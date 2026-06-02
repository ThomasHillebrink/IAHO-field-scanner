import { OVERRIDE_BANDS } from '../config/overrides.js'

// SL-only modal. Arms a forced result band for the next scan, and can
// lock/unlock the registry of persona assets between runs.
export default function OverridePanel({ registryUnlocked, onToggleRegistry, onArm, onClear, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <span className="modal__title">AUDITOR OVERRIDE</span>
          <span className="modal__warn">RESTRICTED · SL USE ONLY</span>
        </div>
        <p className="modal__note">
          Forces the next scan result. Single-use. Default behaviour is deterministic by target.
        </p>
        <div className="override-grid">
          {OVERRIDE_BANDS.map((band) => (
            <button
              key={band.id}
              className="override-band"
              style={{ '--accent': band.accent }}
              onClick={() => onArm(band)}
            >
              <span className="override-band__dot" />
              {band.label}
            </button>
          ))}
        </div>
        <div className="modal__registry">
          <span className="modal__registry-label">
            REGISTRY: {registryUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
          <button className="btn btn--ghost" onClick={() => onToggleRegistry(!registryUnlocked)}>
            {registryUnlocked ? 'RE-LOCK REGISTRY' : 'FORCE UNLOCK'}
          </button>
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClear}>
            CLEAR ARMED OVERRIDE
          </button>
          <button className="btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
