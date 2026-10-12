// Playing one Learn lesson, step by step (Joseph, Sep 2026: really playing and
// thinking, not looking and clicking). A short idea, then drills (Oct 2026,
// after maiachess.com): positions played out against Maia, each with a
// report. A set passes with enough drills passed; if not, a fresh set.
import { useEffect, useState } from 'react'
import { RulesTutorial } from '../components/RulesTutorial'
import { OpeningDrill } from '../components/OpeningDrill'
import { Portrait } from '../components/Portrait'
import type { Lesson, LearnStep } from '../data/learnPath'
import { OPENING_DRILLS } from '../data/openingLessons'
import type { Drill } from '../logic/drills'
import { DrillBuilder } from './DrillBuilder'
import { DrillSession } from './DrillSession'
import { CheckIcon } from './icons'
import { loadDrills } from './loadDrills'

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
          <p>{lesson.id.startsWith('my-') ? 'Well practised. It counts as today’s lesson.' : `${lesson.title}. The next lesson is open.`}</p>
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
  if (step.kind === 'rules') return <RulesTutorial speaker="coach" doneLabel="Finish" onDone={onDone} onSkip={onDone} />
  if (step.kind === 'my-opening') return <OpeningDrill drill={step.drill} onDone={onDone} />
  if (step.kind === 'opening') {
    const drill = OPENING_DRILLS[step.drill]
    if (!drill) return <SkipStep onDone={onDone} />
    return <OpeningDrill drill={drill} onDone={onDone} />
  }
  if (step.kind === 'build-drills') return <DrillBuilder playerRating={playerRating} onDone={onDone} />
  return <DrillStep step={step} playerRating={playerRating} onDone={onDone} />
}

/** (A drill that's gone missing: never block the lesson on it.) */
function SkipStep({ onDone }: { onDone: () => void }) {
  return (
    <button type="button" className="fc-primary" onClick={onDone}>
      Continue
    </button>
  )
}

/** A lesson's drills: a fresh set each attempt, at your level. */
function DrillStep({ step, playerRating, onDone }: { step: Extract<LearnStep, { kind: 'drills' }>; playerRating: number; onDone: () => void }) {
  const [attempt, setAttempt] = useState(1)
  const [drills, setDrills] = useState<Drill[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadDrills([step.spec], step.count, playerRating, step.offset)
      .then((d) => !cancelled && setDrills(d))
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [attempt, playerRating, step])

  if (failed) return <p className="fc-muted">The drills couldn’t load. Are you offline?</p>
  if (!drills) return <p className="fc-muted">Setting up the drills…</p>
  return (
    <DrillSession
      key={attempt}
      drills={drills}
      rating={playerRating}
      pass={Math.min(step.pass, drills.length)}
      onDone={onDone}
      onRetry={() => {
        window.scrollTo(0, 0)
        setDrills(null)
        setAttempt((a) => a + 1)
      }}
    />
  )
}
