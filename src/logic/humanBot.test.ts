import { describe, expect, it } from 'vitest'
import { pickHumanMove } from './humanBot'

const policy = [
  { move: 'e2e4', p: 0.6 },
  { move: 'd2d4', p: 0.3 },
  { move: 'g1f3', p: 0.095 },
  { move: 'a2a4', p: 0.005 }, // almost nobody plays this
]

/** How often each move is picked, over many tries. */
function shares(plan: { maiaElo: number; temperature: number; considered: number }) {
  const counts: Record<string, number> = {}
  let seed = 1
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 20000; i++) {
    const m = pickHumanMove(policy, plan, random)!
    counts[m] = (counts[m] ?? 0) + 1
  }
  return Object.fromEntries(Object.entries(counts).map(([m, c]) => [m, c / 20000]))
}

describe('the human-style bot', () => {
  it('at temperature 1 plays moves as often as people do', () => {
    const s = shares({ maiaElo: 800, temperature: 1, considered: 50 })
    expect(s.e2e4).toBeCloseTo(0.6 / 0.995, 1)
    expect(s.d2d4).toBeCloseTo(0.3 / 0.995, 1)
  })

  it('never plays a move almost nobody would play', () => {
    expect(shares({ maiaElo: 400, temperature: 4, considered: 50 }).a2a4).toBeUndefined()
  })

  it('loosens towards the less likely moves at a higher temperature', () => {
    const plain = shares({ maiaElo: 400, temperature: 1, considered: 50 })
    const loose = shares({ maiaElo: 400, temperature: 3, considered: 50 })
    expect(loose.g1f3).toBeGreaterThan(plain.g1f3 * 1.5)
    expect(loose.e2e4).toBeLessThan(plain.e2e4)
  })

  it('only chooses among the moves it considers', () => {
    expect(Object.keys(shares({ maiaElo: 400, temperature: 2, considered: 2 })).sort()).toEqual(['d2d4', 'e2e4'])
  })

  it('handles an empty list', () => {
    expect(pickHumanMove([], { maiaElo: 800, temperature: 1, considered: 10 })).toBeNull()
  })
})
