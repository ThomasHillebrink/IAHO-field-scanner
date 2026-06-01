import { useState } from 'react'
import { TARGETS, TARGET_KINDS } from '../config/targets.js'

export default function TargetScreen({ mode, onBack, onPickTarget }) {
  const [manualName, setManualName] = useState('')

  return (
    <div className="screen screen--target">
      <header className="bar" style={{ '--accent': mode.accent }}>
        <button className="btn btn--ghost" onClick={onBack}>‹ HOME</button>
        <span className="bar__title">{mode.short} · SELECT TARGET</span>
      </header>

      <div className="target-scroll">
        {TARGET_KINDS.map((kind) => (
          <section key={kind.id} className="target-group">
            <h2 className="target-group__label">{kind.label}</h2>
            <div className="target-grid">
              {TARGETS.filter((t) => t.kind === kind.id && !t.manual).map((t) => (
                <button
                  key={t.id}
                  className="target-btn"
                  style={{ '--accent': mode.accent }}
                  onClick={() => onPickTarget(t.id)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </section>
        ))}

        <section className="target-group">
          <h2 className="target-group__label">Manual Entry</h2>
          <div className="manual-row">
            <input
              className="manual-input"
              type="text"
              placeholder="Free-text target…"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
            />
            <button
              className="btn"
              style={{ '--accent': mode.accent }}
              onClick={() => onPickTarget('manual', manualName)}
            >
              SCAN
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
