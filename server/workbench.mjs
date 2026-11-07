import seed from './seed.mjs';
import plans from './case-plans.mjs';
import { previewCsv, toRecord, validDateTime } from './csv.mjs';
import { attestedOutcome, connectedOutcome, outcomePolicy, permissionPolicy, scopedPermission } from './verification.mjs';

export const START = '2026-11-09 08:00';
export const ACTOR = 'Maria Chen, RN';
const cases = seed.cases.map(([id, name, age, scenario, priority]) =>
  ({id, name, age, scenario, priority: priority.slice(0, 2)}));
const members = new Set(cases.map(member => member.id));
const domains = new Set(seed.catalog.map(row => row[0]));
const actionDomains = new Set(['Hospital_ADT', 'Discharge', 'Medication', 'Authorization',
  'Appointments', 'HomeHealth', 'Referral', 'Contact', 'Pharmacy']);
const steps = [
  {
    id: 'payer-update', member: 'M-1006', domain: 'Authorization',
    source: 'Payer utilization management · simulation',
    event: '2026-11-09 08:04', received: '2026-11-09 08:05',
    title: 'Infusion authorization determination',
    value: 'Simulated payer approval for the scheduled infusion. Reference UM-DEMO-1109.',
    quality: 'Verified', limitation: 'Payer approval addresses coverage only.',
    handling: 'Verify the authorization task. Keep transportation and treating-team follow-up open.',
    recordId: 'SIM-UM-001',
  },
  {
    id: 'transport-update', member: 'M-1006', domain: 'SDOH',
    source: 'Transportation partner · simulation',
    event: '2026-11-09 08:08', received: '2026-11-09 08:09',
    title: 'Transportation status update',
    value: 'Ride request received. Pickup confirmation is still pending.',
    quality: 'Incomplete', limitation: 'No confirmed pickup time.',
    handling: 'Keep the transportation task open and verify the ride or an alternative.',
    recordId: 'SIM-RIDE-001',
  },
];

export function initialState() {
  return {
    clock: START, records: seed.records.map(toRecord), drafts: {}, reviewed: [],
    notes: [], activity: [], imports: [], requestIds: [],
    tasks: cases.flatMap(({id}) => plans[id].tasks.map(([title, owner, source, outcome], index) => ({
      id: id + '-' + (index + 1), member: id, title, owner, source, outcome,
      due: START.slice(0, 10) + ' ' + (index === 0 ? plans[id].deadline : '17:00'),
      status: 'Open',
    }))),
  };
}

function visibleRecords(state) {
  return state.records.filter(record => record.received <= state.clock);
}

function safeRecord(record) {
  if (record.quality !== 'Restricted') return record;
  return {
    id: record.id, member: record.member, domain: record.domain,
    title: 'Restricted source record', quality: record.quality,
    source: 'Restricted partner', event: record.event, received: record.received,
    value: 'Your demo role can see that a record exists. Details are restricted.',
  };
}

function newUpdates(state, records = visibleRecords(state)) {
  const original = new Set(seed.records.map(row => row[0]));
  const reviewed = new Set(state.reviewed);
  return records.filter(record => !original.has(record.id) && !reviewed.has(record.id) &&
    (actionDomains.has(record.domain) || ['Conflict', 'Missing'].includes(record.quality) ||
      steps.some(step => step.recordId === record.id))).map(safeRecord);
}

function recordSort(left, right) {
  return right.event.localeCompare(left.event) || left.id.localeCompare(right.id);
}

function reviewPriorClosure(state, task) {
  if (task.status !== 'Verified' || task.verification) return task;
  const {evidence, confirmation, verifiedAt, ...open} = task;
  const verification = verifiedAt && connectedOutcome(state, task, evidence || '', verifiedAt);
  if (verification) {
    return {...task, evidence: verification.reference, confirmation: verification.disposition, verification};
  }
  return {...open, status: 'Needs verification', priorClosure: {evidence, confirmation, verifiedAt}};
}

function permissionNeedsReview(note) {
  return note.type === 'Outreach' && !note.permission &&
    (plans[note.member]?.blocked || note.channel === 'Authorized caregiver');
}

