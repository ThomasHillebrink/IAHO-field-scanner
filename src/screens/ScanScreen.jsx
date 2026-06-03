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

export default function ScanScreen({ mode, targetName, result, cameraScan, onComplete, onBack }) {
  const [started, setStarted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState([])
  const [camStream, setCamStream] = useState(null)
  const [camError, setCamError] = useState(false)
  const timers = useRef([])
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  // The 5–8s scan: progress ticks, logs stream, then onComplete fires.
  function runTimers() {
    const DURATION = SCAN_DURATION_MS
    const step = 60
    let elapsed = 0

    const progTimer = setInterval(() => {
      elapsed += step
      setProgress(Math.min(100, (elapsed / DURATION) * 100))
      if (elapsed >= DURATION) {
        clearInterval(progTimer)
        stopCamera()
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

  function start() {
    if (started) return
    setStarted(true)

    // Camera scans wait for the permission to settle before counting down, so
    // the live feed is visible for the whole scan. Falls back gracefully.
    if (cameraScan && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then((s) => {
          streamRef.current = s
          setCamStream(s)
          runTimers()
        })
        .catch(() => {
          setCamError(true)
          runTimers()
        })
    } else {
      runTimers()
    }
  }

  // Attach the stream once both the element and stream exist.
  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream
      videoRef.current.play?.().catch(() => {})
    }
  }, [camStream])

  // Clean up timers and release the camera on unmount.
  useEffect(() => {
    return () => {
      timers.current.forEach(clearInterval)
      stopCamera()
    }
  }, [])

  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor((progress / 100) * PHASES.length))]
  const brackets = (
    <>
      <span className="cam-bracket cam-bracket--tl" />
      <span className="cam-bracket cam-bracket--tr" />
      <span className="cam-bracket cam-bracket--bl" />
      <span className="cam-bracket cam-bracket--br" />
    </>
  )

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

      {cameraScan && started ? (
        <div className="cam-wrap">
          <video ref={videoRef} autoPlay playsInline muted className="cam-feed" />
          <div className="cam-overlay" style={{ color: mode.accent }}>
            {brackets}
            <span className="cam-line cam-line--h" />
            <span className="cam-line cam-line--v" />
            <span className="cam-sweep cam-sweep--h" />
            <span className="cam-sweep cam-sweep--v" />
          </div>
          {camError && <div className="cam-error">CAMERA UNAVAILABLE · FALLBACK SCAN</div>}
        </div>
      ) : cameraScan ? (
        <div className="cam-standby" style={{ color: mode.accent }}>
          {brackets}
          <span className="cam-standby__text">CAMERA STANDBY</span>
        </div>
      ) : (
        <div className="scan-viz">
          <div className={`scan-glow ${started ? 'scan-glow--on' : ''}`} />
          <Visual mode={mode} result={result} phase={started ? 'scan' : 'idle'} />
        </div>
      )}

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
