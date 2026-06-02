// Scan targets.
//
// `group` controls availability:
//   'always'   — selectable from the start.
//   'registry' — registered TALON persona assets; hidden until an Architecture
//                Surface Sweep of the Bastion Node retrieves the manifest.
//
// `manual: true`  → free-text name entry.
// `vi: true`      → a Declared VI manual scan (reduced confidence until the
//                   registry is retrieved).
// `code`          → leetspeak TALON designation; assets display as "code / name".
//
// Asset ids are kept stable (don-dragon, bee-nice, …) so scripted result beats
// keyed on them keep working.

export const TARGETS = [
  // ── Systems & routes (always available) ─────────────────────────────────
  { id: 'talon-bastion-node', name: 'TALON Bastion Node', kind: 'system', group: 'always' },
  { id: 'local-terminal', name: 'Local Terminal', kind: 'system', group: 'always' },
  { id: 'attack-vector', name: 'Attack Vector Environment', kind: 'system', group: 'always' },
  { id: 'local-external-infra', name: 'Local External Infrastructure', kind: 'system', group: 'always' },
  { id: 'gaianet-route', name: 'Gaianet Route', kind: 'system', group: 'always' },
  { id: 'unknown-endpoint', name: 'Unknown Endpoint', kind: 'system', group: 'always' },

  // ── Objects (always available) ───────────────────────────────────────────
  { id: 'evidence-packet', name: 'Evidence Packet', kind: 'object', group: 'always' },

  // ── Manual entry (always available) ───────────────────────────────────────
  { id: 'declared-vi', name: 'Declared VI / Manual Entry', kind: 'manual', group: 'always', manual: true, vi: true },
  { id: 'manual', name: 'Manual Target', kind: 'manual', group: 'always', manual: true },

  // ── Registered TALON assets (revealed after the topology sweep) ───────────
  { id: 'shrimp', code: '5HR iMP', name: 'Shrimp', kind: 'asset', group: 'registry' },
  { id: 'bee-nice', code: 'B33-N1C3', name: 'Bee-Nice', kind: 'asset', group: 'registry' },
  { id: 'don-dragon', code: 'D0N D5460N', name: 'Don Dragon', kind: 'asset', group: 'registry' },
  { id: 'io-otter', code: 'I/O 0T73R', name: 'I/O Otter', kind: 'asset', group: 'registry' },
  { id: 'pavel', code: 'P4V37', name: 'Pavel', kind: 'asset', group: 'registry' },
  { id: 'knifey', code: 'ELEANOR', name: 'Knifey', kind: 'asset', group: 'registry' },
]

export const TARGETS_BY_ID = Object.fromEntries(TARGETS.map((t) => [t.id, t]))

// Display label: assets show "CODE / Name", everything else just its name.
export function targetLabel(target) {
  if (!target) return ''
  return target.code ? `${target.code} / ${target.name}` : target.name
}

// The scan that retrieves the registry manifest and unlocks the assets.
export const REGISTRY_UNLOCK = { mode: 'architecture-sweep', target: 'talon-bastion-node' }
