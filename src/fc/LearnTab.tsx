// Learn: the path, Duolingo style (Joseph, Sep 2026). Units in their own
// colours, each with its piece as a big faded picture; lessons as round
// buttons winding down the page, each showing a piece that suits it. Done
// lessons get a tick and can be played again; the next one glows, with the
// Coach beside it; the rest are locked until you get there.
import { defaultPieces } from 'react-chessboard'
import { Portrait } from '../components/Portrait'
import { ALL_LESSONS, LEARN_PATH, type Lesson } from '../data/learnPath'
import { isOpen, nextLesson } from '../logic/learn'
import type { Profile } from '../logic/profile'
import { CheckIcon } from './icons'
import './learnhome.css'

type Props = {
  profile: Profile
  onStart: (lesson: Lesson) => void
}

/** How far each button sits from the middle, in a gentle wave. */
const WAVE = [0, 44, 64, 44, 0, -44, -64, -44]

/** Each unit's piece, for its banner. */
const UNIT_PIECE: Record<string, string> = {
  'first-steps': 'wP',
  tactics: 'wN',
  mates: 'wQ',
  openings: 'wB',
  endgames: 'wK',
  'winning-ideas': 'wR',
  attack: 'wQ',
  'advanced-tactics': 'wN',
  'endgame-mastery': 'wK',
}

/** The piece on each lesson's button: the one that does the job (knights fork, rooks mate on the back rank). */
const LESSON_PIECE: Record<string, string> = {
  rules: 'wK',
  'queen-mate': 'wQ',
  'rook-mate': 'wR',
  'key-squares': 'wK',
  opposition: 'bK',
  lucena: 'wR',
  philidor: 'bR',
  'free-pieces': 'wP',
  'mate-in-one': 'wQ',
  'lone-king': 'wK',
  'stay-safe': 'wR',
  forks: 'wN',
  pins: 'wB',
  skewers: 'wR',
  discovered: 'wB',
  'double-check': 'wQ',
  'back-rank': 'wR',
  smothered: 'wN',
  'mate-in-two': 'wQ',
  'mate-in-three': 'wK',
  italian: 'wB',
  london: 'wB',
  'black-e4': 'bP',
  'black-d4': 'bN',
  'queens-gambit': 'wQ',
  'ruy-lopez': 'wB',
  'caro-kann': 'bP',
  sicilian: 'bB',
  'opening-traps': 'wN',
  'king-pawn': 'wK',
  promotion: 'wP',
  'rook-endings': 'wR',
  sacrifices: 'wQ',
  deflection: 'wR',
  trapped: 'wB',
  'quiet-moves': 'wN',
  'kingside-attack': 'wQ',
  'exposed-king': 'wK',
  attraction: 'wQ',
  'remove-defender': 'wB',
  intermezzo: 'wN',
  clearance: 'wR',
  interference: 'wB',
  'x-ray': 'wR',
  zugzwang: 'wK',
  'passed-pawns': 'wP',
  'bishop-endings': 'wB',
  'knight-endings': 'wN',
  'queen-endings': 'wQ',
}

const piece = (key: string, size: number) => defaultPieces[key]({ svgStyle: { width: size, height: size } })

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
            <span className="fc-unit-art" aria-hidden="true">
              {piece(UNIT_PIECE[unit.id] ?? 'wP', 96)}
            </span>
          </div>
          <ol className="fc-path">
            {unit.lessons.map((lesson) => {
              const offset = WAVE[n++ % WAVE.length]
              const isDone = done.includes(lesson.id)
              const open = isOpen(lesson.id, done)
              const current = upNext?.id === lesson.id
              return (
                <li key={lesson.id} style={{ transform: `translateX(${offset}px)` }}>
                  {/* The Coach stands beside your next lesson, on the side with room. */}
                  {current && (
                    <span className={`fc-path-coach ${offset > 0 ? 'left' : 'right'}`} aria-hidden="true">
                      <span className="fc-path-coach-say">Start here!</span>
                      <Portrait who="coach" size={56} expression="pleased" className="fc-face" />
                    </span>
                  )}
                  <button
                    type="button"
                    className={`fc-node ${isDone ? 'done' : current ? 'current' : 'locked'}`}
                    style={isDone || current ? { background: unit.colour } : undefined}
                    disabled={!open}
                    aria-label={`${lesson.title}${isDone ? ', done' : open ? '' : ', locked'}`}
                    onClick={() => onStart(lesson)}
                  >
                    {open ? piece(LESSON_PIECE[lesson.id] ?? 'wP', 44) : <LockIcon />}
                    {isDone && (
                      <span className="fc-node-tick">
                        <CheckIcon size={14} />
                      </span>
                    )}
                  </button>
                  <span className={`fc-node-label ${open ? '' : 'locked'}`}>{lesson.title}</span>
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
