// The engine side of drills (FreeChess, Oct 2026): for "your moves looked
// like", how likely Maia thought players of each rating were to play each of
// your moves. Runs in Maia's background worker, one position at a time.
import { getMaia } from './maia/maia'

/**
 * For each of your moves (the position it was played in, and the move), the
 * chance a player of each rating would play it. Null if cancelled or Maia
 * isn't available.
 */
export async function moveLikelihoods(
  yourMoves: readonly { fen: string; uci: string }[],
  ratings: readonly number[],
  isCancelled: () => boolean,
): Promise<number[][] | null> {
  const out: number[][] = []
  try {
    for (const { fen, uci } of yourMoves) {
      const row: number[] = []
      for (const r of ratings) {
        if (isCancelled()) return null
        const { policy } = await getMaia().predict(fen, r, r)
        row.push(policy.find((m) => m.move === uci)?.p ?? 0)
      }
      out.push(row)
    }
  } catch {
    return null
  }
  return out
}
