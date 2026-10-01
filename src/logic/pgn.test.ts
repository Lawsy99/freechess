import { describe, expect, it } from 'vitest'
import { newGameRecord } from './gameRecord'
import { parseLine } from './openingBook'
import { gamePgn } from './pgn'

describe('sharing a game', () => {
  it('writes it as PGN with names, date and result', () => {
    const game = { ...newGameRecord('b', 'char:kofi', 'bot', 300), moves: parseLine('1. f3 e5 2. g4 Qh4#'), startedAt: new Date('2026-10-01T12:00:00').getTime() }
    const pgn = gamePgn(game, 'Kofi')
    expect(pgn).toContain('[White "Kofi"]')
    expect(pgn).toContain('[Black "You"]')
    expect(pgn).toContain('[Date "2026.10.01"]')
    expect(pgn).toContain('[Result "0-1"]')
    expect(pgn).toMatch(/1\. f3 e5 2\. g4 Qh4# 0-1$/)
  })

  it('marks a resignation with the right result', () => {
    const game = { ...newGameRecord('w', 'char:kofi', 'bot', 300), moves: parseLine('1. e4 e5'), resignedBy: 'b' as const }
    expect(gamePgn(game, 'Kofi').trimEnd()).toMatch(/1-0$/)
  })
})
