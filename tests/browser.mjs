import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { openDatabase, serve } from '../server/local.mjs';

const liveUrl = process.env.HILABS_TEST_URL?.replace(/\/$/, '');
const db = liveUrl ? null : openDatabase(':memory:');
const server = db ? serve(db) : null;
if (server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
}
const url = liveUrl || 'http://127.0.0.1:' + server.address().port;
let browser;
const screenshots = process.env.HILABS_SCREENSHOTS;
if (screenshots) mkdirSync(screenshots,{recursive:true});
const errors = [];
try {
  browser = await chromium.launch({channel: process.env.HILABS_CHROME_CHANNEL || 'chrome'});
  const context = await browser.newContext({viewport:{width:1440,height:900}});
  const page = await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  const button = (name, root=page) => root.getByRole('button',{name,exact:true});
  const heading = name => page.getByRole('heading',{name,exact:true});
  const state = async () => page.evaluate(async () => (await window.hilabsFetch('/api/state')).json());

  await page.goto(url);
  await heading('Priority work queue').waitFor();
  assert.equal(await page.getByRole('table',{name:'Prioritized cases'}).getByRole('row').count(),7);
  await page.getByLabel('Search cases').fill('Daniel');
  assert.equal(await button('Open Member 360').count(),0);
  await button('Daniel Reed').click();
  await button('Open Member 360').click();
  await page.locator('.member-head').getByRole('heading',{name:'Daniel Reed'}).waitFor();
  await button('Back to queue').click();
  assert.equal(await page.getByLabel('Search cases').inputValue(),'Daniel');
  assert.equal(await button('Daniel Reed').getAttribute('aria-pressed'),'true');
  await page.getByLabel('Search cases').fill('');
  await page.getByLabel('Filter cases').selectOption('P1');
  assert.equal(await button('Open Member 360').count(),0);
  await button('Nina Shah').click();
  await page.getByLabel('Filter cases').selectOption('P2');
  assert.equal(await button('Open Member 360').count(),0);
  await page.getByLabel('Search cases').fill('no matching patient');
  await page.getByText('No cases match these filters.',{exact:true}).waitFor();
  assert.equal(await button('Open Member 360').count(),0);
  await page.getByLabel('Filter cases').selectOption('today');
  await page.getByLabel('Search cases').fill('Nina');
  assert.equal(await page.getByRole('table',{name:'Prioritized cases'}).getByRole('row').count(),2);
  await button('Nina Shah').click();
  await button('Open source R055').click();
  await page.getByRole('dialog').getByText(/Pending clinical review/).waitFor();
  await button('Close',page.getByRole('dialog')).click();
  await button('Open Member 360').click();
  await heading('Member 360').waitFor();
  await button('Back to queue').click();
  assert.equal(await page.getByLabel('Search cases').inputValue(),'Nina');
  await page.getByLabel('Search cases').fill('');
  await button('Open Member 360').click();
  await button('Outreach & notes',page.locator('.member-head')).click();
  await page.getByLabel('Activity type').selectOption('Care coordination');
  await page.getByLabel('Note text').fill('Payer verification pending. Continue to coordinate the ride.');
  await button('Save draft').click();
  await page.getByText('Draft saved',{exact:true}).waitFor();

  const second = await context.newPage();
  await second.goto(url+'/#integrity');
  await second.getByRole('heading',{name:'Data integrity',exact:true}).waitFor();
  await button('Replay payer update',second).click();
  await second.getByText('Replayed',{exact:true}).waitFor();
  await page.bringToFront();
  await heading('New since review').waitFor({timeout:12000});
  assert.equal(await page.getByLabel('Note text').inputValue(),'Payer verification pending. Continue to coordinate the ride.');
  assert.equal(await button('Sign note').isEnabled(),false);
  await button('Open source SIM-UM-001').click();
  await page.getByRole('dialog').getByText(/Simulated payer approval/).waitFor();
  await button('Close',page.getByRole('dialog')).click();
  await button('Mark displayed updates reviewed').click();
  await heading('New since review').waitFor({state:'hidden'});
  assert.equal(await page.getByLabel('Note text').inputValue(),'Payer verification pending. Continue to coordinate the ride.');
  await page.getByLabel('Note text').fill('Reviewed the simulated payer approval. Transportation and treating-team follow-up remain open.');
  await page.getByLabel(/I reviewed the note/).check();
  await button('Sign note').click();
  await page.locator('.record').getByText(/Reviewed the simulated payer approval/).waitFor();
  await button('Case tasks',page.locator('.member-head')).click();
  const authorization = page.locator('.task-list li').filter({hasText:'Verify infusion authorization'});
  await button('Verify outcome',authorization).click();
  await page.getByLabel('Outcome source reference').fill('SIM-UM-001');
  await button('Verify and close task').click();
  await authorization.getByText('Verified',{exact:true}).waitFor();

  const transport = page.locator('.task-list li').filter({hasText:'Verify transport for Nov 10'});
  await button('Handoff / escalate',transport).click();
  await page.getByLabel('New owner').fill('Transportation desk');
  await page.getByLabel('Handoff reason').fill('Confirm pickup and relay the time to Maria.');
  await button('Save handoff').click();
  await transport.getByText('Handed off',{exact:true}).waitFor();
  await button('Back to queue').click();
  await page.reload();
  await page.getByText('Authorization verified · coordination open',{exact:true}).waitFor();

  await button('Grace Turner').click();
  await button('Case tasks',page.locator('#preview')).click();
  const graceTask = page.locator('.task-list li').filter({hasText:'Confirm agency start of care'});
  const before = await state();
  await button('Verify outcome',graceTask).click();
  for (const reference of ['R046','AUDIT-NONEXISTENT']) {
    await page.getByLabel('Outcome source reference').fill(reference);
    const [rejected] = await Promise.all([
      page.waitForResponse(response => response.url().endsWith('/api/action')),
      button('Verify and close task').click(),
    ]);
    assert.equal(rejected.status(),400);
    await page.getByText(/Use a visible source record that confirms/).waitFor();
    assert.deepEqual(await state(),before);
  }
  await page.getByLabel('Evidence method').selectOption('attestation');
  await page.getByLabel('Outcome source reference').fill('AGENCY-DEMO-01');
  await page.getByLabel('Source name').fill('Demo home-health agency');
  await page.getByLabel('Confirmed disposition').selectOption('Start of care confirmed');
  await page.getByLabel(/I verified this outcome/).check();
  await button('Verify and close task').click();
  await graceTask.getByText(/Clinician attestation/).waitFor();
  assert.equal((await state()).metrics.verified,before.metrics.verified+1);
  await button('Back to queue').click();

  await button('Marcus Hill').click();
  await button('Open Member 360').click();
  await button('Outreach & notes',page.locator('.member-head')).click();
  assert.equal(await page.getByLabel('Contact channel').inputValue(),'Verified alternative');
  await page.getByLabel('Note text').fill('Simulated contact through verified alternative route.');
  await page.getByLabel('Observed outcome').selectOption('Connected');
  await page.getByLabel(/I reviewed the note/).check();
  await button('Sign note').click();
  await page.getByText(/Record a verified, permitted alternative route/).waitFor();
  await page.getByLabel('Activity type').selectOption('Route investigation');
  await page.getByLabel('Note text').fill('Alternate contact permission has not been verified.');
  await page.getByLabel(/I reviewed the note/).check();
  await button('Sign note').click();
  await page.locator('.record').getByText('Alternate contact permission has not been verified.',{exact:true}).waitFor();
  assert.equal((await state()).metrics.attempts,0);
  await page.getByLabel('Activity type').selectOption('Outreach');
  await page.getByLabel('Note text').fill('Simulated contact through verified alternative route.');
  await page.getByLabel('Observed outcome').selectOption('Connected');
  await page.getByLabel('Permission source').selectOption('Member services');
  await page.getByLabel('Permission scope').selectOption({label:'Case-management outreach through the alternate channel'});
  await page.getByLabel('Permission reference').fill('PERM-DEMO-102');
  await page.getByLabel(/I verified permission to use this alternate channel/).check();
  await page.getByLabel(/I reviewed the note/).check();
  await button('Sign note').click();
  await page.locator('.record').getByText('Simulated contact through verified alternative route.',{exact:true}).waitFor();
  await button('Outcomes').click();
  await page.getByText('100%',{exact:true}).waitFor();

  await page.setViewportSize({width:390,height:844});
  await button('Work Queue').click();
  await button('Nina Shah').click();
  await page.getByRole('dialog',{name:'Case preview'}).waitFor();
  assert.ok(await button('Open Member 360',page.getByRole('dialog')).isVisible());
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({state:'hidden'});
  await page.getByLabel('Search cases').fill('Daniel');
  assert.equal(await button('View case preview').isEnabled(),false);
  await button('Daniel Reed').click();
  await button('Open Member 360',page.getByRole('dialog')).click();
  await page.locator('.member-head').getByRole('heading',{name:'Daniel Reed'}).waitFor();
  await button('Back to queue').click();
  assert.equal(await page.getByLabel('Search cases').inputValue(),'Daniel');
  assert.equal(await button('Daniel Reed').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);
  console.log('Browser regressions passed for Grace, filtered previews, Marcus, and Nina.');

  if (liveUrl) {
    await button('Reset demo').click();
    await button('Restore baseline').click();
    await page.getByText('Monday baseline restored.',{exact:true}).waitFor();
  }

  if (screenshots) {
    const clean = await browser.newContext({viewport:{width:1440,height:900}});
    const frame = await clean.newPage();
    for (const [hash, label, filename] of [
      ['queue','Priority work queue','01-work-queue.png'],
      ['member/M-1006','Member 360','02-member-360.png'],
      ['outreach/M-1006','Outreach & documentation','03-outreach-documentation.png'],
      ['coord/M-1006','Care coordination','04-care-coordination.png'],
    ]) {
      await frame.goto(url+'/#'+hash);
      await frame.getByRole('heading',{name:label,exact:true}).waitFor();
      if (hash!=='queue') await frame.locator('.member-head').getByRole('heading',{name:'Nina Shah'}).waitFor();
      assert.match(await frame.locator('.date').innerText(), /08:00 ET · Simulation clock/);
      await frame.locator('main').evaluate(main => main.blur());
      await frame.screenshot({path:join(screenshots,filename),animations:'disabled',fullPage:true});
    }
    await clean.close();
  }
} finally {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  db?.close();
}
