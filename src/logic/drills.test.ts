import { Chess } from 'chess.js'
import { describe, expect, it } from 'vitest'
import { ENDGAME_DRILLS } from '../data/endgameDrills'
import { OPENING_DRILLS } from '../data/openingLessons'
import { bookReply, drillState, endgameDrill, estimateRating, gradeDrill, makeDrills, openingDrill, START_FEN, summariseDrills, themeDrill } from './drills'
import type { ReviewedMove } from './review'

const move = (ply: number, mover: 'w' | 'b', rating: ReviewedMove['rating'], accuracy: number, uci = 'e2e4'): ReviewedMove => ({
  ply,
  mover,
  uci,
  san: 'e4',
  fenBefore: '',
  winBefore: 0.5,
  winAfter: rating === 'blunder' ? 0.1 : rating === 'mistake' ? 0.3 : 0.5,
  rating,
  bestMove: null,
  accuracy,
})

describe('drills', () => {
  it('sets up an opening from move 1, following its lines', () => {
    const d = openingDrill(OPENING_DRILLS.italian, 10)
    expect(d.startFen).toBe(START_FEN)
    expect(d.player).toBe('w')
    expect(d.lines!.length).toBeGreaterThan(0)
    // After 1.e4 the opponent answers from the lines (always 1...e5 in the Italian).
    expect(bookReply(d.lines!, ['e2e4'], () => 0)).toBe('e7e5')
    // Once the game leaves every line, Maia is on its own.
    expect(bookReply(d.lines!, ['d2d4'])).toBeNull()
  })

  it('sets up a puzzle position with their move already played', () => {
    const d = themeDrill({ id: 'x', fen: 'r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24', moves: ['f2g3', 'e6e7', 'b2b1'], rating: 1800, themes: ['fork'], opening: '' }, 6, 'Forks')
    expect(d.player).toBe('w')
    expect(d.keyMove).toBe('e6e7')
    expect(new Chess(d.startFen).turn()).toBe('w')
    expect(d.intro).toMatch(/6 moves/)
  })

  it('picks the finishing position for your rating', () => {
    const d = endgameDrill(ENDGAME_DRILLS['lone-king'], 600)!
    expect(d.endgame!.goal).toBe('mate')
    expect(drillState(d, d.startFen, 0).over).toBe(false)
  })

  it('ends after your moves, or when the game ends', () => {
    const d = openingDrill(OPENING_DRILLS.italian, 3)
    expect(drillState(d, START_FEN, 2).over).toBe(false)
    expect(drillState(d, START_FEN, 3).over).toBe(true)
  })

  it('passes on accuracy with no blunders, and names the costliest move', () => {
    const d = openingDrill(OPENING_DRILLS.italian, 3)
    const good = gradeDrill(d, [move(0, 'w', 'best', 100), move(1, 'b', 'good', 90), move(2, 'w', 'good', 90)], null)
    expect(good.passed).toBe(true)
    expect(good.worst).toBeNull()
    const bad = gradeDrill(d, [move(0, 'w', 'best', 100), move(1, 'b', 'good', 90), move(2, 'w', 'blunder', 20)], null)
    expect(bad.passed).toBe(false)
    expect(bad.counts.blunder).toBe(1)
    expect(bad.worst!.ply).toBe(2)
  })

  it('says whether you found the key move', () => {
    const d = { ...openingDrill(OPENING_DRILLS.italian, 3), keyMove: 'e2e4' }
    expect(gradeDrill(d, [move(0, 'w', 'best', 100, 'e2e4')], null).foundKey).toBe(true)
    expect(gradeDrill(d, [move(0, 'w', 'best', 100, 'd2d4')], null).foundKey).toBe(false)
  })

  it('estimates the rating your moves looked like', () => {
    // Moves that only strong players tend to play.
    const strong = Array.from({ length: 8 }, () => [0.05, 0.15, 0.3, 0.5, 0.7])
    const weak = strong.map((m) => [...m].reverse())
    expect(estimateRating(strong)!.rating).toBeGreaterThanOrEqual(2000)
    expect(estimateRating(weak)!.rating).toBeLessThanOrEqual(1000)
    expect(estimateRating([])).toBeNull()
  })

  it('sums up a set', () => {
    const d = openingDrill(OPENING_DRILLS.italian, 3)
    const g = gradeDrill(d, [move(0, 'w', 'best', 100)], null)
    expect(summariseDrills([g, { ...g, passed: false, accuracy: 50 }])).toEqual({ passed: 1, total: 2, accuracy: 75 })
  })

  it('makes a set from several specs, taking turns', () => {
    const p = (id: string, theme: string) => ({ id, fen: 'r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24', moves: ['f2g3', 'e6e7', 'b2b1'], rating: 1200, themes: [theme], opening: '' })
    const bank = [p('a', 'fork'), p('b', 'fork'), p('c', 'pin')]
    const set = makeDrills([{ kind: 'opening', opening: 'italian', moves: 10 }, { kind: 'theme', theme: 'fork', moves: 6 }, { kind: 'endgame', drill: 'lone-king' }], 4, { bank, puzzleRating: 1200, rating: 800 })
    expect(set.map((d) => d.id.split(':')[0])).toEqual(['italian', 'puzzle', 'endgame', 'italian'])
    // Each drill has its own id, so the same opening twice still counts as two.
    expect(new Set(set.map((d) => d.id)).size).toBe(4)
    // Not enough positions: as many as there are.
    expect(makeDrills([{ kind: 'theme', theme: 'pin', moves: 6 }], 3, { bank, puzzleRating: 1200, rating: 800 }).length).toBe(1)
  })
})
