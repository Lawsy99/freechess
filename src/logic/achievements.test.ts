import { describe, expect, it } from 'vitest'
import { BADGES, earned, newlyEarned } from './achievements'
import { NEW_PROFILE, recordBotGame } from './profile'
import { findBot } from '../data/bots'

describe('achievements', () => {
  it('starts with none', () => {
    expect(earned(NEW_PROFILE).size).toBe(0)
  })

  it('gives First win and Clean win for a three-star win, once', () => {
    const before = NEW_PROFILE
    const after = recordBotGame(before, findBot('ada')!, 'win', 0, new Date('2026-09-30T12:00:00')).profile
    expect(newlyEarned(before, after).map((b) => b.id)).toEqual(['first-win', 'three-stars'])
    const again = recordBotGame(after, findBot('ada')!, 'win', 0, new Date('2026-09-30T13:00:00')).profile
    expect(newlyEarned(after, again)).toEqual([])
  })

  it('shows progress towards the rest', () => {
    const regular = BADGES.find((b) => b.id === 'games-25')!
    const p = recordBotGame(NEW_PROFILE, findBot('ada')!, 'loss', 0, new Date('2026-09-30T12:00:00')).profile
    expect(regular.progress(p)).toEqual({ value: 1, target: 25 })
  })

  it('has a unique id for every badge', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length)
  })
})
