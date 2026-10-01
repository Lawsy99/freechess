import { describe, expect, it } from 'vitest'
import { NEW_PROFILE, type Profile } from './profile'
import { cleanCode, mergeCards, mergeGames, mergeProfiles, newSyncCode, showCode } from './syncMerge'
import type { MistakeCard } from './mistakesDeck'

const profile = (over: Partial<Profile>): Profile => ({ ...NEW_PROFILE, ...over })

describe('combining two devices', () => {
  it('keeps everything earned on either, and "now" from the newest', () => {
    const phone = profile({
      updatedAt: 200,
      rating: { rating: 950, deviation: 100, volatility: 0.06 },
      ratingHistory: [{ at: 1, rating: 900 }, { at: 150, rating: 950 }],
      stars: { ada: 3, kofi: 1 },
      lessonsDone: ['rules', 'free-pieces'],
      legends: { morphy: 2 },
      streak: { count: 4, lastDay: '2026-10-01', best: 4 },
      rushBest: 12,
    })
    const laptop = profile({
      updatedAt: 100,
      rating: { rating: 910, deviation: 120, volatility: 0.06 },
      ratingHistory: [{ at: 1, rating: 900 }, { at: 90, rating: 910 }],
      stars: { kofi: 2, mei: 3 },
      lessonsDone: ['rules', 'forks'],
      legends: { morphy: 1, capablanca: 3 },
      streak: { count: 2, lastDay: '2026-09-30', best: 6 },
      rushBest: 15,
    })
    const m = mergeProfiles(phone, laptop)!
    expect(m.rating?.rating).toBe(950)
    expect(m.ratingHistory.map((r) => r.at)).toEqual([1, 90, 150])
    expect(m.stars).toEqual({ ada: 3, kofi: 2, mei: 3 })
    expect(new Set(m.lessonsDone)).toEqual(new Set(['rules', 'free-pieces', 'forks']))
    expect(m.legends).toEqual({ morphy: 2, capablanca: 3 })
    expect(m.streak).toEqual({ count: 4, lastDay: '2026-10-01', best: 6 })
    expect(m.rushBest).toBe(15)
  })

  it('combines today’s goals from both devices', () => {
    const a = profile({ updatedAt: 2, daily: { day: '2026-10-01', done: ['lesson'] } })
    const b = profile({ updatedAt: 1, daily: { day: '2026-10-01', done: ['bot', 'lesson'] } })
    expect(new Set(mergeProfiles(a, b)!.daily.done)).toEqual(new Set(['lesson', 'bot']))
  })

  it('keeps every game, preferring the analysed copy', () => {
    const merged = mergeGames([{ id: 'g1' }, { id: 'g2' }], [{ id: 'g2', evals: [1] }, { id: 'g3' }])
    expect(merged.map((g) => g.id).sort()).toEqual(['g1', 'g2', 'g3'])
    expect(merged.find((g) => g.id === 'g2')?.evals).toEqual([1])
  })

  it('keeps every mistake, preferring the played copy', () => {
    const card = (retired: boolean) => ({ id: 'g1:4', retired }) as MistakeCard
    expect(mergeCards([card(false)], [card(true)])[0].retired).toBe(true)
    expect(mergeCards([card(true)], [card(false)])[0].retired).toBe(true)
  })

  it('makes long codes that are easy to type', () => {
    const code = newSyncCode()
    expect(code).toMatch(/^[A-HJ-NP-Z2-9]{24}$/)
    expect(showCode('ABCDEFGHJKLM')).toBe('ABCD-EFGH-JKLM')
    expect(cleanCode(' abcd-efgh jklm ')).toBe('ABCDEFGHJKLM')
  })
})
