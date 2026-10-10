// The guided review (Joseph, Oct 2026, as chess.com's game review does it):
// "Next" plays quickly through the quiet moves and stops where there's
// something to talk about. These are the stops, as position indices (the
// position after a move: ply + 1).
import type { Colour } from './game'
import type { ReviewedMove } from './review'
import type { Special } from './reviewExtras'

export type StopReason = 'opening' | 'your-error' | 'your-highlight' | 'their-error' | 'end'

export type ReviewStop = { index: number; reason: StopReason }

const ERRORS = ['inaccuracy', 'mistake', 'blunder']

/** Where the guided review stops, in order. Always ends with the final position. */
export function reviewStops(
  reviewed: readonly ReviewedMove[],
  specials: ReadonlyMap<number, Special>,
  player: Colour,
): ReviewStop[] {
  const stops = new Map<number, StopReason>()
  // The end of the opening theory, if the game started with book moves.
  let book = 0
  while (book < reviewed.length && specials.get(reviewed[book].ply) === 'book') book++
  if (book > 0) stops.set(book, 'opening')
  for (const m of reviewed) {
    const at = m.ply + 1
    const special = specials.get(m.ply)
    if (m.mover === player) {
      if (ERRORS.includes(m.rating)) stops.set(at, 'your-error')
      else if (special === 'brilliant' || special === 'great') stops.set(at, 'your-highlight')
    } else if (m.rating === 'mistake' || m.rating === 'blunder') {
      stops.set(at, 'their-error')
    }
  }
  if (reviewed.length > 0 && !stops.has(reviewed.length)) stops.set(reviewed.length, 'end')
  return [...stops.entries()].sort((a, b) => a[0] - b[0]).map(([index, reason]) => ({ index, reason }))
}

/** The next stop after position `index` (the final position if there's none left). */
export function nextStop(stops: readonly ReviewStop[], index: number, last: number): number {
  return stops.find((s) => s.index > index)?.index ?? last
}

/**
 * What the Coach says about the quiet moves just skipped (from position
 * `from` to `to`), or null when it was one move. Your moves only count:
 * theirs were quiet too, or there'd have been a stop.
 */
export function quietSummary(reviewed: readonly ReviewedMove[], specials: ReadonlyMap<number, Special>, player: Colour, from: number, to: number): string | null {
  if (to - from <= 1) return null
  const skipped = reviewed.slice(from, to - 1)
  if (skipped.length === 0) return null
  if (skipped.every((m) => specials.get(m.ply) === 'book')) return 'Known opening moves on both sides.'
  const yours = skipped.filter((m) => m.mover === player)
  if (yours.length === 0) return null
  const first = Math.floor(skipped[0].ply / 2) + 1
  const lastNo = Math.floor(skipped[skipped.length - 1].ply / 2) + 1
  const span = first === lastNo ? `move ${first}` : `moves ${first} to ${lastNo}`
  return yours.length === 1 ? `A sound move from you on ${span}.` : `${yours.length} sound moves from you over ${span}.`
}
