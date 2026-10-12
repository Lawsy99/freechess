import { describe, expect, it } from 'vitest'
import { BOTS } from '../data/bots'
import { maiaSetting, MAIA_MAX, MAIA_MIN, standInRating } from './botStrength'

describe('bot strength', () => {
  it('plays every bot as Maia at its own rating', () => {
    for (const b of BOTS) expect(maiaSetting(b.rating)).toBe(b.rating)
  })

  it('keeps Maia inside the ratings it knows', () => {
    expect(maiaSetting(20)).toBe(MAIA_MIN)
    expect(maiaSetting(3000)).toBe(MAIA_MAX)
  })

  it('sets the stand-in bot lower, since it plays above its setting', () => {
    expect(standInRating(1315)).toBe(700)
    expect(standInRating(500)).toBe(100)
    expect(standInRating(2000)).toBe(800)
  })
})
