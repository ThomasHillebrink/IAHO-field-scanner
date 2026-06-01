import { useScanProgress } from '../lib/useScanProgress.js'
import { SCAN_DURATION_MS } from '../lib/constants.js'

// Wendell's toy. A bureaucratic checklist that ticks/crosses its items one by
// one as it "samples", scrambles an evidence hash that locks at the end, and
// stamps a seal. Comedy, not dangerous plot facts.
const ITEMS = ['FORM REVISION MATCH', 'EVIDENCE SEAL INTACT', 'CHAIN OF CUSTODY', 'OFFICER SIGNATURE']
const HEX = '0123456789ABCDEF'

function fnv(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// Deterministic 8-char hash for the locked evidence value.
function finalHash(seed) {
  let h = fnv(seed)
  let out = ''
  for (let i = 0; i < 8; i++) {
    out += HEX[h & 15]
    h = (h >>> 4) | (Math.imul(h, 2654435761) & 0xf0000000)
    if (i === 3) out += '-'
  }
  return out
}

export default function ProcedureChecklist({ result, accent, phase = 'result' }) {
  const p = useScanProgress(phase === 'scan', SCAN_DURATION_MS)
  const seed = result?.status ?? 'PROC'
  const checklist = result?.fields?.checklist ?? ITEMS.map(() => true)
  const complete = (result?.status ?? '').includes('COMPLETE') || checklist.every(Boolean)

  // Each item locks at a staggered point through the scan.
  const stateFor = (i) => {
    const ok = checklist[i] !== false
    if (phase === 'idle') return 'pending'
    if (phase === 'result') return ok ? 'pass' : 'fail'
    const lockAt = (i + 1) / (ITEMS.length + 1)
    if (p < lockAt - 0.12) return 'pending'
    if (p < lockAt) return 'checking'
    return ok ? 'pass' : 'fail'
  }
  const glyph = { pending: '▢', checking: '▦', pass: '✓', fail: '✗' }

  // Evidence hash: scrambles during the scan, locks to a deterministic value.
  let hash
  if (phase === 'idle') hash = '····-····'
  else if (phase === 'result') hash = finalHash(seed)
  else {
    const tick = Math.floor(p * 48)
    hash = ''
    for (let i = 0; i < 8; i++) {
      hash += HEX[(tick + i * 7) % 16]
      if (i === 3) hash += '-'
    }
  }

  const seal =
    phase === 'idle' ? null : phase === 'scan' ? { kind: 'wait', text: 'AWAITING SEAL' } : complete ? { kind: 'ok', text: 'SEALED' } : { kind: 'bad', text: 'WITHHELD' }

  return (
    <div className="proc" style={{ '--accent': accent }}>
      <div className="proc__hash">
        <span className="proc__hash-label">EV-HASH</span>
        <span className="proc__hash-val">IAHO-{hash}</span>
      </div>

      <ul className="proc__list">
        {ITEMS.map((label, i) => {
          const st = stateFor(i)
          return (
            <li key={i} className={`proc__item proc__item--${st}`}>
              <span className="proc__box">{glyph[st]}</span>
              <span className="proc__label">{label}</span>
            </li>
          )
        })}
      </ul>

      {seal && <div className={`proc__seal proc__seal--${seal.kind}`}>{seal.text}</div>}
    </div>
  )
}
