// The report after a drill (FreeChess, Oct 2026, after maiachess.com): passed
// or not, accuracy, your good moves and mistakes, the game at a glance, the
// Coach on the moment that mattered, and the rating your moves looked like.
// The engine checks every position first (a few seconds); Maia's estimate
// follows.
import { useEffect, useMemo, useState } from 'react'
import { AnalysisBoard } from '../components/AnalysisBoard'
import { EvalGraph } from '../components/EvalGraph'
import { Portrait } from '../components/Portrait'
import { moveLikelihoods } from '../engine/drillEngine'
import { analyseGame } from '../engine/reviewAnalysis'
import { drillCoachLine, ESTIMATE_MOVES, ESTIMATE_RATINGS, estimateRating, gradeDrill, type Drill, type DrillGrade } from '../logic/drills'
import { endgameAdvice, type DrillVerdict } from '../logic/endgameDrill'
import { winChance } from '../logic/evaluation'
import { RATING_LABELS, type MoveRating } from '../logic/moveRating'
import { nameOf } from '../logic/notation'
import { reviewMoves, settleEvals, type PositionEval, type ReviewedMove } from '../logic/review'

type Props = {
  drill: Drill
  moves: string[]
  verdict: DrillVerdict | null
  /** Graded: handed back so the set can sum up. */
  onGraded: (grade: DrillGrade) => void
  onNext: () => void
  nextLabel: string
  /** Play the same drill again (the new try replaces this one in the set). */
  onReplay: () => void
}

const SHOWN: MoveRating[] = ['best', 'good', 'inaccuracy', 'mistake', 'blunder']

export function DrillReport({ drill, moves, verdict, onGraded, onNext, nextLabel, onReplay }: Props) {
  const [evals, setEvals] = useState<PositionEval[] | null>(null)
  const [progress, setProgress] = useState({ done: 0, total: moves.length + 1 })
  const [failed, setFailed] = useState(false)
  const [estimate, setEstimate] = useState<{ rating: number; spread: number } | null | 'working'>('working')
  const [looking, setLooking] = useState(false)

  // The engine first, then Maia's estimate.
  useEffect(() => {
    let cancelled = false
    analyseGame(moves, (done, total) => !cancelled && setProgress({ done, total }), () => cancelled, drill.startFen)
      .then((result) => {
        if (!cancelled && result) setEvals(settleEvals(moves, result, drill.startFen))
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [moves, drill.startFen])

  const reviewed = useMemo(() => (evals ? reviewMoves(moves, evals, drill.startFen) : null), [evals, moves, drill.startFen])
  const grade = useMemo(() => (reviewed ? gradeDrill(drill, reviewed, verdict) : null), [reviewed, drill, verdict])
  useEffect(() => {
    if (grade) onGraded(grade)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when graded
  }, [grade])

  useEffect(() => {
    if (!reviewed) return
    let cancelled = false
    const mine = reviewed.filter((m) => m.mover === drill.player).map((m) => ({ fen: m.fenBefore, uci: m.uci })).slice(-ESTIMATE_MOVES)
    moveLikelihoods(mine, ESTIMATE_RATINGS, () => cancelled).then((l) => !cancelled && setEstimate(l ? estimateRating(l) : null))
    return () => {
      cancelled = true
    }
  }, [reviewed, drill.player])

  if (looking) {
    return (
      <AnalysisBoard
        initial={{ startFen: drill.startFen, moves: [...moves], cursor: moves.length }}
        orientation={drill.player === 'w' ? 'white' : 'black'}
        onBack={() => setLooking(false)}
      />
    )
  }

  if (failed) {
    return (
      <div className="drill-report">
        <p className="fc-muted">The engine couldn’t check this one (phones sometimes pause it).</p>
        <button type="button" className="fc-primary" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    )
  }

  if (!evals || !reviewed || !grade) {
    return (
      <div className="drill-report">
        <p>Checking your moves…</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
        </div>
      </div>
    )
  }

  const forYou = (cp: number) => (drill.player === 'w' ? cp : -cp)
  const points = evals.map((e) => winChance({ type: 'cp', value: forYou(e.cp) }))
  const markers = reviewed
    .filter((m) => m.mover === drill.player && ['inaccuracy', 'mistake', 'blunder'].includes(m.rating))
    .map((m) => ({ index: m.ply + 1, rating: m.rating }))
  const coach = coachSays(drill, grade, moves, evals, reviewed)

  return (
    <div className="drill-report">
      <p className={`drill-verdict ${grade.passed ? 'passed' : 'missed'}`}>{grade.passed ? 'Passed' : 'Not yet'}</p>
      <div className="drill-numbers">
        <div className="fc-card">
          <span>Accuracy</span>
          <strong>{grade.accuracy ?? '–'}%</strong>
        </div>
        <div className="fc-card">
          <span>You played like</span>
          <strong>{estimate === 'working' ? '…' : estimate ? `${estimate.rating}` : '–'}</strong>
        </div>
      </div>
      <ul className="rating-counts drill-counts">
        {SHOWN.map((r) => (
          <li key={r} className={`rating-${r}`}>
            <span className="dot" />
            <span className="count">{grade.counts[r]}</span>
            <span className="label">{RATING_LABELS[r]}</span>
          </li>
        ))}
      </ul>
      <EvalGraph compact points={points} markers={markers} current={-1} onSelect={() => setLooking(true)} />
      <div className="drill-note">
        <Portrait who="coach" size={32} expression={grade.passed ? 'pleased' : 'neutral'} className="fc-face" />
        <p>{coach}</p>
      </div>
      {estimate !== 'working' && estimate && (
        <p className="fc-muted drill-estimate">
          Your moves looked most like a {estimate.rating} player’s (give or take {Math.max(estimate.spread, 100)}), going by how often players of each rating choose them.
        </p>
      )}
      <button type="button" className="fc-primary" onClick={onNext}>
        {nextLabel}
      </button>
      <button type="button" className="fc-secondary" onClick={onReplay}>
        Try this drill again
      </button>
      <button type="button" className="fc-secondary" onClick={() => setLooking(true)}>
        Look at the moves
      </button>
    </div>
  )
}

/** The Coach on the drill: the goal, the key idea, or the costliest move, else praise. */
function coachSays(drill: Drill, g: DrillGrade, moves: string[], evals: PositionEval[], reviewed: ReviewedMove[]): string {
  if (drill.endgame) {
    if (g.verdict === 'won') return drill.endgame.success
    return endgameAdvice(g.verdict ?? 'too-slow', drill.endgame.goal)
  }
  const key =
    g.foundKey === true
      ? 'You found the key move straight away. '
      : g.foundKey === false && drill.keyMove
        ? `The key move here was ${keyName(drill.startFen, drill.keyMove)}. `
        : ''
  if (g.worst) return key + (drillCoachLine(moves, evals, reviewed, g.worst) ?? 'One move cost you here: tap the graph to look again.')
  return key + (g.passed ? 'Clean play: no mistakes. Well done.' : 'Steady, but not quite accurate enough. Try another.')
}

function keyName(fen: string, uci: string): string {
  return nameOf(fen, uci) ?? uci
}
