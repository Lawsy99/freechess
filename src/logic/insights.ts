// Insights (FreeChess, Sep 2026, from a look at chess.com): what your games
// say about your play. Results come from every finished bot game; accuracy,
// the phases and blunders from the games that have been through a review (the
// engine has checked those). Pure, so it can be tested.
import { OPENING_NAMES } from '../data/scouting'
import { replay, type Colour } from './game'
import { outcomeOf, type GameRecord } from './gameRecord'
import { detectOpening } from './openings'
import { gameAccuracy, reviewMoves, settleEvals, SHORTEST_REVIEW, type PositionEval } from './review'
import { PHASES, phaseAccuracy, type Phase } from './reviewExtras'

type Game = GameRecord & { finishedAt: number; evals?: PositionEval[] }

export type Tally = { games: number; wins: number; draws: number; losses: number }
export type OpeningRow = { key: string; name: string; colour: Colour } & Tally

export type Insights = {
  results: Tally
  asWhite: Tally
  asBlack: Tally
  /** Games the engine has checked (reviewed), which the rest is based on. */
  analysed: number
  /** Your accuracy in each checked game, oldest first (for the graph). */
  accuracyTrend: { at: number; rating: number }[]
  averageAccuracy: number | null
  /** Average accuracy in each phase, and the one that costs you most. */
  phases: Record<Phase, number | null>
  weakestPhase: Phase | null
  blundersPerGame: number | null
  /** Your openings, most played first. */
  openings: OpeningRow[]
}

const COACH_LEVEL = 'char:coach'
/** Accuracy graph: the last this many checked games. */
const TREND_GAMES = 30
/** A phase needs this many games before it's called your weakest. */
const PHASE_MIN_GAMES = 3

const empty = (): Tally => ({ games: 0, wins: 0, draws: 0, losses: 0 })

function add(t: Tally, result: 'win' | 'draw' | 'loss'): void {
  t.games++
  if (result === 'win') t.wins++
  else if (result === 'draw') t.draws++
  else t.losses++
}

/** Points scored, as a percentage (a draw is half). */
export function scorePercent(t: Tally): number | null {
  return t.games ? Math.round(((t.wins + t.draws / 2) / t.games) * 100) : null
}

function openingName(key: string): string {
  const name = OPENING_NAMES[key] ?? key
  const plain = name.replace(/^the /, '')
  return plain.charAt(0).toUpperCase() + plain.slice(1)
}

export function insights(games: readonly Game[]): Insights {
  const results = empty()
  const asWhite = empty()
  const asBlack = empty()
  const openings = new Map<string, OpeningRow>()
  const trend: { at: number; rating: number }[] = []
  const phaseSums: Record<Phase, { total: number; games: number }> = {
    opening: { total: 0, games: 0 },
    middlegame: { total: 0, games: 0 },
    endgame: { total: 0, games: 0 },
  }
  let blunders = 0
  let analysed = 0

  for (const g of [...games].sort((a, b) => a.finishedAt - b.finishedAt)) {
    const outcome = outcomeOf(g)
    if (!outcome) continue
    const result = outcome.winner === null ? 'draw' : outcome.winner === g.playerColour ? 'win' : 'loss'
    const botGame = g.levelId !== COACH_LEVEL

    // Results: bot games (the Coach's are lessons), custom bots included.
    if (botGame) {
      add(results, result)
      add(g.playerColour === 'w' ? asWhite : asBlack, result)
      const key = detectOpening(replay(g.moves.slice(0, 12)).history())
      if (key) {
        const id = `${key}:${g.playerColour}`
        const row = openings.get(id) ?? { key, name: openingName(key), colour: g.playerColour, ...empty() }
        add(row, result)
        openings.set(id, row)
      }
    }

    // How well you played: games the engine has checked.
    if (g.evals?.length === g.moves.length + 1 && g.moves.length >= SHORTEST_REVIEW) {
      const reviewed = reviewMoves(g.moves, settleEvals(g.moves, g.evals))
      const accuracy = gameAccuracy(reviewed, g.playerColour)
      if (accuracy === null) continue
      analysed++
      trend.push({ at: g.finishedAt, rating: accuracy })
      const phase = phaseAccuracy(reviewed, g.playerColour)
      for (const p of PHASES) {
        if (phase[p] === null) continue
        phaseSums[p].total += phase[p]!
        phaseSums[p].games++
      }
      blunders += reviewed.filter((m) => m.mover === g.playerColour && m.rating === 'blunder').length
    }
  }

  const phases = Object.fromEntries(
    PHASES.map((p) => [p, phaseSums[p].games ? Math.round(phaseSums[p].total / phaseSums[p].games) : null]),
  ) as Record<Phase, number | null>
  const ranked = PHASES.filter((p) => phaseSums[p].games >= PHASE_MIN_GAMES && phases[p] !== null).sort((a, b) => phases[a]! - phases[b]!)

  return {
    results,
    asWhite,
    asBlack,
    analysed,
    accuracyTrend: trend.slice(-TREND_GAMES),
    averageAccuracy: trend.length ? Math.round(trend.reduce((s, t) => s + t.rating, 0) / trend.length) : null,
    phases,
    weakestPhase: ranked.length >= 2 ? ranked[0] : null,
    blundersPerGame: analysed ? Math.round((blunders / analysed) * 10) / 10 : null,
    openings: [...openings.values()].sort((a, b) => b.games - a.games).slice(0, 6),
  }
}

