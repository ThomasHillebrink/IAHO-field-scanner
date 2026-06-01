import { useScanProgress } from '../lib/useScanProgress.js'
import { SCAN_DURATION_MS } from '../lib/constants.js'

// Node map: TALON Bastion Node at the centre with edges radiating to the
// surrounding surface. The result decides which endpoint (if any) is flagged,
// so the same scan always draws the same topology.
const CX = 160
const CY = 108
const R = 82

const NODES = [
  { id: 'vi-host', label: 'VI HOST' },
  { id: 'attack-vector', label: 'ATTACK VECTOR' },
  { id: 'comms', label: 'COMMS' },
  { id: 'local-external-infra', label: 'LOCAL INFRA' },
  { id: 'gaianet-route', label: 'GAIANET' },
  { id: 'unknown-endpoint', label: 'UNKNOWN' },
].map((n, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180
  return { ...n, x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), a }
})

const ID_TO_INDEX = Object.fromEntries(NODES.map((n, i) => [n.id, i]))

// Which endpoint is flagged, and how severely, derived from the result.
function flagFromResult(result) {
  const s = result?.status ?? ''
  const route = result?.fields?.route
  if (route?.length >= 2) {
    const idx = ID_TO_INDEX[route[route.length - 1]]
    if (idx != null) return { idx, sev: 'danger' }
  }
  if (/EXPECTED/.test(s)) return { idx: -1, sev: null }
  if (/GAIANET/.test(s)) return { idx: ID_TO_INDEX['gaianet-route'], sev: 'danger' }
  if (/NON-TALON/.test(s)) return { idx: ID_TO_INDEX['unknown-endpoint'], sev: 'danger' }
  if (/EXTERNAL|BRIDGE/.test(s)) return { idx: ID_TO_INDEX['local-external-infra'], sev: 'danger' }
  if (/ADAPTATION/.test(s)) return { idx: ID_TO_INDEX['comms'], sev: 'warn' }
  return { idx: -1, sev: null }
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))

export default function ArchitectureMap({ result, accent, phase = 'result' }) {
  const p = useScanProgress(phase === 'scan', SCAN_DURATION_MS)
  const { idx: flagged, sev } = flagFromResult(result)
  const flagColor = sev === 'danger' ? '#ff5f7a' : '#ffd166'
  const confidence = result?.fields?.confidence

  // Rotating radar sweep angle (two passes over the scan).
  const sweepA = ((-90 + p * 720) * Math.PI) / 180

  return (
    <svg viewBox="0 0 320 216" className="viz viz--arch" role="img" aria-label="architecture map">
      {/* edges */}
      {NODES.map((n, i) => {
        const draw =
          phase === 'result' ? 1 : phase === 'idle' ? 0 : clamp01((p - i * 0.05) / 0.45)
        const isFlag = i === flagged
        const stroke = isFlag ? flagColor : accent
        return (
          <line
            key={`e${i}`}
            x1={CX}
            y1={CY}
            x2={n.x}
            y2={n.y}
            className={`arch-edge ${isFlag && phase === 'result' ? 'arch-edge--flag' : ''}`}
            style={{
              stroke,
              strokeDasharray: R,
              strokeDashoffset: R * (1 - draw),
              opacity: draw <= 0 ? 0.12 : 1,
            }}
          />
        )
      })}

      {/* radar sweep, scan only */}
      {phase === 'scan' && (
        <line
          x1={CX}
          y1={CY}
          x2={CX + R * Math.cos(sweepA)}
          y2={CY + R * Math.sin(sweepA)}
          className="arch-sweep"
          style={{ stroke: accent }}
        />
      )}

      {/* satellite nodes + labels */}
      {NODES.map((n, i) => {
        const shown =
          phase === 'result' ? 1 : phase === 'idle' ? 0.3 : clamp01((p - i * 0.05) / 0.45)
        const isFlag = i === flagged
        const fill = isFlag ? flagColor : accent
        const anchor = n.x < CX - 6 ? 'end' : n.x > CX + 6 ? 'start' : 'middle'
        const lx = n.x + (anchor === 'end' ? -8 : anchor === 'start' ? 8 : 0)
        const ly = n.y < CY ? n.y - 8 : n.y + 14
        return (
          <g key={`n${i}`} style={{ opacity: shown }}>
            <circle
              cx={n.x}
              cy={n.y}
              r={isFlag ? 5.5 : 4}
              className={`arch-node ${isFlag && phase === 'result' ? 'arch-node--flag' : ''}`}
              style={{ fill }}
            />
            <text x={lx} y={ly} textAnchor={anchor} className="arch-label">
              {n.label}
            </text>
          </g>
        )
      })}

      {/* centre: Bastion Node */}
      <circle cx={CX} cy={CY} r="11" className="arch-center" style={{ stroke: accent }} />
      <circle cx={CX} cy={CY} r="3.5" style={{ fill: accent }} />
      <text x={CX} y={CY + 26} textAnchor="middle" className="arch-center-label" style={{ fill: accent }}>
        BASTION
      </text>

      {/* confidence readout */}
      {confidence != null && phase !== 'idle' && (
        <text x="312" y="206" textAnchor="end" className="arch-conf">
          {phase === 'scan' ? `${Math.round(confidence * p)}%` : `CONFIDENCE ${confidence}%`}
        </text>
      )}
    </svg>
  )
}
