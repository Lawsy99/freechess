import { describe, expect, it } from 'vitest'
import { completeGoal, currentStreak, NEW_PROFILE, recordBotGame, recordCoachGame, starsFor, todaysGoals, withLevel } from './profile'

describe('stars', () => {
  it('gives three for a clean win, one fewer per takeback or hint, none for a draw or loss', () => {
    expect(starsFor(true, 0)).toBe(3)
    expect(starsFor(true, 1)).toBe(2)
    expect(starsFor(true, 2)).toBe(1)
    expect(starsFor(true, 5)).toBe(0)
    expect(starsFor(false, 0)).toBe(0)
  })
})

describe('daily goals and the streak', () => {
  it('ticks goals off for today only, and counts days in a row', () => {
    let p = completeGoal(NEW_PROFILE, 'bot', '2026-09-28')
    expect(todaysGoals(p, '2026-09-28')).toEqual(['bot'])
    expect(todaysGoals(p, '2026-09-29')).toEqual([])
    p = completeGoal(p, 'lesson', '2026-09-28')
    expect(p.streak.count).toBe(1)
    p = completeGoal(p, 'bot', '2026-09-29')
    expect(currentStreak(p, '2026-09-29')).toBe(2)
    // Still alive the next morning; gone after a missed day.
    expect(currentStreak(p, '2026-09-30')).toBe(2)
    expect(currentStreak(p, '2026-10-01')).toBe(0)
    p = completeGoal(p, 'bot', '2026-10-02')
    expect(p.streak).toEqual({ count: 1, lastDay: '2026-10-02', best: 2 })
  })

  it('carries a streak across the end of a month', () => {
    const p = completeGoal(completeGoal(NEW_PROFILE, 'bot', '2026-09-30'), 'bot', '2026-10-01')
    expect(p.streak.count).toBe(2)
  })
})

describe('a game against a bot', () => {
  it('rates it, keeps the best stars, records the result and ticks the day’s goal', () => {
    const start = withLevel(NEW_PROFILE, 'beginner', 0)
    const now = new Date(2026, 8, 30, 12)
    const win = recordBotGame(start, { id: 'kofi', rating: 300 }, 'win', 1, now)
    expect(win.stars).toBe(2)
    expect(win.profile.stars.kofi).toBe(2)
    expect(win.profile.results.kofi).toEqual({ wins: 1, losses: 0, draws: 0 })
    expect(todaysGoals(win.profile, '2026-09-30')).toEqual(['bot'])
    // A later, worse result never lowers the best stars.
    const loss = recordBotGame(win.profile, { id: 'kofi', rating: 300 }, 'loss', 0, now)
    expect(loss.profile.stars.kofi).toBe(2)
    expect(loss.profile.rating!.rating).toBeLessThan(win.profile.rating!.rating)
  })
})

describe('a game with the Coach', () => {
  it('ticks the coach goal and keeps the streak, without touching the rating', () => {
    const start = recordBotGame(NEW_PROFILE, { id: 'kofi', rating: 300 }, 'win', 0, new Date(2026, 8, 30, 9)).profile
    const after = recordCoachGame(start, new Date(2026, 8, 30, 18))
    expect(todaysGoals(after, '2026-09-30')).toEqual(['bot', 'coach'])
    expect(after.rating).toEqual(start.rating)
    expect(after.coachGames).toBe(1)
  })
})

describe('the week on Home', () => {
  it('marks the days you practised, Monday first', async () => {
    const { thisWeek, completeGoal, NEW_PROFILE } = await import('./profile')
    // Wednesday 30 September 2026.
    const wed = new Date('2026-09-30T12:00:00')
    let p = completeGoal(NEW_PROFILE, 'bot', '2026-09-28')
    p = completeGoal(p, 'lesson', '2026-09-30')
    const week = thisWeek(p, wed)
    expect(week.map((d) => d.label).join('')).toBe('MTWTFSS')
    expect(week.map((d) => d.active)).toEqual([true, false, true, false, false, false, false])
    expect(week[2].today).toBe(true)
    expect(week[3].future).toBe(true)
  })
})
