import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, relative, isAbsolute, sep } from 'node:path';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { createApp } from '../server/api.mjs';
import { columns } from '../server/csv.mjs';
import { openDatabase } from '../server/local.mjs';
import { hostedFetch } from '../server/worker.mjs';
import { initialState, publicState } from '../server/workbench.mjs';
import seed from '../server/seed.mjs';

const recordCsv = rows => [columns, ...rows].map(row => row.map(value =>
  '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\r\n');
const lookup = (state, id) => state.cases.find(member => member.id === id);
const ids = values => values.map(value => value.id);

function harness(t, filename = ':memory:') {
  let store = openDatabase(filename);
  let app = createApp(store, {});
  t.after(() => store.close());
  async function call(path, body) {
    const response = await app(new Request('http://localhost' + path, body ? {
      method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body),
    } : {}));
    return {status: response.status, body: await response.json()};
  }
  const state = async () => (await call('/api/state')).body;
  return {
    state, call,
    reopen() {store.close(); store = openDatabase(filename); app = createApp(store, {});},
    async action(action, body = {}, revision) {
      return call('/api/action', {action, revision: revision ?? (await state()).revision,
        requestId: randomUUID(), ...body});
    },
  };
}

test('six members, source cutoff, and all workbook alert and defect evidence', async t => {
  const {state} = harness(t);
  const result = await state();
  assert.equal(result.clock, '2026-11-09 08:00');
  assert.equal(result.cases.length, 6);
  assert.equal(result.records.length, 60);
  assert.equal(result.metrics.attempts, 0);
  assert.equal(result.metrics.verified, 0);
  for (const [id, name, age, scenario, priority] of seed.cases) {
    const member = lookup(result, id);
    assert.deepEqual([member.name, member.age, member.scenario, member.priority],
      [name, age, scenario, priority.slice(0,2)]);
    assert.equal(result.records.filter(record => record.member === id).length, 10);
    assert.ok(member.evidence.every(ref => result.records.some(record => record.id === ref && record.member === id)));
  }
  const expectedAlerts = {
    T001: ['R003','R005'], T002: ['R006','R007'], T003: ['R012','R013'],
    T004: ['R017','R018'], T005: ['R023','R027'], T006: ['R025','R026'],
    T007: ['R032','R033','R036'], T008: ['R035','R039'], T009: ['R046','R047'],
    T010: ['R048','R049'], T011: ['R054','R055'], T012: ['R058','R059'],
  };
  for (const [id, member] of seed.alerts) {
    const evidence = expectedAlerts[id];
    assert.ok(evidence.every(ref => result.records.some(record => record.id === ref && record.member === member)), id);
    assert.ok(evidence.some(ref => lookup(result, member).evidence.includes(ref)), id);
  }
  const expectedDefects = {
    Q01:['R005','Conflict'],Q02:['R006','Incomplete'],Q03:['R008','Stale'],
    Q04:['R012','Missing'],Q05:['R017','Conflict'],Q06:['R013','Delayed'],
    Q07:['R025','Incomplete'],Q08:['R028','Stale'],Q09:['R032','Conflict'],
    Q10:['R034','Restricted'],Q11:['R047','Conflict'],Q12:['R055','Conflict'],
    Q13:['R053','Incomplete'],Q14:['R059','Verified'],
  };
  for (const [id, member] of seed.defects) {
    const [ref, quality] = expectedDefects[id];
    assert.ok(result.records.some(record => record.id === ref && record.member === member && record.quality === quality), id);
  }
  assert.match(lookup(result, 'M-1001').why, /20 mg.*10 mg/);
  assert.match(lookup(result, 'M-1002').why, /omits reason/);
  assert.match(lookup(result, 'M-1003').why, /no-show/);
  assert.match(lookup(result, 'M-1004').why, /Spanish/);
  assert.match(lookup(result, 'M-1005').why, /onboarding is pending/);
  assert.match(lookup(result, 'M-1006').why, /authorization is pending/);
  const restricted = result.records.find(record => record.id === 'R034');
  assert.match(restricted.value, /Details are restricted/);
  assert.equal(restricted.limitation, undefined);
  assert.ok(!JSON.stringify(result).includes(seed.records.find(row => row[0] === 'R034')[7]));
});

