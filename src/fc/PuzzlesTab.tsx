// Puzzles, laid out as chess.com does (Joseph, Oct 2026): your puzzle rating,
// then rated puzzles without end, Puzzle Rush, the daily puzzle and custom
// puzzles (any themes, any difficulty). "Themes to work on" comes from your
// own rated results, so it changes as you improve.
import { useEffect, useState } from 'react'
import { dayKey, type Profile } from '../logic/profile'
import { MIN_TRIED, weakestThemes, type Difficulty } from '../logic/puzzleThemes'
import { loadPuzzleProgress } from '../storage/db'
import { CheckIcon, ChevronIcon, PuzzleIcon } from './icons'

export type PuzzleMode =
  | { kind: 'rated' }
  | { kind: 'daily' }
  /** Custom puzzles: chosen themes at a chosen difficulty, unrated. */
  | { kind: 'custom'; themes: string[]; difficulty: Difficulty }
  /** The custom puzzles picker. */
  | { kind: 'customise' }
  | { kind: 'rush' }
  | { kind: 'vision' }
  | { kind: 'mistakes' }

type Props = {
  profile: Profile
  /** Positions from your own games waiting to be practised. */
  mistakesDue: number
  onStart: (mode: PuzzleMode) => void
}

export function PuzzlesTab({ profile, mistakesDue, onStart }: Props) {
  const [rating, setRating] = useState<number | null>(null)
  const [weak, setWeak] = useState<ReturnType<typeof weakestThemes>>([])
  useEffect(() => {
    loadPuzzleProgress()
      .then((p) => {
        setRating(p ? Math.round(p.rating.rating) : null)
        setWeak(weakestThemes(p?.themeStats))
      })
      .catch(() => setRating(null))
  }, [])
  const dailyDone = profile.dailySolvedOn === dayKey(new Date())

  return (
    <main className="fc-page">
      <header className="fc-page-head">
        <h1>Puzzles</h1>
        <p>Unlimited, and every one of them free.</p>
      </header>

      <div className="fc-quick-stats">
        <div className="fc-card">
          <span>Puzzle rating</span>
          <strong>{rating ?? '–'}</strong>
        </div>
        <div className="fc-card">
          <span>Solved</span>
          <strong>{profile.puzzlesSolved ?? 0}</strong>
        </div>
        <div className="fc-card">
          <span>Rush best</span>
          <strong>{profile.rushBest ?? 0}</strong>
        </div>
      </div>

      <button type="button" className="fc-card fc-mode fc-mode-main" onClick={() => onStart({ kind: 'rated' })}>
        <PuzzleIcon size={30} />
        <span>
          <strong>Solve puzzles</strong>
          <span>Rated, at your level, as many as you like.</span>
        </span>
        <ChevronIcon size={20} />
      </button>

      <button type="button" className="fc-card fc-mode" onClick={() => onStart({ kind: 'rush' })}>
        <span className="fc-mode-badge rush">3:00</span>
        <span>
          <strong>Puzzle Rush</strong>
          <span>Three minutes, three strikes. They get harder as you go.</span>
        </span>
        <ChevronIcon size={20} />
      </button>

      <button type="button" className="fc-card fc-mode" onClick={() => onStart({ kind: 'daily' })}>
        <span className="fc-mode-badge">{dailyDone ? <CheckIcon size={18} /> : new Date().getDate()}</span>
        <span>
          <strong>Daily puzzle</strong>
          <span>{dailyDone ? 'Solved today. A new one tomorrow.' : 'One a day, the same for everyone.'}</span>
        </span>
        <ChevronIcon size={20} />
      </button>

      <button type="button" className="fc-card fc-mode" onClick={() => onStart({ kind: 'customise' })}>
        <span className="fc-mode-badge custom">
          <PuzzleIcon size={18} />
        </span>
        <span>
          <strong>Custom puzzles</strong>
          <span>Choose the themes and the difficulty. Unrated practice.</span>
        </span>
        <ChevronIcon size={20} />
      </button>

      {/* From your own rated results: your three weakest themes. */}
      {weak.length > 0 && (
        <section>
          <h2>Themes to work on</h2>
          <div className="fc-themes">
            {weak.map((t) => (
              <button key={t.id} type="button" className="fc-theme" onClick={() => onStart({ kind: 'custom', themes: [t.id], difficulty: 'normal' })}>
                {t.label} · {Math.round(t.rate * 100)}%
              </button>
            ))}
          </div>
          <p className="fc-muted">Your success rate in rated puzzles (themes with at least {MIN_TRIED}).</p>
        </section>
      )}

      {/* Your own mistakes, brought back on a schedule (spaced repetition). */}
      <button type="button" className={`fc-card fc-mode ${mistakesDue > 0 ? 'due' : ''}`} onClick={() => onStart({ kind: 'mistakes' })}>
        <span className="fc-mode-badge mistakes">{mistakesDue > 0 ? mistakesDue : <CheckIcon size={18} />}</span>
        <span>
          <strong>Your mistakes</strong>
          <span>
            {mistakesDue > 0
              ? `Today: ${mistakesDue} position${mistakesDue === 1 ? '' : 's'} from your games. The biggest mistakes first.`
              : 'Done for today. Your biggest mistakes come back here, three a day.'}
          </span>
        </span>
        <ChevronIcon size={20} />
      </button>

      <button type="button" className="fc-card fc-mode" onClick={() => onStart({ kind: 'vision' })}>
        <span className="fc-mode-badge vision">e4</span>
        <span>
          <strong>Vision</strong>
          <span>Name the square: tap it, as many as you can in 30 seconds.</span>
        </span>
        <ChevronIcon size={20} />
      </button>
    </main>
  )
}
