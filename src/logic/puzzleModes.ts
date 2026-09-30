// FreeChess puzzle modes (Sep 2026): the daily puzzle, Puzzle Rush and theme
// practice, on top of the Lichess puzzle set (logic/puzzles.ts). Pure, so it
// can be tested on its own.
import type { Puzzle } from './puzzles'

/** The themes to practise, in the order shown, with friendly names. */
export const PUZZLE_THEMES: { id: string; label: string }[] = [
  { id: 'mateIn1', label: 'Mate in one' },
  { id: 'mateIn2', label: 'Mate in two' },
  { id: 'fork', label: 'Forks' },
  { id: 'pin', label: 'Pins' },
  { id: 'skewer', label: 'Skewers' },
  { id: 'discoveredAttack', label: 'Discovered attacks' },
  { id: 'hangingPiece', label: 'Hanging pieces' },
  { id: 'backRankMate', label: 'Back-rank mates' },
  { id: 'sacrifice', label: 'Sacrifices' },
  { id: 'pawnEndgame', label: 'Pawn endgames' },
  { id: 'rookEndgame', label: 'Rook endgames' },
  { id: 'defensiveMove', label: 'Defending' },
]

/** A small, stable hash of a string (the same day always gives the same number). */
function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * The daily puzzle: the same one for everybody on a given day, a satisfying
 * middle-strength puzzle (1300 to 1800) that isn't too long.
 */
export function dailyPuzzle(bank: readonly Puzzle[], day: string): Puzzle | null {
  const pool = bank.filter((p) => p.rating >= 1300 && p.rating <= 1800 && p.moves.length <= 6)
  return pool.length ? pool[hash(`daily:${day}`) % pool.length] : null
}

/** Puzzle Rush: three minutes, three strikes. */
export const RUSH_SECONDS = 180
export const RUSH_STRIKES = 3

/** How hard the next Rush puzzle is: starts easy, 60 points harder for each one solved. */
export function rushRating(solved: number): number {
  return 500 + solved * 60
}

/** A Rush puzzle near the target rating, not used already this run. */
export function pickRushPuzzle(bank: readonly Puzzle[], target: number, used: ReadonlySet<string>, random: () => number = Math.random): Puzzle | null {
  for (const window of [60, 120, 250, 500]) {
    const near = bank.filter((p) => !used.has(p.id) && Math.abs(p.rating - target) <= window && p.moves.length <= 6)
    if (near.length) return near[Math.floor(random() * near.length)]
  }
  return null
}
