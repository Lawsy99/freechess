// A set of drills in a row (FreeChess, Oct 2026, after maiachess.com): each
// one played, then its report, then the next; at the end, how the set went.
// In a lesson the set has to be passed (enough drills passed); if not, a
// fresh set. Built-your-own sets just end.
import { useState } from 'react'
import { summariseDrills, type Drill, type DrillGrade } from '../logic/drills'
import type { DrillVerdict } from '../logic/endgameDrill'
import { DrillPlayer } from './DrillPlayer'
import { DrillReport } from './DrillReport'
import '../components/ratings.css'
import './drills.css'

type Props = {
  drills: Drill[]
  /** Maia's level. */
  rating: number
  /** Drills to pass for the set to count (lessons); none for your own sets. */
  pass?: number
  /** All done: whether the set was passed. */
  onDone: (passed: boolean) => void
  /** Lessons: try again with a fresh set. */
  onRetry?: () => void
}

type Played = { moves: string[]; verdict: DrillVerdict | null }

export function DrillSession({ drills, rating, pass, onDone, onRetry }: Props) {
  const [index, setIndex] = useState(0)
  const [played, setPlayed] = useState<Played | null>(null)
  const [grades, setGrades] = useState<DrillGrade[]>([])

  if (drills.length === 0) {
    return (
      <div className="drill-report">
        <p className="fc-muted">No drills could be set up for this. Try another.</p>
        <button type="button" className="fc-primary" onClick={() => onDone(true)}>
          Continue
        </button>
      </div>
    )
  }

  // The set is over: how it went.
  if (index >= drills.length) {
    const s = summariseDrills(grades)
    const needed = pass ?? 0
    const passed = s.passed >= needed
    return (
      <div className={`fc-round-result ${passed ? 'passed' : 'missed'}`}>
        <strong>
          {s.passed} of {s.total} drills passed
        </strong>
        <p>
          {s.accuracy !== null ? `Average accuracy ${s.accuracy}%. ` : ''}
          {pass === undefined ? '' : passed ? 'Well done. On to the next step.' : `You need ${needed}. Here’s a fresh set to try.`}
        </p>
        {passed || !onRetry ? (
          <button type="button" className="fc-primary" onClick={() => onDone(passed)}>
            Continue
          </button>
        ) : (
          <button type="button" className="fc-primary" onClick={onRetry}>
            Try a fresh set
          </button>
        )}
      </div>
    )
  }

  const drill = drills[index]
  if (!played) {
    return (
      <DrillPlayer
        key={`${index}:${drill.id}`}
        drill={drill}
        rating={rating}
        position={{ index, total: drills.length }}
        onFinished={(moves, verdict) => {
          window.scrollTo(0, 0)
          setPlayed({ moves, verdict })
        }}
      />
    )
  }
  return (
    <DrillReport
      key={`report:${index}`}
      drill={drill}
      moves={played.moves}
      verdict={played.verdict}
      onGraded={(g) => setGrades((all) => [...all.slice(0, index), g])}
      onNext={() => {
        window.scrollTo(0, 0)
        setPlayed(null)
        setIndex(index + 1)
      }}
      nextLabel={index + 1 < drills.length ? 'Next drill' : 'See how you did'}
    />
  )
}
