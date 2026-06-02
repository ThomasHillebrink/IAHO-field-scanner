import { useState } from 'react'
import { TARGETS, targetLabel } from '../config/targets.js'

const ALL_KINDS = ['system', 'object', 'asset', 'vi-manual', 'manual']
const byKind = (k) => TARGETS.filter((t) => t.kind === k)

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

  // Only the target kinds this scanner can logically be pointed at.
  const allowed = mode.targetKinds ?? ALL_KINDS
  const systems = allowed.includes('system') ? byKind('system') : []
  const objects = allowed.includes('object') ? byKind('object') : []
  const showAssets = allowed.includes('asset')
  const manualTargets = TARGETS.filter(
    (t) => (t.kind === 'vi-manual' || t.kind === 'manual') && allowed.includes(t.kind),
  )

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
        {systems.length > 0 && (
          <Group label="Systems & Routes">
            <div className="target-grid">
              {systems.map((t) => (
                <TargetBtn key={t.id} target={t} accent={accent} onClick={() => onPickTarget(t.id)} />
              ))}
            </div>
          </Group>
        )}

        {objects.length > 0 && (
          <Group label="Objects">
            <div className="target-grid">
              {objects.map((t) => (
                <TargetBtn key={t.id} target={t} accent={accent} onClick={() => onPickTarget(t.id)} />
              ))}
            </div>
          </Group>
        )}

        {showAssets && (
          <Group label="Registered TALON Assets">
            {registryUnlocked ? (
              <>
                <p className="registry-note">
                  REGISTRY RETRIEVED · 5 COMMAND/SUPPORT · 1 CUSTODIAL · RECONCILIATION REQUIRED
                </p>
                <div className="target-grid">
                  {byKind('asset').map((t) => (
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
        )}

        {manualTargets.length > 0 && (
          <Group label="Manual Entry">
            {manualTargets.map((t) => (
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
        )}
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
