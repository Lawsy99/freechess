// Solving puzzles one after another: rated puzzles at your level, custom
// puzzles (your themes, your difficulty, unrated), or the daily puzzle. After
// each: solved or not, its themes, the rating change, then the next one.
import { useEffect, useState } from 'react'
import { PuzzleTrainer } from '../components/PuzzleTrainer'
import { loadPuzzleBank } from '../engine/puzzleBank'
import { dailyPuzzle } from '../logic/puzzleModes'
import { pickPuzzles, ratePuzzle, type Puzzle } from '../logic/puzzles'
import { DIFFICULTIES, recordThemes, themeLabel } from '../logic/puzzleThemes'
import { dayKey } from '../logic/profile'
import { loadPuzzleProgress, updatePuzzleProgress, type PuzzleProgress } from '../storage/db'
import type { PuzzleMode } from './PuzzlesTab'
import { BackIcon } from './icons'

type Props = {
  mode: Extract<PuzzleMode, { kind: 'rated' | 'daily' | 'custom' }>
  /** Starting puzzle rating for someone who has never done one: their playing rating. */
  playerRating: number
  onSolved: (solved: boolean, daily: boolean) => void
  onBack: () => void
}

const NEW_DEVIATION = 200

export function PuzzleRun({ mode, playerRating, onSolved, onBack }: Props) {
  const [bank, setBank] = useState<Puzzle[] | null>(null)
  const [progress, setProgress] = useState<PuzzleProgress | null>(null)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [result, setResult] = useState<{ solved: boolean; change: number } | null>(null)
  const [failed, setFailed] = useState(false)

  const next = (all: Puzzle[], p: PuzzleProgress) => {
    setResult(null)
    if (mode.kind === 'daily') return setPuzzle(dailyPuzzle(all, dayKey(new Date())))
    const offset = mode.kind === 'custom' ? (DIFFICULTIES.find((d) => d.id === mode.difficulty)?.offset ?? 0) : 0
    const [picked] = pickPuzzles(all, { themes: mode.kind === 'custom' ? mode.themes : undefined, rating: p.rating.rating + offset, count: 1, exclude: new Set(p.seen) })
    setPuzzle(picked ?? null)
  }

  useEffect(() => {
    Promise.all([loadPuzzleBank(), loadPuzzleProgress()])
      .then(([all, saved]) => {
        const start: PuzzleProgress = saved ?? { rating: { rating: playerRating, deviation: NEW_DEVIATION, volatility: 0.06 }, seen: [] }
        setBank(all)
        setProgress(start)
        next(all, start)
      })
      .catch(() => setFailed(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once
  }, [])

  function finished(clean: boolean) {
    if (!puzzle || !progress) return
    // Only "Solve puzzles" is rated: the daily puzzle is the same for everyone,
    // and custom puzzles are practice you choose (as on chess.com).
    const rated = mode.kind === 'rated'
    const after = rated ? ratePuzzle(progress.rating, puzzle.rating, clean) : progress.rating
    // Rated results also count towards how you do in each theme.
    const themeStats = rated ? recordThemes(progress.themeStats, puzzle.themes, clean) : progress.themeStats
    const updated = { ...progress, rating: after, seen: [...progress.seen, puzzle.id], themeStats }
    setProgress(updated)
    updatePuzzleProgress((saved) => ({
      ...(saved ?? updated),
      rating: after,
      seen: [...(saved?.seen ?? []), puzzle.id].slice(-3000),
      themeStats: rated ? recordThemes(saved?.themeStats, puzzle.themes, clean) : saved?.themeStats,
    })).catch(() => undefined)
    setResult({ solved: clean, change: Math.round(after.rating - progress.rating.rating) })
    onSolved(clean, mode.kind === 'daily')
  }

  const title =
    mode.kind === 'daily' ? 'Daily puzzle' : mode.kind === 'custom' ? (mode.themes.length === 1 ? themeLabel(mode.themes[0]) : 'Custom puzzles') : 'Puzzles'
  const rated = mode.kind === 'rated'

  return (
    <main className="fc-page fc-puzzle-run">
      <header className="fc-run-head">
        <button type="button" className="fc-back" onClick={onBack}>
          <BackIcon size={22} /> Puzzles
        </button>
        <strong>{title}</strong>
        {progress && rated && <span className="fc-rating-tag">{Math.round(progress.rating.rating)}</span>}
      </header>
      {failed ? (
        <p className="fc-muted">The puzzles couldn’t load. Are you offline?</p>
      ) : !bank || !puzzle ? (
        <p className="fc-muted">Finding a puzzle…</p>
      ) : (
        <>
          <PuzzleTrainer key={puzzle.id} puzzle={puzzle} onFinished={finished} focus={mode.kind === 'custom' ? mode.themes : []} />
          {result && (
            <div className={`fc-puzzle-result ${result.solved ? 'solved' : 'missed'}`}>
              <strong>{result.solved ? 'Solved!' : 'Not this time'}</strong>
              {rated && (
                <span>
                  {result.change >= 0 ? '+' : ''}
                  {result.change}
                </span>
              )}
              {mode.kind === 'daily' ? (
                <button type="button" className="fc-primary" onClick={onBack}>
                  Done
                </button>
              ) : (
                <button type="button" className="fc-primary" onClick={() => progress && next(bank, progress)}>
                  Next puzzle
                </button>
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
