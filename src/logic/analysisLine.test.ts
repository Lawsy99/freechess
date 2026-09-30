import { describe, expect, it } from 'vitest'
import { checkSetup, fenAt, fenOf, lineSans, placementOf, playMove, START_FEN, stepTo, type AnalysisLine } from './analysisLine'

const line = (moves: string[], cursor = moves.length): AnalysisLine => ({ startFen: START_FEN, moves, cursor })

describe('the analysis line', () => {
  it('steps forward along the line when you play its next move', () => {
    const l = playMove(line(['e2e4', 'e7e5', 'g1f3'], 1), 'e7e5')
    expect(l.moves).toEqual(['e2e4', 'e7e5', 'g1f3'])
    expect(l.cursor).toBe(2)
  })

  it('branches when you play something else part way along', () => {
    const l = playMove(line(['e2e4', 'e7e5', 'g1f3'], 1), 'c7c5')
    expect(l.moves).toEqual(['e2e4', 'c7c5'])
    expect(lineSans(l)).toEqual(['e4', 'c5'])
  })

  it('knows the position at the cursor, and stays inside the line', () => {
    expect(fenAt(line(['e2e4'], 0))).toBe(START_FEN)
    expect(fenAt(line(['e2e4'])).split(' ')[0]).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR')
    expect(stepTo(line(['e2e4']), 9).cursor).toBe(1)
    expect(stepTo(line(['e2e4']), -2).cursor).toBe(0)
  })
})

describe('setting up a position', () => {
  it('round-trips the starting position', () => {
    expect(fenOf(placementOf(START_FEN), 'w')).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  })

  it('accepts a sensible position', () => {
    const r = checkSetup({ e1: 'K', e8: 'k', d1: 'Q' }, 'w')
    expect('fen' in r && r.fen).toBe('4k3/8/8/8/8/8/8/3QK3 w - - 0 1')
  })

  it('explains what is wrong with an impossible one', () => {
    expect(checkSetup({ e1: 'K' }, 'w')).toEqual({ problem: 'Each side needs exactly one king.' })
    expect(checkSetup({ e1: 'K', e8: 'k', a8: 'P' }, 'w')).toEqual({ problem: 'Pawns can’t stand on the first or last row.' })
    // White to move, but Black is in check: impossible.
    const r = checkSetup({ e1: 'K', e8: 'k', e4: 'R' }, 'w')
    expect('problem' in r && r.problem).toMatch(/in check/)
  })
})
