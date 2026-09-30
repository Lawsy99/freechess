import { describe, expect, it } from 'vitest'
import { reviewMoves, type PositionEval } from './review'
import { bookLength, phaseAccuracy, phaseOf, playedLike, specialMoves } from './reviewExtras'
import { parseLine } from './openingBook'

const level = (n: number): PositionEval[] => Array.from({ length: n }, () => ({ cp: 20, bestMove: null }))

describe('review extras', () => {
  it('knows book moves while the game follows theory', () => {
    const italian = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5')
    expect(bookLength(italian)).toBe(6)
    expect(bookLength(parseLine('1. e4 e5 2. Ke2'))).toBe(2)
    expect(bookLength(parseLine('1. a4'))).toBe(0)
  })

  it('marks book moves in the review', () => {
    const moves = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. a3')
    const reviewed = reviewMoves(moves, level(moves.length + 1))
    const specials = specialMoves(reviewed)
    expect(specials.get(0)).toBe('book')
    expect(specials.get(5)).toBe('book')
    expect(specials.get(6)).toBeUndefined()
  })

  it('splits the game into opening, middlegame and endgame', () => {
    expect(phaseOf('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 0)).toBe('opening')
    expect(phaseOf('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 30)).toBe('middlegame')
    expect(phaseOf('4k3/pp3r2/8/8/8/8/PP3R2/4K3 w - - 0 1', 8)).toBe('endgame')
    const moves = parseLine('1. e4 e5 2. Nf3 Nc6')
    const acc = phaseAccuracy(reviewMoves(moves, level(5)), 'w')
    expect(acc.opening).toBe(100)
    expect(acc.endgame).toBeNull()
  })

  it('guesses a rating from accuracy, only for a real game', () => {
    expect(playedLike(80, 20)).toBe(1450)
    expect(playedLike(72.5, 20)).toBe(1100)
    expect(playedLike(99, 20)).toBe(2700)
    expect(playedLike(10, 20)).toBe(250)
    expect(playedLike(80, 4)).toBeNull()
    expect(playedLike(null, 20)).toBeNull()
  })
})

describe('settling the engine’s quick looks', () => {
  it('carries a mate seen a move later back to the move that set it up', async () => {
    const { settleEvals } = await import('./review')
    // White plays a move the engine didn't choose; the mate only shows after Black's reply.
    const evals: PositionEval[] = [
      { cp: 700, bestMove: 'g5f6' },
      { cp: 280, bestMove: 'f6d7' },
      { cp: 9998, bestMove: 'b3b8' },
    ]
    const settled = settleEvals(['b5d7', 'f6d7'], evals)
    expect(settled[1].cp).toBe(9998) // Black played the engine's move: same value
    expect(settled[0].cp).toBe(9998) // White's move was at least that good
    const graded = reviewMoves(['b5d7', 'f6d7'], settled)
    expect(graded[0].rating).toBe('best')
  })

  it('leaves a real blunder a blunder', async () => {
    const { settleEvals } = await import('./review')
    const evals: PositionEval[] = [
      { cp: 300, bestMove: 'e2e4' },
      { cp: -500, bestMove: 'd8h4' },
      { cp: -500, bestMove: null },
    ]
    const settled = settleEvals(['f2f3', 'd8h4'], evals)
    expect(settled[0].cp).toBe(300)
    expect(reviewMoves(['f2f3', 'd8h4'], settled)[0].rating).toBe('blunder')
  })
})
