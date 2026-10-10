import { describe, expect, it } from 'vitest'
import type { ReviewedMove } from './review'
import type { Special } from './reviewExtras'
import { nextStop, quietSummary, reviewStops } from './reviewStops'

/** A made-up game: ratings by ply, White to start. */
function game(ratings: ReviewedMove['rating'][]): ReviewedMove[] {
  return ratings.map((rating, ply) => ({
    ply,
    mover: ply % 2 === 0 ? 'w' : 'b',
    uci: 'e2e4',
    san: 'e4',
    fenBefore: '',
    winBefore: 0.5,
    winAfter: 0.5,
    rating,
    bestMove: null,
    accuracy: 100,
  }))
}

describe('the guided review', () => {
  // Plies 0-3 book; White (you) slips at ply 6; Black blunders at ply 9; White finds a great move at ply 10.
  const reviewed = game(['best', 'best', 'good', 'best', 'good', 'best', 'mistake', 'good', 'best', 'blunder', 'best', 'good', 'best'])
  const specials = new Map<number, Special>([
    [0, 'book'],
    [1, 'book'],
    [2, 'book'],
    [3, 'book'],
    [10, 'great'],
  ])
  const stops = reviewStops(reviewed, specials, 'w')

  it('stops at the end of the opening, your mistakes and highlights, their mistakes, and the end', () => {
    expect(stops).toEqual([
      { index: 4, reason: 'opening' },
      { index: 7, reason: 'your-error' },
      { index: 10, reason: 'their-error' },
      { index: 11, reason: 'your-highlight' },
      { index: 13, reason: 'end' },
    ])
  })

  it('goes to the next stop, or the end', () => {
    expect(nextStop(stops, 0, 13)).toBe(4)
    expect(nextStop(stops, 4, 13)).toBe(7)
    expect(nextStop(stops, 11, 13)).toBe(13)
    expect(nextStop(stops, 13, 13)).toBe(13)
  })

  it('doesn’t count their good moves as worth a stop', () => {
    expect(reviewStops(game(['best', 'good', 'best', 'inaccuracy']), new Map(), 'w')).toEqual([{ index: 4, reason: 'end' }])
  })

  it('sums up what was skipped', () => {
    expect(quietSummary(reviewed, specials, 'w', 0, 4)).toBe('Known opening moves on both sides.')
    expect(quietSummary(reviewed, specials, 'w', 4, 7)).toBe('A sound move from you on move 3.')
    expect(quietSummary(reviewed, specials, 'w', 11, 12)).toBeNull()
  })
})
