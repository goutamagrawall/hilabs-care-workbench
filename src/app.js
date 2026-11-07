(() => {
  const $ = query => document.querySelector(query);
  const main = $('main'), modal = $('#modal');
  const names = {queue:'Work Queue',coord:'Care Coordination',integrity:'Data Integrity',outcomes:'Outcomes',
    member:'Member 360',outreach:'Outreach & Documentation'};
  const icons = {
    queue:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    coord:'<path d="M5 4h4v4H5zM15 10h4v4h-4zM5 16h4v4H5zM9 6h3v12H9m3-6h3"/>',
    integrity:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    outcomes:'<path d="M4 19h16M7 16v-4m5 4V8m5 8V5"/>',
  };
  const categories = {
    overview:['Overview'], timeline:['Timeline'], medications:['Medications','Medication','Pharmacy','Discharge'],
    claims:['Claims','Claims'], appointments:['Appointments','Appointments','Authorization','Referral','HomeHealth'],
    social:['Social needs','SDOH','Contact','CareTeam'], plans:['Care plans','CarePlan'],
  };
  let data, revision, view='queue', selected='M-1006', scope='', category='overview';
  let search='', filter='today', sort='priority', queueScroll=0, active=false;
  let importFile, preview, returnFocus, toastTimer;
  const unsaved = new Map();
  const e = value => String(value ?? '').replace(/[&<>"']/g,
    char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const badge = (label,type=label) => `<span class="badge ${e(type)}">${e(label)}</span>`;
  const btn = (label,action,id='',style='',disabled=false) =>
    `<button class="button ${style}" type="button" data-do="${action}" data-id="${e(id)}" ${disabled?'disabled':''}>${e(label)}</button>`;
  const panel = (title,body,style='') =>
    `<section class="panel ${style}"><div class="panel-header"><h2>${e(title)}</h2></div>${body}</section>`;
  const empty = label => `<p class="empty">${e(label)}</p>`;
  const detail = value => value ? e(value) + ' ET' : '—';
  const clock = value => value ? detail(value.slice(11)) : '—';
  const options = (values,current) => values.map(value =>
    `<option ${value===current?'selected':''}>${e(value)}</option>`).join('');
  const member = () => data.cases.find(item => item.id === selected);
  const records = id => data.records.filter(item => item.member === id);
  const updates = id => data.updates.filter(item => item.member === id);
  const refs = ids => ids.length ? `<div class="sources" aria-label="Source records">${ids.map(id =>
    `<button type="button" data-do="source" data-id="${e(id)}" aria-label="Open source ${e(id)}">${e(id)}</button>`
  ).join('')}</div>` : '';
  const head = (section,title,description) => `<div class="heading"><div><div class="eyebrow">${section}</div>
    <h1>${title}</h1><p>${description}</p></div><div class="date"><strong>${e(data.clock.slice(0,10))}</strong>
    ${clock(data.clock)} · Simulation clock</div></div>`;

  function caseHeader(m) {
    return `<section class="member-head"><span class="initials" aria-hidden="true">${e(m.name.split(' ').map(n=>n[0]).join(''))}</span>
      <div><h2>${e(m.name)}</h2><p class="sub">${e(m.id)} · ${e(m.age)} years · ${e(m.scenario)}</p>
      <p class="tiny">${e(m.contact)}</p></div>${badge(m.priority)}
      <div class="actions">${btn('Back to queue','queue')}
      ${view!=='member'?btn('Member 360','member',m.id):''}
      ${view!=='outreach'?btn('Outreach & notes','outreach',m.id):''}
      ${view!=='coord'?btn('Case tasks','coord',m.id):''}</div></section>`;
  }

  function record(r) {
    return `<article class="record"><div class="row-flex"><h3>${e(r.title)}</h3>${badge(r.quality)}</div>
      <p class="sub pre">${e(r.value)}</p><div class="tiny">${e(r.id)} · ${e(r.source)} · ${e(r.domain.replaceAll('_',' '))}</div>
      <div class="tiny">Event ${detail(r.event)} · Received ${detail(r.received)}</div>
      ${r.limitation?`<p class="tiny">${e(r.limitation)}</p>`:''}</article>`;
  }

  function newEvidence(m) {
    const list = updates(m.id);
    return list.length ? panel('New since review', list.map(r => `<article class="record"><h3>${e(r.title)}</h3>
      <p class="sub">${e(r.handling || 'Review the new evidence and the related action.')}</p>
      <p class="tiny">Received ${detail(r.received)}</p>${refs([r.id])}</article>`).join('')
      + `<div class="pad">${btn('Mark displayed updates reviewed','review',list.map(r=>r.id).join(','))}</div>`,
      'update-panel top-space') : '';
  }

  function summary(m) {
    return `<aside class="panel summary"><div class="summary-top"><div class="eyebrow">CASE EVIDENCE</div>
      ${badge(m.priority)}<h2>${e(m.name)}</h2><p class="sub">${e(m.scenario)}</p></div>
      <div class="pad"><h3>Why this case is here</h3><p class="sub">${e(m.why)}</p>${refs(m.evidence)}
      <h3 class="top-space">Suggested next step</h3><p class="reason">${e(m.next)}</p>
      <p class="sub"><b>Owner</b> · ${e(m.nextTask?.owner || 'Case team')}</p>
      <p class="sub"><b>Evidence status</b> · ${e(m.trust)}</p>
      <p class="sub"><b>Open actions</b> · ${m.openCount}</p>
      <div class="actions">${view==='queue'?btn('Open Member 360','member',m.id,'primary'):btn('Outreach & notes','outreach',m.id,'primary')}
        ${btn('Case tasks','coord',m.id)}</div></div>
      <div class="caption">Suggestions require clinician review.</div></aside>${newEvidence(m)}`;
  }

  function queue() {
    const counts = data.cases.reduce((result,m) => {
      result[m.priority] = (result[m.priority] || 0) + 1;
      return result;
    },{});
    return head('MY CASELOAD','Priority work queue','Review the cases that need action and see the evidence behind their position.')
      + `<section class="queue-strip" aria-label="Caseload overview">
      <div><b>${data.cases.length}</b><span>Assigned demo cases</span></div>
      <div><b>${counts.P1||0}</b><span>Review today</span></div>
      <div><b>${counts.P2||0}</b><span>Follow up today</span></div>
      <div><b>${data.cases.filter(m=>m.updateCount).length}</b><span>Cases with new evidence</span></div></section>
      <div class="grid queue-grid"><section class="panel"><div class="panel-header"><div><h2>Assigned cases</h2>
      <p class="tiny">Monday review · ${e(data.actor)}</p></div>${btn('View case preview','preview','','mobile-preview')}</div>
      <div class="filters"><input id="search" aria-label="Search cases" placeholder="Search name, member ID, or issue" value="${e(search)}">
      <select id="filter" aria-label="Filter cases">${[['today','Due today'],['active','All active'],['new','New since review'],
      ['P1','P1 · Review today'],['P2','P2 · Follow up today'],['all','All cases']].map(([id,label])=>
      `<option value="${id}" ${filter===id?'selected':''}>${label}</option>`).join('')}</select>
      <select id="sort" aria-label="Sort cases">${[['priority','Priority first'],['due','Due time first'],['name','Member name']].map(([id,label])=>
      `<option value="${id}" ${sort===id?'selected':''}>${label}</option>`).join('')}</select></div>
      <div class="table-wrap"><table aria-label="Prioritized cases"><thead><tr><th>Priority</th><th>Member</th><th>Why now</th>
      <th>Next due</th></tr></thead><tbody id="queue-rows"></tbody></table></div><div id="queue-count" class="caption" aria-live="polite"></div></section>
      <div id="preview" class="desktop-preview" aria-live="polite"></div></div>`;
  }

  function drawRows() {
    const query = search.trim().toLowerCase();
    const today = data.clock.slice(0,10);
    const activeCase = m => m.priority !== 'Complete';
    const filters = {today:m=>activeCase(m)&&(m.deadline?.slice(0,10)<=today||m.updateCount),active:activeCase,
      new:m=>m.updateCount,all:()=>true,P1:m=>m.priority==='P1',P2:m=>m.priority==='P2'};
    const due = (a,b) => (a.deadline||'~').localeCompare(b.deadline||'~');
    const priority = (a,b) => Number(a.priority==='Complete')-Number(b.priority==='Complete') || a.priority.localeCompare(b.priority);
    const list = data.cases.filter(m=>filters[filter](m)&&[m.name,m.id,m.signal,m.scenario].join(' ').toLowerCase().includes(query))
      .sort((a,b)=>(sort==='due'?due(a,b)||priority(a,b):sort==='name'?a.name.localeCompare(b.name):priority(a,b)||due(a,b))||a.id.localeCompare(b.id));
    const selection = list.find(m=>m.id===selected);
    if (!selection) selected='';
    $('#preview').innerHTML = selection ? summary(selection) :
      panel('Case evidence',empty('Select a visible case to review its evidence.'));
    $('[data-do="preview"]').disabled = !selection;
    $('#queue-rows').innerHTML = list.length ? list.map(m => `<tr class="${m.id===selected?'selected':''}">
      <td>${badge(m.priority,m.priority==='Complete'?'Verified':m.priority)}</td>
      <td><button type="button" class="link-button" data-do="select" data-id="${e(m.id)}" aria-pressed="${m.id===selected}">${e(m.name)}</button><small>${e(m.id)}</small></td>
      <td><b>${e(m.signal)}</b>${m.updateCount?`<small class="new-label">${m.updateCount} new · Review pending</small>`:''}</td>
      <td class="due-cell"><b>${clock(m.deadline)}</b><small>${m.openCount} open</small></td></tr>`).join('')
      : '<tr><td colspan="4" class="empty">No cases match these filters.</td></tr>';
    const hidden = data.cases.length-list.length;
    $('#queue-count').textContent = list.length+' of '+data.cases.length+' demo cases'+(hidden?' · '+hidden+' hidden by filters':'');
  }

  function audit(id) {
    const list = data.activity.filter(item=>!id||item.member===id);
    return list.length ? `<ul class="audit-list">${list.map(item=>`<li><div><h3>${e(item.label)}</h3>
      <p class="tiny">${detail(item.at)} · ${e(item.actor)}${item.member?' · '+e(item.member):''}</p>
      <p class="sub pre">${e(item.detail)}</p></div></li>`).join('')}</ul>` : empty('No actions recorded yet.');
  }

  function memberPage(m) {
    const list = records(m.id).filter(r=>category==='timeline'||(category==='overview'?m.evidence.includes(r.id):categories[category].slice(1).includes(r.domain)));
    const tabs = `<div class="tabs" aria-label="Record categories">${Object.entries(categories).map(([id,[label]])=>
      `<button type="button" data-do="category" data-id="${id}" aria-pressed="${category===id}">${label}</button>`).join('')}</div>`;
    return head('MEMBER RECORD','Member 360','See the current issue, source evidence, and open actions.')+caseHeader(m)
      + `<div class="grid"><div>${panel('Member timeline',tabs+(list.length?list.map(record).join(''):empty('No connected records in this category.')))}
      ${panel('Case activity',audit(m.id),'top-space')}</div><div>${summary(m)}</div></div>`;
  }

  function noteData(form) {
    const f = new FormData(form);
    return {...Object.fromEntries(f),interpreter:f.has('interpreter'),reviewed:f.has('reviewed'),
      permissionConfirmed:f.has('permissionConfirmed'),generated:form.dataset.generated || ''};
  }

  function permissionFields(policy,draft) {
    if (!policy) return '';
    return `<fieldset class="form evidence-fields" data-permission>
      <legend>Scoped outreach permission</legend>
      <label>Permission source<select name="permissionSource"><option value="">Choose source</option>
        ${options(policy.sources,draft.permissionSource)}</select></label>
      <label>Permission scope<select name="permissionScope"><option value="">Choose scope</option>
        ${options([policy.scope],draft.permissionScope)}</select></label>
      <label>Permission reference<input name="permissionReference" maxlength="120"
        value="${e(draft.permissionReference)}" placeholder="Demo consent or contact record reference"></label>
      <label class="check"><input name="permissionConfirmed" type="checkbox" ${draft.permissionConfirmed?'checked':''}> ${e(policy.label)}</label>
    </fieldset>`;
  }

  function outreach(m) {
    const draft = unsaved.get(m.id) || data.drafts[m.id] || {};
    const channels = m.blocked?['Verified alternative']:
      ['Phone','Verified alternative','Approved portal',...(m.caregiver?['Authorized caregiver']:[])];
    const recent = records(m.id).filter(r=>['Outreach','Contact'].includes(r.domain));
    const notes = data.notes.filter(n=>n.member===m.id);
    const form = `<div class="pad note-panel"><div class="row-flex"><h2>Activity note</h2>
      ${badge(data.drafts[m.id]?'Draft saved':'Clinician review required','Incomplete')}</div>
      <p class="tiny">The template briefing uses source evidence. Record your own observations before signing.</p>
      <div id="draft-warning"></div><hr class="divider">
      <form id="note-form" class="form" data-generated="${e(draft.generated)}">
      <div class="field-grid"><label>Activity type<select name="type">${options(['Pre-contact briefing','Outreach','Route investigation','Care coordination'],draft.type||'Outreach')}</select></label>
      <label data-contact>Contact channel<select name="channel">${options(channels,draft.channel)}</select></label></div>
      <p class="tiny" data-investigation hidden>Use this activity to investigate a route or consent. Outcomes excludes these notes from outreach attempts.</p>
      <label data-contact data-standard-route>Verified route and permission<input name="route" maxlength="300" value="${e(draft.route)}" placeholder="Verification reference"></label>
      ${permissionFields(m.contactPermission,draft)}
      <label data-contact>Observed outcome<select name="outcome"><option value="">Select outcome</option>${options(['Connected','Voicemail','No answer','Disconnected'],draft.outcome)}</select></label>
      ${m.interpreter?`<label data-contact class="check"><input type="checkbox" name="interpreter" ${draft.interpreter?'checked':''}> Spanish interpreter supported this encounter</label>`:''}
      <label>Note text<textarea name="text" maxlength="3000" placeholder="Enter observed details…">${e(draft.text)}</textarea></label>
      <label>Follow-up task title (optional)<input name="followUp" maxlength="140" value="${e(draft.followUp)}" placeholder="Example: Confirm transportation pickup"></label>
      <label class="check"><input type="checkbox" name="reviewed"> I reviewed the note and confirmed the details I entered</label>
      <div class="actions">${btn('Prepare template briefing','briefing')}${btn('Save draft','draft')}
      <button class="button primary" type="submit">Sign note</button></div><p class="error" aria-live="polite"></p></form></div>`;
    return head('CASE EXECUTION','Outreach & documentation','Review contact guidance and document the outcome of a simulated action.')
      + caseHeader(m)+`<div class="split"><div>${panel('Contact guidance',`<div class="pad"><div class="warning ${m.blocked?'urgent':''}">${e(m.contact)}</div>
      ${refs(recent.map(r=>r.id))}</div>`)}${panel('Previous source attempts',recent.filter(r=>r.domain==='Outreach').map(record).join('')||empty('No previous attempts in the connected record.'),'top-space')}
      </div><div><section class="panel">${form}</section>${panel('Signed notes',notes.map(n=>`<article class="record">
      <h3>${e(n.type)} · ${e(n.actor)}</h3><p class="tiny">${detail(n.at)}${n.outcome?' · '+e(n.outcome):''}</p>
      <p class="sub pre">${e(n.text)}</p>${n.permission?`<p class="tiny">Permission · ${e(n.permission.source)} · ${e(n.permission.scope)} · ${e(n.permission.reference)}</p>`:''}
      ${n.permissionReview?badge('Prior permission needs review','Incomplete'):''}</article>`).join('')||empty('No signed notes for this case.'),'top-space')}</div></div>`;
  }

  function coord(m) {
    const tasks = data.tasks.filter(t=>!scope||scope===t.member)
      .sort((a,b)=>Number(a.status==='Verified')-Number(b.status==='Verified')||a.due.localeCompare(b.due)||a.id.localeCompare(b.id));
    const list = `<section class="panel"><div class="panel-header"><div><h2>${scope?'Case tasks':'Across-case tasks'}</h2>
      <p class="tiny">${tasks.filter(t=>t.status!=='Verified').length} open · Simulation due dates</p></div>
      ${scope?`<div class="actions">${btn('All cases','coord')}${btn('Add task','task-create','','primary')}</div>`:''}</div>
      <ul class="task-list">${tasks.map(t=>`<li><div><h3>${e(t.title)}</h3>
      ${!scope?btn(data.cases.find(c=>c.id===t.member).name,'coord',t.member,'task-member'):''}
      <p class="tiny">${e(t.owner)} · Due ${detail(t.due)}</p><p class="tiny">Outcome required · ${e(t.outcome)}</p>
      ${t.verification?`<p class="tiny">${t.verification.kind==='attestation'?'Clinician attestation':'Connected evidence'} · ${e(t.verification.reference)} · ${e(t.verification.disposition)}
      · ${e(t.verification.source)} · ${detail(t.verification.time)}</p>`:''}
      ${refs([...new Set([t.source,t.verification?.kind==='record'?t.verification.reference:null].filter(Boolean))])}</div>
      <div class="actions">${badge(t.status,t.status==='Verified'?'Verified':'Incomplete')}
      ${t.status==='Open'?btn('Start','task-start',t.id):''}
      ${t.status!=='Verified'?btn('Handoff / escalate','task-handoff',t.id)+btn('Verify outcome','task-verify',t.id):''}</div></li>`).join('')}</ul></section>`;
    const status = scope ? records(m.id).filter(r=>['Authorization','Appointments','HomeHealth','Referral'].includes(r.domain)||
      ['R059','SIM-RIDE-001'].includes(r.id)) : [];
    return head('CASE EXECUTION','Care coordination','Assign follow-up, track partner status, and verify each outcome.')
      + (scope?caseHeader(m)+`<div class="grid"><div>${list}</div><div>${panel('Partner evidence',status.map(record).join('')||empty('No partner status records.'))}
      ${panel('Activity audit',audit(m.id),'top-space')}</div></div>`:list);
  }

  function importResult() {
    if (!preview) return '';
    if (preview.error) return `<p class="error">${e(preview.error)}</p>`;
    return `<b>${e(importFile.name)}</b><p class="sub">${preview.accepted} new · ${preview.duplicates} duplicates · ${preview.errors.length} rejected</p>
      ${preview.errors.length?`<ul class="error">${preview.errors.slice(0,12).map(x=>`<li>Row ${x.row} · ${e(x.id)} ${e(x.reason)}</li>`).join('')}</ul>`:''}
      <div class="actions top-space">${btn('Commit import','import','','primary',!!preview.errors.length||!preview.accepted)}</div>`;
  }

  function integrity() {
    const issues = data.records.filter(r=>['Conflict','Delayed','Missing','Stale','Incomplete','Restricted'].includes(r.quality));
    const batches = data.imports.map(b=>`<article class="record"><h3>${e(b.name)}</h3>
      <p class="tiny">${detail(b.at)} · ${b.added} added · ${b.duplicates} duplicates</p></article>`).join('');
    const replay = data.replay.map(r=>`<article class="record"><h3>${e(r.title)}</h3>
      <p class="tiny">Nina Shah · Receipt ${detail(r.received)}</p><div class="actions top-space">${r.played?badge('Replayed','Verified'):
      btn(r.id==='payer-update'?'Replay payer update':'Replay transport update','replay',r.id,'',!r.available)}</div></article>`).join('');
    const catalog = data.catalog.map(([domain,source,access,cadence,issue])=>{
      const matching = data.records.filter(r=>r.domain===domain);
      const latest = matching.map(r=>r.received).sort().at(-1);
      return `<details class="record"><summary>${e(domain.replaceAll('_',' '))} · ${matching.length} records</summary>
      <p class="sub">${e(source)} · ${e(access)}</p><p class="tiny">Expected cadence · ${e(cadence)}</p>
      <p class="tiny">Latest receipt · ${detail(latest)}</p><p class="tiny">${e(issue)}</p></details>`;
    }).join('');
    return head('SOURCE OPERATIONS','Data integrity','Validate standardized records and trace discrepancies to their source.')
      + `<div class="split"><div>${panel('Standardized records import',`<div class="pad form">
      <label>Choose a records CSV<input id="csv-file" type="file" accept=".csv,text/csv"></label>
      <p class="tiny">Preview required fields, duplicates, and rejected rows before committing.</p>
      <div id="import-preview" aria-live="polite">${importResult()}</div></div>`)}
      ${panel('Import history',batches||empty('The baseline was seeded from the verified workbook.'),'top-space')}</div>
      <div>${panel('Replay synthetic evidence',replay+`<div class="pad">${btn('Advance clock','advance')}</div>`)}
      ${panel('Source catalog',`<div class="catalog-list">${catalog}</div>`,'top-space')}</div></div>
      ${panel('Evidence that needs attention',`<div class="table-wrap"><table aria-label="Data discrepancies"><thead><tr>
      <th>Record</th><th>Member</th><th>Source issue</th><th>Flag</th><th>Received</th></tr></thead><tbody>
      ${issues.map(r=>`<tr><td>${refs([r.id])}</td><td>${e(r.member)}</td><td>${e(r.title)}</td><td>${badge(r.quality)}</td>
      <td>${detail(r.received)}</td></tr>`).join('')}</tbody></table></div>`,'top-space')}`;
  }

  function outcomes() {
    const m = data.metrics;
    const stat = (value,label,hint) => `<div class="stat"><b>${value}</b><span>${label}</span><small>${hint}</small></div>`;
    return head('DEMO OPERATIONS','Outcomes','Metrics reflect actions recorded since the Monday baseline.')
      + `<section class="stats" aria-label="Recorded outcomes">${stat(m.open,'Open tasks',m.overdue+' overdue')}
      ${stat(m.verified,'Verified closures','Evidence-backed task outcomes')}
      ${stat(m.attempts,'Outreach attempts','Signed simulated outreach notes')}
      ${stat(m.attempts?Math.round(m.connected/m.attempts*100)+'%':'—','Connection rate',m.connected+' connected / '+m.attempts+' attempts')}</section>`
      + panel('Activity audit',audit());
  }

  const pages = {queue,member:memberPage,outreach,coord,integrity,outcomes};
  function syncNote() {
    const form = $('#note-form');
    if (!form) return;
    const outreach = form.elements.type.value==='Outreach';
    const needsPermission = outreach && (member().blocked || form.elements.channel.value==='Authorized caregiver');
    form.querySelectorAll('[data-contact]').forEach(field=>{field.hidden=!outreach;});
    form.querySelector('[data-standard-route]').hidden=!outreach||needsPermission;
    const permission = form.querySelector('[data-permission]');
    if (permission) {
      permission.hidden=!needsPermission;
      permission.disabled=!needsPermission;
    }
    form.querySelector('[data-investigation]').hidden=form.elements.type.value!=='Route investigation';
    const warning = $('#draft-warning');
    if (warning.dataset.revision !== String(data.revision)) {
      warning.innerHTML = newEvidence(member());
      warning.dataset.revision = data.revision;
    }
    $('.heading .date').innerHTML = '<strong>' + e(data.clock.slice(0,10)) + '</strong>' +
      clock(data.clock) + ' · Simulation clock';
    form.querySelector('[type=submit]').disabled = updates(selected).length>0;
  }

  function render(focus=false) {
    revision = data.revision;
    $('#crumb').textContent = 'Care management / '+names[view];
    const current = ['member','outreach'].includes(view)?'queue':view;
    $('#nav').innerHTML = Object.keys(icons).map(id=>`<button class="nav-button" type="button" data-do="${id}"
      aria-label="${names[id]}" ${id===current?'aria-current="page"':''}><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      ${icons[id]}</svg><span>${names[id]}</span></button>`).join('');
    main.innerHTML = pages[view](member());
    main.removeAttribute('aria-busy');
    if (view==='queue') drawRows();
    if (view==='outreach') syncNote();
    if (focus) main.focus({preventScroll:true});
  }

  function routeFromHash() {
    if (!data) return;
    if (view==='queue') queueScroll=window.scrollY;
    const [destination,id] = location.hash.slice(1).split('/');
    view = Object.hasOwn(pages,destination)?destination:'queue';
    scope = data.cases.some(m=>m.id===id)?id:'';
    if (scope&&selected!==scope) {selected=scope;category='overview';}
    if (['member','outreach'].includes(view)&&!member()) view='queue';
    render(true);
    window.scrollTo(0,view==='queue'?queueScroll:0);
  }

  function navigate(destination,id) {
    if (modal.open) modal.close();
    const caseId = id || (['member','outreach'].includes(destination)?selected:'');
    const hash = '#'+destination+(caseId?'/'+caseId:'');
    if (location.hash!==hash) history.pushState(null,'',hash);
    routeFromHash();
  }

  function announce(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent=message;
    toastTimer=setTimeout(()=>{$('#toast').textContent='';},5000);
  }

  async function api(url,body) {
    const response = await fetch(url,body?{
      method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),
    }:{cache:'no-store'});
    const result = await response.json();
    if (!response.ok) {
      const error = new Error(result.error);
      error.state=result.state;
      throw error;
    }
    return result;
  }

  async function mutate(action,body) {
    if (active) return false;
    active=true;
    try {
      const result=await api('/api/action',{...body,action,revision,requestId:crypto.randomUUID()});
      data=result.state;
      announce(result.message);
      return true;
    } catch (error) {
      if (error.state) data=error.state;
      throw error;
    } finally {active=false;}
  }

  function showModal(title,body) {
    if (!modal.open) returnFocus=document.activeElement;
    modal.innerHTML=`<h2 id="modal-title">${e(title)}</h2><div class="top-space">${body}</div>`;
    if (!modal.open) modal.showModal();
    else modal.querySelector('button,input,textarea')?.focus();
  }

  function showForm(title,action,body,label,id='') {
    showModal(title,`<form id="action-form" class="form" data-action="${action}" data-id="${e(id)}">${body}
      <p class="error" aria-live="polite"></p><div class="actions"><button class="button primary" type="submit">${label}</button>
      ${btn('Cancel','dismiss')}</div></form>`);
  }

  const findTask = id => data.tasks.find(task=>task.id===id);
  const findRecord = id => data.records.find(item=>item.id===id);
  const dateField = (name,label,value) => `<label>${label}<input type="datetime-local" name="${name}"
    value="${e(value.replace(' ','T'))}" required></label>`;
  const dueField = (value=data.clock.slice(0,10)+' 17:00') => dateField('due','Due date and time (ET)',value);

  function taskForm(action,id) {
    const task = findTask(id);
    if (action==='task-create') {
      showForm('Add coordination task',action,`<label>Task title<input name="title" maxlength="140" required></label>
        <label>Owner<input name="owner" maxlength="140" required></label>${dueField()}
        <label>Outcome required<textarea name="outcome" maxlength="300" required></textarea></label>`,'Add task');
    } else if (task && action==='task-handoff') {
      showForm('Hand off or escalate task',action,`<p class="sub">${e(task.title)}</p>
        <label>New owner<input name="owner" maxlength="140" value="${e(task.owner)}" required></label>${dueField(task.due)}
        <label>Handoff reason<textarea name="detail" maxlength="600" required></textarea></label>
        <label class="check"><input name="escalate" type="checkbox"> Mark as escalated</label>`,'Save handoff',id);
    } else if (task) {
      showForm('Verify task outcome',action,`<p class="sub">${e(task.title)} · ${e(task.outcome)}</p>
        <label>Evidence method<select name="verificationMode"><option value="record">Connected source record</option>
          <option value="attestation">External clinician attestation</option></select></label>
        <label>Outcome source reference<input name="evidence" maxlength="140" required></label>
        <fieldset class="form evidence-fields" data-attestation hidden disabled>
          <legend>External confirmation</legend>
          <p class="tiny">Confirm the disposition with the ${e(task.outcomePolicy.source)}.</p>
          <label>Source name<input name="outcomeSource" maxlength="140" required></label>
          ${dateField('outcomeTime','Confirmation time (ET)',data.clock)}
          <label>Confirmed disposition<select name="disposition" required><option value="">Choose disposition</option>
            ${options([task.outcomePolicy.disposition])}</select></label>
          <label class="check"><input name="outcomeConfirmed" type="checkbox" required> I verified this outcome with the named source</label>
        </fieldset>`,
        'Verify and close task',id);
    }
  }

  function prepareBriefing() {
    const form = $('#note-form');
    const field = form.elements.text;
    if (field.value.trim() && field.value.trim()!==form.dataset.generated.trim()) {
      form.querySelector('.error').textContent='Clear the note text before inserting a briefing.';
      return;
    }
    const m=member();
    field.value='Template briefing for '+m.name+'.\nEvidence: '+m.why+
      '\nSuggested next step for clinician review: '+m.next+'\nSources: '+m.evidence.join(', ')+'.';
    form.dataset.generated=field.value;
    form.elements.type.value='Pre-contact briefing';
    form.elements.reviewed.checked=false;
    unsaved.set(selected,noteData(form));
    syncNote();
    field.focus();
  }

  async function saveNote(action,form) {
    const id=selected, body=noteData(form);
    unsaved.set(id,body);
    try {
      if (!await mutate(action,{...body,member:id})) return;
      unsaved.delete(id);
      render(true);
    } catch (error) {
      if (error.state) render();
      $('#note-form')?.querySelector('.error')?.replaceChildren(error.message);
    }
  }

  async function run(action,body) {
    try {
      if (!await mutate(action,body)) return;
      if (action==='import') {preview=null;importFile=null;}
      render(true);
    } catch (error) {
      if (error.state) render();
      announce(error.message);
    }
  }

  function drawer() {
    if (member()) showModal('Case preview',summary(member())+`<div class="actions">${btn('Close','dismiss')}</div>`);
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-do]');
    if (!button||!data) return;
    const {do:action,id}=button.dataset;
    if (Object.hasOwn(pages,action)) {navigate(action,id);return;}
    switch (action) {
      case 'select':
        selected=id;category='overview';
        drawRows();
        $('#queue-rows [data-id="'+CSS.escape(id)+'"]')?.focus();
        if (matchMedia('(max-width: 890px)').matches) drawer();
        break;
      case 'preview': drawer();break;
      case 'category':
        category=id;render();
        $('[data-do="category"][data-id="'+id+'"]')?.focus();
        break;
      case 'source': {
        const r=findRecord(id);
        if (r) showModal('Source record '+id,record(r)+`<div class="actions">${btn('Open Member 360','member',r.member)}
          ${view==='integrity'&&r.quality!=='Restricted'?btn('Reconcile / verify','reconcile',id):''}${btn('Close','dismiss')}</div>`);
        break;
      }
      case 'dismiss': modal.close();break;
      case 'briefing': prepareBriefing();break;
      case 'draft': void saveNote(action,$('#note-form'));break;
      case 'review':
        if (view==='outreach') unsaved.set(selected,noteData($('#note-form')));
        if (modal.open) modal.close();
        void run(action,{member:selected,ids:id.split(',')});
        break;
      case 'replay': void run(action,{id});break;
      case 'import':
        if (importFile) void run(action,{csv:importFile.text,filename:importFile.name});
        break;
      case 'advance': showForm('Advance simulation clock',action,dateField('clock','Snapshot (ET)',data.clock),'Advance clock');break;
      case 'reconcile':
        showForm('Reconcile source '+id,action,`<label>Verification or reconciliation detail<textarea name="detail" maxlength="600" required></textarea></label>
          <label class="check"><input name="createTask" type="checkbox"> Create a verification task for Maria</label>`,'Save reconciliation',id);
        break;
      case 'task-start':
        if (findTask(id)) void run(action,{id,member:findTask(id).member});
        break;
      case 'task-create':
      case 'task-handoff':
      case 'task-verify': taskForm(action,id);break;
    }
  });

  document.addEventListener('submit',async event=>{
    const form=event.target;
    if (!['note-form','action-form'].includes(form.id)) return;
    event.preventDefault();
    if (form.id==='note-form') {void saveNote('sign',form);return;}
    const {action,id}=form.dataset;
    const fields=new FormData(form);
    const body={...Object.fromEntries(fields),id,member:findTask(id)?.member||selected};
    if (body.due) body.due=body.due.replace('T',' ');
    if (body.clock) body.clock=body.clock.replace('T',' ');
    if (body.outcomeTime) body.outcomeTime=body.outcomeTime.replace('T',' ');
    if (action==='task-verify') body.outcomeConfirmed=fields.has('outcomeConfirmed');
    if (action==='task-handoff') body.escalate=fields.has('escalate');
    if (action==='reconcile') {
      body.member=findRecord(id)?.member;
      body.createTask=fields.has('createTask');
    }
    try {
      if (!await mutate(action,body)) return;
      modal.close();
      if (action==='reset') {
        unsaved.clear();
        selected='M-1006';filter='today';sort='priority';category='overview';search='';queueScroll=0;
        importFile=null;preview=null;
        navigate('queue');
      } else {render(true);}
    } catch (error) {
      form.querySelector('.error').textContent=error.message;
      if (error.state) {
        form.querySelector('[type=submit]').disabled=true;
        render();
      }
    }
  });

  document.addEventListener('input',event=>{
    if (event.target.id==='search') {search=event.target.value;drawRows();}
    const form=event.target.closest('#note-form');
    if (form&&event.target.name!=='reviewed') {
      form.elements.reviewed.checked=false;
      if (['permissionSource','permissionScope','permissionReference'].includes(event.target.name)) {
        form.elements.permissionConfirmed.checked=false;
      }
      form.querySelector('.error').textContent='';
      unsaved.set(selected,noteData(form));
    }
  });

  document.addEventListener('change',async event=>{
    const {id,value}=event.target;
    if (id==='filter') {filter=value;drawRows();}
    if (id==='sort') {sort=value;drawRows();}
    if (['type','channel'].includes(event.target.name)&&view==='outreach') {
      const form=$('#note-form');
      if (event.target.name==='channel'&&form.elements.permissionConfirmed) {
        form.elements.permissionConfirmed.checked=false;
      }
      syncNote();
      unsaved.set(selected,noteData(form));
    }
    if (event.target.name==='verificationMode') {
      const attestation=event.target.form.querySelector('[data-attestation]');
      attestation.hidden=value!=='attestation';
      attestation.disabled=attestation.hidden;
    }
    if (id!=='csv-file') return;
    const file=event.target.files[0];
    if (!file) return;
    const pendingFile={name:file.name};
    importFile=pendingFile;
    preview={error:'Validating the selected CSV…'};
    $('#import-preview').innerHTML=importResult();
    let result;
    try {
      if (file.size>250_000) throw new Error('Choose a CSV smaller than 250 KB.');
      pendingFile.text=await file.text();
      result=await api('/api/import/preview',{csv:pendingFile.text});
    } catch (error) {result={error:error.message};}
    if (importFile!==pendingFile) return;
    preview=result;
    if ($('#import-preview')) $('#import-preview').innerHTML=importResult();
  });

  modal.addEventListener('close',()=>{if (returnFocus?.isConnected) returnFocus.focus();});
  $('#reset').addEventListener('click',()=>{
    if (data) showForm('Reset demo','reset','<p class="sub">Restore the six-case Monday baseline and clear demo actions from this database.</p>','Restore baseline');
  });
  $('.skip').addEventListener('click',event=>{event.preventDefault();main.focus();});
  window.addEventListener('popstate',routeFromHash);
  setInterval(async ()=>{
    if (!data||view!=='outreach'||active||document.hidden) return;
    try {
      const fresh=await api('/api/state');
      if (view==='outreach'&&!active&&fresh.revision>data.revision) {data=fresh;syncNote();}
    } catch { /* An attempted save or the next check can surface a persistent failure. */ }
  },5000);
  api('/api/state').then(result=>{data=result;routeFromHash();}).catch(()=>{
    main.removeAttribute('aria-busy');
    main.innerHTML='<p class="empty" role="alert">Could not load the workbench. Refresh to try again.</p>';
  });
})();
