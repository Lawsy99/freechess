// The review's extras (FreeChess, Sep 2026, from a look at chess.com): which
// moves were book, great or brilliant; accuracy for the opening, middlegame
// and endgame; and a rough "you played like" rating for the game.
import { Chess, type Square } from 'chess.js'
import { OPENING_BOOKS } from '../data/openingBooks'
import { OPENING_DRILLS } from '../data/openingLessons'
import { winChance } from './evaluation'
import { type Colour } from './game'
import { parseLine } from './openingBook'
import type { ReviewedMove } from './review'

export type Special = 'brilliant' | 'great' | 'book'

export const SPECIAL_LABELS: Record<Special, string> = { brilliant: 'Brilliant', great: 'Great move', book: 'Book' }
export const SPECIAL_GLYPHS: Record<Special, string> = { brilliant: '!!', great: '!', book: '' }

// --- Book ----------------------------------------------------------------------

let theory: Set<string> | null = null

/** Every known opening position, as the moves that reach it ("e2e4 e7e5 …"). */
function knownLines(): Set<string> {
  if (theory) return theory
  theory = new Set()
  // (Not Terry's: the Bongcloud is a joke, not theory.)
  const lines = Object.entries(OPENING_BOOKS)
    .filter(([id]) => id !== 'terry')
    .flatMap(([, b]) => [...b.white, ...b.black])
  const drills = Object.values(OPENING_DRILLS).flatMap((d) => d.lines)
  for (const line of [...lines, ...drills]) {
    let moves: string[]
    try {
      moves = parseLine(line)
    } catch {
      continue // (never block a review on a bad line)
    }
    for (let i = 1; i <= moves.length; i++) theory.add(moves.slice(0, i).join(' '))
  }
  return theory
}

/** How many moves from the start follow known opening theory. */
export function bookLength(moves: readonly string[]): number {
  const known = knownLines()
  let n = 0
  while (n < moves.length && known.has(moves.slice(0, n + 1).join(' '))) n++
  return n
}

// --- Great and brilliant ---------------------------------------------------------

const VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

/**
 * A piece left where it can be taken: attacked by something cheaper, or
 * attacked and undefended, without having taken something as good.
 */
function leavesPiece(fenBefore: string, uci: string): boolean {
  const chess = new Chess(fenBefore)
  let move
  try {
    move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] })
  } catch {
    return false
  }
  if (move.piece === 'p' || move.piece === 'k') return false
  if (move.captured && VALUES[move.captured] >= VALUES[move.piece]) return false
  const them = move.color === 'w' ? 'b' : 'w'
  const attackers = chess.attackers(move.to as Square, them)
  if (attackers.length === 0) return false
  const defended = chess.attackers(move.to as Square, move.color).length > 0
  return !defended || attackers.some((sq) => VALUES[chess.get(sq)!.type] < VALUES[move.piece])
}

/**
 * Book while the game is in known theory. Brilliant: the best move, giving up a
 * piece, and you're still doing well after it (not already completely winning).
 * Great: the best move that punishes their mistake just before (a plain
 * recapture doesn't count: anyone would play that).
 */
export function specialMoves(moves: readonly ReviewedMove[]): Map<number, Special> {
  const out = new Map<number, Special>()
  const book = bookLength(moves.map((m) => m.uci))
  for (const m of moves) {
    if (m.ply < book) {
      out.set(m.ply, 'book')
      continue
    }
    if (m.rating !== 'best') continue
    if (m.winAfter >= 0.5 && m.winBefore < 0.93 && leavesPiece(m.fenBefore, m.uci)) {
      out.set(m.ply, 'brilliant')
      continue
    }
    const prev = moves[m.ply - 1]
    const theirDrop = prev ? prev.winBefore - prev.winAfter : 0
    const recapture = prev && prev.uci.slice(2, 4) === m.uci.slice(2, 4)
    if (prev && theirDrop >= 0.1 && !recapture && m.winAfter >= 0.6) out.set(m.ply, 'great')
  }
  return out
}

