// Predefined scan targets. `kind` drives grouping on the target screen.
// The special 'manual' target opens a free-text field and always resolves to
// the boring / inconclusive default (it cannot produce a scripted plot beat).

export const TARGETS = [
  // People
  { id: 'don-dragon', name: 'Don Dragon', kind: 'person' },
  { id: 'bee-nice', name: 'Bee-Nice', kind: 'person' },
  { id: 'io-otter', name: 'IO Otter', kind: 'person' },
  { id: 'shrimp', name: 'Shrimp', kind: 'person' },
  { id: 'pavel', name: 'Pavel', kind: 'person' },

  // Systems
  { id: 'talon-bastion-node', name: 'TALON Bastion Node', kind: 'system' },
  { id: 'attack-vector', name: 'Attack Vector Environment', kind: 'system' },
  { id: 'local-external-infra', name: 'Local External Infrastructure', kind: 'system' },
  { id: 'gaianet-route', name: 'Gaianet Route', kind: 'system' },
  { id: 'unknown-endpoint', name: 'Unknown Endpoint', kind: 'system' },

  // Objects
  { id: 'evidence-packet', name: 'Evidence Packet', kind: 'object' },
  { id: 'manual', name: 'Manual Target', kind: 'object', manual: true },
]

export const TARGETS_BY_ID = Object.fromEntries(
  TARGETS.map((t) => [t.id, t]),
)

export const TARGET_KINDS = [
  { id: 'person', label: 'Subjects' },
  { id: 'system', label: 'Systems & Routes' },
  { id: 'object', label: 'Objects' },
]
