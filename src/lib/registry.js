// Tracks whether the TALON registry has been retrieved (via an Architecture
// Surface Sweep of the Bastion Node), which reveals the registered persona
// assets on the target screen. Persisted so it survives a reload mid-game; an
// SL can re-lock it from the Auditor Override panel between runs.
const KEY = 'iaho-registry-unlocked-v1'

export function loadRegistryUnlocked() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function setRegistryUnlocked(unlocked) {
  try {
    if (unlocked) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    /* storage unavailable — keep the prop running */
  }
}
