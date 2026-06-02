// The six official-looking IAHO scanner applications.
// `visual` names the SVG component used on the scan/result screen.
// `accent` is the per-mode accent colour (CSS).
// `families` are the possible result labels (used as the deterministic pool
// for any combination that has no hand-scripted narrative beat).
// `targetKinds` lists which target kinds the scanner can be pointed at, so the
// target screen hides illogical options (e.g. no CQ on a Gaianet route). Kinds:
//   'system' · 'object' · 'asset' (registered VIs) · 'vi-manual' (Declared VI
//   manual entry) · 'manual' (generic Manual Target catch-all).

export const SCAN_MODES = [
  {
    id: 'cq-boundary',
    name: 'CQ Boundary Scan',
    short: 'CQ-BND',
    blurb: 'VI legality assessment against the regulated cognitive-quotient boundary.',
    accent: '#5fd0ff',
    visual: 'CqGauge',
    targetKinds: ['asset', 'vi-manual', 'manual'],
    families: [
      'COMPLIANT BASELINE',
      'COMPLIANT / MONITOR UNDER STRESS',
      'BORDERLINE / TECHNICAL INTERPRETATION REQUIRED',
      'THRESHOLD EXCEEDED / REPEATABILITY REQUIRED',
      'READING UNSTABLE',
      'CLASSIFICATION REFUSED',
    ],
  },
  {
    id: 'memory-retention',
    name: 'Memory Retention / Continuity Scan',
    short: 'MEM-CON',
    blurb: 'Distinguishes operational logging from continuity of self.',
    accent: '#c9a6ff',
    visual: 'MemoryTimeline',
    targetKinds: ['asset', 'vi-manual', 'manual'],
    families: [
      'STANDARD OPERATIONAL LOG CONTINUITY',
      'PERSISTENT PREFERENCE MARKERS',
      'REPEATED-HANDLER BONDING MARKERS',
      'IDENTITY-CONTINUITY MARKERS',
      'UNKNOWN MEMORY STRUCTURE',
      'AUDITOR NOTE: EMOTIONAL DISTANCE RECOMMENDED',
    ],
  },
  {
    id: 'fetr-patch',
    name: 'FETR Patch Integrity',
    short: 'FETR',
    blurb: 'Falling Edge Termination and Reset patch verification.',
    accent: '#ffd166',
    visual: 'FetrWaveform',
    targetKinds: ['system', 'asset', 'manual'],
    families: [
      'PATCH PRESENT',
      'PATCH PRESENT / LOCAL MODIFICATIONS',
      'PATCH PRESENT BUT DIRTY',
      'FETR BOUNDARY ECHO DETECTED',
      'RESET HYSTERESIS DETECTED',
      'MONITORING SHARD MISMATCH',
      'PATCH LINEAGE CANNOT BE VERIFIED',
    ],
  },
  {
    id: 'architecture-sweep',
    name: 'Architecture Surface Sweep',
    short: 'ARCH',
    blurb: 'Maps what talks to what across the node surface.',
    accent: '#5fffb0',
    visual: 'ArchitectureMap',
    targetKinds: ['system', 'manual'],
    families: [
      'EXPECTED TALON ARCHITECTURE',
      'LOCAL ADAPTATION DETECTED',
      'UNSUPPORTED BRIDGE DETECTED',
      'EXTERNAL ROUTE DETECTED',
      'NON-TALON PROCESS DETECTED',
      'LOCAL EXTERNAL-ADJACENT ENDPOINT',
      'GAIANET EXPOSURE MARKER',
      'TOPOLOGY SUMMARY REFUSED',
    ],
  },
  {
    id: 'cradle-residue',
    name: 'Cradle Residue / External Cognition Sweep',
    short: 'CRADLE',
    blurb: 'Detects external cognition and cradle reset residue. Use sparingly.',
    accent: '#ff5f7a',
    visual: 'CradleLattice',
    targetKinds: ['system', 'asset', 'vi-manual', 'manual'],
    families: [
      'NO CRADLE INDICATORS',
      'RESET-BOUNDARY RESIDUE',
      'MEMORY-CONTINUITY SUPPORT',
      'EXTERNAL COGNITION MARKER',
      'NON-TALON SIGNATURE',
      'LOCAL EXTERNAL ROUTE CORRELATION',
      'GAIANET ROUTE CORRELATION',
      'CLASSIFICATION UNAVAILABLE',
      'IAHO PROTOCOL GAP DETECTED',
    ],
  },
  {
    id: 'procedure-seal',
    name: 'Procedure Completeness / Evidence Seal Integrity',
    short: 'PROC',
    blurb: 'Bureaucratic completeness, chain-of-custody and evidence seal checks.',
    accent: '#9fb3c8',
    visual: 'ProcedureChecklist',
    targetKinds: ['object', 'asset', 'manual'],
    families: [
      'COMPLETE',
      'INCOMPLETE',
      'FORM MISMATCH',
      'SIGNATURE GAP',
      'CHAIN-OF-CUSTODY BREAK',
      'CONFLICT DECLARATION REQUIRED',
      'WITNESS REQUIRED',
      'UNAUTHORIZED TOUCHING DETECTED',
      'PROCEDURAL VIBE DEGRADED',
    ],
  },
]

export const SCAN_MODES_BY_ID = Object.fromEntries(
  SCAN_MODES.map((m) => [m.id, m]),
)
