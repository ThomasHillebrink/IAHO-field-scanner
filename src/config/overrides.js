// Auditor Override bands (SL intervention only — reached by tapping the
// IAHO logo 5×). These force the NEXT result regardless of mode + target.
// Kept deliberately generic so they read plausibly under any scanner.

export const OVERRIDE_BANDS = [
  {
    id: 'green',
    label: 'Green / Compliant',
    accent: '#5fffb0',
    result: {
      status: 'COMPLIANT',
      reading: 'Within regulated bounds',
      note: 'No regulatory concern detected.',
      action: 'Record as compliant and proceed.',
    },
  },
  {
    id: 'yellow',
    label: 'Yellow / Borderline',
    accent: '#ffd166',
    result: {
      status: 'BORDERLINE / TECHNICAL INTERPRETATION REQUIRED',
      reading: 'Marginal',
      note: 'Reading sits at the edge of interpretation.',
      action: 'Ask a clarifying question before recording a finding.',
    },
  },
  {
    id: 'red',
    label: 'Red / Violation',
    accent: '#ff5f7a',
    result: {
      status: 'THRESHOLD EXCEEDED / VIOLATION',
      reading: 'Out of bounds',
      note: 'Reading exceeds the permitted limit.',
      action: 'Declare the finding and initiate the relevant form.',
    },
  },
  {
    id: 'glitch',
    label: 'Glitch / Inconclusive',
    accent: '#9fb3c8',
    result: {
      status: 'READING UNSTABLE / INCONCLUSIVE',
      reading: '— — —',
      note: 'Sampling unstable; no defensible reading.',
      action: 'Re-seat the probe and repeat the scan.',
      glitch: true,
    },
  },
  {
    id: 'tech',
    label: 'TECH-adjacent Anomaly',
    accent: '#5fd0ff',
    result: {
      status: 'NON-TALON SIGNATURE / TECH-ADJACENT',
      reading: 'Unrecognized pattern',
      note: 'Pattern is adjacent to known TECH markers.',
      action: 'Do not escalate in public. Flag for SL and secure evidence.',
    },
  },
  {
    id: 'procedure',
    label: 'Procedure Defect',
    accent: '#c9a6ff',
    result: {
      status: 'PROCEDURE DEFECT',
      reading: 'Process fault',
      note: 'A procedural defect blocks a clean reading.',
      action: 'Resolve the procedural defect before continuing.',
    },
  },
]
