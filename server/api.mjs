import { applyAction, checkImport, initialState, publicState, WorkflowError } from './workbench.mjs';

const baseHeaders = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'",
};

function json(body, status = 200) {
  return Response.json(body, {status, headers: baseHeaders});
}

export function createApp(store, assets) {
  return async function handle(request) {
    const url = new URL(request.url);
    if (request.method === 'GET' && Object.hasOwn(assets, url.pathname)) {
      const [type, content] = assets[url.pathname];
      return new Response(content, {headers: {...baseHeaders, 'content-type': type}});
    }
    if (!['/api/state', '/api/import/preview', '/api/action'].includes(url.pathname)) {
      return json({error: 'Page or resource unavailable.'}, 404);
    }

    let current;
    try {
      current = await store.read();
      if (request.method === 'GET' && url.pathname === '/api/state') {
        return json(publicState(current.state, current.revision));
      }
      if (request.method !== 'POST' || url.pathname === '/api/state') {
        return json({error: 'Method unavailable.'}, 405);
      }
      const origin = request.headers.get('origin');
      if ((origin && origin !== url.origin) || request.headers.get('sec-fetch-site') === 'cross-site' ||
          !request.headers.get('content-type')?.startsWith('application/json')) {
        return json({error: 'Use the workbench to submit this action.'}, 403);
      }
      const raw = await request.text();
      if (raw.length > 1_000_000) return json({error: 'Request is too large.'}, 413);
      let body;
      try { body = JSON.parse(raw); }
      catch { return json({error: 'Invalid request data.'}, 400); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return json({error: 'Invalid request data.'}, 400);
      }
      if (url.pathname === '/api/import/preview') return json(checkImport(current.state, body.csv));

      const requestId = body.requestId;
      if (typeof requestId !== 'string' || !/^[\da-f-]{36}$/i.test(requestId)) {
        return json({error: 'Missing action identifier.'}, 400);
      }
      for (let attempt = 0; attempt < 3; attempt++) {
        const {state, revision} = current;
        if (state.requestIds.includes(requestId)) {
          return json({state: publicState(state, revision), message: 'Action already recorded.'});
        }
        // Acknowledging explicit IDs is safe when a newer update has arrived.
        if (body.action !== 'review' && body.revision !== revision) {
          return json({
            error: 'The case changed while you were working. Review the latest evidence and retry.',
            state: publicState(state, revision),
          }, 409);
        }
        const result = applyAction(structuredClone(state), body);
        if (result.changed === false) {
          return json({state: publicState(state, revision), message: result.message});
        }
        result.state.requestIds = [...result.state.requestIds.slice(-499), requestId];
        if (await store.write(revision, result.state)) {
          return json({state: publicState(result.state, revision + 1), message: result.message});
        }
        current = await store.read();
      }
      return json({error: 'The workspace is busy. Review the latest state and retry.',
        state: publicState(current.state, current.revision)}, 409);
    } catch (error) {
      if (error instanceof WorkflowError) {
        return json({error: error.message, ...(error.status === 409 && current ?
          {state: publicState(current.state, current.revision)} : {})}, error.status);
      }
      console.error(error);
      return json({error: 'The workbench could not save this request. Try again.'}, 500);
    }
  };
}

export function encodeInitialState() {
  return JSON.stringify(initialState());
}
