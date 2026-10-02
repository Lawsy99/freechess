// The big picture (FreeChess, Oct 2026: "it needs a strategic angle"): what
// the plan should be in a position, the way a coach would say it. Every
// statement comes from what is on the board (material, kings, development,
// open files, passed and isolated pawns), so it is never wrong; the advice
// that follows is the standard plan for that kind of position.
import { Chess, type PieceSymbol, type Square } from 'chess.js'
import type { Colour } from './game'

const FILES = 'abcdefgh'
const VALUES: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
const NAMES: Record<PieceSymbol, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }

type Piece = { type: PieceSymbol; color: Colour; square: Square }

function pieces(chess: Chess): Piece[] {
  return chess.board().flat().filter(Boolean) as Piece[]
}

const fileOf = (sq: Square) => sq[0]
const rankOf = (sq: Square) => Number(sq[1])
const other = (c: Colour): Colour => (c === 'w' ? 'b' : 'w')

/** A pawn with no enemy pawn in front of it on its own or the next files. */
function isPassed(p: Piece, all: Piece[]): boolean {
  const f = FILES.indexOf(fileOf(p.square))
  const r = rankOf(p.square)
  return !all.some(
    (q) =>
      q.type === 'p' &&
      q.color !== p.color &&
      Math.abs(FILES.indexOf(fileOf(q.square)) - f) <= 1 &&
      (p.color === 'w' ? rankOf(q.square) > r : rankOf(q.square) < r),
  )
}

/** A pawn with no friendly pawn on either side file. */
function isIsolated(p: Piece, all: Piece[]): boolean {
  const f = FILES.indexOf(fileOf(p.square))
  return !all.some((q) => q.type === 'p' && q.color === p.color && Math.abs(FILES.indexOf(fileOf(q.square)) - f) === 1)
}

export type PlanIdea = { kind: string; text: string; weight: number }

/** The plans that fit the position for `side`, most important first. */
export function planIdeas(fen: string, side: Colour): PlanIdea[] {
  const chess = new Chess(fen)
  const all = pieces(chess)
  const mine = all.filter((p) => p.color === side)
  const theirs = all.filter((p) => p.color !== side)
  const them = other(side)
  const ideas: PlanIdea[] = []
  const moveNo = chess.moveNumber()
  const material = (ps: Piece[]) => ps.reduce((s, p) => s + VALUES[p.type], 0)
  const diff = material(mine) - material(theirs)
  const queensOn = all.some((p) => p.type === 'q')
  const bigPieces = all.filter((p) => p.type !== 'p' && p.type !== 'k').length
  const ending = !queensOn && bigPieces <= 6
  const backRank = (c: Colour) => (c === 'w' ? 1 : 8)
  const kingOf = (c: Colour) => all.find((p) => p.type === 'k' && p.color === c)!
  const central = (c: Colour) => {
    const k = kingOf(c)
    return rankOf(k.square) === backRank(c) && 'def'.includes(fileOf(k.square))
  }
  const pawnOnFile = (file: string, c?: Colour) => all.some((p) => p.type === 'p' && fileOf(p.square) === file && (!c || p.color === c))
  const centreOpen = !pawnOnFile('d') || !pawnOnFile('e')
  const castling = fen.split(' ')[2]
  const canCastle = (c: Colour) => (c === 'w' ? /[KQ]/.test(castling) : /[kq]/.test(castling))

  // Material.
  if (diff >= 3) {
    ideas.push({ kind: 'ahead', weight: 9, text: `You’re ahead in material. Swap pieces (not pawns) when you can: every trade brings a won ending closer, and leaves them fewer chances.` })
  } else if (diff <= -3) {
    ideas.push({ kind: 'behind', weight: 8, text: `You’re behind in material, so avoid swaps. Keep pieces on the board and look for active chances, especially against their king.` })
  }

  // Kings.
  if (queensOn && !ending && central(side) && moveNo >= 8) {
    ideas.push(
      canCastle(side)
        ? { kind: 'castle', weight: centreOpen ? 8 : 6, text: `Your king is still in the middle${centreOpen ? ', and the centre is opening up' : ''}. Castling soon should be near the top of your list.` }
        : { kind: 'king-stuck', weight: 6, text: `Your king can’t castle any more. Keep the centre closed if you can, and don’t open lines near it.` },
    )
  }
  if (queensOn && !ending && central(them) && moveNo >= 8 && centreOpen) {
    ideas.push({ kind: 'attack-centre-king', weight: 8, text: `Their king is still in the centre with lines opening around it. Open the position: bring pieces to the open files and make it hard for them to castle.` })
  }

  // Development.
  if (moveNo >= 8 && !ending) {
    const home = side === 'w' ? { b1: 'n', g1: 'n', c1: 'b', f1: 'b' } : { b8: 'n', g8: 'n', c8: 'b', f8: 'b' }
    const idle = Object.entries(home).filter(([sq, t]) => mine.some((p) => p.square === sq && p.type === t))
    if (idle.length >= 2) {
      const names = idle.map(([sq, t]) => `${NAMES[t as PieceSymbol]} on ${sq}`)
      ideas.push({ kind: 'develop', weight: 7, text: `Finish developing first: your ${names.join(' and ')} haven’t moved yet. Pieces at home don’t take part in the fight.` })
    }
  }

  // Open files for rooks.
  const myRooks = mine.filter((p) => p.type === 'r')
  if (myRooks.length && !ending) {
    const open = [...FILES].filter((f) => !pawnOnFile(f) && 'cdef'.includes(f))
    const free = open.find((f) => !myRooks.some((r) => fileOf(r.square) === f))
    if (free && !myRooks.some((r) => open.includes(fileOf(r.square)))) {
      ideas.push({ kind: 'open-file', weight: 5, text: `The ${free}-file is open. A rook there gets into their position: open files are where rooks come alive.` })
    }
  }

  // Passed and weak pawns.
  const myPassed = mine.filter((p) => p.type === 'p' && isPassed(p, all) && (side === 'w' ? rankOf(p.square) >= 5 : rankOf(p.square) <= 4))
  if (myPassed[0]) {
    ideas.push({ kind: 'passed', weight: ending ? 8 : 6, text: `Your passed pawn on ${myPassed[0].square} is a real asset: nothing can stop it but their pieces. Support it and push it on.` })
  }
  const theirPassed = theirs.filter((p) => p.type === 'p' && isPassed(p, all) && (them === 'w' ? rankOf(p.square) >= 5 : rankOf(p.square) <= 4))
  if (theirPassed[0]) {
    ideas.push({ kind: 'blockade', weight: ending ? 8 : 6, text: `Watch their passed pawn on ${theirPassed[0].square}. Put a piece directly in front of it: a blocked passed pawn is just a weak pawn.` })
  }
  const theirIsolated = theirs.find((p) => p.type === 'p' && isIsolated(p, all) && 'cdef'.includes(fileOf(p.square)))
  if (theirIsolated && !ending) {
    ideas.push({ kind: 'isolated', weight: 4, text: `Their pawn on ${theirIsolated.square} is isolated: no pawn can ever defend it. Pile pieces up against it, and put one on the square in front of it.` })
  }

  // The ending.
  if (ending) {
    ideas.push({ kind: 'king-active', weight: 7, text: `It’s an ending, so your king is a fighting piece now. Bring it towards the centre and into the game.` })
  }

  return ideas.sort((a, b) => b.weight - a.weight)
}

