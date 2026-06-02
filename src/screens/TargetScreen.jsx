import { useState } from 'react'
import { TARGETS, targetLabel } from '../config/targets.js'

const systems = TARGETS.filter((t) => t.kind === 'system')
const objects = TARGETS.filter((t) => t.kind === 'object')
const manuals = TARGETS.filter((t) => t.kind === 'manual')
const assets = TARGETS.filter((t) => t.kind === 'asset')

export default function TargetScreen({
  mode,
  onBack,
  onPickTarget,
  registryUnlocked,
  justUnlocked,
  onSeenUnlock,
}) {
  // One free-text value per manual target (Declared VI + Manual Target).
  const [names, setNames] = useState({})
  const accent = { '--accent': mode.accent }

  return (
    <div className="screen screen--target">
      <header className="bar" style={accent}>
        <button className="btn btn--ghost" onClick={onBack}>‹ HOME</button>
        <span className="bar__title">{mode.short} · SELECT TARGET</span>
      </header>

      {justUnlocked && (
        <div className="registry-flash">
          <div className="registry-flash__main">REGISTRY UPDATED</div>
          <div className="registry-flash__line">6 PERSONA-BEARING ASSETS FOUND</div>
          <div className="registry-flash__warn">1 CUSTODIAL GOVERNANCE WARNING</div>
          <button className="registry-flash__x" onClick={onSeenUnlock} aria-label="dismiss">×</button>
        </div>
      )}

      <div className="target-scroll">
        <Group label="Systems & Routes">
          <div className="target-grid">
            {systems.map((t) => (
              <TargetBtn key={t.id} target={t} accent={accent} onClick={() => onPickTarget(t.id)} />
            ))}
          </div>
        </Group>

        <Group label="Objects">
          <div className="target-grid">
            {objects.map((t) => (
              <TargetBtn key={t.id} target={t} accent={accent} onClick={() => onPickTarget(t.id)} />
            ))}
          </div>
        </Group>

        <Group label="Manual Entry">
          {manuals.map((t) => (
            <div key={t.id} className="manual-block">
              <span className="manual-block__label">
                {t.name}
                {t.vi && !registryUnlocked && <em className="manual-block__hint"> · reduced confidence</em>}
              </span>
              <div className="manual-row">
                <input
                  className="manual-input"
                  type="text"
                  placeholder={t.vi ? 'Declared VI name…' : 'Free-text target…'}
                  value={names[t.id] ?? ''}
                  onChange={(e) => setNames((n) => ({ ...n, [t.id]: e.target.value }))}
                />
                <button className="btn" style={accent} onClick={() => onPickTarget(t.id, names[t.id])}>
                  SCAN
                </button>
              </div>
            </div>
          ))}
        </Group>

        <Group label="Registered TALON Assets">
          {registryUnlocked ? (
            <>
              <p className="registry-note">
                REGISTRY RETRIEVED · 5 COMMAND/SUPPORT · 1 CUSTODIAL · RECONCILIATION REQUIRED
              </p>
              <div className="target-grid">
                {assets.map((t) => (
                  <TargetBtn key={t.id} target={t} accent={accent} onClick={() => onPickTarget(t.id)} />
                ))}
              </div>
            </>
          ) : (
            <div className="registry-locked">
              <span className="registry-locked__lock">⊘ LOCKED</span>
              Registered profiles available after topology sweep. Run an{' '}
              <strong>Architecture Surface Sweep</strong> of the <strong>TALON Bastion Node</strong>.
            </div>
          )}
        </Group>
      </div>
    </div>
  )
}

function Group({ label, children }) {
  return (
    <section className="target-group">
      <h2 className="target-group__label">{label}</h2>
      {children}
    </section>
  )
}

function TargetBtn({ target, accent, onClick }) {
  return (
    <button className="target-btn" style={accent} onClick={onClick}>
      {target.code && <span className="target-btn__code">{target.code}</span>}
      <span className="target-btn__name">{target.code ? target.name : targetLabel(target)}</span>
    </button>
  )
}
