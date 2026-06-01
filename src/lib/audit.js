// Evidence-ID generation + the localStorage-backed audit log.
// Evidence IDs are the thing players copy onto paper forms (e.g. E-003,
// IAHO-EV-7C4A-19, CQ-BND-447A), so they need to look official and be unique.

const STORAGE_KEY = 'iaho-audit-log-v1'

function hex(len) {
  let s = ''
  for (let i = 0; i < len; i++) {
    s += Math.floor(Math.random() * 16).toString(16)
  }
  return s.toUpperCase()
}

// Two IDs per scan: a global evidence ID and a mode-tagged short ID.
export function generateEvidenceIds(modeShort, seq) {
  const n = String(seq).padStart(2, '0')
  return {
    evidenceId: `IAHO-EV-${hex(4)}-${n}`,
    modeTag: `${modeShort}-${hex(3)}`,
  }
}

export function loadLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntry(entry) {
  const log = loadLog()
  const seq = log.length + 1
  const ids = generateEvidenceIds(entry.modeShort, seq)
  const record = {
    seq,
    ...ids,
    at: new Date().toISOString(),
    ...entry,
  }
  const next = [record, ...log]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — keep the prop running anyway */
  }
  return record
}

export function clearLog() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
