import { useRef } from 'react'

// CSS/text logo. Five taps within 2.5s opens the hidden Auditor Override.
export default function IahoLogo({ onSecret, small }) {
  const taps = useRef([])

  function handleTap() {
    const now = Date.now()
    taps.current = taps.current.filter((t) => now - t < 2500)
    taps.current.push(now)
    if (taps.current.length >= 5) {
      taps.current = []
      onSecret?.()
    }
  }

  return (
    <button
      type="button"
      className={`iaho-logo ${small ? 'iaho-logo--small' : ''}`}
      onClick={handleTap}
      aria-label="IAHO"
    >
      <span className="iaho-logo__mark">[ IAHO ]</span>
      {!small && <span className="iaho-logo__sub">INTEGRATED AUDIT &amp; HAZARD OVERSIGHT</span>}
    </button>
  )
}
