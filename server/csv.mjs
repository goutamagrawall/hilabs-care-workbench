export const columns = [
  'record_id', 'member_id', 'dataset', 'fictional_source', 'event_at_et',
  'received_at_et', 'field', 'observed_value', 'quality_flag', 'limitation', 'expected_handling'
];

const fields = ['id', 'member', 'domain', 'source', 'event', 'received', 'title',
  'value', 'quality', 'limitation', 'handling'];

export function toRecord(values) {
  return Object.fromEntries(fields.map((field, index) => [field, values[index]]));
}

export function validDateTime(value) {
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value)) return false;
  const date = new Date(value.replace(' ', 'T') + ':00Z');
  return Number.isFinite(+date) && date.toISOString().slice(0, 16).replace('T', ' ') === value;
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false, closed = false;
  function finishField() {
    row.push(field);
    field = '';
    closed = false;
  }
  function finishRow() {
    finishField();
    if (row.some(Boolean) || row.length > 1) rows.push(row);
    row = [];
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
        closed = true;
      } else {
        field += char;
      }
    } else if (char === ',') {
      finishField();
    } else if (char === '\r' || char === '\n') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      finishRow();
    } else if (closed) {
      throw new Error('Unexpected text after a closing quote.');
    } else if (char === '"') {
      if (field) throw new Error('Unexpected quote inside an unquoted field.');
      quoted = true;
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error('A quoted field was left open.');
  if (field || closed || row.length) finishRow();
  return rows;
}

export function previewCsv(csv, state, memberIds, domains) {
  const errors = [], accepted = [];
  let duplicates = 0;
  const result = () => ({accepted, duplicates, errors});
  if (typeof csv !== 'string' || !csv.trim() || csv.length > 250_000) {
    errors.push({row: 1, reason: 'Choose a non-empty CSV smaller than 250 KB.'});
    return result();
  }
  let rows;
  try {
    rows = parseCsv(csv.replace(/^\uFEFF/, ''));
  } catch (error) {
    errors.push({row: 1, reason: error.message});
    return result();
  }
  const [header, ...data] = rows;
  if (!header || header.length !== columns.length ||
      columns.some((column, index) => header[index] !== column)) {
    errors.push({row: 1, reason: 'The CSV headers must match the standardized records export.'});
    return result();
  }
  if (!data.length || data.length > 500) {
    errors.push({row: 2, reason: 'Include between 1 and 500 records per import.'});
    return result();
  }

  const existing = new Map(state.records.map(record => [record.id, record]));
  const qualities = ['Verified', 'Conflict', 'Delayed', 'Incomplete', 'Missing', 'Provisional', 'Restricted', 'Stale'];
  for (const [index, row] of data.entries()) {
    const record = toRecord(row);
    let reason;
    if (row.length !== fields.length || row.slice(0, 9).some(value => !value.trim()) ||
        row.some(value => value.length > 2000)) {
      reason = 'Check the column count, required values, and field lengths.';
    } else if (!/^[A-Z][A-Z0-9-]{1,31}$/.test(record.id) || record.id.startsWith('SIM-')) {
      reason = 'Use a valid source record ID outside the reserved SIM- namespace.';
    } else if (!memberIds.has(record.member)) {
      reason = 'Unknown member ID.';
    } else if (!domains.has(record.domain) || !qualities.includes(record.quality)) {
      reason = 'Unrecognized dataset or quality flag.';
    } else if (!validDateTime(record.event) || !validDateTime(record.received) ||
               record.received < record.event) {
      reason = 'Use valid ET timestamps (YYYY-MM-DD HH:mm). Receipt must follow the event.';
    } else if (existing.has(record.id)) {
      if (fields.every(field => existing.get(record.id)[field] === record[field])) {
        duplicates++;
        continue;
      }
      reason = 'This ID already has different content. Keep the original and use a new ID for a separate assertion.';
    }
    if (reason) {
      errors.push({row: index + 2, id: record.id, reason});
    } else {
      existing.set(record.id, record);
      accepted.push(record);
    }
  }
  return result();
}
