import { describe, expect, it } from 'vitest'
import { ALL_LESSONS } from '../data/learnPath'
import { parseLine } from './openingBook'
import { reviewMoves, type PositionEval } from './review'
import { coachTip, stepExplanation } from './stepExplain'

// A short Italian where White blunders a knight on move 4 (Ng5, taken by the queen).
const moves = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. Ng5 Qxg5')

// White's 4. Ng5 hangs the knight to the queen: evaluations say so.
const evals: PositionEval[] = [
  { cp: 30, bestMove: 'e2e4', pv: ['e2e4'] },
  { cp: 30, bestMove: 'e7e5', pv: ['e7e5'] },
  { cp: 30, bestMove: 'g1f3', pv: ['g1f3'] },
  { cp: 30, bestMove: 'b8c6', pv: ['b8c6'] },
  { cp: 30, bestMove: 'f1c4', pv: ['f1c4'] },
  { cp: 30, bestMove: 'f8c5', pv: ['f8c5'] },
  { cp: 30, bestMove: 'c2c3', pv: ['c2c3', 'g8f6'] },
  { cp: -300, bestMove: 'd8g5', pv: ['d8g5'] },
  { cp: -310, bestMove: 'd2d4', pv: ['d2d4'] },
]

describe('the Coach in the step-through', () => {
  const reviewed = reviewMoves(moves, evals)

  it('explains a blunder and what was better', () => {
    const text = stepExplanation(moves, evals, reviewed, 6, 'w')
    expect(reviewed[6].rating).toBe('blunder')
    expect(text).toMatch(/knight/)
    expect(text).toMatch(/Better was this/)
  })

  it('calls book moves book, and nudges at their mistakes only', () => {
    expect(stepExplanation(moves, evals, reviewed, 0, 'w', 'book')).toMatch(/standard opening move/)
    expect(stepExplanation(moves, evals, reviewed, 1, 'w')).toBeNull()
  })

  it('gives one tip for the game, pointing to a real lesson', () => {
    const tip = coachTip(moves, evals, reviewed, 'w')
    expect(tip).not.toBeNull()
    expect(ALL_LESSONS.some((l) => l.id === tip!.lesson)).toBe(true)
    expect(coachTip(moves, evals, reviewed, 'b')).toBeNull()
  })
})
