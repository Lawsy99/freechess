import { describe, expect, it } from 'vitest'
import { insights, scorePercent } from './insights'
import { newGameRecord } from './gameRecord'
import { parseLine } from './openingBook'

// Scholar's mate: White wins in 7 plies.
const SCHOLAR = parseLine('1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7#')
const ITALIAN_WIN = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 d6 6. O-O O-O 7. h3 h6')

function game(moves: string[], colour: 'w' | 'b', levelId: string, extra: object = {}) {
  return { ...newGameRecord(colour, levelId, 'bot', 800), moves, finishedAt: Date.now(), ...extra }
}

describe('insights', () => {
  it('tallies results by colour, bot games only', () => {
    const i = insights([
      game(SCHOLAR, 'w', 'char:kofi'),
      game(SCHOLAR, 'b', 'char:kofi'),
      game(SCHOLAR, 'w', 'char:coach'), // a lesson, not a result
      game(parseLine('1. e4'), 'w', 'char:kofi'), // unfinished
    ])
    expect(i.results).toEqual({ games: 2, wins: 1, draws: 0, losses: 1 })
    expect(i.asWhite.wins).toBe(1)
    expect(i.asBlack.losses).toBe(1)
    expect(scorePercent(i.results)).toBe(50)
  })

  it('groups your openings by colour', () => {
    const resigned = game(ITALIAN_WIN, 'w', 'char:kofi', { resignedBy: 'b' })
    const i = insights([resigned, { ...resigned, id: 'x' }])
    expect(i.openings[0]).toMatchObject({ key: 'italian', name: 'Italian', colour: 'w', games: 2, wins: 2 })
  })

  it('uses only engine-checked games for accuracy', () => {
    const plain = game(ITALIAN_WIN, 'w', 'char:kofi', { resignedBy: 'b' })
    expect(insights([plain]).analysed).toBe(0)
    const evals = Array.from({ length: ITALIAN_WIN.length + 1 }, () => ({ cp: 30, bestMove: null }))
    const checked = insights([{ ...plain, evals }])
    expect(checked.analysed).toBe(1)
    expect(checked.averageAccuracy).toBe(100)
    expect(checked.blundersPerGame).toBe(0)
    expect(checked.phases.opening).toBe(100)
  })
})