function caseSummary(member, records, tasks, updates) {
  const plan = plans[member.id];
  const ids = new Set(records.map(record => record.id));
  const openTasks = tasks.filter(task => task.status !== 'Verified')
    .sort((left, right) => left.due.localeCompare(right.due) || left.id.localeCompare(right.id));
  const nextTask = openTasks[0];
  const evidence = plan.evidence.filter(id => ids.has(id));
  const payerUpdate = ids.has('SIM-UM-001');
  const transportUpdate = ids.has('SIM-RIDE-001');
  let { signal, why, next, trust } = plan;
  let authorization = 'Pending review';
  if (member.id === 'M-1006' && payerUpdate) {
    signal = 'Payer update received · follow-up needed';
    why = 'The scheduled infusion remains on the calendar. A simulated payer approval arrived. Transportation and treating-team follow-up are tracked separately.';
    next = 'Review the payer determination and verify the authorization task. Confirm the ride and next steps with oncology.';
    trust = 'New payer determination';
    authorization = 'Approved by payer · simulated';
    evidence.unshift('SIM-UM-001');
  }
  if (member.id === 'M-1006' && transportUpdate) evidence.unshift('SIM-RIDE-001');
  if (member.id === 'M-1006' && payerUpdate && tasks.find(task => task.id === 'M-1006-1')?.status === 'Verified') {
    signal = 'Authorization verified · coordination open';
    next = nextTask ? nextTask.title + '.' : 'Review the verified outcomes.';
  }
  if (member.id !== 'M-1006' && tasks.find(task => task.id === member.id + '-1')?.status === 'Verified' && nextTask) {
    signal = 'Initial outcome verified · follow-up open';
    next = nextTask.title + '.';
  }
  if (!openTasks.length) {
    signal = 'Tracked actions verified';
    next = 'Review the verified outcomes and any new evidence.';
  }
  const additional = updates.filter(update => !evidence.includes(update.id));
  if (additional.length) {
    signal = 'New source evidence · review needed';
    next = 'Review the new source evidence and confirm whether it changes the next action.';
    evidence.unshift(...additional.map(update => update.id));
  }
  const priority = nextTask || updates.length ? member.priority : 'Complete';
  return {
    ...member, priority, signal, why, next, trust, evidence, nextTask, authorization,
    deadline: nextTask?.due || null, openCount: openTasks.length,
    contact: plan.contact, blocked: !!plan.blocked, interpreter: !!plan.interpreter,
    caregiver: !!plan.caregiver,
    contactPermission: plan.blocked ? permissionPolicy(true) :
      (plan.caregiver ? permissionPolicy(false, 'Authorized caregiver') : null),
    updateCount: updates.length,
  };
}

export function publicState(state, revision) {
  const records = visibleRecords(state).map(safeRecord).sort(recordSort);
  const updates = newUpdates(state);
  const tasks = state.tasks.map(task => ({...reviewPriorClosure(state, task), outcomePolicy: outcomePolicy(task)}));
  const roster = cases.map(member => caseSummary(member,
    records.filter(record => record.member === member.id),
    tasks.filter(task => task.member === member.id),
    updates.filter(update => update.member === member.id)));
  const notes = state.notes.map(note => ({...note, permissionReview: !!permissionNeedsReview(note)}));
  const outreach = notes.filter(note => note.type === 'Outreach' && !note.permissionReview);
  return {
    revision, clock: state.clock, actor: ACTOR, cases: roster, records, updates,
    tasks, drafts: state.drafts, notes, activity: state.activity,
    imports: state.imports, catalog: seed.catalog,
    replay: steps.map(step => ({
      id: step.id, title: step.title, received: step.received,
      available: !state.records.some(record => record.id === step.recordId) &&
        (step.id !== 'transport-update' || state.records.some(record => record.id === 'SIM-UM-001')),
      played: state.records.some(record => record.id === step.recordId),
    })),
    metrics: {
      open: tasks.filter(task => task.status !== 'Verified').length,
      overdue: tasks.filter(task => task.status !== 'Verified' && task.due < state.clock).length,
      verified: tasks.filter(task => task.status === 'Verified').length,
      attempts: outreach.length, connected: outreach.filter(note => note.outcome === 'Connected').length,
      signed: state.notes.length,
    },
  };
}

export function checkImport(state, csv) {
  const {accepted, duplicates, errors} = previewCsv(csv, state, members, domains);
  return {accepted: accepted.length, duplicates, errors};
}

export class WorkflowError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function requireValue(test, message, status) {
  if (!test) throw new WorkflowError(message, status);
}

function text(value, max = 3000) {
  requireValue(typeof value === 'string' && value.trim().length <= max, 'Check the text length and try again.');
  return value.trim();
}

function log(state, member, label, detail) {
  state.activity.unshift({id: crypto.randomUUID(), member, label, detail, at: state.clock, actor: ACTOR});
}

