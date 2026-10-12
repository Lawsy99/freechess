// Drills (FreeChess, Oct 2026, after maiachess.com's Drills): you play a
// position out against Maia for a set number of moves, then get a report:
// accuracy, your mistakes, the Coach on the moment that mattered, and the
// rating your moves looked like. Lessons are built from drills, and you can
// build your own set. Pure, so it can be tested on its own.
import { Chess } from 'chess.js'
import { ENDGAME_DRILLS, type EndgamePosition } from '../data/endgameDrills'
import { OPENING_DRILLS, type OpeningDrill } from '../data/openingLessons'
import { judgeEndgame, type DrillVerdict } from './endgameDrill'
import { applyUci, type Colour } from './game'
import type { MoveRating } from './moveRating'
import { parseLine } from './openingBook'
import { pickPuzzles, type Puzzle } from './puzzles'
import { explainBestMove, explainMistake, type MistakeFacts } from './explain'
import { gameAccuracy, type PositionEval, type ReviewedMove } from './review'

export const START_FEN = new Chess().fen()

/** What a drill is made from: an opening, a puzzle theme, or a finishing position. */
export type DrillSpec =
  | { kind: 'opening'; opening: string; moves: number }
  | { kind: 'theme'; theme: string; moves: number }
  | { kind: 'endgame'; drill: string }

export type Drill = {
  id: string
  title: string
  startFen: string
  player: Colour
  /** Your moves before it ends (endgames: the most you're allowed). */
  playMoves: number
  /** Opening drills: the opening's lines (UCI), which the opponent follows while you do. */
  lines?: string[][]
  /** Theme drills: the key move in the position (the puzzle's answer), to say whether you found it. */
  keyMove?: string
  /** Endgame drills: the position and its goal. */
  endgame?: EndgamePosition
  /** What the Coach says before you start. */
  intro?: string
  /** Theme drills: their move that set it up, highlighted at the start. */
  lastMove?: { from: string; to: string }
}

/** An opening from move 1: you play your side, and the opponent follows the opening's lines while you do. */
export function openingDrill(o: OpeningDrill, moves: number, id = o.id): Drill {
  const player = o.colour ?? 'w'
  return {
    id,
    title: o.name.charAt(0).toUpperCase() + o.name.slice(1),
    startFen: START_FEN,
    player,
    playMoves: moves,
    lines: o.lines.map((l) => parseLine(l)),
    intro: `Play ${o.name} as ${player === 'w' ? 'White' : 'Black'}, then keep going: ${moves} moves in all.`,
  }
}

/** A position from a real game where the theme is in the air: their move has just been played; it's yours. */
export function themeDrill(p: Puzzle, moves: number, label: string): Drill {
  const chess = new Chess(p.fen)
  const theirs = applyUci(chess, p.moves[0])
  return {
    id: `puzzle:${p.id}`,
    title: label,
    startFen: chess.fen(),
    player: chess.turn(),
    playMoves: moves,
    keyMove: p.moves[1],
    lastMove: theirs ? { from: theirs.from, to: theirs.to } : undefined,
    intro: `From a real game: your move, and there’s something here. Find it, then play on: ${moves} moves in all.`,
  }
}

/** A finishing drill, at the position for your rating. */
export function endgameDrill(positions: readonly EndgamePosition[], rating: number): Drill | null {
  const p = positions.find((x) => rating <= x.upTo) ?? positions.at(-1)
  if (!p) return null
  const chess = new Chess(p.fen)
  return { id: `endgame:${p.id}`, title: p.title, startFen: p.fen, player: chess.turn(), playMoves: p.maxMoves, endgame: p, intro: p.intro }
}

/** What a set of drills is made from, and where. */
export type DrillSources = {
  /** The puzzle bank, for theme drills (positions from real games). */
  bank: readonly Puzzle[]
  /** Where theme positions are pitched (your puzzle rating, give or take). */
  puzzleRating: number
  /** Your playing rating: finishing positions are chosen by it. */
  rating: number
  /** Puzzles you've seen, to leave out. */
  seen?: ReadonlySet<string>
  random?: () => number
}

