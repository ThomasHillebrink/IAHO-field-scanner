import { useEffect, useState } from 'react'

// Drives a smooth 0→1 progress value over `durationMs` using requestAnimationFrame
// (60fps) while `active` is true. Returns 1 when inactive so visuals render their
// settled state. Used by the animated scan visuals (gauge needle, memory bars).
export function useScanProgress(active, durationMs) {
  const [p, setP] = useState(active ? 0 : 1)

  useEffect(() => {
    if (!active) {
      setP(1)
      return
    }
    let raf
    let start
    const tick = (t) => {
      if (start === undefined) start = t
      const np = Math.min(1, (t - start) / durationMs)
      setP(np)
      if (np < 1) raf = requestAnimationFrame(tick)
    }
    setP(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, durationMs])

  return p
}
