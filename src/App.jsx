import { useState } from 'react'
import { SCAN_MODES_BY_ID } from './config/scanModes.js'
import { TARGETS_BY_ID, targetLabel, REGISTRY_UNLOCK } from './config/targets.js'
import { resolveResult } from './lib/resolveResult.js'
import { saveEntry } from './lib/audit.js'
import { loadRegistryUnlocked, setRegistryUnlocked } from './lib/registry.js'
import HomeScreen from './screens/HomeScreen.jsx'
import TargetScreen from './screens/TargetScreen.jsx'
import ScanScreen from './screens/ScanScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import AuditLogScreen from './screens/AuditLogScreen.jsx'
import OverridePanel from './components/OverridePanel.jsx'

// Simple navigation state machine — no router needed for a single-device prop.
const SCREENS = { HOME: 'home', TARGET: 'target', SCAN: 'scan', RESULT: 'result', AUDIT: 'audit' }

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME)
  const [modeId, setModeId] = useState(null)
  const [targetId, setTargetId] = useState(null)
  const [manualName, setManualName] = useState('')
  const [result, setResult] = useState(null)

  // Auditor Override (SL intervention). When armed, the next scan forces this band.
  const [overridePanelOpen, setOverridePanelOpen] = useState(false)
  const [armedOverride, setArmedOverride] = useState(null)

  // Registry of persona assets — revealed once the Bastion topology sweep runs.
  const [registryUnlocked, setRegistryUnlockedState] = useState(loadRegistryUnlocked)
  const [justUnlocked, setJustUnlocked] = useState(false)

  const mode = modeId ? SCAN_MODES_BY_ID[modeId] : null
  const target = targetId ? TARGETS_BY_ID[targetId] : null
  const targetName = target?.manual ? manualName || target.name : targetLabel(target)

  function pickMode(id) {
    setModeId(id)
    setScreen(SCREENS.TARGET)
  }

  function pickTarget(id, name) {
    setTargetId(id)
    setManualName(name || '')
    // Resolve the planned result up front so the scan visual can animate toward
    // its real final value (needle settles, bars settle). Still deterministic.
    const planned = armedOverride
      ? { ...armedOverride.result, _override: armedOverride.id }
      : resolveResult(modeId, id)
    setResult(planned)
    setArmedOverride(null) // override is single-use
    setScreen(SCREENS.SCAN)
  }

  // Called when the scan animation completes — the result is already resolved.
  function completeScan() {
    // The Bastion topology sweep retrieves the registry and reveals the assets.
    if (modeId === REGISTRY_UNLOCK.mode && targetId === REGISTRY_UNLOCK.target && !registryUnlocked) {
      setRegistryUnlocked(true)
      setRegistryUnlockedState(true)
      setJustUnlocked(true)
    }
    setScreen(SCREENS.RESULT)
  }

  function toggleRegistry(unlocked) {
    setRegistryUnlocked(unlocked)
    setRegistryUnlockedState(unlocked)
    if (!unlocked) setJustUnlocked(false)
  }

  function saveResult() {
    return saveEntry({
      modeId,
      modeShort: mode.short,
      modeName: mode.name,
      targetId,
      targetName,
      status: result.status,
      reading: result.reading,
      action: result.action,
    })
  }

  function reset() {
    setScreen(SCREENS.HOME)
    setModeId(null)
    setTargetId(null)
    setManualName('')
    setResult(null)
  }

  return (
    <div className="app">
      <div className="scanlines" aria-hidden="true" />

      {screen === SCREENS.HOME && (
        <HomeScreen
          onPickMode={pickMode}
          onOpenAudit={() => setScreen(SCREENS.AUDIT)}
          onSecretOverride={() => setOverridePanelOpen(true)}
          armedOverride={armedOverride}
        />
      )}

      {screen === SCREENS.TARGET && (
        <TargetScreen
          mode={mode}
          onBack={reset}
          onPickTarget={pickTarget}
          registryUnlocked={registryUnlocked}
          justUnlocked={justUnlocked}
          onSeenUnlock={() => setJustUnlocked(false)}
        />
      )}

      {screen === SCREENS.SCAN && (
        <ScanScreen
          mode={mode}
          targetName={targetName}
          result={result}
          cameraScan={modeId === 'procedure-seal' && targetId === 'evidence-packet'}
          onComplete={completeScan}
          onBack={() => setScreen(SCREENS.TARGET)}
        />
      )}

      {screen === SCREENS.RESULT && (
        <ResultScreen
          mode={mode}
          targetName={targetName}
          result={result}
          onSave={saveResult}
          onRepeat={() => setScreen(SCREENS.SCAN)}
          onHome={reset}
        />
      )}

      {screen === SCREENS.AUDIT && <AuditLogScreen onBack={reset} />}

      {overridePanelOpen && (
        <OverridePanel
          registryUnlocked={registryUnlocked}
          onToggleRegistry={toggleRegistry}
          onArm={(band) => {
            setArmedOverride(band)
            setOverridePanelOpen(false)
          }}
          onClear={() => {
            setArmedOverride(null)
            setOverridePanelOpen(false)
          }}
          onClose={() => setOverridePanelOpen(false)}
        />
      )}
    </div>
  )
}
