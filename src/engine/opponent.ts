// Chooses the opponent's move. Characters first play from their opening
// book; after that every bot plays through Maia-3 at the setting measured to
// match its rating (logic/botStrength.ts, Oct 2026), nudged towards the
// character's style. If Maia is unavailable, the old Stockfish-based bot
// stands in until it's back.
// Then a human-like pause: the design's thinking times for characters, a
// short one for practice levels.
import { Chess } from 'chess.js'
import { TEST_THINK_TIME } from '../data/testOpponents'
import type { Opponent } from '../data/opponents'
import { botDepth, pickBotMove } from '../logic/botMistakeModel'
import { toCentipawns } from '../logic/evaluation'
import { bookMove } from '../logic/openingBook'
import { MIN_LIKELIHOOD } from '../logic/sampleMove'
import { botPlan, standInRating } from '../logic/botStrength'
import { checkCandidates, pickHumanMove, usesCheck, type MoveCheck } from '../logic/humanBot'
import { applyUci } from '../logic/game'
import { styleWeight } from '../logic/style'
import { classifyMove, thinkTime, type MoveKind } from '../logic/thinkTime'
import { getMaia } from './maia/maia'
import { getEngine } from './stockfish'

export type OpponentChoice = {
  move: string | null
  /** How long Maia's model took, when Maia played (for checking phone speed). */
  maiaMs?: number
  /** The move came from the character's opening book (so leaving it can be noticed). */
  fromBook?: boolean
}

export async function chooseOpponentMove(
  fen: string,
  movesSoFar: readonly string[],
  opponent: Opponent,
  /** Toby's targeting: prefer book lines heading into this opening. */
  preferOpening?: string,
  /** A move that must be played (Pemberton's announced trap, while the game follows it). */
  forced?: string | null,
  /** The longest the bot may take (in a timed game, less when it's short of time). */
  maxPauseMs = Infinity,
): Promise<OpponentChoice> {
  const started = Date.now()
  const colour = new Chess(fen).turn()
  const book =
    forced ?? (opponent.character ? bookMove(opponent.character.id, colour, movesSoFar, Math.random, preferOpening) : null)

  let choice: OpponentChoice
  let kind: MoveKind
  if (book) {
    choice = { move: book, fromBook: true }
    kind = 'book'
  } else if (opponent.engine === 'maia') {
    try {
      ;({ choice, kind } = await maiaMove(fen, opponent, movesSoFar))
    } catch (err) {
      // Maia couldn't answer (e.g. "Load failed": the connection dropped during
      // its download). The Stockfish-based bot covers this move so the game
      // carries on; Maia is tried again a minute later.
      console.warn('Maia unavailable; the backup bot plays this move.', err)
      ;({ choice, kind } = await botMove(fen, opponent, movesSoFar))
    }
  } else if (opponent.engine === 'full') {
    ;({ choice, kind } = await fullStrengthMove(fen))
  } else {
    ;({ choice, kind } = await botMove(fen, opponent, movesSoFar))
  }

  // Only one legal move: play it straight away, whatever the engine thought.
  if (new Chess(fen).moves().length <= 1) kind = 'forced'
  const pause = opponent.character
    ? thinkTime(kind, opponent.character.thinkSpeed)
    : TEST_THINK_TIME.min + Math.random() * (TEST_THINK_TIME.max - TEST_THINK_TIME.min)
  const remaining = Math.min(pause, maxPauseMs) - (Date.now() - started)
  if (remaining > 0) await new Promise((r) => setTimeout(r, remaining))
  return choice
}

async function maiaMove(fen: string, opponent: Opponent, moves: readonly string[]) {
  // (Calibrated with Maia imagining an equal opponent, so asked the same way.)
  const plan = botPlan(opponent.rating)
  const { policy, ms } = await getMaia().predict(fen, plan.maiaElo, plan.maiaElo)
  const style = opponent.character?.style
  const traits = opponent.character?.traits ?? []
  const nudged = style
    ? policy.map((m) => (m.p >= MIN_LIKELIHOOD ? { ...m, p: m.p * styleWeight(style, fen, m.move, traits) } : m))
    : policy
  const kind = classifyMove(policy[0]?.p ?? 1, isRecaptureAvailable(fen, moves, policy[0]?.move))
  const move = usesCheck(plan) ? await checkedMove(fen, nudged, plan.check!) : pickHumanMove(nudged, plan)
  return { choice: { move, maiaMs: ms }, kind }
}

/**
 * The strongest bots: Stockfish compares Maia's few likeliest moves and plays
 * the soundest, so the move is still one a strong person would play.
 */
async function checkedMove(fen: string, policy: readonly { move: string; p: number }[], check: MoveCheck): Promise<string | null> {
  const candidates = checkCandidates(policy, check)
  if (candidates.length <= 1) return candidates[0] ?? null
  let best: { move: string; cp: number } | null = null
  for (const move of candidates) {
    const after = new Chess(fen)
    if (!applyUci(after, move)) continue
    // (Scored for the side that moved: the reply's score, turned round.)
    const cp = after.isCheckmate()
      ? Infinity
      : after.isDraw()
        ? 0
        : -toCentipawns((await getEngine().search(after.fen(), { depth: check.depth, movetime: 600 })).lines[0]?.score ?? { type: 'cp', value: 0 })
    if (!best || cp > best.cp) best = { move, cp }
  }
  return best?.move ?? candidates[0]
}

async function botMove(fen: string, opponent: Opponent, moves: readonly string[]) {
  // (Set lower than the bot's rating: measured, this bot plays above its setting.)
  const setting = standInRating(opponent.rating)
  const { lines } = await getEngine().search(fen, { depth: botDepth(setting), multiPv: 6, movetime: 400 })
  const candidates = lines.map((l) => ({ move: l.pv[0], cp: toCentipawns(l.score) }))
  const legal = new Chess(fen).moves({ verbose: true }).map((m) => m.from + m.to + (m.promotion ?? ''))
  const style = opponent.character?.style
  const traits = opponent.character?.traits ?? []
  const weights = style ? candidates.map((c) => styleWeight(style, fen, c.move, traits)) : undefined
  const move = pickBotMove(candidates, legal, setting, Math.random, weights)
  // Without Maia's likelihoods, judge "obvious" by how far the best move stands out.
  const gap = candidates.length > 1 ? candidates[0].cp - candidates[1].cp : 1000
  const kind = classifyMove(gap > 150 ? 0.8 : gap < 30 ? 0.15 : 0.4, isRecaptureAvailable(fen, moves, move))
  return { choice: { move }, kind }
}

/** Stockfish's best move, no mistakes (Toby on trial night: the player is meant to lose). */
async function fullStrengthMove(fen: string) {
  const { bestMove, lines } = await getEngine().search(fen, { depth: 18, multiPv: 1, movetime: 1500 })
  const move = bestMove ?? lines[0]?.pv[0] ?? null
  return { choice: { move }, kind: 'normal' as MoveKind }
}

/** True if `move` takes back on the square where the opponent just captured. */
function isRecaptureAvailable(fen: string, moves: readonly string[], move: string | null | undefined): boolean {
  const last = moves.at(-1)
  if (!last || !move || move.slice(2, 4) !== last.slice(2, 4)) return false
  return new Chess(fen).get(move.slice(2, 4) as never) !== undefined
}