/**
 * A set of `count` drills from one or more specs, taking turns between them
 * (so a mix of openings alternates). Theme drills are fresh positions each
 * time; openings and finishing positions repeat, as Maia varies its play.
 */
export function makeDrills(specs: readonly DrillSpec[], count: number, src: DrillSources, label: (spec: DrillSpec) => string = () => 'Find the idea'): Drill[] {
  const out: Drill[] = []
  const themed = new Map<string, Puzzle[]>()
  for (const spec of specs)
    if (spec.kind === 'theme' && !themed.has(spec.theme)) {
      const want = Math.ceil(count / specs.length) + 1
      themed.set(spec.theme, pickPuzzles(src.bank, { themes: [spec.theme], rating: src.puzzleRating, count: want, exclude: new Set(src.seen ?? []) }, src.random))
    }
  for (let i = 0; out.length < count && i < count * 2; i++) {
    const spec = specs[i % specs.length]
    if (!spec) break
    if (spec.kind === 'opening') {
      const o = OPENING_DRILLS[spec.opening]
      if (o) out.push(openingDrill(o, spec.moves, `${o.id}:${i}`))
    } else if (spec.kind === 'endgame') {
      const d = endgameDrill(ENDGAME_DRILLS[spec.drill] ?? [], src.rating)
      if (d) out.push({ ...d, id: `${d.id}:${i}` })
    } else {
      const p = themed.get(spec.theme)?.shift()
      if (p) out.push(themeDrill(p, spec.moves, label(spec)))
    }
  }
  return out
}

/**
 * The opponent's move while the game still follows one of the opening's
 * lines (picked at random among those that match), or null once it has left
 * them: then Maia plays on its own.
 */
export function bookReply(lines: readonly string[][], played: readonly string[], random: () => number = Math.random): string | null {
  const next = lines.filter((l) => l.length > played.length && played.every((m, i) => l[i] === m)).map((l) => l[played.length])
  return next.length ? next[Math.floor(random() * next.length)] : null
}

export type DrillState = { over: boolean; verdict: DrillVerdict | null }

/** Whether a drill has ended, after `yourMoves` of your moves, with this position on the board. */
export function drillState(d: Drill, fen: string, yourMoves: number): DrillState {
  if (d.endgame) {
    const verdict = judgeEndgame(d.endgame, fen, d.player, yourMoves)
    return { over: verdict !== 'going', verdict: verdict === 'going' ? null : verdict }
  }
  const chess = new Chess(fen)
  return { over: chess.isGameOver() || yourMoves >= d.playMoves, verdict: null }
}

/** Accuracy needed to pass a drill (with no blunders). */
export const PASS_ACCURACY = 65

export type DrillGrade = {
  accuracy: number | null
  counts: Record<MoveRating, number>
  passed: boolean
  /** Theme drills: whether your first move was the key move. */
  foundKey: boolean | null
  /** Your costliest move, for the Coach to talk about (null if none went wrong). */
  worst: ReviewedMove | null
  verdict: DrillVerdict | null
}

/** How a drill went, from its graded moves. Endgames pass on the goal; others on accuracy with no blunders. */
export function gradeDrill(d: Drill, reviewed: readonly ReviewedMove[], verdict: DrillVerdict | null): DrillGrade {
  const mine = reviewed.filter((m) => m.mover === d.player)
  const counts: Record<MoveRating, number> = { best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 }
  for (const m of mine) counts[m.rating]++
  const accuracy = gameAccuracy([...reviewed], d.player)
  const cost = (m: ReviewedMove) => m.winBefore - m.winAfter
  const worst = [...mine].filter((m) => m.rating === 'inaccuracy' || m.rating === 'mistake' || m.rating === 'blunder').sort((a, b) => cost(b) - cost(a))[0] ?? null
  const passed = d.endgame ? verdict === 'won' : counts.blunder === 0 && (accuracy ?? 0) >= PASS_ACCURACY
  const foundKey = d.keyMove ? mine[0]?.uci === d.keyMove : null
  return { accuracy, counts, passed, foundKey, worst, verdict }
}

