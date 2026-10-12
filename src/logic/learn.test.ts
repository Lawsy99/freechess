import { describe, expect, it } from 'vitest'
import { ALL_LESSONS, LEARN_PATH } from '../data/learnPath'
import { isOpen, lessonPuzzleRating, nextLesson } from './learn'

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

  it('pitches positions around your level', () => {
    expect(lessonPuzzleRating(500, -200)).toBe(400)
    expect(lessonPuzzleRating(1400, -200)).toBe(1200)
  })

  it('uses only drills that exist', async () => {
    const { ENDGAME_DRILLS } = await import('../data/endgameDrills')
    const { OPENING_DRILLS } = await import('../data/openingLessons')
    for (const lesson of ALL_LESSONS)
      for (const step of lesson.steps) {
        if (step.kind === 'opening') expect(OPENING_DRILLS[step.drill]).toBeDefined()
        if (step.kind !== 'drills') continue
        const { spec } = step
        if (spec.kind === 'endgame') expect(ENDGAME_DRILLS[spec.drill]).toBeDefined()
        if (spec.kind === 'opening') expect(OPENING_DRILLS[spec.opening]).toBeDefined()
        expect(step.pass).toBeLessThanOrEqual(step.count)
      }
  })

  it('ends every lesson but the rules with drills against Maia', () => {
    for (const lesson of ALL_LESSONS) if (lesson.id !== 'rules') expect(lesson.steps.some((s) => s.kind === 'drills')).toBe(true)
  })

  it('uses only themes the puzzle bank has', async () => {
    const { THEME_GROUPS } = await import('./puzzleThemes')
    const known = new Set(THEME_GROUPS.flatMap((g) => g.themes.map((t) => t.id)))
    for (const lesson of ALL_LESSONS)
      for (const step of lesson.steps) if (step.kind === 'drills' && step.spec.kind === 'theme') expect(known.has(step.spec.theme), step.spec.theme).toBe(true)
  })
})
