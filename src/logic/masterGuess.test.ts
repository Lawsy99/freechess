import { describe, expect, it } from 'vitest'
import { gradeGuess, scorePercent } from './masterGuess'

describe('grading a guess at a master’s move', () => {
  it('gives full marks for an equally good move', () => {
    expect(gradeGuess(120, 110, 'w', 'Morphy').points).toBe(3)
  })

  it('marks a move better than the master’s', () => {
    const g = gradeGuess(50, 250, 'w', 'Morphy')
    expect(g.better).toBe(true)
    expect(g.verdict).toMatch(/more than Morphy’s/)
  })

  it('takes points off for weaker moves, and none for a blunder', () => {
    expect(gradeGuess(100, 50, 'w', 'Morphy').points).toBe(2)
    expect(gradeGuess(100, -50, 'w', 'Morphy').points).toBe(1)
    expect(gradeGuess(100, -500, 'w', 'Morphy').points).toBe(0)
  })

  it('judges from Black’s side for Black’s moves', () => {
    expect(gradeGuess(-300, 200, 'b', 'Nimzowitsch').points).toBe(0)
    expect(gradeGuess(-300, -320, 'b', 'Nimzowitsch').points).toBe(3)
  })

  it('barely minds a slip in a position that stays won', () => {
    expect(gradeGuess(900, 700, 'w', 'Morphy').points).toBeGreaterThanOrEqual(2)
  })

  it('turns points into a percentage', () => {
    expect(scorePercent(9, 4)).toBe(75)
    expect(scorePercent(0, 0)).toBe(0)
  })
})
