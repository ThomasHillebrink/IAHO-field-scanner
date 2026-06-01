import { useScanProgress } from '../lib/useScanProgress.js'
import { SCAN_DURATION_MS } from '../lib/constants.js'

const N = 10
const BASE_H = 86 // px, max bar height

// Deterministic final heights seeded from the result so the same scan always
// settles to the same silhouette (used by Memory Retention and the other
// placeholder modes until their bespoke visuals are built).
function finalHeights(seed) {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  const out = []
  for (let i = 0; i < N; i++) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0
    out.push(0.22 + (h / 0xffffffff) * 0.78)
  }
  return out
}

// During the scan each bar oscillates with a large, decaying amplitude and its
// own frequency/phase, so the bars rise and fall dramatically before settling
// onto their final values.
function animateBar(finalH, p, i) {
  const env = Math.exp(-2.9 * p)
  const amp = 0.5 * env
  const osc = amp * Math.sin(p * (11 + i * 1.7) + i * 0.9)
  return Math.max(0.04, Math.min(1, finalH + osc))
}

export default function GenericVisual({ accent, label, result, phase = 'result' }) {
  const seed = result?.status ?? label ?? 'IAHO'
  const finals = finalHeights(seed)
  const p = useScanProgress(phase === 'scan', SCAN_DURATION_MS)

  const heights = finals.map((f, i) =>
    phase === 'idle' ? 0.06 : phase === 'scan' ? animateBar(f, p, i) : f,
  )

  return (
    <svg viewBox="0 0 320 140" className="viz viz--generic" role="img" aria-label={label}>
      <line x1="0" y1="110" x2="320" y2="110" className="fetr-grid" />
      {heights.map((b, i) => (
        <rect
          key={i}
          x={12 + i * 30}
          y={110 - b * BASE_H}
          width="16"
          height={b * BASE_H}
          rx="2"
          style={{ fill: accent, opacity: 0.25 + b * 0.6 }}
          className="generic-bar"
        />
      ))}
      <text x="312" y="18" className="fetr-label">{label}</text>
    </svg>
  )
}
