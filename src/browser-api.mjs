import {createApp, encodeInitialState} from '../server/api.mjs';

// Reuse the release's workflow rules; replace only its persistence adapter.
export function createBrowserApi({storage=localStorage, locks=navigator.locks, key='hilabs-pages-demo-v1:'+new URL('.',location.href).pathname}={}) {
  const read = () => {
    const raw = storage.getItem(key);
    if (raw) return JSON.parse(raw);
    return {revision:0,state:JSON.parse(encodeInitialState())};
  };
  const app = createApp({
    read,
    write(revision,state) {
      if (read().revision !== revision) return false;
      storage.setItem(key,JSON.stringify({revision:revision+1,state}));
      return true;
    },
  },{});
  const handle = (path,options={}) => app(new Request('https://hilabs-demo.invalid'+path,options));
  return (path,options) => locks
    ? locks.request(key,() => handle(path,options))
    : handle(path,options);
}
