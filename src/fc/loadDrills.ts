// Setting up a set of drills (FreeChess, Oct 2026): loads the puzzle bank
// when tactics positions are wanted, pitches them from your puzzle rating,
// leaves out ones you've seen, and marks the chosen ones as seen.
import { loadPuzzleBank } from '../engine/puzzleBank'
import { makeDrills, type Drill, type DrillSpec } from '../logic/drills'
import { lessonPuzzleRating } from '../logic/learn'
import { themeLabel } from '../logic/puzzleThemes'
import { loadPuzzleProgress, updatePuzzleProgress } from '../storage/db'

/** `count` drills from the specs, for a player of `playerRating`; tactics positions `offset` from your puzzle rating. */
export async function loadDrills(specs: readonly DrillSpec[], count: number, playerRating: number, offset = 0): Promise<Drill[]> {
  const themed = specs.some((s) => s.kind === 'theme')
  const [bank, progress] = themed ? await Promise.all([loadPuzzleBank(), loadPuzzleProgress()]) : [[], null]
  const puzzleRating = lessonPuzzleRating(progress ? progress.rating.rating : playerRating, offset)
  const drills = makeDrills(specs, count, { bank, puzzleRating, rating: playerRating, seen: new Set(progress?.seen ?? []) }, (s) =>
    s.kind === 'theme' ? themeLabel(s.theme) : '',
  )
  const used = drills.flatMap((d) => (d.id.startsWith('puzzle:') ? [d.id.slice('puzzle:'.length)] : []))
  if (used.length) updatePuzzleProgress((saved) => (saved ? { ...saved, seen: [...saved.seen, ...used].slice(-3000) } : saved)).catch(() => undefined)
  return drills
}
