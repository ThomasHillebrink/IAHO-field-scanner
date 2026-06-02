import { SCRIPTED, BORING_DEFAULT, DECLARED_VI_DEFAULT, POOLS } from '../config/results.js'
import { TARGETS_BY_ID } from '../config/targets.js'

// Stable string hash (FNV-1a). Same input → same number, always.
// This is what makes "scan mode + target = planned result" deterministic
// for combinations that have no hand-scripted beat.
function stableHash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// Resolve the planned result for a given mode + target.
//   1. exact scripted beat
//   2. boring default for the manual / free-text target
//   3. deterministic pick from the mode's pool
//   4. boring default as a last resort (mode without a pool)
export function resolveResult(modeId, targetId, overrideKey) {
  // Auditor Override (SL intervention) is handled in the UI layer by passing
  // a synthetic result; we keep resolution pure here.
  if (overrideKey) return overrideKey

  const key = `${modeId}|${targetId}`
  if (SCRIPTED[key]) return SCRIPTED[key]

  const target = TARGETS_BY_ID[targetId]
  if (target?.vi) return DECLARED_VI_DEFAULT
  if (target?.manual) return BORING_DEFAULT

  const pool = POOLS[modeId]
  if (pool && pool.length > 0) {
    return pool[stableHash(key) % pool.length]
  }

  return BORING_DEFAULT
}
