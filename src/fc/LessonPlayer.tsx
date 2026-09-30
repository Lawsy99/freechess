// Playing one Learn lesson, step by step (Joseph, Sep 2026: really playing and
// thinking, not looking and clicking). A short idea, then puzzles to solve,
// positions to play out against the engine, or an opening to play through.
// A puzzle round passes with enough solved cleanly; if not, a fresh set.
import { useEffect, useState } from 'react'
import { EndgameDrill } from '../components/EndgameDrill'
import { OpeningDrill } from '../components/OpeningDrill'
import { Portrait } from '../components/Portrait'
import { PuzzleTrainer } from '../components/PuzzleTrainer'
import { ENDGAME_DRILLS } from '../data/endgameDrills'
import type { Lesson, LearnStep } from '../data/learnPath'
import { OPENING_DRILLS } from '../data/openingLessons'
import { loadPuzzleBank } from '../engine/puzzleBank'
import { lessonPuzzleRating, roundPassed } from '../logic/learn'
import { pickPuzzles, type Puzzle } from '../logic/puzzles'
import { loadPuzzleProgress, updatePuzzleProgress } from '../storage/db'
import { CheckIcon } from './icons'

type Props = {
  lesson: Lesson
  /** Your playing rating (puzzles use your puzzle rating when you have one). */
  playerRating: number
  onComplete: () => void
  onBack: () => void
}

export function LessonPlayer({ lesson, playerRating, onComplete, onBack }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [complete, setComplete] = useState(false)
  const step = lesson.steps[stepIndex]
  const next = () => {
    window.scrollTo(0, 0)
    if (stepIndex + 1 >= lesson.steps.length) setComplete(true)
    else setStepIndex(stepIndex + 1)
  }

  return (
    <main className="fc-page fc-lesson">
      <header className="fc-lesson-head">
        <button type="button" className="fc-icon-button" onClick={onBack} aria-label="Leave the lesson">
          ✕
        </button>
        <div className="fc-lesson-progress" aria-label={`Step ${stepIndex + 1} of ${lesson.steps.length}`}>
          <i style={{ width: `${((complete ? lesson.steps.length : stepIndex) / lesson.steps.length) * 100}%` }} />
        </div>
      </header>

      {complete ? (
        <div className="fc-lesson-done">
          <span className="fc-lesson-tick">
            <CheckIcon size={44} />
          </span>
          <h1>Lesson complete</h1>
          <p>{lesson.title}. The next lesson is open.</p>
          <button type="button" className="fc-primary" onClick={onComplete}>
            Continue
          </button>
        </div>
      ) : (
        <>
          <h1 className="fc-lesson-title">{lesson.title}</h1>
          <StepView key={stepIndex} step={step} playerRating={playerRating} onDone={next} />
        </>
      )}
    </main>
  )
}

function StepView({ step, playerRating, onDone }: { step: LearnStep; playerRating: number; onDone: () => void }) {
  if (step.kind === 'idea') {
    return (
      <div className="fc-idea">
        <div className="fc-idea-card">
          <Portrait who="coach" size={44} expression="pleased" className="fc-face" />
          <p>{step.text}</p>
        </div>
        <button type="button" className="fc-primary" onClick={onDone}>
          Let’s try it
        </button>
      </div>
    )
  }
  if (step.kind === 'endgame') {
    const positions = ENDGAME_DRILLS[step.drill] ?? []
    // The position that suits your rating (easier ones for newer players).
    const position = positions.find((p) => playerRating <= p.upTo) ?? positions.at(-1)
    if (!position) return <SkipStep onDone={onDone} />
    return <EndgameDrill position={position} onDone={onDone} noSkip />
  }
  if (step.kind === 'opening') {
    const drill = OPENING_DRILLS[step.drill]
    if (!drill) return <SkipStep onDone={onDone} />
    return <OpeningDrill drill={drill} onDone={onDone} />
  }
  return <PuzzleRound step={step} playerRating={playerRating} onDone={onDone} />
}

/** (A drill that's gone missing: never block the lesson on it.) */
function SkipStep({ onDone }: { onDone: () => void }) {
  return (
    <button type="button" className="fc-primary" onClick={onDone}>
      Continue
    </button>
  )
}

type Round = { puzzles: Puzzle[]; index: number; clean: number; finished: boolean; lastClean: boolean | null }

function PuzzleRound({ step, playerRating, onDone }: { step: Extract<LearnStep, { kind: 'puzzles' }>; playerRating: number; onDone: () => void }) {
  const [round, setRound] = useState<Round | null>(null)
  const [attempt, setAttempt] = useState(1)
  const [failed, setFailed] = useState(false)

  // A fresh set each attempt, around your level, never ones you've seen.
  useEffect(() => {
    let cancelled = false
    Promise.all([loadPuzzleBank(), loadPuzzleProgress()])
      .then(([bank, progress]) => {
        if (cancelled) return
        const rating = lessonPuzzleRating(progress ? progress.rating.rating : playerRating, step.offset)
        const puzzles = pickPuzzles(bank, { themes: step.themes, rating, count: step.count, exclude: new Set(progress?.seen ?? []) })
        setRound({ puzzles, index: 0, clean: 0, finished: false, lastClean: null })
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [attempt, playerRating, step])

  if (failed) return <p className="fc-muted">The puzzles couldn’t load. Are you offline?</p>
  if (!round) return <p className="fc-muted">Setting up the puzzles…</p>

  const puzzle = round.puzzles[round.index]
  const doneAll = round.index >= round.puzzles.length
  const passed = roundPassed(round.clean, Math.min(step.pass, round.puzzles.length))

  if (doneAll) {
    return (
      <div className={`fc-round-result ${passed ? 'passed' : 'missed'}`}>
        <strong>
          {round.clean} of {round.puzzles.length} solved first time
        </strong>
        <p>{passed ? 'Well done. On to the next step.' : `You need ${step.pass}. Here’s a fresh set to try.`}</p>
        {passed ? (
          <button type="button" className="fc-primary" onClick={onDone}>
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="fc-primary"
            onClick={() => {
              setRound(null)
              setAttempt((a) => a + 1)
            }}
          >
            Try a fresh set
          </button>
        )}
      </div>
    )
  }

  const finished = (clean: boolean) => {
    setRound((r) => (r ? { ...r, clean: r.clean + (clean ? 1 : 0), finished: true, lastClean: clean } : r))
    updatePuzzleProgress((saved) => (saved ? { ...saved, seen: [...saved.seen, puzzle.id].slice(-3000) } : saved)).catch(() => undefined)
  }

  return (
    <div className="fc-round">
      <p className="fc-round-head">
        <strong>{step.title}</strong>
        <span>
          {round.index + 1} of {round.puzzles.length} · {round.clean} solved
        </span>
      </p>
      <PuzzleTrainer key={puzzle.id} puzzle={puzzle} onFinished={finished} focus={step.themes} oneTry={step.oneTry} />
      {round.finished && (
        <button
          type="button"
          className="fc-primary"
          onClick={() => setRound((r) => (r ? { ...r, index: r.index + 1, finished: false, lastClean: null } : r))}
        >
          {round.index + 1 >= round.puzzles.length ? 'See how you did' : 'Next puzzle'}
        </button>
      )}
    </div>
  )
}
