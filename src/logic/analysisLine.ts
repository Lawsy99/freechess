// The analysis board's moves (FreeChess, Sep 2026): one line of moves from a
// starting position, and where you are in it. Playing a move part way along
// replaces what came after, as on most analysis boards. Also checks a
// position you've set up yourself before the engine looks at it.
import { Chess, validateFen } from 'chess.js'
import { applyUci } from './game'

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export type AnalysisLine = {
  /** Where the line starts. */
  startFen: string
  /** The moves from there, in UCI. */
  moves: string[]
  /** How many of them are played on the board now (0 = the start). */
  cursor: number
}

/** The position at the cursor. */
export function fenAt(line: AnalysisLine): string {
  const chess = new Chess(line.startFen)
  for (const uci of line.moves.slice(0, line.cursor)) applyUci(chess, uci)
  return chess.fen()
}

/**
 * Plays a move at the cursor. If it's the move already next in the line, just
 * steps forward (the rest of the line is kept); otherwise the line branches here.
 */
export function playMove(line: AnalysisLine, uci: string): AnalysisLine {
  if (line.moves[line.cursor] === uci) return { ...line, cursor: line.cursor + 1 }
  return { ...line, moves: [...line.moves.slice(0, line.cursor), uci], cursor: line.cursor + 1 }
}

export function stepTo(line: AnalysisLine, cursor: number): AnalysisLine {
  return { ...line, cursor: Math.max(0, Math.min(line.moves.length, cursor)) }
}

/** The moves in ordinary notation, for the move list. */
export function lineSans(line: AnalysisLine): string[] {
  const chess = new Chess(line.startFen)
  return line.moves.map((uci) => applyUci(chess, uci)?.san ?? uci)
}

// --- Setting up a position ------------------------------------------------------

/** Square → piece, as FEN letters ("K" white king, "p" black pawn). */
export type Placement = Record<string, string>

const FILES = 'abcdefgh'

export function placementOf(fen: string): Placement {
  const out: Placement = {}
  fen
    .split(' ')[0]
    .split('/')
    .forEach((row, r) => {
      let f = 0
      for (const c of row) {
        if (/\d/.test(c)) f += Number(c)
        else out[`${FILES[f++]}${8 - r}`] = c
      }
    })
  return out
}

/** The placement as a FEN, with the side to move; castling only where king and rook still stand at home. */
export function fenOf(placement: Placement, turn: 'w' | 'b'): string {
  const rows: string[] = []
  for (let r = 8; r >= 1; r--) {
    let row = ''
    let empty = 0
    for (const f of FILES) {
      const p = placement[`${f}${r}`]
      if (p) {
        row += (empty || '') + p
        empty = 0
      } else empty++
    }
    rows.push(row + (empty || ''))
  }
  const at = (sq: string, p: string) => placement[sq] === p
  const castling =
    [at('e1', 'K') && at('h1', 'R') && 'K', at('e1', 'K') && at('a1', 'R') && 'Q', at('e8', 'k') && at('h8', 'r') && 'k', at('e8', 'k') && at('a8', 'r') && 'q']
      .filter(Boolean)
      .join('') || '-'
  return `${rows.join('/')} ${turn} ${castling} - 0 1`
}

/** Checks a set-up position. Returns the FEN, or what's wrong with it in plain words. */
export function checkSetup(placement: Placement, turn: 'w' | 'b'): { fen: string } | { problem: string } {
  const pieces = Object.entries(placement)
  const count = (p: string) => pieces.filter(([, x]) => x === p).length
  if (count('K') !== 1 || count('k') !== 1) return { problem: 'Each side needs exactly one king.' }
  if (pieces.some(([sq, p]) => /p/i.test(p) && /[18]$/.test(sq))) return { problem: 'Pawns can’t stand on the first or last row.' }
  const fen = fenOf(placement, turn)
  if (!validateFen(fen).ok) return { problem: 'That position isn’t possible.' }
  // The side that just moved can't have left its own king in check.
  const flipped = new Chess(fenOf(placement, turn === 'w' ? 'b' : 'w'))
  if (flipped.inCheck()) return { problem: `${turn === 'w' ? 'Black' : 'White'}’s king is in check, but it’s ${turn === 'w' ? 'White' : 'Black'} to move.` }
  return { fen }
}
