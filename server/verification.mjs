import { validDateTime } from './csv.mjs';

// Only the documented completion of this task is a qualifying disposition.
const policies = {
  'M-1001-1': ['Prescribing team', 'Intended regimen confirmed'],
  'M-1001-2': ['Member, pharmacy or clinic', 'Medication access and follow-up confirmed'],
  'M-1002-1': ['Hospital or HIE', 'ED encounter details received'],
  'M-1002-2': ['Member services or member', 'Contact route and permission verified'],
  'M-1003-1': ['Member or pharmacy', 'Medication access and barriers confirmed'],
  'M-1003-2': ['PCP or scheduling team', 'Visit outcome confirmed'],
  'M-1004-1': ['Language services or member', 'Interpreter support and contact outcome confirmed'],
  'M-1004-2': ['Behavioral-health team or member', 'Referral outcome confirmed'],
  'M-1005-1': ['Home-health agency', 'Start of care confirmed'],
  'M-1005-2': ['Authorized caregiver', 'Support plan confirmed by caregiver'],
  'M-1006-1': ['Payer utilization management', 'Payer determination confirmed'],
  'M-1006-2': ['Treating oncology team', 'Next steps confirmed by treating team'],
  'M-1006-3': ['Transportation partner or member', 'Ride or alternative confirmed'],
  'M-1006-4': ['Member', 'Contact outcome documented'],
};

export function outcomePolicy(task) {
  const [source, disposition] = policies[task.id] || ['Responsible party', 'Required outcome confirmed'];
  return {source, disposition};
}

function findRecord(state, reference) {
  const id = reference.toUpperCase();
  return state.records.find(record => record.id === (id === 'UM-DEMO-1109' ? 'SIM-UM-001' : id));
}

export function connectedOutcome(state, task, reference, at = state.clock) {
  const record = findRecord(state, reference);
  if (!record || record.member !== task.member || record.received > at || record.quality !== 'Verified') {
    return null;
  }
  // The replay supplies a structured, task-specific payer determination.
  if (task.id !== 'M-1006-1' || record.id !== 'SIM-UM-001' || record.domain !== 'Authorization') {
    return null;
  }
  return {kind: 'record', reference: record.id, source: record.source,
    time: record.received, disposition: outcomePolicy(task).disposition};
}

export const validReference = value => /^[A-Za-z0-9][A-Za-z0-9._:/-]{1,119}$/.test(value);

export function attestedOutcome(state, task, values) {
  const {reference, source, time, disposition, confirmed} = values;
  const policy = outcomePolicy(task);
  if (!confirmed || !source || !validReference(reference) || !validDateTime(time) ||
      time > state.clock || disposition !== policy.disposition || findRecord(state, reference)) {
    return null;
  }
  const baseline = task.source && findRecord(state, task.source);
  const pendingRide = task.id === 'M-1006-3' && findRecord(state, 'SIM-RIDE-001');
  if ((baseline && time < baseline.received) || (pendingRide && time < pendingRide.received)) {
    return null;
  }
  return {kind: 'attestation', reference, source, sourceRole: policy.source, time, disposition};
}

export function permissionPolicy(blocked, channel) {
  if (blocked) {
    return {
      sources: ['Member services', 'Member'],
      scope: 'Case-management outreach through the alternate channel',
      label: 'I verified permission to use this alternate channel for case-management outreach',
    };
  }
  if (channel === 'Authorized caregiver') {
    return {
      sources: ['Member consent record', 'Member'],
      scope: 'Discuss home-health coordination and caregiver support',
      label: 'I verified the caregiver’s identity and consent for this scope',
    };
  }
  return null;
}

export function scopedPermission(blocked, note) {
  const policy = permissionPolicy(blocked, note.channel);
  if (!policy || note.permissionConfirmed !== true || !policy.sources.includes(note.permissionSource) ||
      note.permissionScope !== policy.scope || !validReference(note.permissionReference)) return null;
  return {source: note.permissionSource, scope: note.permissionScope, reference: note.permissionReference};
}
