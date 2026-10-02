// "Guess the move" in the Master Games (Oct 2026): you play the winner's
// moves before you see them, and the engine grades each guess against the
// move actually played. Graded on winning chances, as Lichess grades accuracy,
// so a small slip in a won position costs little and a blunder costs a lot.
import { winChance } from './evaluation'

export const POINTS_PER_MOVE = 3

export type GuessGrade = {
  points: number
  /** The verdict in a few words. */
  verdict: string
  /** Better than the game move by the engine's count. */
  better: boolean
}

/** Winning chances (0 to 1) for `side` from a centipawn score stored from White's side. */
export function chancesFor(cpWhite: number, side: 'w' | 'b'): number {
  const cp = side === 'w' ? cpWhite : -cpWhite
  return winChance({ type: 'cp', value: Math.max(-1000, Math.min(1000, cp)) })
}

/**
 * How good a guess was next to the game move, both scored (from White's
 * side) in the position after the move. `master` names the player, for the
 * verdict.
 */
export function gradeGuess(gameCp: number, guessCp: number, side: 'w' | 'b', master: string): GuessGrade {
  const loss = chancesFor(gameCp, side) - chancesFor(guessCp, side)
  if (loss <= -0.04) return { points: POINTS_PER_MOVE, verdict: `The engine likes your move even more than ${master}’s.`, better: true }
  if (loss <= 0.03) return { points: 3, verdict: `Not the move played, but just as good by the engine’s count.`, better: false }
  if (loss <= 0.06) return { points: 2, verdict: `A good move, a little weaker than ${master}’s.`, better: false }
  if (loss <= 0.15) return { points: 1, verdict: `Playable, but clearly weaker than ${master}’s move.`, better: false }
  return { points: 0, verdict: `A real mistake: the engine says it gives away a lot.`, better: false }
}

/** Your score as a percentage of the most you could have got. */
export function scorePercent(points: number, guesses: number): number {
  return guesses === 0 ? 0 : Math.round((points / (guesses * POINTS_PER_MOVE)) * 100)
}
