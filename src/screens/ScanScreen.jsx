import { useEffect, useRef, useState } from 'react'
import Visual from '../visuals/index.jsx'
import { SCAN_DURATION_MS } from '../lib/constants.js'

const PHASES = ['CALIBRATING', 'SAMPLING', 'NORMALIZING', 'LEGALIZING']

// Pseudo log lines per phase — pure flavour, never affect the result.
const LOG_LINES = [
  'probe handshake … ok',
  'seating reference cell',
  'acquiring sample window',
  'baseline drift compensated',
  'cross-checking TALON registry',
  'applying regulatory weighting',
  'normalizing against boundary',
  'sealing provisional reading',
  'composing auditor note',
]

export default function ScanScreen({ mode, targetName, result, onComplete, onBack }) {
  const [started, setStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const timers = useRef([])

  // ~6.5s scan. Progress ticks, logs stream, then onComplete fires.
  function start() {
    if (started) return
    setStarted(true)
    const DURATION = SCAN_DURATION_MS
    const step = 60
    let elapsed = 0

    const progTimer = setInterval(() => {
      elapsed += step
      setProgress(Math.min(100, (elapsed / DURATION) * 100))
      if (elapsed >= DURATION) {
        clearInterval(progTimer)
        onComplete()
      }
    }, step)
    timers.current.push(progTimer)

    let li = 0
    const logTimer = setInterval(() => {
      setLogs((prev) => [...prev, LOG_LINES[li % LOG_LINES.length]])
      li += 1
    }, 600)
    timers.current.push(logTimer)
  }

  useEffect(() => {
    return () => timers.current.forEach(clearInterval)
  }, [])

  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor((progress / 100) * PHASES.length))]

  return (
    <div className="screen screen--scan" style={{ '--accent': mode.accent }}>
      <header className="bar">
        <button className="btn btn--ghost" onClick={onBack} disabled={started}>‹ BACK</button>
        <span className="bar__title">{mode.short}</span>
      </header>

      <div className="scan-target">
        <span className="scan-target__label">TARGET</span>
        <span className="scan-target__name">{targetName}</span>
      </div>

      <div className="scan-viz">
        <div className={`scan-glow ${started ? 'scan-glow--on' : ''}`} />
        <Visual mode={mode} result={result} phase={started ? 'scan' : 'idle'} />
      </div>

      {!started ? (
        <button className="scan-btn" style={{ '--accent': mode.accent }} onClick={start}>
          START SCAN
        </button>
      ) : (
        <div className="scan-progress">
          <div className="scan-phase">{phase}…</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="scan-pct">{Math.floor(progress)}%</div>
          <div className="scan-logs">
            {logs.slice(-6).map((l, i) => (
              <div key={i} className="scan-log-line">&gt; {l}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
