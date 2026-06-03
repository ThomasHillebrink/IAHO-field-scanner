import { SCAN_MODES } from '../config/scanModes.js'
import IahoLogo from '../components/IahoLogo.jsx'

export default function HomeScreen({ onPickMode, onOpenAudit, onSecretOverride, armedOverride }) {
  return (
    <div className="screen screen--home">
      <header className="home-head">
        <IahoLogo onSecret={onSecretOverride} />
        <h1 className="home-title">FIELD SCANNER</h1>
        <p className="home-sub">SELECT AUDIT APPLICATION</p>
        {armedOverride && (
          <p className="override-armed" style={{ '--accent': armedOverride.accent }}>
            ⚠ OVERRIDE ARMED · {armedOverride.label.toUpperCase()}
          </p>
        )}
      </header>

      <div className="mode-grid">
        {SCAN_MODES.map((m) => (
          <button
            key={m.id}
            className="mode-card"
            style={{ '--accent': m.accent }}
            onClick={() => onPickMode(m.id)}
          >
            <span className="mode-card__name">{m.name}</span>
            <span className="mode-card__short">{m.short}</span>
            <span className="mode-card__blurb">{m.blurb}</span>
          </button>
        ))}
      </div>

      <footer className="home-foot">
        <button className="btn btn--ghost" onClick={onOpenAudit}>
          AUDIT LOG
        </button>
        <span className="home-foot__build">IAHO-FS · BUILD 0.1 · FIELD UNIT</span>
      </footer>
    </div>
  )
}