// --- Phases ------------------------------------------------------------------

export type Phase = 'opening' | 'middlegame' | 'endgame'
export const PHASES: Phase[] = ['opening', 'middlegame', 'endgame']
export const PHASE_LABELS: Record<Phase, string> = { opening: 'Opening', middlegame: 'Middlegame', endgame: 'Endgame' }

/** The first ten moves each are the opening, unless it's already an ending. */
const OPENING_PLIES = 20
/** Queens, rooks, bishops and knights left (both sides, in points) at or below which it's an ending. */
const ENDGAME_MATERIAL = 26

function pieceMaterial(fen: string): number {
  return [...fen.split(' ')[0]].reduce((sum, c) => sum + (/[qrbn]/i.test(c) ? VALUES[c.toLowerCase()] : 0), 0)
}

export function phaseOf(fenBefore: string, ply: number): Phase {
  if (pieceMaterial(fenBefore) <= ENDGAME_MATERIAL) return 'endgame'
  return ply < OPENING_PLIES ? 'opening' : 'middlegame'
}

/** Your accuracy in each phase (a plain average), or null for a phase the game never reached. */
export function phaseAccuracy(moves: readonly ReviewedMove[], side: Colour): Record<Phase, number | null> {
  const out: Record<Phase, number | null> = { opening: null, middlegame: null, endgame: null }
  for (const phase of PHASES) {
    const accs = moves.filter((m) => m.mover === side && phaseOf(m.fenBefore, m.ply) === phase).map((m) => m.accuracy)
    if (accs.length) out[phase] = Math.round(accs.reduce((a, b) => a + b, 0) / accs.length)
  }
  return out
}

// --- Played like ---------------------------------------------------------------

/** Fewer of your moves than this and there's too little to go on. */
export const PLAYED_LIKE_MOVES = 10
/** Rating points for each point of accuracy you played above (or below) your opponent. */
const POINTS_PER_ACCURACY = 12
/** How far from the opponent's rating accuracy alone can take it. */
const ACCURACY_REACH = 300
const RESULT_POINTS = { win: 75, draw: 0, loss: -75 }
/** Never more than this far from the opponent's rating: one game only says so much. */
const MAX_FROM_OPPONENT = 400

/**
 * A rough rating for how you played this game (Joseph, Sep 2026: from accuracy
 * alone it said 2400 for an 800 player, because accuracy runs high against weak
 * opponents who hand you easy positions). So it starts from the opponent's
 * rating and moves with how much more (or less) accurately you played than
 * them, and the result, never more than 400 away. To the nearest 50; null for
 * a game too short to judge, or with no rating to start from.
 */
export function playedLike(g: {
  yours: number | null
  theirs: number | null
  opponentRating: number | undefined
  result: 'win' | 'draw' | 'loss'
  yourMoves: number
}): number | null {
  if (g.yours === null || g.theirs === null || g.opponentRating === undefined || g.yourMoves < PLAYED_LIKE_MOVES) return null
  const fromAccuracy = Math.max(-ACCURACY_REACH, Math.min(ACCURACY_REACH, (g.yours - g.theirs) * POINTS_PER_ACCURACY))
  const raw = g.opponentRating + fromAccuracy + RESULT_POINTS[g.result]
  const kept = Math.max(g.opponentRating - MAX_FROM_OPPONENT, Math.min(g.opponentRating + MAX_FROM_OPPONENT, raw))
  return Math.max(100, Math.min(2800, Math.round(kept / 50) * 50))
}

// --- The graph -------------------------------------------------------------------

/** Your winning chances (0–1) at every position of the game, for the graph. */
export function winPoints(evals: readonly { cp: number }[], side: Colour): number[] {
  return evals.map((e) => winChance({ type: 'cp', value: side === 'w' ? e.cp : -e.cp }))
}
