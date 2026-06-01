import { useState } from 'react'
import { loadLog, clearLog } from '../lib/audit.js'

export default function AuditLogScreen({ onBack }) {
  const [log, setLog] = useState(() => loadLog())

  function handleClear() {
    clearLog()
    setLog([])
  }

  return (
    <div className="screen screen--audit">
      <header className="bar">
        <button className="btn btn--ghost" onClick={onBack}>‹ HOME</button>
        <span className="bar__title">AUDIT LOG · {log.length} ENTRIES</span>
      </header>

      {log.length === 0 ? (
        <p className="audit-empty">No scans recorded. Saved scans appear here with evidence IDs.</p>
      ) : (
        <div className="audit-list">
          {log.map((e) => (
            <div key={e.seq} className="audit-entry">
              <div className="audit-entry__top">
                <span className="audit-entry__id">{e.evidenceId}</span>
                <span className="audit-entry__tag">{e.modeTag}</span>
              </div>
              <div className="audit-entry__status">{e.status}</div>
              <div className="audit-entry__meta">
                {e.modeShort} · {e.targetName}
                {e.reading ? ` · ${e.reading}` : ''}
              </div>
              <div className="audit-entry__action">{e.action}</div>
            </div>
          ))}
        </div>
      )}

      {log.length > 0 && (
        <footer className="audit-foot">
          <button className="btn btn--ghost" onClick={handleClear}>CLEAR LOG</button>
        </footer>
      )}
    </div>
  )
}
