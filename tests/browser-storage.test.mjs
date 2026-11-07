import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createBrowserApi} from '../src/browser-api.mjs';

function fixture() {
  const values = new Map();
  const storage = {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
  const api = key => createBrowserApi({storage,locks:null,key});
  const state = async fetch => (await fetch('/api/state')).json();
  const action = async (fetch,name,body={}) => fetch('/api/action',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({...body,action:name,revision:(await state(fetch)).revision,requestId:randomUUID()}),
  });
  return {api,state,action,storage};
}

test('Pages adapter starts with six cases and sixty records',async()=>{
  const {api,state} = fixture();
  const data = await state(api('site-a'));
  assert.equal(data.cases.length,6);
  assert.equal(data.records.length,60);
  assert.equal(data.revision,0);
});

test('Pages adapter persists replay across reload and shares only the same site key',async()=>{
  const {api,state,action} = fixture();
  const original = api('site-a');
  const response = await action(original,'replay',{id:'payer-update'});
  assert.equal(response.status,200,JSON.stringify(await response.clone().json()));
  const reloaded = await state(api('site-a'));
  assert.equal(reloaded.records.some(record=>record.id==='SIM-UM-001'),true);
  assert.equal((await state(api('site-b'))).records.length,60);
});

test('Pages adapter serializes operations through Web Locks when available',async()=>{
  const {storage} = fixture();
  let calls=0;
  const fetch=createBrowserApi({storage,key:'locked-site',locks:{request(key,run){assert.equal(key,'locked-site');calls++;return run();}}});
  assert.equal((await fetch('/api/state')).status,200);
  assert.equal(calls,1);
});