const noteTypes = ['Pre-contact briefing', 'Outreach', 'Route investigation', 'Care coordination'];
const noteOutcomes = ['Connected', 'Voicemail', 'No answer', 'Disconnected'];
function noteValues(body) {
  requireValue(noteTypes.includes(body.type), 'Choose an activity type.');
  return {
    type: body.type, channel: text(body.channel || '', 100), route: text(body.route || '', 300),
    outcome: text(body.outcome || '', 100), text: text(body.text || ''),
    followUp: text(body.followUp || '', 300), interpreter: body.interpreter === true,
    generated: text(body.generated || ''),
    permissionSource: text(body.permissionSource || '', 100),
    permissionScope: text(body.permissionScope || '', 160),
    permissionReference: text(body.permissionReference || '', 120),
    permissionConfirmed: body.permissionConfirmed === true,
  };
}

function newTask(state, member, input) {
  const task = {
    id: crypto.randomUUID(), member, title: text(input.title || '', 140),
    owner: text(input.owner || '', 140), due: text(input.due || '', 30),
    outcome: text(input.outcome || '', 300), source: input.source || null, status: 'Open',
  };
  requireValue(task.title && task.owner && task.outcome && validDateTime(task.due),
    'Enter a task title, owner, due date, and verification requirement.');
  state.tasks.push(task);
  log(state, member, 'Task created', task.title + ' · ' + task.owner);
}

function verifyTask(state, task, body) {
  const evidence = text(body.evidence || '', 140);
  let verification;
  if (body.verificationMode === 'attestation') {
    verification = attestedOutcome(state, task, {
      reference: evidence, source: text(body.outcomeSource || '', 140),
      time: text(body.outcomeTime || '', 30), disposition: body.disposition,
      confirmed: body.outcomeConfirmed === true,
    });
    requireValue(verification,
      'Record a qualifying external outcome with its source, time, unique reference, and clinician attestation.');
  } else {
    verification = connectedOutcome(state, task, evidence);
    requireValue(verification, 'Use a visible source record that confirms this task’s outcome for this member.');
  }
  const {reference, source, time, disposition, kind} = verification;
  Object.assign(task, {status: 'Verified', evidence: reference, confirmation: disposition,
    verifiedAt: state.clock, verification});
  log(state, task.member, kind === 'attestation' ? 'Outcome attested by clinician' : 'Outcome verified',
    [task.title, reference, source, time + ' ET', disposition].join(' · '));
}

