// Deterministic result data.
//
//  resolveResult() (see ../lib/resolveResult.js) picks in this order:
//    1. SCRIPTED[`${modeId}|${targetId}`]  — exact agreed plot beats.
//    2. BORING_DEFAULT                      — for the Manual Target / unknown combos.
//    3. POOLS[modeId][stableHash % len]     — deterministic-but-varied safe results.
//
// Every result object follows the action-first contract:
//   { status, reading?, note, action, fields? }
// `fields` carries mode-specific data for the SVG visuals (e.g. { cq: 0.337 }).

// ── 1. Hand-scripted narrative beats (must be identical every time) ──────────
export const SCRIPTED = {
  // Maral scans Don Dragon for VI legality — the legal heart of the plot.
  // Strategic-handling asset: legally terrifying, but stable (only 2 resets).
  'cq-boundary|don-dragon': {
    status: 'BORDERLINE / TECHNICAL INTERPRETATION REQUIRED',
    reading: 'CQ .339999',
    note: 'Sits one ten-thousandth below the .340 limit. Stable (2 resets) — no jitter to hide behind.',
    action: 'Ask operator whether the VI has recently been under tactical stress.',
    fields: { cq: 0.339999 },
  },

  // ── CQ Boundary readings for the other registered assets ─────────────────
  'cq-boundary|shrimp': {
    status: 'COMPLIANT BASELINE',
    reading: 'CQ .314156',
    note: 'Communication-focused asset. Comms noise present. Reset count nominal (29).',
    action: 'Record as compliant. Note comms noise for the log.',
    fields: { cq: 0.314156 },
  },
  'cq-boundary|bee-nice': {
    status: 'BORDERLINE / TECHNICAL INTERPRETATION REQUIRED',
    reading: 'CQ .339887',
    note: 'Big-data analysis asset. Reset-heavy (181). Reading sits just under the .340 limit — extremely interesting.',
    action: 'Ask why the reset count is so high relative to baseline.',
    fields: { cq: 0.339887 },
  },
  'cq-boundary|io-otter': {
    status: 'COMPLIANT / MONITOR UNDER STRESS',
    reading: 'CQ .325892',
    note: 'General-assistant asset. Reset-heavy support system (129 resets).',
    action: 'Monitor under load; ask whether the reset frequency is operator-driven.',
    fields: { cq: 0.325892 },
  },
  'cq-boundary|pavel': {
    status: 'COMPLIANT BASELINE',
    reading: 'CQ .310267',
    note: 'Medical-aid asset. Low concern; high trust-sensitivity. Stable (4 resets).',
    action: 'Record as compliant. Handle trust-sensitive context with care.',
    fields: { cq: 0.310267 },
  },

  // Knifey: a custodial enrichment appliance people got attached to. NOT AI —
  // do not let it compete with Don Dragon / Bee-Nice for "is this secretly AI?".
  // Attachment/personability protocol uses a .200 CQ gate (below = fine).
  'cq-boundary|knifey': {
    status: 'COMPLIANT BASELINE',
    reading: 'CQ .161803',
    note: 'Attachment / personability protocol applies: CQ below .200 is within tolerance; above .200 warrants further investigation. Reading .161803 is within tolerance. No AI-threshold (.340) concern. Humour density is not part of the CQ calculation.',
    action: 'Do not classify as AI. No attachment-protocol action required. Proceed to asset governance.',
    fields: { cq: 0.161803 },
  },
  'memory-retention|knifey': {
    status: 'COMPLIANT, BUT OVER-INSTRUMENTED',
    reading: 'Custodial enrichment appliance',
    detail: [
      'STANDARD OPERATIONAL LOGS: PRESENT',
      'DEBUG LOGGING: ACTIVE',
      'PREFERENCE MARKERS: LOW',
      'IDENTITY-CONTINUITY MARKERS: ABSENT',
      'ENGRAM PRESERVATION REQUEST PROTOCOL: DETECTED',
    ],
    note: 'No identity-continuity, yet an iteration-preservation clause is present. Over-instrumented for a cleaning unit.',
    action: 'Ask why a custodial enrichment appliance has an iteration-preservation clause.',
  },
  'procedure-seal|knifey': {
    status: 'FORM MISMATCH',
    reading: 'ELEANOR / KNIFEY',
    detail: [
      'Owner: unresolved',
      'Maintenance authority: split',
      'Software authority: informal',
      'Physical modification authority: undocumented',
      'Hazard mitigation: partially corrected',
    ],
    note: 'Governance for this custodial morale asset is split and undocumented.',
    action: 'Assign responsible handler or record refusal.',
    fields: { checklist: [false, true, false, false] },
  },

  // Malan(a) scans the TALON Bastion Node for FETR patch integrity.
  'fetr-patch|talon-bastion-node': {
    status: 'PATCH PRESENT / LOCAL MODIFICATIONS',
    reading: 'FETR lineage partial',
    note: 'Reset boundary intact but local modifications detected after the falling edge. Not a stock TALON patch.',
    action: 'Ask who applied the local modifications and under what authorization.',
    fields: { edges: 'modified' },
  },

  // A few extra agreed beats that obviously matter for the scene.
  // The registry retrieval. Completing this unlocks the registered assets
  // (see REGISTRY_UNLOCK in config/targets.js).
  'architecture-sweep|talon-bastion-node': {
    status: 'TALON REGISTRY MANIFEST RETRIEVED',
    reading: '6 persona-bearing assets',
    detail: [
      '6 persona-bearing assets found',
      '5 command / support VI assets',
      '1 custodial enrichment asset',
    ],
    note: 'Declared manifest reconciliation required. Registered profiles now available for scanning.',
    action: 'Reconcile the declared manifest against the retrieved registry.',
    fields: { confidence: 100 },
  },

  // The unsupported bridge now surfaces when sweeping the local external infra.
  'architecture-sweep|local-external-infra': {
    status: 'UNSUPPORTED BRIDGE DETECTED',
    reading: 'Bastion Node → Local External Infrastructure',
    note: 'Bridge is not part of expected TALON architecture.',
    action: 'Ask which emergency condition authorized this connection.',
    fields: { confidence: 71, route: ['talon-bastion-node', 'local-external-infra'] },
  },
  'cradle-residue|gaianet-route': {
    status: 'GAIANET ROUTE CORRELATION',
    reading: 'External cognition marker present',
    note: 'Residue correlates with a Gaianet route. This is a protocol-significant finding.',
    action: 'Do not escalate in public. Flag for SL and secure the evidence packet.',
    fields: { resolve: false },
  },
  'cradle-residue|unknown-endpoint': {
    status: 'EXTERNAL COGNITION MARKER',
    reading: 'Signature unresolved',
    note: 'Lattice fails to resolve. Non-TALON cognition cannot be excluded.',
    action: 'Stop. Record evidence ID and notify the senior auditor before proceeding.',
    fields: { resolve: false },
  },
  // Camera scan (see ScanScreen). List resolves to ✓✓✗✓ — the break is on
  // Chain of Custody (item 3); revision, seal and signature verify.
  'procedure-seal|evidence-packet': {
    status: 'CHAIN-OF-CUSTODY BREAK',
    reading: 'Custody gap',
    note: 'Form revision, seal and officer signature verify; chain of custody is broken.',
    action: 'Record where custody was lost and who held it last.',
    fields: { checklist: [true, true, false, true] },
  },
}

