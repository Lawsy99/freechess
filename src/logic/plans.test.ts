import { describe, expect, it } from 'vitest'
import { replay } from './game'
import { parseLine } from './openingBook'
import { planFor, planIdeas, planMoment } from './plans'

const after = (line: string) => replay(parseLine(line)).fen()
const kinds = (fen: string, side: 'w' | 'b') => planIdeas(fen, side).map((i) => i.kind)

describe('the big picture', () => {
  it('has nothing to say at the start', () => {
    expect(planFor(after(''), 'w')).toBeNull()
  })

  it('sees a king caught in the centre (the Opera Game after 9…b5)', () => {
    const fen = after('1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5')
    expect(kinds(fen, 'w')).toContain('attack-centre-king')
    expect(kinds(fen, 'b')).toContain('castle')
  })

  it('says to finish developing when pieces are still at home', () => {
    const fen = after('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5')
    const develop = planIdeas(fen, 'w').find((i) => i.kind === 'develop')
    expect(develop?.text).toMatch(/knight on b1 and bishop on c1/)
  })

  it('says to swap when ahead and to keep pieces when behind', () => {
    // White has an extra rook.
    const fen = 'r5k1/5ppp/8/8/8/8/5PPP/R5KR w - - 0 30'
    expect(planFor(fen, 'w')?.kind).toBe('ahead')
    expect(kinds(fen, 'b')).toContain('behind')
  })

  it('brings the king in for an ending, and pushes a passed pawn', () => {
    const fen = '8/5k2/8/3P4/8/8/r5PP/3R2K1 w - - 0 40'
    expect(kinds(fen, 'w')).toEqual(expect.arrayContaining(['king-active', 'passed']))
    expect(kinds(fen, 'b')).toContain('blockade')
  })
})

describe('the Coach’s big-picture moments', () => {
  const middlegame = after('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5')

  it('speaks once the opening is over, and only once', () => {
    const m = planMoment(middlegame, 'w', 20, false, [])
    expect(m?.kind).toBe('middlegame')
    expect(m?.text).toMatch(/^The opening’s done, so here’s the big picture\. Finish developing/)
    expect(planMoment(middlegame, 'w', 20, false, [{ kind: 'middlegame', idea: m!.idea }])).toBeNull()
  })

  it('never speaks in the middle of a trade', () => {
    expect(planMoment(middlegame, 'w', 20, true, [])).toBeNull()
  })

  it('marks the ending', () => {
    const m = planMoment('8/5k2/8/3P4/8/8/r5PP/3R2K1 w - - 0 40', 'w', 78, false, [{ kind: 'middlegame', idea: 'develop' }])
    expect(m?.kind).toBe('ending')
  })
})
