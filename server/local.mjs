import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp, encodeInitialState } from './api.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const paths = {
  '/': ['text/html; charset=utf-8', 'index.html'],
  '/styles.css': ['text/css; charset=utf-8', 'styles.css'],
  '/app.js': ['text/javascript; charset=utf-8', 'app.js'],
};
const assets = Object.fromEntries(Object.entries(paths).map(([route, [type, filename]]) =>
  [route, [type, readFileSync(resolve(root, 'docs', filename), 'utf8')]]));

export function openDatabase(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), {recursive: true});
  const db = new DatabaseSync(filename);
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec(readFileSync(resolve(root, 'drizzle/0000_workbench.sql'), 'utf8'));
  db.prepare('INSERT OR IGNORE INTO demo_state (id, revision, payload) VALUES (1, 0, ?)')
    .run(encodeInitialState());
  const read = db.prepare('SELECT revision, payload FROM demo_state WHERE id = 1');
  const write = db.prepare('UPDATE demo_state SET revision = revision + 1, payload = ? WHERE id = 1 AND revision = ?');
  return {
    read() {
      const {revision, payload} = read.get();
      return {revision, state: JSON.parse(payload)};
    },
    write(revision, state) {
      return write.run(JSON.stringify(state), revision).changes === 1;
    },
    close() { db.close(); },
  };
}

export function serve(store) {
  const app = createApp(store, assets);
  return createServer(async (incoming, outgoing) => {
    const host = incoming.headers.host;
    if (!/^(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(host || '')) {
      outgoing.writeHead(403).end('Use the local workbench address.');
      return;
    }
    try {
      const data = [];
      let size = 0;
      for await (const chunk of incoming) {
        size += chunk.length;
        if (size > 1_000_000) {
          outgoing.writeHead(413).end('Request too large.');
          return;
        }
        data.push(chunk);
      }
      const body = data.length ? Buffer.concat(data) : undefined;
      const request = new Request('http://' + host + incoming.url, {
        method: incoming.method, headers: incoming.headers, body,
      });
      const response = await app(request);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      console.error(error);
      if (!outgoing.headersSent) outgoing.writeHead(500);
      outgoing.end('Workbench request failed.');
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const db = openDatabase(resolve(process.env.HILABS_DB || resolve(root, '.local/workbench.sqlite')));
  const server = serve(db);
  server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
    console.log('HiLabs Workbench: http://127.0.0.1:' + server.address().port);
  });
}
