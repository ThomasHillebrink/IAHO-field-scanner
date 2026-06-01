import { useScanProgress } from '../lib/useScanProgress.js'
import { SCAN_DURATION_MS } from '../lib/constants.js'

// Returns the [x, y] at fractional distance `t` (0..1) along a polyline,
// so a signal dot can ride the trace including up/down the falling edges.
function pointAt(points, t) {
  const lens = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
    lens.push(l)
    total += l
  }
  let target = t * total
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i] || i === lens.length - 1) {
      const f = lens[i] === 0 ? 0 : target / lens[i]
      const a = points[i]
      const b = points[i + 1]
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
    }
    target -= lens[i]
  }
  return points[points.length - 1]
}

const PASSES = 3.5 // signal traverses the route this many times over a scan

// FETR (Falling Edge Termination and Reset) waveform. Renders a digital-ish
// trace with sharp falling edges, resets and — depending on the result —
// residue/echo/hysteresis after the edge. During a scan a signal dot follows
// the route left→right.
export default function FetrWaveform({ result, accent, phase = 'result' }) {
  const mode = result?.fields?.edges ?? 'clean'
  const p = useScanProgress(phase === 'scan', SCAN_DURATION_MS)

  const W = 320
  const H = 140
  const mid = H / 2
  const hi = 28
  const lo = H - 28

  // Build a square-ish trace with falling edges. seg = W / levels so it fits.
  const levels = ['hi', 'hi', 'lo', 'hi', 'lo', 'lo', 'hi', 'hi']
  const seg = W / levels.length
  const pts = []
  let x = 0
  levels.forEach((lvl) => {
    const y = lvl === 'hi' ? hi : lo
    pts.push([x, y])
    x += seg
    pts.push([x, y])
  })
  const path = 'M ' + pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(' L ')

  // Falling edges (hi → lo transitions) at the boundary between levels.
  const fallingX = []
  for (let i = 1; i < levels.length; i++) {
    if (levels[i - 1] === 'hi' && levels[i] === 'lo') fallingX.push(i * seg)
  }

  const dirty = mode === 'dirty' || mode === 'modified'
  const echo = mode === 'unknown' || mode === 'modified'
  const hysteresis = mode === 'hysteresis'
  const stroke = mode === 'clean' ? accent : mode === 'unknown' ? '#9fb3c8' : '#ffd166'

  // Signal dot position (scan only). Loops across the route a few times.
  const t = phase === 'scan' ? (p * PASSES) % 1 : null
  const head = t != null ? pointAt(pts, t) : null
  const trail = t != null ? [0.05, 0.1, 0.16, 0.23] : []

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="viz viz--fetr" role="img" aria-label="FETR waveform">
      {/* baseline grid */}
      <line x1="0" y1={mid} x2={W} y2={mid} className="fetr-grid" />
      <line x1="0" y1={hi} x2={W} y2={hi} className="fetr-grid fetr-grid--faint" />
      <line x1="0" y1={lo} x2={W} y2={lo} className="fetr-grid fetr-grid--faint" />

      <path d={path} className="fetr-trace" style={{ stroke }} />

      {fallingX.map((fx, i) => (
        <g key={i}>
          <line x1={fx} y1={hi} x2={fx} y2={lo} className="fetr-edge" style={{ stroke }} />
          {dirty && <circle cx={fx + 6} cy={lo} r="3" className="fetr-residue" />}
          {echo && <path d={`M ${fx} ${lo} q 10 -18 20 0`} className="fetr-echo" />}
          {hysteresis && <line x1={fx} y1={lo} x2={fx + 14} y2={lo} className="fetr-hyst" />}
        </g>
      ))}

      {/* signal following the route */}
      {head && (
        <g className="fetr-signal" style={{ color: stroke }}>
          {trail.map((off, i) => {
            const tt = t - off
            if (tt < 0) return null // don't wrap the trail across the loop seam
            const [tx, ty] = pointAt(pts, tt)
            return (
              <circle key={i} cx={tx} cy={ty} r={3 - i * 0.5} className="fetr-trail"
                style={{ opacity: 0.4 - i * 0.08 }} />
            )
          })}
          <circle cx={head[0]} cy={head[1]} r="6.5" className="fetr-dot-halo" style={{ fill: stroke }} />
          <circle cx={head[0]} cy={head[1]} r="3" className="fetr-dot" />
        </g>
      )}

      <text x={W - 6} y={16} className="fetr-label">{mode.toUpperCase()}</text>
    </svg>
  )
}
