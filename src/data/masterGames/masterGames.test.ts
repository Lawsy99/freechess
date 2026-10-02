// The Master Games' data must match the moves exactly: a note per move, stops
// whose options are legal there (with the game's move marked), chapters on the
// board, and an engine verdict for every position.
import { Chess } from 'chess.js'
import { describe, expect, it } from 'vitest'
import { MASTER_EVALS, MASTER_GAMES } from '.'

describe('master games', () => {
  for (const game of MASTER_GAMES) {
    describe(game.id, () => {
      const c = new Chess()
      c.loadPgn(game.pgn)
      const history = c.history({ verbose: true })

      it('has one note per move', () => {
        expect(game.notes.length).toBe(history.length)
      })

      it('ends as the result says', () => {
        if (game.ending.startsWith('Black is checkmated')) expect(c.isCheckmate() && c.turn() === 'b').toBe(true)
        expect(['1-0', '0-1', '1/2-1/2']).toContain(game.result)
      })

      it('has stops with legal options and the game move marked', () => {
        for (const stop of game.stops) {
          const board = new Chess(stop.ply === 0 ? undefined : history[stop.ply - 1].after)
          const legal = board.moves()
          for (const o of stop.options) expect(legal, `${game.id} stop ${stop.ply}: ${o.san}`).toContain(o.san)
          const best = stop.options.filter((o) => o.best)
          expect(best.map((o) => o.san)).toEqual([history[stop.ply].san])
          // Stops are for the side we watch from.
          expect(board.turn()).toBe(game.orientation[0])
        }
      })

      it('has chapters on the board', () => {
        for (const ch of game.chapters) {
          expect(ch.ply).toBeGreaterThanOrEqual(1)
          expect(ch.ply).toBeLessThanOrEqual(history.length)
        }
      })

      it('has an engine verdict for every position', () => {
        expect(MASTER_EVALS[game.id]?.length).toBe(history.length + 1)
      })

      it('uses no em dashes', () => {
        expect(JSON.stringify(game)).not.toContain('—')
      })
    })
  }
})