/** The single most important plan for `side`, or null if nothing stands out. */
export function planFor(fen: string, side: Colour): PlanIdea | null {
  return planIdeas(fen, side)[0] ?? null
}

export type PlanMomentKind = 'middlegame' | 'later' | 'queens-off' | 'ending'

/**
 * In a coached game, the Coach says the big picture at the turning points of
 * a game (Oct 2026): when the opening is over, once more later if the plan
 * has changed, when the queens come off, and when the ending starts. Each at
 * most once (`said`), and never in the middle of a trade, when the material
 * count would mislead. Null when it isn't the moment or there's nothing to say.
 */
export function planMoment(
  fen: string,
  side: Colour,
  ply: number,
  lastWasCapture: boolean,
  said: readonly { kind: PlanMomentKind; idea: string }[],
): { kind: PlanMomentKind; idea: string; text: string } | null {
  if (lastWasCapture) return null
  const all = pieces(new Chess(fen))
  const queensOn = all.some((p) => p.type === 'q')
  const bigPieces = all.filter((p) => p.type !== 'p' && p.type !== 'k').length
  const ending = !queensOn && bigPieces <= 6
  const has = (k: PlanMomentKind) => said.some((s) => s.kind === k)
  const idea = planFor(fen, side)
  if (!idea) return null
  let kind: PlanMomentKind | null = null
  let intro = ''
  if (ending && !has('ending')) {
    kind = 'ending'
    intro = idea.kind === 'king-active' ? '' : 'It’s an ending now. '
  } else if (!ending && !queensOn && ply >= 12 && !has('queens-off')) {
    kind = 'queens-off'
    intro = 'The queens are off, and that changes the plan. '
  } else if (!ending && ply >= 16 && ply <= 40 && said.length === 0) {
    kind = 'middlegame'
    intro = 'The opening’s done, so here’s the big picture. '
  } else if (!ending && ply >= 36 && has('middlegame') && !has('later') && !said.some((s) => s.idea === idea.kind)) {
    kind = 'later'
    intro = 'The position has changed, so here’s the big picture now. '
  }
  if (!kind) return null
  return { kind, idea: idea.kind, text: intro + idea.text }
}
