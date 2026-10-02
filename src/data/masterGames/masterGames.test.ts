// The Master Games' data must match the moves exactly: a note per move, stops
// whose options are legal there (with the game's move marked), chapters on the
// board, and an engine verdict for every position.
import { Chess, type Square } from 'chess.js'
import { describe, expect, it } from 'vitest'
import { MASTER_EVALS, MASTER_GAMES, MASTER_GROUPS, MASTER_LINES } from '.'

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

      it('has chapters on the board, with arrows from real pieces', () => {
        for (const ch of game.chapters) {
          const board = new Chess(history[ch.ply - 1].after)
          // (Each arrow starts on a piece, or carries on a route from where the last one ended.)
          ;(ch.arrows ?? []).forEach((a, i, all) => {
            const route = i > 0 && all[i - 1].slice(2, 4) === a.slice(0, 2)
            expect(route || !!board.get(a.slice(0, 2) as Square), `${game.id} ${ch.ply} ${a}`).toBe(true)
            expect(a).toMatch(/^[a-h][1-8][a-h][1-8]$/)
          })
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

describe('master game lines', () => {
  for (const game of MASTER_GAMES) {
    it(`${game.id}: every line is legal from where it starts`, () => {
      const c = new Chess()
      c.loadPgn(game.pgn)
      const history = c.history({ verbose: true })
      const data = MASTER_LINES[game.id]
      expect(data, `${game.id} has no lines: run scratch/makeLines.mjs`).toBeDefined()
      const fenAt = (i: number) => (i === 0 ? new Chess().fen() : history[i - 1].after)
      for (const [note, lines] of Object.entries(data.notes)) {
        for (const line of lines) {
          // A line starts at the note's move (an alternative) or just after it (a reply).
          expect([Number(note), Number(note) + 1]).toContain(line.at)
          const b = new Chess(fenAt(line.at))
          for (const san of line.sans) b.move(san)
          // The note names the line's first move.
          expect(game.notes[Number(note)]).toContain(line.label)
        }
      }
      for (const stop of game.stops) {
        for (const o of stop.options.filter((x) => !x.best)) {
          const line = data.stops[`${stop.ply}:${o.san}`]
          expect(line?.sans[0]).toBe(o.san)
          const b = new Chess(fenAt(stop.ply))
          for (const san of line!.sans) b.move(san)
        }
      }
    })
  }
})

describe('master game groups on Learn', () => {
  it('shows every game exactly once', () => {
    const grouped = MASTER_GROUPS.flatMap((g) => g.ids).filter((id) => MASTER_GAMES.some((m) => m.id === id))
    expect(grouped.sort()).toEqual(MASTER_GAMES.map((m) => m.id).sort())
  })
})
