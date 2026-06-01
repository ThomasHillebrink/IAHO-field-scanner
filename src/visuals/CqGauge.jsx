import { useScanProgress } from '../lib/useScanProgress.js'
import { SCAN_DURATION_MS } from '../lib/constants.js'

const MAX = 0.4
const THRESHOLD = 0.34

// Settle animation: a galvanometer-style wind-up sweep toward near-full-scale,
// then a damped oscillation that rings around the final value and narrows onto
// it — "winds up, then bounces around the final value while it narrows."
function animateCq(final, p) {
  const sweepEnd = 0.26
  const peak = MAX * 0.92
  if (p < sweepEnd) {
    const q = p / sweepEnd
    const ease = 1 - Math.pow(1 - q, 3) // easeOutCubic
    return peak * ease
  }
  const q = (p - sweepEnd) / (1 - sweepEnd) // 0→1
  const env = Math.exp(-3.4 * q) // decaying envelope
  return Math.max(0, final + (peak - final) * env * Math.cos(q * 17))
}

// Iconic CQ Boundary gauge: a 270° arc from .000 to .400 with the .340 legal
// threshold marked. The needle points at the (animated) CQ value.
export default function CqGauge({ result, accent, phase = 'result' }) {
  const finalCq = result?.fields?.cq ?? 0.0
  const p = useScanProgress(phase === 'scan', SCAN_DURATION_MS)

  const cq =
    phase === 'idle' ? 0 : phase === 'scan' ? animateCq(finalCq, p) : finalCq

  // Arc geometry: 270° sweep, from 135° (bottom-left) clockwise to 405°.
  const startA = 135
  const sweep = 270
  const cx = 110
  const cy = 110
  const r = 84

  const toXY = (frac, radius = r) => {
    const a = ((startA + sweep * frac) * Math.PI) / 180
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)]
  }

  const valueFrac = Math.max(0, Math.min(1, cq / MAX))
  const threshFrac = THRESHOLD / MAX

  const [nx, ny] = toXY(valueFrac, r - 14)
  const [tx1, ty1] = toXY(threshFrac, r - 24)
  const [tx2, ty2] = toXY(threshFrac, r + 8)

  // Background arc path.
  const [ax, ay] = toXY(0)
  const [bx, by] = toXY(1)
  const arc = `M ${ax} ${ay} A ${r} ${r} 0 1 1 ${bx} ${by}`

  // Filled portion up to value. largeArc depends on the actual swept *angle*
  // exceeding 180°, not on the fraction passing 0.5 — the arc spans `sweep`
  // (270°), so the flip is at 180/270 of the range, else the fill draws the
  // long way round and spills past the track.
  const [vx, vy] = toXY(valueFrac)
  const largeArc = sweep * valueFrac > 180 ? 1 : 0
  const fill = `M ${ax} ${ay} A ${r} ${r} 0 ${largeArc} 1 ${vx} ${vy}`

  // Colour reflects the *instantaneous* value, so the needle flashes red as it
  // overshoots past the .34 limit during the wind-up, then settles to its
  // final colour.
  const over = cq >= THRESHOLD
  const settledStroke = result?.fields?.unstable ? '#9fb3c8' : finalCq >= THRESHOLD ? '#ff5f7a' : accent
  const stroke = phase === 'idle' ? accent : over ? '#ff5f7a' : settledStroke

  return (
    <svg viewBox="0 0 220 200" className="viz viz--cq" role="img" aria-label="CQ gauge">
      <path d={arc} className="cq-track" />
      <path d={fill} className="cq-fill" style={{ stroke }} />

      {/* .340 threshold tick + label */}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} className="cq-thresh" />
      <text x={tx2} y={ty2 - 4} className="cq-thresh-label">.34</text>

      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} className="cq-needle" style={{ stroke }} />
      <circle cx={cx} cy={cy} r="5" className="cq-hub" style={{ fill: stroke }} />

      {/* readout — follows the needle during the scan */}
      <text x={cx} y={cy + 36} className="cq-readout" style={{ fill: stroke }}>
        {cq.toFixed(3).replace(/^0/, '')}
      </text>
      <text x={cx} y={cy + 52} className="cq-readout-sub">CQ INDEX</text>
    </svg>
  )
}
