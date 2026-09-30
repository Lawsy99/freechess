// Puzzle Rush: three minutes, three strikes, and puzzles that get harder as
// you solve them. One try at each (a miss shows the move and costs a strike).
// Not rated; your best score is kept.
import { useEffect, useRef, useState } from 'react'
import { PuzzleTrainer } from '../components/PuzzleTrainer'
import { loadPuzzleBank } from '../engine/puzzleBank'
import { pickRushPuzzle, rushRating, RUSH_SECONDS, RUSH_STRIKES } from '../logic/puzzleModes'
import type { Puzzle } from '../logic/puzzles'
import { BackIcon } from './icons'

type Props = {
  best: number
  onFinished: (score: number) => void
  onBack: () => void
}

/** A moment to see the answer before the next puzzle. */
const NEXT_MS = 900

export function PuzzleRush({ best, onFinished, onBack }: Props) {
  const [bank, setBank] = useState<Puzzle[] | null>(null)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [score, setScore] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [left, setLeft] = useState(RUSH_SECONDS)
  const [started, setStarted] = useState(false)
  const [over, setOver] = useState(false)
  const used = useRef(new Set<string>())

  useEffect(() => {
    loadPuzzleBank()
      .then(setBank)
      .catch(() => setBank([]))
  }, [])

  // The clock.
  useEffect(() => {
    if (!started || over) return
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [started, over])

  useEffect(() => {
    if (started && !over && (left === 0 || strikes >= RUSH_STRIKES)) {
      setOver(true)
      onFinished(score)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ends once
  }, [left, strikes, started])

  const deal = (solvedSoFar: number) => {
    if (!bank) return
    const next = pickRushPuzzle(bank, rushRating(solvedSoFar), used.current)
    if (next) used.current.add(next.id)
    setPuzzle(next)
  }

  function start() {
    used.current.clear()
    setScore(0)
    setStrikes(0)
    setLeft(RUSH_SECONDS)
    setOver(false)
    setStarted(true)
    deal(0)
  }

  function finished(clean: boolean) {
    if (over) return
    const nextScore = clean ? score + 1 : score
    if (clean) setScore(nextScore)
    else setStrikes((s) => s + 1)
    window.setTimeout(() => deal(nextScore), NEXT_MS)
  }

  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`

  return (
    <main className="fc-page fc-puzzle-run">
      <header className="fc-run-head">
        <button type="button" className="fc-back" onClick={onBack}>
          <BackIcon size={22} /> Puzzles
        </button>
        <strong>Puzzle Rush</strong>
      </header>

      {!started ? (
        <div className="fc-card fc-rush-intro">
          <span className="fc-mode-badge rush big">3:00</span>
          <h2>Puzzle Rush</h2>
          <p>Solve as many as you can in three minutes. One try at each: three misses and it’s over. They start easy and get harder.</p>
          <p className="fc-muted">Your best: {best}</p>
          <button type="button" className="fc-primary" disabled={!bank?.length} onClick={start}>
            {bank ? 'Start' : 'Loading puzzles…'}
          </button>
        </div>
      ) : (
        <>
          <div className="fc-rush-bar">
            <span className={`fc-rush-clock ${left <= 20 ? 'low' : ''}`}>{clock}</span>
            <span className="fc-rush-score">{score}</span>
            <span className="fc-rush-strikes" aria-label={`${strikes} of ${RUSH_STRIKES} strikes`}>
              {Array.from({ length: RUSH_STRIKES }, (_, i) => (
                <span key={i} className={i < strikes ? 'hit' : undefined}>
                  ✕
                </span>
              ))}
            </span>
          </div>
          {over ? (
            <div className="fc-card fc-rush-intro">
              <h2>{score > best ? 'New best!' : 'Time’s up'}</h2>
              <p className="fc-rush-final">{score}</p>
              <p className="fc-muted">{score > best ? `Your old best was ${best}.` : `Your best is ${best}.`}</p>
              <button type="button" className="fc-primary" onClick={start}>
                Go again
              </button>
            </div>
          ) : (
            puzzle && <PuzzleTrainer key={puzzle.id} puzzle={puzzle} onFinished={finished} oneTry />
          )}
        </>
      )}
    </main>
  )
}
