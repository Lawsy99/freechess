import { describe, expect, it } from 'vitest'
import { trainingFocus } from './focus'
import { newGameRecord } from './gameRecord'
import { parseLine } from './openingBook'
import type { PositionEval } from './review'

// White hangs a knight to the queen on move 4 (the same game as stepExplain's test).
const moves = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. Ng5 Qxg5')
const evals: PositionEval[] = [
  ...Array.from({ length: 6 }, () => ({ cp: 30, bestMove: null })),
  { cp: 30, bestMove: 'c2c3', pv: ['c2c3', 'g8f6'] },
  { cp: -300, bestMove: 'd8g5', pv: ['d8g5'] },
  { cp: -310, bestMove: 'd2d4', pv: ['d2d4'] },
]
const game = (id: string) => ({ ...newGameRecord('w', 'char:kofi', 'bot', 300), id, moves, evals, resignedBy: 'w' as const, finishedAt: Date.now() })

describe('your training focus', () => {
  it('finds the mistake you keep making, and what practises it', () => {
    const focus = trainingFocus([game('a'), game('b')])
    expect(focus?.label).toBe('leaving pieces unprotected')
    expect(focus?.lesson).toBe('stay-safe')
    expect(focus?.count).toBe(2)
  })

  it('needs it to happen more than once', () => {
    expect(trainingFocus([game('a')])).toBeNull()
    expect(trainingFocus([])).toBeNull()
  })
})
