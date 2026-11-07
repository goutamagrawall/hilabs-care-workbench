import { createApp } from './api.mjs';
import { initialState } from './workbench.mjs';

const cookieName = '__Host-hilabs-demo';
const visitorPattern = /^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/;

function visitorId(request) {
  const cookies = request.headers.get('cookie')?.split(';') || [];
  const entry = cookies.map(cookie => cookie.trim()).find(cookie => cookie.startsWith(cookieName + '='));
  const id = entry?.slice(cookieName.length + 1);
  return visitorPattern.test(id) ? id : null;
}

async function visitorKey(id) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

function d1Store(db, key) {
  return {
    async read() {
      const row = await db.prepare('SELECT revision, payload FROM visitor_state WHERE visitor_key = ?')
        .bind(key).first();
      return row ? {revision: row.revision, state: JSON.parse(row.payload)} :
        {revision: 0, state: initialState()};
    },
    async write(revision, state) {
      const payload = JSON.stringify(state);
      const result = revision === 0 ?
        await db.prepare('INSERT OR IGNORE INTO visitor_state (visitor_key, revision, payload) VALUES (?, 1, ?)')
          .bind(key, payload).run() :
        await db.prepare('UPDATE visitor_state SET revision = revision + 1, payload = ? WHERE visitor_key = ? AND revision = ?')
          .bind(payload, key, revision).run();
      return result.meta.changes === 1;
    },
  };
}

export async function hostedFetch(request, env, assets) {
  const path = new URL(request.url).pathname;
  if (!path.startsWith('/api/')) return createApp(null, assets)(request);

  const existing = visitorId(request);
  if (!existing && (request.method !== 'GET' || path !== '/api/state')) {
    return Response.json({error: 'Open the workbench before submitting a demo action.'}, {
      status: 403, headers: {'cache-control': 'no-store'},
    });
  }
  const id = existing || crypto.randomUUID();
  const response = await createApp(d1Store(env.DB, await visitorKey(id)), assets)(request);
  if (existing || !response.ok) return response;

  const headers = new Headers(response.headers);
  headers.append('set-cookie', cookieName + '=' + id +
    '; Path=/; Max-Age=2592000; Secure; HttpOnly; SameSite=Lax');
  return new Response(response.body, {status: response.status, headers});
}

export default {
  fetch(request, env) {
    return hostedFetch(request, env, HILABS_ASSETS);
  },
};
