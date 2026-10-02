import { describe, expect, it } from 'vitest'
import { gameStory, standing } from './gameStory'
import { parseLine } from './openingBook'
import { reviewMoves, type PositionEval } from './review'

// White hangs a knight on move 4 (Ng5, taken by the queen).
const short = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. Ng5 Qxg5')
const shortEvals: PositionEval[] = [
  { cp: 30, bestMove: 'e2e4', pv: ['e2e4'] },
  { cp: 30, bestMove: 'e7e5', pv: ['e7e5'] },
  { cp: 30, bestMove: 'g1f3', pv: ['g1f3'] },
  { cp: 30, bestMove: 'b8c6', pv: ['b8c6'] },
  { cp: 30, bestMove: 'f1c4', pv: ['f1c4'] },
  { cp: 30, bestMove: 'f8c5', pv: ['f8c5'] },
  { cp: 30, bestMove: 'c2c3', pv: ['c2c3', 'g8f6'] },
  { cp: -300, bestMove: 'd8g5', pv: ['d8g5'] },
  { cp: -310, bestMove: 'd2d4', pv: ['d2d4'] },
]

describe('the story of the game', () => {
  const reviewed = reviewMoves(short, shortEvals)

  it('names your own blunder as the turning point', () => {
    const beats = gameStory({ moves: short, evals: shortEvals, reviewed, player: 'w', result: 'loss' })
    const turning = beats.find((b) => b.title === 'The turning point')
    expect(turning?.text).toMatch(/^Your move/)
    expect(turning?.text).toMatch(/knight/)
    expect(turning?.ply).toBe(6)
    expect(beats.at(-1)?.text).toBe('They kept control from there.')
  })

  it('names their blunder, whether you made it count, and when you were winning', () => {
    const beats = gameStory({ moves: short, evals: shortEvals, reviewed, player: 'b', result: 'win' })
    expect(beats.find((b) => b.title === 'The turning point')?.text).toMatch(/biggest swing of the game, in your favour.*You made it count/)
    expect(beats.at(-1)?.text).toBe('You were winning from move 4 and brought it home.')
  })

  it('sums up the opening and the plan from there', () => {
    const moves = parseLine('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2 cxd4 13. cxd4')
    const evals = [...moves.map((m) => ({ cp: 20, bestMove: m, pv: [m] })), { cp: 20, bestMove: null }]
    const beats = gameStory({ moves, evals, reviewed: reviewMoves(moves, evals), player: 'w', result: 'draw' })
    expect(beats[0]).toEqual({ title: 'The opening', text: 'After the opening you were level.' })
    expect(beats[1].title).toBe('The plan from move 11')
    expect(beats[1].text).toMatch(/b1/)
    // No swing, and never winning: nothing more to say.
    expect(beats).toHaveLength(2)
  })

  it('puts the position into words', () => {
    expect([450, 200, 60, 0, -60, -200, -450].map(standing)).toEqual([
      'winning',
      'clearly better',
      'a little better',
      'level',
      'a little worse',
      'clearly worse',
      'losing',
    ])
  })
})
