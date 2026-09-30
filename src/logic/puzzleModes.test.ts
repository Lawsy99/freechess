import { describe, expect, it } from 'vitest'
import { dailyPuzzle, pickRushPuzzle, rushRating } from './puzzleModes'
import type { Puzzle } from './puzzles'

const p = (id: string, rating: number): Puzzle => ({ id, fen: '', moves: ['a', 'b'], rating, themes: [], opening: '' })
const bank = [p('a', 900), p('b', 1400), p('c', 1500), p('d', 1700), p('e', 2200)]

describe('puzzle modes', () => {
  it('gives everyone the same daily puzzle, of middle strength', () => {
    const today = dailyPuzzle(bank, '2026-09-30')
    expect(today).toEqual(dailyPuzzle(bank, '2026-09-30'))
    expect(today!.rating).toBeGreaterThanOrEqual(1300)
    expect(today!.rating).toBeLessThanOrEqual(1800)
  })

  it('makes Puzzle Rush harder as you go, never repeating a puzzle', () => {
    expect(rushRating(0)).toBeLessThan(rushRating(10))
    expect(pickRushPuzzle(bank, 900, new Set())!.id).toBe('a')
    expect(pickRushPuzzle(bank, 900, new Set(['a']))!.id).not.toBe('a')
  })
})
