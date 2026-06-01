// FETR (Falling Edge Termination and Reset) waveform. Renders a digital-ish
// trace with sharp falling edges, resets and — depending on the result —
// residue/echo/hysteresis after the edge.
export default function FetrWaveform({ result, accent }) {
  const mode = result?.fields?.edges ?? 'clean'

  const W = 320
  const H = 140
  const mid = H / 2
  const hi = 28
  const lo = H - 28

  // Build a square-ish trace with three falling edges.
  // Each segment: [x, level] where level is 'hi' or 'lo'.
  const pts = []
  const seg = W / 7
  let x = 0
  const levels = ['hi', 'hi', 'lo', 'hi', 'lo', 'lo', 'hi', 'hi']
  levels.forEach((lvl, i) => {
    const y = lvl === 'hi' ? hi : lo
    pts.push([x, y])
    x += seg
    pts.push([x, y])
  })
  const path =
    'M ' +
    pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(' L ') +
    // connect vertical transitions implicitly by line-joining points at same x
    ''

  // Residue/echo markers placed just after the falling edges.
  const fallingX = []
  for (let i = 1; i < levels.length; i++) {
    if (levels[i - 1] === 'hi' && levels[i] === 'lo') fallingX.push(i * seg)
  }

  const dirty = mode === 'dirty' || mode === 'modified'
  const echo = mode === 'unknown' || mode === 'modified'
  const hysteresis = mode === 'hysteresis'
  const stroke = mode === 'clean' ? accent : mode === 'unknown' ? '#9fb3c8' : '#ffd166'

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
          {echo && (
            <path
              d={`M ${fx} ${lo} q 10 -18 20 0`}
              className="fetr-echo"
            />
          )}
          {hysteresis && (
            <line x1={fx} y1={lo} x2={fx + 14} y2={lo} className="fetr-hyst" />
          )}
        </g>
      ))}

      <text x={W - 6} y={16} className="fetr-label">{mode.toUpperCase()}</text>
    </svg>
  )
}
