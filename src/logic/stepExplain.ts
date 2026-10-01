// The Coach's line for each move in the step-through, and the Coach's tip for
// the game (FreeChess, Sep 2026, like chess.com's coach explanations). Built
// on logic/explain.ts, which only claims what the engine's own line proves.
import { errorKind, explainBestMove, explainGoodMove, explainMistake, type ErrorKind, type MistakeFacts } from './explain'
import type { Square } from 'chess.js'
import { replay, type Colour } from './game'
import type { PositionEval, ReviewedMove } from './review'
import type { Special } from './reviewExtras'

const ERRORS = ['inaccuracy', 'mistake', 'blunder']

/** The facts explain.ts needs about one of your moves. */
function factsFor(moves: readonly string[], evals: readonly PositionEval[], m: ReviewedMove, player: Colour): MistakeFacts {
  const forPlayer = (cp: number) => (player === 'w' ? cp : -cp)
  return {
    fenBefore: m.fenBefore,
    played: m.uci,
    bestMove: m.bestMove,
    reply: evals[m.ply + 1]?.bestMove ?? null,
    cpBefore: forPlayer(evals[m.ply].cp),
    cpAfter: forPlayer(evals[m.ply + 1].cp),
    replyLine: evals[m.ply + 1]?.pv,
    bestLine: evals[m.ply].pv,
    prev: m.ply > 0 ? { fen: replay(moves.slice(0, m.ply - 1)).fen(), move: moves[m.ply - 1] } : undefined,
    actual: moves.slice(m.ply + 1),
  }
}

/**
 * What the Coach says about the move at `ply`: for your errors, what went
 * wrong and what was better; for your good moves, why they worked; for theirs,
 * only a nudge when they slipped. Null when there's nothing worth saying.
 */
export function stepExplanation(
  moves: readonly string[],
  evals: readonly PositionEval[],
  reviewed: readonly ReviewedMove[],
  ply: number,
  player: Colour,
  special?: Special,
): string | null {
  const m = reviewed[ply]
  if (!m) return null
  if (special === 'book') return 'A standard opening move, played by strong players for years.'
  if (m.mover !== player) {
    if (m.rating === 'blunder' || m.rating === 'mistake') return 'A mistake by them. Step on: did you make them pay?'
    return null
  }
  try {
    if (ERRORS.includes(m.rating)) {
      const f = factsFor(moves, evals, m, player)
      const why = explainMistake(f)
      if (!m.bestMove || /^You (missed|had|needed)/.test(why)) return why
      const better = explainBestMove(f.fenBefore, m.bestMove, f.cpBefore, f.played, f.bestLine, f.prev, f.cpAfter)
      return why.endsWith('was stronger.') ? better : `${why} Better was this: ${better}`
    }
    const good = explainGoodMove(m.fenBefore, m.uci, false, evals[m.ply].pv, moves.slice(m.ply))
    if (special === 'brilliant') return `Brilliant: you gave up material and it works. ${good}`
    if (special === 'great') return `Great move: you punished their mistake. ${good}`
    // Plain good moves early on don't need a speech.
    if (m.ply < 16 && m.rating !== 'best') return null
    return good || null
  } catch {
    return null // (never break the review over an explanation)
  }
}

// --- The Coach's tip -------------------------------------------------------------

/** What to practise for each kind of error: a Learn lesson that drills it. */
const TIPS: Partial<Record<ErrorKind, { text: (n: number) => string; lesson: string }>> = {
  undefended: { text: (n) => `${times(n)} a piece of yours was left where it could be taken for free.`, lesson: 'stay-safe' },
  'lost-material': { text: (n) => `${times(n)} a move let them win material.`, lesson: 'stay-safe' },
  fork: { text: (n) => `${times(n)} you walked into a fork.`, lesson: 'forks' },
  'allowed-mate': { text: () => 'You allowed a checkmate you could have stopped.', lesson: 'back-rank' },
  'missed-mate': { text: (n) => `${times(n)} you had a checkmate and missed it.`, lesson: 'mate-in-two' },
  'missed-win': { text: (n) => `${times(n)} you could have won material and didn't see it.`, lesson: 'free-pieces' },
  'early-queen': { text: () => 'Your queen came out early and got chased about.', lesson: 'italian' },
  'same-piece-twice': { text: () => 'You moved the same piece again while others were still at home.', lesson: 'italian' },
  'lost-castling': { text: () => 'Your king lost the right to castle.', lesson: 'italian' },
}

/** Whether their best reply takes one of your pieces (not just a pawn). */
function takesAPiece(moves: readonly string[], ply: number, reply: string | null | undefined): boolean {
  if (!reply) return false
  const chess = replay(moves.slice(0, ply + 1))
  const target = chess.get(reply.slice(2, 4) as Square)
  return !!target && target.type !== 'p' && target.color !== chess.turn()
}

function times(n: number): string {
  return n === 1 ? 'Once,' : n === 2 ? 'Twice,' : `${n} times,`
}

export type CoachTip = { text: string; lesson: string; kind: ErrorKind }

/**
 * The one thing to work on from this game: the kind of error you made most
 * (mistakes and blunders first), with the Learn lesson that practises it.
 * Null for a clean game, or errors with no lesson to point to.
 */
export function coachTip(
  moves: readonly string[],
  evals: readonly PositionEval[],
  reviewed: readonly ReviewedMove[],
  player: Colour,
  fromPly = 0,
): CoachTip | null {
  const counts = new Map<ErrorKind, number>()
  for (const kind of errorKindsIn(moves, evals, reviewed, player, fromPly)) {
    if (TIPS[kind]) counts.set(kind, (counts.get(kind) ?? 0) + 1)
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (!top) return null
  const tip = TIPS[top[0]]!
  return { kind: top[0], text: tip.text(top[1]), lesson: tip.lesson }
}

/**
 * What kind of error each of your mistakes and blunders was, in order (also
 * used across games for your training focus, logic/focus.ts).
 */
export function errorKindsIn(
  moves: readonly string[],
  evals: readonly PositionEval[],
  reviewed: readonly ReviewedMove[],
  player: Colour,
  fromPly = 0,
): ErrorKind[] {
  const kinds: ErrorKind[] = []
  for (const m of reviewed) {
    if (m.mover !== player || m.ply < fromPly || (m.rating !== 'mistake' && m.rating !== 'blunder')) continue
    try {
      let kind = errorKind(factsFor(moves, evals, m, player))
      // (A vague reason, but the punishment starts by taking one of your
      // pieces: that's losing material, and there's a lesson for it.)
      if (!TIPS[kind] && takesAPiece(moves, m.ply, evals[m.ply + 1]?.bestMove)) kind = 'lost-material'
      kinds.push(kind)
    } catch {
      // (skip a move that can't be read)
    }
  }
  return kinds
}
