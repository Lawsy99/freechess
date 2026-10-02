// The story of the game (FreeChess, Oct 2026: "the coach needs the big
// picture"): a few lines at the top of the review that say how the game went,
// the way a coach would sum it up. How the opening went, the plan from there,
// the turning point and how it ended. Built only from the engine's verdicts
// and the board, so it never claims more than the analysis shows.
import { Chess } from 'chess.js'
import { applyUci, replay, type Colour } from './game'
import { moveLabel } from './mistakeCards'
import { planFor } from './plans'
import type { PositionEval, ReviewedMove } from './review'
import { stepExplanation } from './stepExplain'

export type StoryBeat = {
  title: string
  text: string
  /** The move (its ply) to see in the step-through, if there is one. */
  ply?: number
}

type Input = {
  moves: readonly string[]
  evals: readonly PositionEval[]
  reviewed: readonly ReviewedMove[]
  player: Colour
  result: 'win' | 'draw' | 'loss'
  /** Where this game's own moves start (a retry copies the first ones). */
  startPly?: number
}

/** Where the opening is over, for the summary. */
const OPENING_PLIES = 20
/** A win-chance swing this big makes a move the turning point. */
const TURNING_SWING = 0.2
/** Clearly winning, in centipawns. */
const WINNING = 300

/** How the position stood for you, in words. */
export function standing(cp: number): string {
  if (cp >= 400) return 'winning'
  if (cp >= 150) return 'clearly better'
  if (cp >= 50) return 'a little better'
  if (cp > -50) return 'level'
  if (cp > -150) return 'a little worse'
  if (cp > -400) return 'clearly worse'
  return 'losing'
}

const moveNo = (ply: number) => Math.floor(ply / 2) + 1

/** The first position from `from` on that isn't in the middle of a trade (the last move wasn't a capture). */
function settledPly(moves: readonly string[], from: number): number {
  const history = replay(moves).history({ verbose: true })
  for (let p = from; p <= Math.min(moves.length, from + 6); p++) {
    if (p === 0 || !history[p - 1].captured) return p
  }
  return from
}

export function gameStory({ moves, evals, reviewed, player, result, startPly = 0 }: Input): StoryBeat[] {
  const beats: StoryBeat[] = []
  if (evals.length !== moves.length + 1) return beats
  const mine = (cp: number) => (player === 'w' ? cp : -cp)
  const cpAt = (ply: number) => mine(evals[ply].cp)

  // The opening, and the plan from there (not for a retry, which starts mid-game).
  if (startPly === 0 && moves.length >= OPENING_PLIES + 4) {
    const at = settledPly(moves, OPENING_PLIES)
    beats.push({ title: 'The opening', text: `After the opening you were ${standing(cpAt(at))}.` })
    const fen = replay(moves.slice(0, at)).fen()
    const plan = planFor(fen, player)
    if (plan) beats.push({ title: `The plan from move ${moveNo(at)}`, text: plan.text })
  }

  // The turning point: the move that swung the game most.
  const swing = (m: ReviewedMove) => m.winBefore - m.winAfter
  const turning = reviewed.filter((m) => m.ply >= startPly).sort((a, b) => swing(b) - swing(a))[0]
  if (turning && swing(turning) >= TURNING_SWING) {
    const label = moveLabel({ fenBefore: turning.fenBefore, uci: turning.uci, ply: turning.ply, rating: turning.rating })
    if (turning.mover === player) {
      const why = stepExplanation(moves, evals, reviewed, turning.ply, player)
      beats.push({ title: 'The turning point', text: `Your move ${label}. ${why ?? ''}`.trim(), ply: turning.ply })
    } else {
      // Did you make them pay? Your next move, judged by how much of their gift you kept.
      const next = reviewed[turning.ply + 1]
      const kept = next && next.mover === player ? next.rating === 'best' || next.rating === 'good' : null
      const better = turning.bestMove ? applyUci(new Chess(turning.fenBefore), turning.bestMove)?.san : null
      const tail =
        kept === null ? '' : kept ? ' You made it count.' : ' You didn’t take the chance straight away: step through to find what was there.'
      beats.push({
        title: 'The turning point',
        text: `Their move ${label} was the biggest swing of the game, in your favour${better ? ` (${better} was their best)` : ''}.${tail}`,
        ply: turning.ply,
      })
    }
  }

  // How it ended, measured against the best and worst you stood.
  const own = evals.slice(startPly + 1).map((e, i) => ({ ply: startPly + 1 + i, cp: mine(e.cp) }))
  const firstWinning = own.find((p) => p.cp >= WINNING)
  const firstLosing = own.find((p) => p.cp <= -WINNING)
  if (result === 'win' && firstLosing && firstLosing.ply < (firstWinning?.ply ?? Infinity)) {
    beats.push({ title: 'How it ended', text: `A comeback: you were losing after move ${moveNo(firstLosing.ply - 1)} and turned it round.`, ply: firstLosing.ply - 1 })
  } else if (result === 'win' && firstWinning) {
    beats.push({ title: 'How it ended', text: `You were winning from move ${moveNo(firstWinning.ply - 1)} and brought it home.` })
  } else if (result !== 'win' && firstWinning) {
    beats.push({
      title: 'How it ended',
      text: `You were winning after move ${moveNo(firstWinning.ply - 1)}, but ${result === 'draw' ? 'it ended in a draw' : 'it slipped away'}. Turning a winning position into a win is a skill of its own: keep it simple, trade pieces, and check every move for their threats.`,
      ply: firstWinning.ply - 1,
    })
  } else if (result === 'loss') {
    beats.push({ title: 'How it ended', text: 'They kept control from there.' })
  }
  return beats
}
