// Your openings, from your own games (FreeChess, Oct 2026): the openings you
// play most, how they go for you, and a drill of the lines you actually play,
// with your slips put right. Each drill runs in the usual opening trainer
// (components/OpeningDrill.tsx): you play your side, the computer plays what
// your opponents played.
import type { OpeningDrill } from '../data/openingLessons'
import { OPENING_NAMES } from '../data/scouting'
import { explainBestMove } from './explain'
import { formatLine, replay, type Colour } from './game'
import { outcomeOf, type GameRecord } from './gameRecord'
import { parseLine } from './openingBook'
import { detectOpening } from './openings'
import { reviewMoves, settleEvals, SHORTEST_REVIEW, type PositionEval } from './review'

type Game = GameRecord & { finishedAt: number; evals?: PositionEval[] }

export type MyOpening = {
  key: string
  name: string
  colour: Colour
  games: number
  /** Points scored, as a percentage. */
  score: number
  /** A drill of your lines; null until enough of these games have been reviewed. */
  drill: OpeningDrill | null
}

/** How far into the game a line goes (single moves): six moves each. */
const LINE_PLIES = 12
/** An opening needs this many games to count as one of yours. */
const MIN_GAMES = 2
/** Lines in a drill, at most. */
const MAX_LINES = 3
const SLIPS = ['inaccuracy', 'mistake', 'blunder']

function nameOf(key: string): string {
  const name = (OPENING_NAMES[key] ?? key).replace(/^the /, '')
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Your line from one reviewed game: its first moves, up to the first slip of
 * yours, where the engine's move goes in instead (and the line stops).
 */
function lineFrom(g: Game): { uci: string[]; fixed: { ply: number; san: string; why: string } | null } | null {
  if (!g.evals || g.evals.length !== g.moves.length + 1) return null
  const evals = settleEvals(g.moves, g.evals)
  const reviewed = reviewMoves(g.moves, evals)
  const uci: string[] = []
  for (const m of reviewed.slice(0, LINE_PLIES)) {
    if (m.mover === g.playerColour && SLIPS.includes(m.rating) && m.bestMove) {
      const best = m.bestMove
      const chess = replay(g.moves.slice(0, m.ply))
      const san = chess.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: best[4] })?.san
      if (!san) return null
      const forYou = g.playerColour === 'w' ? evals[m.ply].cp : -evals[m.ply].cp
      return { uci: [...uci, best], fixed: { ply: m.ply, san, why: explainBestMove(m.fenBefore, best, forYou, m.uci, evals[m.ply].pv) } }
    }
    uci.push(m.uci)
  }
  return { uci, fixed: null }
}

export function myOpenings(games: readonly Game[]): MyOpening[] {
  const groups = new Map<string, Game[]>()
  for (const g of games) {
    if (!outcomeOf(g) || g.levelId === 'char:coach' || g.moves.length < SHORTEST_REVIEW) continue
    const key = detectOpening(replay(g.moves.slice(0, 12)).history())
    if (!key || key === 'exchange') continue
    const id = `${key}:${g.playerColour}`
    groups.set(id, [...(groups.get(id) ?? []), g])
  }
  const out: MyOpening[] = []
  for (const [id, gs] of groups) {
    if (gs.length < MIN_GAMES) continue
    const [key, colour] = id.split(':') as [string, Colour]
    const points = gs.reduce((sum, g) => {
      const o = outcomeOf(g)!
      return sum + (o.winner === null ? 0.5 : o.winner === colour ? 1 : 0)
    }, 0)
    out.push({ key, name: nameOf(key), colour, games: gs.length, score: Math.round((points / gs.length) * 100), drill: drillFor(key, colour, gs) })
  }
  return out.sort((a, b) => b.games - a.games)
}

/** The drill: your most common lines (fixed where you slipped), with a reason for each of your moves. */
function drillFor(key: string, colour: Colour, games: readonly Game[]): OpeningDrill | null {
  const counts = new Map<string, { n: number; fixed: { san: string; why: string } | null }>()
  for (const g of games) {
    const line = lineFrom(g)
    if (!line || line.uci.length < 4) continue
    const text = formatLine(replay([]).fen(), line.uci, LINE_PLIES)
    const known = counts.get(text)
    counts.set(text, { n: (known?.n ?? 0) + 1, fixed: known?.fixed ?? line.fixed })
  }
  const best = [...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, MAX_LINES)
  if (best.length === 0) return null
  const lines = best.map(([text]) => text)
  // Every move of yours needs a reason: the fixed one gets the Coach's, the rest are yours already.
  const why: Record<string, string> = {}
  for (const line of lines) {
    const uci = parseLine(line)
    const sans = replay(uci).history()
    sans.forEach((san, i) => {
      const mine = (i % 2 === 0) === (colour === 'w')
      if (mine && !why[san]) why[san] = 'Your usual move here.'
    })
  }
  for (const [, v] of best) if (v.fixed) why[v.fixed.san] = `Better than what you played in one game. ${v.fixed.why}`
  return {
    id: `my-${key}-${colour}-${lines.join('|').length}`,
    name: `your ${nameOf(key)}`,
    colour: colour === 'b' ? 'b' : undefined,
    demo: [],
    lines,
    why,
    runs: Math.min(2, lines.length),
  }
}
