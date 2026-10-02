import { describe, expect, it } from 'vitest'
import { BOTS } from '../data/bots'
import { botPlan, LADDER } from './botStrength'

describe('bot strength', () => {
  it('has a ladder that only gets stronger', () => {
    for (let i = 1; i < LADDER.length; i++) expect(LADDER[i].strength).toBeGreaterThan(LADDER[i - 1].strength)
  })

  it('changes one setting at a time between neighbouring rungs', () => {
    for (let i = 1; i < LADDER.length; i++) {
      const [a, b] = [LADDER[i - 1], LADDER[i]]
      const changed = [a.maiaElo !== b.maiaElo, a.temperature !== b.temperature || a.considered !== b.considered].filter(Boolean)
      expect(changed.length, `rungs ${i - 1} and ${i}`).toBeLessThanOrEqual(1)
    }
  })

  it('plays a rung exactly at its measured strength', () => {
    for (const { strength, ...settings } of LADDER) {
      const plan = botPlan(strength)
      expect(plan.maiaElo).toBe(settings.maiaElo)
      expect(plan.temperature).toBe(settings.temperature)
      expect(plan.considered).toBe(settings.considered)
      expect(!!plan.includeRare).toBe(!!settings.includeRare)
      expect(plan.check).toEqual(settings.check)
      expect(plan.checkChance ?? 0).toBeCloseTo(settings.check ? (settings.checkChance ?? 1) : 0)
    }
  })

  it('blends between rungs', () => {
    const [a, b] = [LADDER[3], LADDER[4]]
    const mid = botPlan((a.strength + b.strength) / 2)
    expect(mid.maiaElo).toBeGreaterThan(Math.min(a.maiaElo, b.maiaElo) - 1)
    expect(mid.maiaElo).toBeLessThan(Math.max(a.maiaElo, b.maiaElo) + 1)
  })

  it('covers every bot in the app', () => {
    const ratings = BOTS.map((b) => b.rating)
    // (Random moves measure about 230 too: nothing plays weaker, so the few bots
    // rated below the floor play at it.)
    expect(Math.min(...ratings)).toBeGreaterThanOrEqual(LADDER[0].strength - 130)
    expect(Math.max(...ratings)).toBeLessThanOrEqual(LADDER[LADDER.length - 1].strength + 1)
  })
})