export function applyAction(state, body) {
  const {action, member} = body;
  if (action === 'reset') return {state: initialState(), message: 'Monday baseline restored.'};
  state.tasks = state.tasks.map(task => reviewPriorClosure(state, task));
  if (action === 'import') {
    const preview = previewCsv(body.csv, state, members, domains);
    requireValue(!preview.errors.length, 'Correct the rejected CSV rows before importing.');
    if (!preview.accepted.length) return {state, changed: false, message: 'All rows were already present.'};
    state.records.push(...preview.accepted);
    const name = text(body.filename || 'Records CSV', 120);
    state.imports.unshift({name, at: state.clock, added: preview.accepted.length, duplicates: preview.duplicates});
    log(state, null, 'CSV imported', name + ' · ' + preview.accepted.length + ' records');
    return {state, message: preview.accepted.length + ' source records imported.'};
  }
  if (action === 'advance') {
    requireValue(validDateTime(body.clock) && body.clock >= state.clock, 'Choose a valid time at or after the current snapshot.');
    if (body.clock === state.clock) return {state, changed: false, message: 'Snapshot unchanged.'};
    state.clock = body.clock;
    log(state, null, 'Simulation advanced', state.clock + ' ET');
    return {state, message: 'Simulation time updated.'};
  }
  if (action === 'replay') {
    const step = steps.find(item => item.id === body.id);
    requireValue(step, 'Unknown replay event.');
    if (state.records.some(record => record.id === step.recordId)) {
      return {state, changed: false, message: 'This event is already present.'};
    }
    requireValue(step.id !== 'transport-update' || state.records.some(record => record.id === 'SIM-UM-001'),
      'Replay the payer update first.');
    const {id, recordId, ...record} = step;
    state.records.push({...record, id: recordId});
    if (state.clock < step.received) state.clock = step.received;
    log(state, step.member, 'Source update received', recordId + ' · ' + step.title);
    return {state, message: 'Synthetic update received for Nina Shah.'};
  }
  requireValue(members.has(member), 'Choose a valid member.', 404);

  if (action === 'review') {
    requireValue(Array.isArray(body.ids) && body.ids.every(id => typeof id === 'string'),
      'Select the displayed updates.');
    const shown = new Set(body.ids);
    const ids = newUpdates(state).filter(record => record.member === member && shown.has(record.id)).map(record => record.id);
    if (!ids.length) return {state, changed: false, message: 'These updates were already reviewed.'};
    state.reviewed.push(...ids);
    log(state, member, 'Evidence reviewed', ids.join(', '));
    return {state, message: ids.length + (ids.length === 1 ? ' update marked reviewed.' : ' updates marked reviewed.')};
  }
  if (action === 'draft' || action === 'sign') {
    const note = noteValues(body);
    if (action === 'draft') {
      state.drafts[member] = note;
      return {state, message: 'Draft saved.'};
    }
    requireValue(body.reviewed === true && note.text, 'Enter a note and confirm clinician review.');
    requireValue(!newUpdates(state).some(record => record.member === member),
      'Review the new evidence before signing. Your draft can still be saved.', 409);
    if (note.type === 'Outreach') {
      const plan = plans[member];
      const channels = plan.blocked ? ['Verified alternative'] :
        ['Phone', 'Verified alternative', 'Approved portal', ...(plan.caregiver ? ['Authorized caregiver'] : [])];
      requireValue(channels.includes(note.channel) && noteOutcomes.includes(note.outcome),
        'Choose a permitted contact channel and an observed outcome.');
      if (permissionPolicy(plan.blocked, note.channel)) {
        note.permission = scopedPermission(plan.blocked, note);
        requireValue(note.permission, plan.blocked ?
          'Record a verified, permitted alternative route with scoped permission before signing.' :
          'Verify caregiver identity and consent for the selected scope before signing.');
        requireValue(!state.records.some(record => record.id.toUpperCase() === note.permission.reference.toUpperCase()),
          'Enter the external permission reference. The connected case records do not establish this scope.');
        note.route = '';
      } else {
        requireValue(note.route, 'Enter the verified contact route.');
      }
      requireValue(!plan.interpreter || note.outcome !== 'Connected' || note.interpreter,
        'Record interpreter support for the connected encounter.');
      requireValue(!note.generated || note.text !== note.generated, 'Enter your observed interaction details.');
    } else {
      Object.assign(note, {channel: '', route: '', outcome: '', interpreter: false,
        permissionSource: '', permissionScope: '', permissionReference: '', permissionConfirmed: false});
    }
    if (note.followUp) newTask(state, member, {
      title: note.followUp, owner: ACTOR, due: state.clock.slice(0, 10) + ' 17:00',
      outcome: 'Document the follow-up and the verified result.',
    });
    state.notes.unshift({...note, id: crypto.randomUUID(), member, at: state.clock, actor: ACTOR});
    delete state.drafts[member];
    log(state, member, 'Note signed', note.type + (note.outcome ? ' · ' + note.outcome : ''));
    return {state, message: 'Signed note recorded.'};
  }
  if (action === 'task-create') {
    newTask(state, member, body);
    return {state, message: 'Task created.'};
  }
  if (action === 'reconcile') {
    const record = visibleRecords(state).find(item => item.member === member && item.id === body.id);
    requireValue(record && record.quality !== 'Restricted', 'Source record unavailable.', 404);
    const detail = text(body.detail || '', 600);
    requireValue(detail, 'Enter the verification or reconciliation detail.');
    if (body.createTask === true) newTask(state, member, {
      title: 'Verify source ' + record.id, owner: ACTOR, due: state.clock.slice(0, 10) + ' 17:00',
      outcome: detail.slice(0, 300), source: record.id,
    });
    log(state, member, 'Reconciliation recorded', record.id + ' · ' + detail);
    return {state, message: 'Reconciliation saved. Source record preserved.'};
  }

  requireValue(['task-start', 'task-handoff', 'task-verify'].includes(action), 'Unknown action.', 404);
  const task = state.tasks.find(item => item.id === body.id && item.member === member);
  requireValue(task && task.status !== 'Verified', 'This open task is unavailable.', 409);
  if (action === 'task-verify') {
    verifyTask(state, task, body);
  } else if (action === 'task-handoff') {
    const owner = text(body.owner || '', 140);
    const due = text(body.due || '', 30);
    const detail = text(body.detail || '', 600);
    requireValue(owner && validDateTime(due) && detail, 'Enter the owner, due date, and handoff reason.');
    Object.assign(task, {owner, due, status: body.escalate ? 'Escalated' : 'Handed off'});
    log(state, member, task.status, task.title + ' · ' + owner + ' · ' + detail);
  } else {
    requireValue(task.status !== 'In progress', 'This task is already in progress.', 409);
    task.status = 'In progress';
    log(state, member, 'Task started', task.title);
  }
  return {state, message: 'Task updated.'};
}
