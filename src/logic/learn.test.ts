import { describe, expect, it } from 'vitest'
import { ALL_LESSONS, LEARN_PATH } from '../data/learnPath'
import { isOpen, lessonPuzzleRating, nextLesson, roundPassed } from './learn'

describe('the Learn path', () => {
  it('opens one lesson at a time, in order', () => {
    const [first, second, third] = ALL_LESSONS
    expect(nextLesson([])?.id).toBe(first.id)
    expect(isOpen(first.id, [])).toBe(true)
    expect(isOpen(second.id, [])).toBe(false)
    expect(isOpen(second.id, [first.id])).toBe(true)
    expect(isOpen(third.id, [first.id])).toBe(false)
    expect(nextLesson(ALL_LESSONS.map((l) => l.id))).toBeNull()
  })

  it('is mostly doing: every lesson has more hands-on steps than reading', () => {
    for (const lesson of ALL_LESSONS) {
      const reading = lesson.steps.filter((s) => s.kind === 'idea').length
      expect(lesson.steps.length - reading).toBeGreaterThanOrEqual(1)
      expect(reading).toBeLessThanOrEqual(1)
    }
    expect(LEARN_PATH.length).toBe(9)
  })

  it('passes a round with enough clean solves, pitched around your level', () => {
    expect(roundPassed(4, 4)).toBe(true)
    expect(roundPassed(3, 4)).toBe(false)
    expect(lessonPuzzleRating(500, -200)).toBe(400)
    expect(lessonPuzzleRating(1400, -200)).toBe(1200)
  })

  it('uses only drills that exist', async () => {
    const { ENDGAME_DRILLS } = await import('../data/endgameDrills')
    const { OPENING_DRILLS } = await import('../data/openingLessons')
    for (const lesson of ALL_LESSONS)
      for (const step of lesson.steps) {
        if (step.kind === 'endgame') expect(ENDGAME_DRILLS[step.drill]).toBeDefined()
        if (step.kind === 'opening') expect(OPENING_DRILLS[step.drill]).toBeDefined()
      }
  })
})
