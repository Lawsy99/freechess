import { describe, expect, it } from 'vitest'
import { recordBotGame, NEW_PROFILE } from '../logic/profile'
import { findCharacter } from './characters'
import { customBot, customStyle } from './customBot'

describe('the custom bot', () => {
  it('keeps its strength in range and its style in its id', () => {
    expect(customBot(10, 'solid').rating).toBe(250)
    expect(customBot(9999, 'solid').rating).toBe(2400)
    expect(customBot(1437, 'aggressive')).toMatchObject({ id: 'custom-aggressive', rating: 1450, group: 'intermediate' })
    expect(customStyle('custom-grinding')).toBe('grinding')
    expect(customStyle('custom-nonsense')).toBeNull()
    expect(findCharacter('custom-grinding')?.style).toBe('grinding')
  })

  it('counts for your rating but earns no stars or record', () => {
    const bot = customBot(800, 'solid')
    const { profile, stars } = recordBotGame(NEW_PROFILE, bot, 'win', 0, new Date('2026-09-30T12:00:00'), false)
    expect(stars).toBe(0)
    expect(profile.stars).toEqual({})
    expect(profile.results).toEqual({})
    expect(profile.rating!.rating).toBeGreaterThan(800)
  })
})