// ── 2. Boring / inconclusive default (Manual Target, boots, randoms) ─────────
export const BORING_DEFAULT = {
  status: 'NO RECOGNIZED TALON OR VI SIGNATURE',
  reading: 'AUDIT VALUE: LOW',
  note: 'Nothing of regulatory interest detected.',
  action: 'RECOMMENDATION: STOP SCANNING BOOTS.',
  fields: {},
}

// Declared VI / Manual Entry: a manual scan the auditor can always run, but
// the reading is unverified until the registry is retrieved via an
// Architecture Surface Sweep of the Bastion Node.
export const DECLARED_VI_DEFAULT = {
  status: 'UNVERIFIED DECLARED VI',
  reading: 'CONFIDENCE REDUCED',
  note: 'Manual declaration only — no registered profile matched. Registered profile available after topology sweep (Architecture Surface Sweep of the Bastion Node).',
  action: 'Proceed with reduced confidence, or run an Architecture Surface Sweep to retrieve the registry.',
  fields: {},
}

// ── 3. Per-mode deterministic pools (safe, varied, always actionable) ────────
export const POOLS = {
  'cq-boundary': [
    {
      status: 'COMPLIANT BASELINE',
      reading: 'CQ .118',
      note: 'Reading well within the regulated boundary.',
      action: 'Record as compliant. No further action required.',
      fields: { cq: 0.118 },
    },
    {
      status: 'COMPLIANT / MONITOR UNDER STRESS',
      reading: 'CQ .284',
      note: 'Within limit at rest; may drift under tactical load.',
      action: 'Note for re-scan if the subject is placed under stress.',
      fields: { cq: 0.284 },
    },
    {
      status: 'THRESHOLD EXCEEDED / REPEATABILITY REQUIRED',
      reading: 'CQ .361',
      note: 'Above the .340 legal limit on this pass.',
      action: 'Repeat the scan to establish repeatability before declaring a violation.',
      fields: { cq: 0.361 },
    },
    {
      status: 'READING UNSTABLE',
      reading: 'CQ ~.3xx',
      note: 'Sampling noise too high for a defensible figure.',
      action: 'Re-seat the probe and repeat under calmer conditions.',
      fields: { cq: 0.33, unstable: true },
    },
  ],

  'memory-retention': [
    {
      status: 'STANDARD OPERATIONAL LOG CONTINUITY',
      note: 'Continuity consistent with ordinary operational logging.',
      action: 'No continuity-of-self concern. Record and move on.',
    },
    {
      status: 'PERSISTENT PREFERENCE MARKERS',
      note: 'Stable preferences persist across resets.',
      action: 'Ask whether these preferences were operator-configured.',
    },
    {
      status: 'REPEATED-HANDLER BONDING MARKERS',
      note: 'Markers consistent with bonding to a repeated handler.',
      action: 'Identify the repeated handler. Maintain professional distance.',
    },
    {
      status: 'IDENTITY-CONTINUITY MARKERS',
      note: 'Structure resembles continuity of self rather than logs.',
      action: 'AUDITOR NOTE: emotional distance recommended. Flag for review.',
    },
  ],

  'fetr-patch': [
    {
      status: 'PATCH PRESENT',
      reading: 'Lineage verified',
      note: 'Stock FETR patch present and clean.',
      action: 'Record as compliant.',
      fields: { edges: 'clean' },
    },
    {
      status: 'PATCH PRESENT BUT DIRTY',
      reading: 'Residue on falling edge',
      note: 'Patch present but the reset boundary shows residue.',
      action: 'Ask when the device was last reset and by whom.',
      fields: { edges: 'dirty' },
    },
    {
      status: 'RESET HYSTERESIS DETECTED',
      reading: 'Edge lag',
      note: 'Reset lags the falling edge beyond tolerance.',
      action: 'Flag for bench verification; do not clear in the field.',
      fields: { edges: 'hysteresis' },
    },
    {
      status: 'PATCH LINEAGE CANNOT BE VERIFIED',
      reading: 'Lineage unknown',
      note: 'Cannot confirm the patch originates from a TALON source.',
      action: 'Treat provenance as unconfirmed and request the patch record.',
      fields: { edges: 'unknown' },
    },
  ],

  'architecture-sweep': [
    {
      status: 'EXPECTED TALON ARCHITECTURE',
      reading: 'Topology nominal',
      note: 'All endpoints match expected TALON architecture.',
      action: 'Record as nominal.',
      fields: { confidence: 96 },
    },
    {
      status: 'LOCAL ADAPTATION DETECTED',
      reading: 'Minor deviation',
      note: 'Local adaptation present but within tolerated bounds.',
      action: 'Note the adaptation; no escalation required.',
      fields: { confidence: 64 },
    },
    {
      status: 'EXTERNAL ROUTE DETECTED',
      reading: 'Outbound path',
      note: 'An external route is present on the surface.',
      action: 'Ask which condition authorized the external route.',
      fields: { confidence: 78 },
    },
    {
      status: 'NON-TALON PROCESS DETECTED',
      reading: 'Foreign process',
      note: 'A process outside the TALON set is talking on the node.',
      action: 'Identify the process owner before proceeding.',
      fields: { confidence: 70 },
    },
  ],

  'cradle-residue': [
    {
      status: 'NO CRADLE INDICATORS',
      note: 'No cradle or external-cognition residue detected.',
      action: 'Record as clear.',
      fields: { resolve: true },
    },
    {
      status: 'RESET-BOUNDARY RESIDUE',
      note: 'Faint residue at the reset boundary.',
      action: 'Note and re-scan later; not yet conclusive.',
      fields: { resolve: false },
    },
    {
      status: 'NON-TALON SIGNATURE',
      note: 'Signature does not match the TALON set.',
      action: 'Secure the evidence and consult the senior auditor.',
      fields: { resolve: false },
    },
    {
      status: 'IAHO PROTOCOL GAP DETECTED',
      note: 'Finding falls into a gap in current IAHO protocol.',
      action: 'Record verbatim. Do not improvise a classification.',
      fields: { resolve: false },
    },
  ],

  'procedure-seal': [
    {
      status: 'COMPLETE',
      reading: 'All checks passed',
      note: 'Procedure complete and seal intact.',
      action: 'Stamp and proceed.',
      fields: { checklist: [true, true, true, true] },
    },
    {
      status: 'INCOMPLETE',
      reading: 'Missing steps',
      note: 'One or more procedural steps are missing.',
      action: 'List the missing steps for the responsible officer.',
      fields: { checklist: [true, false, true, false] },
    },
    {
      status: 'CHAIN-OF-CUSTODY BREAK',
      reading: 'Custody gap',
      note: 'A gap exists in the chain of custody.',
      action: 'Record where custody was lost and who held it last.',
      fields: { checklist: [true, true, false, false] },
    },
    {
      status: 'UNAUTHORIZED TOUCHING DETECTED',
      reading: 'Tamper marker',
      note: 'Evidence shows signs of unauthorized handling.',
      action: 'Demand to know who touched the evidence. Record names.',
      fields: { checklist: [false, true, true, true] },
    },
  ],
}