test('CSV validation, idempotence, atomicity, and receipt-time cutoff', async t => {
  const {state, call, action} = harness(t);
  const all = recordCsv(seed.records);
  const preview = await call('/api/import/preview', {csv: all});
  assert.deepEqual(preview.body, {accepted: 0, duplicates: 60, errors: []});
  const original = await state();
  assert.equal((await action('import',{csv:all})).status, 200);
  assert.equal((await state()).revision, original.revision);
  const good = ['TEST-001','M-1001','Hospital_ADT','Test HIE','2026-11-09 07:59',
    '2026-11-09 08:10','Hospital alert','Late arrival, "example"','Verified','',''];
  const changed = [...seed.records[0]];
  changed[7] = 'This changes an original assertion';
  const bad = [...good]; bad[0] = 'TEST-002'; bad[1] = 'INVALID';
  const invalid = recordCsv([good, bad, changed]);
  assert.equal((await call('/api/import/preview',{csv:invalid})).body.errors.length,2);
  assert.equal((await action('import',{csv:invalid})).status,400);
  assert.equal((await state()).revision,original.revision);
  assert.equal((await action('import',{csv:recordCsv([good])})).status,200);
  assert.equal((await state()).records.length,60);
  const update = await action('advance',{clock:'2026-11-09 08:10'});
  assert.equal(update.status,200);
  assert.deepEqual(ids(update.body.state.updates),['TEST-001']);
  await action('review',{member:'M-1001',ids:['TEST-001']});
  await action('import',{csv:recordCsv([good])});
  assert.deepEqual((await state()).updates,[]);
});

test('Nina replay, partial review, draft preservation, evidence-backed task verification, and database reopen', async t => {
  const temporary = mkdtempSync(join(tmpdir(),'hilabs-test-'));
  const safeRoot = resolve(tmpdir());
  const fromRoot = relative(safeRoot, resolve(temporary));
  assert.ok(fromRoot.startsWith('hilabs-test-') && !isAbsolute(fromRoot) && !fromRoot.includes(sep));
  // Register cleanup after the database handle closes on Windows.
  const {state,action,reopen} = harness(t,join(temporary,'workbench.sqlite'));
  t.after(() => rmSync(temporary,{recursive:true,force:true}));
  const member = 'M-1006';
  const note = {member,type:'Care coordination',text:'Draft while waiting for payer determination.'};
  const draft = await action('draft',note);
  assert.equal(draft.status,200);
  const payer = await action('replay',{id:'payer-update'});
  assert.equal(payer.status,200);
  assert.deepEqual(ids(payer.body.state.updates),['SIM-UM-001']);
  assert.match(lookup(payer.body.state,member).authorization,/Approved by payer/);
  assert.equal((await action('sign',{...note,reviewed:true})).status,409);
  const ride = await action('replay',{id:'transport-update'});
  assert.equal(ride.status,200);
  await action('review',{member,ids:['SIM-UM-001']},payer.body.state.revision);
  assert.deepEqual(ids((await state()).updates),['SIM-RIDE-001']);
  assert.equal((await state()).drafts[member].text,note.text);
  await action('review',{member,ids:['SIM-RIDE-001']});
  assert.equal((await action('sign',{...note,reviewed:false})).status,400);
  const actionId = randomUUID();
  const originalRevision = (await state()).revision;
  assert.equal((await action('sign',{...note,reviewed:true,requestId:actionId},originalRevision)).status,200);
  assert.equal((await action('sign',{...note,reviewed:true,requestId:actionId},originalRevision)).status,200);
  assert.equal((await state()).notes.length,1);
  assert.equal((await action('task-verify',{member,id:'M-1006-1',evidence:'R055',confirmation:'Original pending record'})).status,400);
  assert.equal((await action('task-verify',{member,id:'M-1006-1',evidence:'SIM-UM-001',confirmation:'Payer approved coverage'})).status,200);
  assert.equal((await action('task-verify',{member,id:'M-1006-3',evidence:'SIM-RIDE-001',confirmation:'Request only'})).status,400);
  assert.equal((await action('task-handoff',{member,id:'M-1006-3',owner:'Transportation desk',due:'2026-11-09 10:00',
    detail:'Confirm pickup.',escalate:true})).status,200);
  reopen();
  const saved=await state();
  assert.equal(saved.notes.length,1);
  assert.equal(saved.tasks.find(task=>task.id==='M-1006-1').status,'Verified');
  assert.equal(saved.tasks.find(task=>task.id==='M-1006-2').status,'Open');
  assert.equal(saved.tasks.find(task=>task.id==='M-1006-3').status,'Escalated');
  assert.match(lookup(saved,member).signal,/Authorization verified/);
  assert.equal(saved.metrics.verified,1);
});

