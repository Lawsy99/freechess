import { describe, expect, it } from 'vitest'
import { NEW_PROFILE, recordLegendGame } from '../logic/profile'
import { findCharacter } from './characters'
import { FACES } from './faces'
import { LEGEND_LEVELS, LEGENDS, legendLevel } from './legends'
import { OPENING_BOOKS } from './openingBooks'

const now = new Date('2026-10-01T12:00:00')

describe('chess legends', () => {
  it('each has a face, a book and a character', () => {
    for (const l of LEGENDS) {
      expect(FACES[l.id], l.id).toBeDefined()
      expect(OPENING_BOOKS[l.id], l.id).toBeDefined()
      expect(findCharacter(l.id)?.style).toBe(l.style)
    }
  })

  it('moves up a level when you beat them at their level', () => {
    const r = recordLegendGame(NEW_PROFILE, { id: 'morphy' }, LEGEND_LEVELS[0], 'win', 0, now, LEGEND_LEVELS)
    expect(r.profile.legends?.morphy).toBe(1)
    expect(r.levelUp).toEqual({ level: 2, rating: 400 })
    expect(legendLevel(1)).toBe(1)
  })

  it('stays put after a loss or a draw, and gives no stars', () => {
    const r = recordLegendGame(NEW_PROFILE, { id: 'morphy' }, LEGEND_LEVELS[0], 'loss', 0, now, LEGEND_LEVELS)
    expect(r.profile.legends?.morphy ?? 0).toBe(0)
    expect(r.levelUp).toBeNull()
    expect(r.profile.stars).toEqual({})
    expect(r.ratingChange).not.toBeNull()
  })

  it('finishes the journey at the peak', () => {
    const p = { ...NEW_PROFILE, legends: { morphy: LEGEND_LEVELS.length - 1 } }
    const r = recordLegendGame(p, { id: 'morphy' }, LEGEND_LEVELS.at(-1)!, 'win', 0, now, LEGEND_LEVELS)
    expect(r.profile.legends?.morphy).toBe(LEGEND_LEVELS.length)
    expect(r.levelUp).toBeNull()
    expect(legendLevel(LEGEND_LEVELS.length)).toBe(LEGEND_LEVELS.length - 1)
  })
})
