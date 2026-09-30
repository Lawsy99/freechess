// Puzzles: your puzzle rating, then the ways to play. Rated puzzles without
// end, the daily puzzle, Puzzle Rush, and theme practice.
import { useEffect, useState } from 'react'
import { PUZZLE_THEMES } from '../logic/puzzleModes'
import { dayKey, type Profile } from '../logic/profile'
import { loadPuzzleProgress } from '../storage/db'
import { CheckIcon, ChevronIcon, PuzzleIcon } from './icons'

export type PuzzleMode = { kind: 'rated' } | { kind: 'daily' } | { kind: 'theme'; theme: string; label: string } | { kind: 'rush' } | { kind: 'vision' }

type Props = {
  profile: Profile
  onStart: (mode: PuzzleMode) => void
}

export function PuzzlesTab({ profile, onStart }: Props) {
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