test('Marcus requires verified alternative contact and Sofia requires an interpreter', async t => {
  const {action,state} = harness(t);
  const note={type:'Outreach',route:'Verified demo contact',outcome:'Connected',text:'Observed simulated contact outcome.',reviewed:true};
  assert.equal((await action('sign',{...note,member:'M-1002',channel:'Phone'})).status,400);
  const marcus={...note,member:'M-1002',channel:'Verified alternative'};
  assert.equal((await action('sign',{...marcus,route:'alternate contact permission has NOT been verified'})).status,400);
  assert.equal((await action('sign',{...marcus,type:'Route investigation'})).status,200);
  assert.equal((await state()).metrics.attempts,0);
  const permission={permissionSource:'Member services',permissionConfirmed:true,
    permissionScope:'Case-management outreach through the alternate channel'};
  assert.equal((await action('sign',{...marcus,...permission,permissionReference:'R017'})).status,400);
  assert.equal((await action('sign',{...marcus,...permission,permissionReference:'PERM-DEMO-102'})).status,200);
  const caregiver={...note,member:'M-1005',channel:'Authorized caregiver',permissionSource:'Member consent record',
    permissionScope:'Discuss home-health coordination and caregiver support',permissionReference:'CONSENT-DEMO-105'};
  assert.equal((await action('sign',caregiver)).status,400);
  assert.equal((await action('sign',{...caregiver,permissionConfirmed:true,permissionScope:'All care'})).status,400);
  assert.equal((await action('sign',{...caregiver,permissionConfirmed:true})).status,200);
  assert.equal((await action('sign',{...note,member:'M-1004',channel:'Phone'})).status,400);
  assert.equal((await action('sign',{...note,member:'M-1004',channel:'Phone',interpreter:true})).status,200);
  const result=await state();
  assert.equal(result.metrics.attempts,3);
  assert.equal(result.metrics.connected,3);
  assert.equal(result.notes.find(item=>item.type==='Route investigation').outcome,'');
});

test('Grace closure rejects fabricated, pending, unrelated and restricted evidence without changing state', async t => {
  const {action,state} = harness(t);
  const task = {member:'M-1005',id:'M-1005-1'};
  const before = await state();
  for (const evidence of ['R046','R047','R034','AUDIT-NONEXISTENT']) {
    const result = await action('task-verify',{...task,evidence,confirmation:'No agency start of care has been confirmed'});
    assert.equal(result.status,400,evidence);
    assert.deepEqual(await state(),before);
  }
  const external={...task,verificationMode:'attestation',evidence:'AGENCY-DEMO-01',
    outcomeSource:'Demo home-health agency',outcomeTime:'2026-11-09 08:00',
    disposition:'Start of care confirmed',outcomeConfirmed:true};
  for (const invalid of [{disposition:'Still pending'},{outcomeConfirmed:false},
    {outcomeTime:'2026-11-09 08:01'},{evidence:'R046'},{outcomeSource:''}]) {
    assert.equal((await action('task-verify',{...external,...invalid})).status,400);
    assert.deepEqual(await state(),before);
  }
  assert.equal((await action('task-verify',external)).status,200);
  const after = await state();
  assert.equal(after.metrics.verified,1);
  assert.equal(lookup(after,task.member).openCount,1);
  const verified = after.tasks.find(item=>item.id===task.id);
  assert.equal(verified.verification.kind,'attestation');
  assert.equal(verified.verification.time,external.outcomeTime);
  assert.equal(verified.verification.disposition,external.disposition);
});

