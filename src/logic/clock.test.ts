import { describe, expect, it } from 'vitest'
import { afterMove, botPauseCap, formatClock, startClock } from './clock'

describe('clocks', () => {
  it('starts each side with the same time, or none', () => {
    expect(startClock('none')).toBeUndefined()
    expect(startClock('5')).toEqual({ w: 300_000, b: 300_000, incrementMs: 0 })
    expect(startClock('3+2')).toEqual({ w: 180_000, b: 180_000, incrementMs: 2000 })
  })

  it('takes off the time used, then adds the increment', () => {
    const c = afterMove(startClock('3+2')!, 'w', 10_000)
    expect(c.w).toBe(172_000)
    expect(c.b).toBe(180_000)
  })

  it('never goes below nothing, and no increment once out of time', () => {
    expect(afterMove({ w: 1000, b: 1000, incrementMs: 2000 }, 'b', 5000).b).toBe(0)
  })

  it('shows minutes and seconds, and tenths when short', () => {
    expect(formatClock(299_000)).toBe('4:59')
    expect(formatClock(61_000)).toBe('1:01')
    expect(formatClock(9_450)).toBe('0:09.4')
    expect(formatClock(-5)).toBe('0:00.0')
  })

  it('makes bots hurry when short of time', () => {
    expect(botPauseCap(undefined)).toBe(Infinity)
    expect(botPauseCap(400_000)).toBe(10_000)
    expect(botPauseCap(2_000)).toBe(150)
  })
})

describe('running out of time', () => {
  it('loses the game, or draws if the other side has only a king', async () => {
    const { newGameRecord, outcomeOf, withFlag, withTimedMove } = await import('./gameRecord')
    const { startClock: start } = await import('./clock')
    const game = { ...newGameRecord('w', 'char:kofi', 'bot', 300), clock: start('5') }
    const moved = withTimedMove(game, 'e2e4', 12_000)
    expect(moved.clock!.w).toBe(288_000)
    expect(outcomeOf(withFlag(moved, 'b'))).toEqual({ winner: 'w', reason: 'timeout' })
    expect(outcomeOf(withFlag(game, 'w'))).toEqual({ winner: 'b', reason: 'timeout' })
    // An untimed game can't be lost on time.
    expect(withFlag(newGameRecord('w', 'char:kofi', 'bot', 300), 'w').flaggedBy).toBeUndefined()
  })
})