/** The ratings checked for "your moves looked like" (five, so a phone works it out in seconds). */
export const ESTIMATE_RATINGS = [600, 1000, 1400, 1800, 2200]

/** Your moves checked for the estimate: the last dozen at most, which says enough and keeps it quick. */
export const ESTIMATE_MOVES = 12

/**
 * The rating your moves looked like, as maiachess.com works it out: for each
 * of your moves, how likely Maia thought a player of each rating was to play
 * it. `likelihoods[i][r]` is that for move i at ESTIMATE_RATINGS[r]. Weighted
 * across the ratings by how well each explains your moves; rounded to 50.
 */
export function estimateRating(likelihoods: readonly (readonly number[])[], ratings: readonly number[] = ESTIMATE_RATINGS): { rating: number; spread: number } | null {
  if (likelihoods.length === 0) return null
  const ll = ratings.map((_, r) => likelihoods.reduce((sum, move) => sum + Math.log(Math.max(move[r] ?? 0, 1e-4)), 0))
  const top = Math.max(...ll)
  const w = ll.map((x) => Math.exp(x - top))
  const total = w.reduce((a, b) => a + b, 0)
  const mean = ratings.reduce((s, r, i) => s + r * w[i], 0) / total
  const spread = Math.sqrt(ratings.reduce((s, r, i) => s + (r - mean) ** 2 * w[i], 0) / total)
  return { rating: Math.round(mean / 50) * 50, spread: Math.round(spread / 50) * 50 }
}

/** How a set of drills went: passed, out of how many, and the average accuracy. */
export function summariseDrills(grades: readonly DrillGrade[]): { passed: number; total: number; accuracy: number | null } {
  const accs = grades.map((g) => g.accuracy).filter((a): a is number => a !== null)
  return {
    passed: grades.filter((g) => g.passed).length,
    total: grades.length,
    accuracy: accs.length ? Math.round(accs.reduce((a, b) => a + b, 0) / accs.length) : null,
  }
}

/**
 * What the Coach says about your costliest move in a drill: what went wrong
 * and what was better, from the engine's own lines (as in the review).
 */
export function drillCoachLine(
  moves: readonly string[],
  evals: readonly PositionEval[],
  reviewed: readonly ReviewedMove[],
  m: ReviewedMove,
): string | null {
  const forMover = (cp: number) => (m.mover === 'w' ? cp : -cp)
  const prevMove = m.ply > 0 ? reviewed[m.ply - 1] : undefined
  const facts: MistakeFacts = {
    fenBefore: m.fenBefore,
    played: m.uci,
    bestMove: m.bestMove,
    reply: evals[m.ply + 1]?.bestMove ?? null,
    cpBefore: forMover(evals[m.ply].cp),
    cpAfter: forMover(evals[m.ply + 1].cp),
    replyLine: evals[m.ply + 1]?.pv,
    bestLine: evals[m.ply].pv,
    prev: prevMove ? { fen: prevMove.fenBefore, move: prevMove.uci } : undefined,
    actual: moves.slice(m.ply + 1),
  }
  try {
    const why = explainMistake(facts)
    if (!m.bestMove || /^You (missed|had|needed)/.test(why)) return why
    const better = explainBestMove(facts.fenBefore, m.bestMove, facts.cpBefore, facts.played, facts.bestLine, facts.prev, facts.cpAfter)
    return why.endsWith('was stronger.') ? better : `${why} Better was this: ${better}`
  } catch {
    return null
  }
}