test('legacy unsupported closures and outreach stay out of verified metrics', () => {
  const original = initialState();
  const task = original.tasks.find(item=>item.id==='M-1005-1');
  Object.assign(task,{status:'Verified',evidence:'AUDIT-NONEXISTENT',verifiedAt:original.clock});
  original.notes.push({id:'old-note',member:'M-1002',type:'Outreach',channel:'Verified alternative',outcome:'Connected'});
  const state = publicState(original,1);
  assert.equal(state.tasks.find(item=>item.id===task.id).status,'Needs verification');
  assert.equal(state.metrics.verified,0);
  assert.equal(state.metrics.attempts,0);
  assert.equal(state.notes[0].permissionReview,true);
});

test('a stale task form is rejected without replacing the newer change', async t => {
  const {action,state}=harness(t);
  const revision=(await state()).revision;
  const item={member:'M-1005',id:'M-1005-1'};
  assert.equal((await action('task-start',item,revision)).status,200);
  assert.equal((await action('task-handoff',{...item,owner:'Other',due:'2026-11-09 11:00',detail:'Stale'},revision)).status,409);
  assert.equal((await state()).tasks.find(task=>task.id===item.id).status,'In progress');
});

test('hosted visitors can edit and reset only their own workspaces', async t => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  for (const file of ['0000_workbench.sql', '0001_visitor_state.sql']) {
    sqlite.exec(readFileSync(new URL('../drizzle/' + file, import.meta.url), 'utf8'));
  }
  sqlite.prepare('INSERT INTO demo_state VALUES (1, 8, ?)').run('legacy workspace data');
  const DB = {prepare(sql) {
    const statement = sqlite.prepare(sql);
    return {bind: (...values) => ({
      first: async () => statement.get(...values),
      run: async () => ({meta: statement.run(...values)}),
    })};
  }};
  const origin = 'https://demo.example.test';
  async function visit(cookie, action, revision = 0) {
    const headers = new Headers();
    if (cookie) headers.set('cookie', cookie);
    if (action) {
      headers.set('content-type', 'application/json');
      headers.set('origin', origin);
    }
    return hostedFetch(new Request(origin + (action ? '/api/action' : '/api/state'), {
      method: action ? 'POST' : 'GET', headers,
      body: action ? JSON.stringify({revision, requestId: randomUUID(), ...action}) : undefined,
    }), {DB}, {});
  }
  const first = await visit();
  const second = await visit();
  const firstCookie = first.headers.get('set-cookie').split(';')[0];
  const secondCookie = second.headers.get('set-cookie').split(';')[0];
  assert.notEqual(firstCookie, secondCookie);
  assert.match(first.headers.get('set-cookie'), /Secure; HttpOnly; SameSite=Lax/);
  assert.equal((await first.json()).records.length, 60);
  assert.equal((await second.json()).records.length, 60);
  assert.equal(sqlite.prepare('SELECT count(*) AS n FROM visitor_state').get().n, 0);
  assert.equal((await visit(null, {action: 'reset'})).status, 403);
  assert.equal((await visit(firstCookie, {action: 'replay', id: 'payer-update'})).status, 200);
  assert.equal((await visit(secondCookie, {action: 'reset'})).status, 200);
  const firstState = await (await visit(firstCookie)).json();
  const secondState = await (await visit(secondCookie)).json();
  assert.equal(firstState.records.length, 61);
  assert.equal(secondState.records.length, 60);
  assert.equal((await visit(firstCookie)).headers.get('set-cookie'), null);
  assert.equal(sqlite.prepare('SELECT payload FROM demo_state WHERE id = 1').get().payload, 'legacy workspace data');
});
