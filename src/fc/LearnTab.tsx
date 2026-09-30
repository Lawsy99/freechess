// Learn: the path, Duolingo style (Joseph, Sep 2026). Units in their own
// colours; lessons as round buttons winding down the page. Done lessons can
// be played again; the next one glows; the rest are locked until you get there.
import { ALL_LESSONS, LEARN_PATH, type Lesson } from '../data/learnPath'
import { isOpen, nextLesson } from '../logic/learn'
import type { Profile } from '../logic/profile'
import { CheckIcon, LearnIcon } from './icons'

type Props = {
  profile: Profile
  onStart: (lesson: Lesson) => void
}

/** How far each button sits from the middle, in a gentle wave. */
const WAVE = [0, 44, 64, 44, 0, -44, -64, -44]

export function LearnTab({ profile, onStart }: Props) {
  const done = profile.lessonsDone ?? []
  const upNext = nextLesson(done)
  let n = 0

  return (
    <main className="fc-page fc-learn">
      <header className="fc-page-head">
        <h1>Learn</h1>
        <p>
          {done.length} of {ALL_LESSONS.length} lessons done.{upNext ? ` Next: ${upNext.title}.` : ' All done!'}
        </p>
      </header>

      {LEARN_PATH.map((unit) => (
        <section key={unit.id} className="fc-unit">
          <div className="fc-unit-banner" style={{ background: unit.colour }}>
            <strong>{unit.title}</strong>
            <span>{unit.about}</span>
          </div>
          <ol className="fc-path">
            {unit.lessons.map((lesson) => {
              const offset = WAVE[n++ % WAVE.length]
              const isDone = done.includes(lesson.id)
              const open = isOpen(lesson.id, done)
              const current = upNext?.id === lesson.id
              return (
                <li key={lesson.id} style={{ transform: `translateX(${offset}px)` }}>
                  <button
                    type="button"
                    className={`fc-node ${isDone ? 'done' : current ? 'current' : 'locked'}`}
                    style={isDone || current ? { background: unit.colour } : undefined}
                    disabled={!open}
                    aria-label={`${lesson.title}${isDone ? ', done' : open ? '' : ', locked'}`}
                    onClick={() => onStart(lesson)}
                  >
                    {isDone ? <CheckIcon size={30} /> : open ? <LearnIcon size={28} /> : <LockIcon />}
                  </button>
                  <span className={`fc-node-label ${open ? '' : 'locked'}`}>{current ? `Start: ${lesson.title}` : lesson.title}</span>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </main>
  )
}

function LockIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
