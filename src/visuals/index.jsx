import CqGauge from './CqGauge.jsx'
import FetrWaveform from './FetrWaveform.jsx'
import ArchitectureMap from './ArchitectureMap.jsx'
import CradleLattice from './CradleLattice.jsx'
import ProcedureChecklist from './ProcedureChecklist.jsx'
import GenericVisual from './GenericVisual.jsx'

// Maps a mode's `visual` name to a component. The four not-yet-built visuals
// fall back to GenericVisual (see IMPLEMENTATION_PLAN.md build order).
//
// `phase` drives the settle animations: 'idle' (pre-scan, resting),
// 'scan' (animating toward the final value), 'result' (settled, default).
export default function Visual({ mode, result, phase = 'result' }) {
  const accent = mode?.accent ?? '#5fd0ff'
  switch (mode?.visual) {
    case 'CqGauge':
      return <CqGauge result={result} accent={accent} phase={phase} />
    case 'FetrWaveform':
      return <FetrWaveform result={result} accent={accent} phase={phase} />
    case 'ArchitectureMap':
      return <ArchitectureMap result={result} accent={accent} phase={phase} />
    case 'CradleLattice':
      return <CradleLattice result={result} accent={accent} phase={phase} />
    case 'ProcedureChecklist':
      return <ProcedureChecklist result={result} accent={accent} phase={phase} />
    default:
      return <GenericVisual accent={accent} label={mode?.short ?? ''} result={result} phase={phase} />
  }
}
