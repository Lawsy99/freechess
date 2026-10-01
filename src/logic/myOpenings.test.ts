import { describe, expect, it } from 'vitest'
import { newGameRecord } from './gameRecord'
import { myOpenings } from './myOpenings'
import { parseLine } from './openingBook'
import type { PositionEval } from './review'

// Two Italians as White; in each, 4. Ng5?? hangs the knight (the engine wanted c3).
const moves = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. Ng5 Qxg5')
const evals: PositionEval[] = [
  ...Array.from({ length: 6 }, () => ({ cp: 30, bestMove: null })),
  { cp: 30, bestMove: 'c2c3', pv: ['c2c3', 'g8f6'] },
  { cp: -300, bestMove: 'd8g5', pv: ['d8g5'] },
  { cp: -310, bestMove: 'd2d4', pv: ['d2d4'] },
]
const game = (id: string, extra = {}) => ({ ...newGameRecord('w', 'char:kofi', 'bot', 300), id, moves, evals, resignedBy: 'w' as const, finishedAt: Date.now(), ...extra })

describe('your openings', () => {
  it('finds an opening you play, with your record in it', () => {
    const [mine] = myOpenings([game('a'), game('b')])
    expect(mine).toMatchObject({ key: 'italian', name: 'Italian', colour: 'w', games: 2, score: 0 })
  })

  it('drills your line with the slip put right, and a reason for every move of yours', () => {
    const drill = myOpenings([game('a'), game('b')])[0].drill!
    expect(drill.lines).toEqual(['1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3'])
    expect(drill.why.c3).toMatch(/Better than what you played/)
    for (const san of ['e4', 'Nf3', 'Bc4']) expect(drill.why[san]).toBeDefined()
  })

  it('needs at least two games of an opening', () => {
    expect(myOpenings([game('a')])).toEqual([])
  })
})
