// Puzzles: your puzzle rating, then the ways to play. Rated puzzles without
// end, the daily puzzle, Puzzle Rush, and theme practice.
import { useEffect, useState } from 'react'
import { PUZZLE_THEMES } from '../logic/puzzleModes'
import { dayKey, type Profile } from '../logic/profile'
import { loadPuzzleProgress } from '../storage/db'
import type { Focus } from '../logic/focus'
import { CheckIcon, ChevronIcon, PuzzleIcon } from './icons'

export type PuzzleMode = { kind: 'rated' } | { kind: 'daily' } | { kind: 'theme'; theme: string; label: string } | { kind: 'rush' } | { kind: 'vision' } | { kind: 'mistakes' }

type Props = {
  profile: Profile
  /** Positions from your own games waiting to be practised. */
  mistakesDue: number
  /** Your training focus: a puzzle set for it. */
  focus: Focus | null
  onStart: (mode: PuzzleMode) => void
}

export function PuzzlesTab({ profile, mistakesDue, focus, onStart }: Props) {
  const [rating, setRating] = useState<number | null>(null)
  useEffect(() => {
    loadPuzzleProgress()
      .then((p) => setRating(p ? Math.round(p.rating.rating) : null))
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

      {/* For you (Oct 2026): puzzles on the mistake you make most lately. */}
      {focus && (
        <button type="button" className="fc-card fc-mode fc-for-you" onClick={() => onStart({ kind: 'theme', theme: focus.theme, label: focus.themeLabel })}>
          <span className="fc-mode-badge for-you">For you</span>
          <span>
            <strong>{focus.themeLabel}</strong>
            <span>You’ve been {focus.label} lately. These will sharpen it.</span>
          </span>
          <ChevronIcon size={20} />
        </button>
      )}

      {/* Your own mistakes, brought back on a schedule (spaced repetition). */}
      <button type="button" className={`fc-card fc-mode ${mistakesDue > 0 ? 'due' : ''}`} onClick={() => onStart({ kind: 'mistakes' })}>
        <span className="fc-mode-badge mistakes">{mistakesDue > 0 ? mistakesDue : <CheckIcon size={18} />}</span>
        <span>
          <strong>Your mistakes</strong>
          <span>
            {mistakesDue > 0
              ? `${mistakesDue} position${mistakesDue === 1 ? '' : 's'} from your games to try again.`
              : 'Positions from your games come back here to try again.'}
          </span>
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

      <button type="button" className="fc-card fc-mode" onClick={() => onStart({ kind: 'rush' })}>
        <span className="fc-mode-badge rush">3:00</span>
        <span>
          <strong>Puzzle Rush</strong>
          <span>Three minutes, three strikes. They get harder as you go.</span>
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

      <section>
        <h2>Practise a theme</h2>
        <div className="fc-themes">
          {PUZZLE_THEMES.map((t) => (
            <button key={t.id} type="button" className="fc-theme" onClick={() => onStart({ kind: 'theme', theme: t.id, label: t.label })}>
              {t.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
