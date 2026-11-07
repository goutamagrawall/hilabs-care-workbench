import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
await build({
  stdin:{
    contents:"import {createBrowserApi} from './browser-api.mjs';\nwindow.hilabsFetch = createBrowserApi();\n"+
      readFileSync(new URL('src/app.js',import.meta.url),'utf8').replace('await fetch(url,body?', 'await window.hilabsFetch(url,body?'),
    resolveDir:fileURLToPath(new URL('src/',import.meta.url)),
  },
  bundle:true,platform:'browser',format:'iife',outfile:fileURLToPath(new URL('docs/app.js',import.meta.url)),
});
