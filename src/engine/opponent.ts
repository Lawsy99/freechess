// Chooses the opponent's move. Every bot is pure Maia (Joseph, Oct 2026):
// Maia-3 at exactly the bot's rating, from the first move, each move picked
// as often as real players at that rating play it, the way maiachess.com
// plays. No opening books, style nudges or engine help. If Maia is
// unavailable, the old Stockfish-based bot stands in until it's back.
// Then a human-like pause: the design's thinking times for characters, a
// short one for practice levels.
import { Chess } from 'chess.js'
import { TEST_THINK_TIME } from '../data/testOpponents'
import type { Opponent } from '../data/opponents'
import { botDepth, pickBotMove } from '../logic/botMistakeModel'
import { toCentipawns } from '../logic/evaluation'
import { sampleMove } from '../logic/sampleMove'
import { maiaSetting, standInRating } from '../logic/botStrength'
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
  /** Maia couldn't answer, so the backup Stockfish bot played this move. */
  standIn?: boolean
}

export async function chooseOpponentMove(
  fen: string,
  movesSoFar: readonly string[],
  opponent: Opponent,
  /** (Club Night's rival steered openings; unused now bots have no books.) */
  _preferOpening?: string,
  /** A move that must be played (Pemberton's announced trap, while the game follows it). */
  forced?: string | null,
  /** The longest the bot may take (in a timed game, less when it's short of time). */
  maxPauseMs = Infinity,
): Promise<OpponentChoice> {
  const started = Date.now()
  // (Only a scripted coaching line forces a move; FreeChess has none today.)
  const book = forced ?? null

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
      choice = { ...choice, standIn: true }
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
  // (Maia imagines an opponent of the same rating, as on maiachess.com.)
  const elo = maiaSetting(opponent.rating)
  const { policy, ms } = await getMaia().predict(fen, elo, elo)
  const kind = classifyMove(policy[0]?.p ?? 1, isRecaptureAvailable(fen, moves, policy[0]?.move))
  return { choice: { move: sampleMove(policy), maiaMs: ms }, kind }
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
