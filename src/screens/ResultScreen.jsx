import { useState } from 'react'
import Visual from '../visuals/index.jsx'

export default function ResultScreen({ mode, targetName, result, onSave, onRepeat, onHome }) {
  const [saved, setSaved] = useState(null)

  function handleSave() {
    if (saved) return
    setSaved(onSave())
  }

  return (
    <div
      className={`screen screen--result ${result.glitch ? 'is-glitch' : ''}`}
      style={{ '--accent': mode.accent }}
    >
      <header className="bar">
        <span className="bar__title">{mode.short} · RESULT</span>
        {result._override && <span className="bar__flag">OVERRIDE</span>}
      </header>

      <div className="result-viz">
        <Visual mode={mode} result={result} />
      </div>

      <div className="result-card">
        <Row label="TARGET" value={targetName} />
        <Row label="STATUS" value={result.status} strong />
        {result.reading && <Row label="READING" value={result.reading} />}
        {saved && <Row label="EVIDENCE ID" value={`${saved.evidenceId}  ·  ${saved.modeTag}`} mono />}
        {result.note && <Row label="NOTE" value={result.note} />}
        <Row label="ACTION" value={result.action} action />
      </div>

      <div className="result-actions">
        <button className="btn btn--ghost" onClick={onRepeat}>REPEAT SCAN</button>
        <button className="btn" onClick={handleSave} disabled={!!saved}>
          {saved ? 'SAVED ✓' : 'SAVE TO AUDIT LOG'}
        </button>
        <button className="btn btn--ghost" onClick={onHome}>HOME</button>
      </div>
    </div>
  )
}

function Row({ label, value, strong, mono, action }) {
  return (
    <div className={`result-row ${action ? 'result-row--action' : ''}`}>
      <span className="result-row__label">{label}</span>
      <span className={`result-row__value ${strong ? 'is-strong' : ''} ${mono ? 'is-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}
