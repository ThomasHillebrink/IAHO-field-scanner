import { useScanProgress } from '../lib/useScanProgress.js'
import { SCAN_DURATION_MS } from '../lib/constants.js'

// The "oh shit" scanner. A concentric-ring fingerprint that warps while it
// samples. Whether it resolves to a clean lattice or keeps failing is decided
// by result.fields.resolve, so the outcome is deterministic per scan.
const CX = 160
const CY = 104
const RINGS = [20, 36, 52, 68, 84]
const SEG = 64

const CLEAN = '#5fffb0'
const UNSTABLE = '#ff5f7a'

export default function CradleLattice({ result, accent, phase = 'result' }) {
  const p = useScanProgress(phase === 'scan', SCAN_DURATION_MS)
  const resolved = result?.fields?.resolve === true

  // Distortion amplitude: high & moving while sampling; at rest it collapses to
  // near-zero when resolved, or stays warped (and CSS-flickers) when it doesn't.
  let amp
  if (phase === 'idle') amp = 2.5
  else if (phase === 'scan') amp = 9
  else amp = resolved ? 0.6 : 5.5

  const t = phase === 'scan' ? p * Math.PI * 3 : 0

  const disp = (ang, ring) =>
    amp * (Math.sin(ang * 3 + ring * 1.3 + t * 2) + 0.5 * Math.sin(ang * 7 - t * 1.5 + ring))

  const ringPath = (rad, ring) => {
    let d = ''
    for (let s = 0; s <= SEG; s++) {
      const ang = (s / SEG) * Math.PI * 2
      const rr = rad + disp(ang, ring)
      const x = CX + rr * Math.cos(ang)
      const y = CY + rr * Math.sin(ang)
      d += `${s === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `
    }
    return d + 'Z'
  }

  const settledUnstable = phase === 'result' && !resolved
  const settledClean = phase === 'result' && resolved
  const stroke = settledClean ? CLEAN : phase === 'idle' ? accent : UNSTABLE

  // A slow vertical sample bar during the scan.
  const barY = 20 + p * 168

  const label =
    phase === 'idle'
      ? ''
      : phase === 'scan'
        ? 'RESOLVING…'
        : resolved
          ? 'LATTICE RESOLVED'
          : 'FAILED TO RESOLVE'

  return (
    <svg
      viewBox="0 0 320 208"
      className={`viz viz--cradle ${settledUnstable ? 'cradle--unstable' : ''}`}
      role="img"
      aria-label="cradle residue lattice"
    >
      {phase === 'scan' && (
        <line x1="20" y1={barY} x2="300" y2={barY} className="cradle-bar" style={{ stroke: UNSTABLE }} />
      )}

      {RINGS.map((rad, i) => (
        <path
          key={i}
          d={ringPath(rad, i)}
          className={`cradle-ring ${settledUnstable ? 'cradle-ring--broken' : ''}`}
          style={{ stroke, opacity: 0.35 + (i / RINGS.length) * 0.5 }}
        />
      ))}

      {/* fracture spokes when it fails to resolve */}
      {settledUnstable &&
        [0, 1, 2].map((k) => {
          const a = ((40 + k * 115) * Math.PI) / 180
          return (
            <line
              key={`f${k}`}
              x1={CX}
              y1={CY}
              x2={CX + 90 * Math.cos(a)}
              y2={CY + 90 * Math.sin(a)}
              className="cradle-fracture"
            />
          )
        })}

      {/* core */}
      <circle
        cx={CX}
        cy={CY}
        r="5"
        className={`cradle-core ${phase === 'scan' ? 'cradle-core--live' : ''}`}
        style={{ fill: settledClean ? CLEAN : UNSTABLE }}
      />

      {label && (
        <text x={CX} y="198" textAnchor="middle" className="cradle-label" style={{ fill: stroke }}>
          {label}
        </text>
      )}
    </svg>
  )
}
