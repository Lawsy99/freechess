// Your training focus (FreeChess, Oct 2026): the mistake you make most in your
// recent games, and what practises it. It picks today's lesson, a "For you"
// puzzle set, and what the Coach watches for in your games together.
import type { ErrorKind } from './explain'
import { outcomeOf, type GameRecord } from './gameRecord'
import { reviewMoves, settleEvals, SHORTEST_REVIEW, type PositionEval } from './review'
import { errorKindsIn } from './stepExplain'

type Game = GameRecord & { finishedAt: number; evals?: PositionEval[] }

export type Focus = {
  /** "leaving pieces unprotected" */
  label: string
  /** How many times in your recent games. */
  count: number
  /** The Learn lesson that practises it, and a puzzle theme for it. */
  lesson: string
  theme: string
  themeLabel: string
  /** The error kinds it covers, for the Coach to point out. */
  kinds: ErrorKind[]
}

const FOCUSES: { kinds: ErrorKind[]; label: string; lesson: string; theme: string; themeLabel: string }[] = [
  { kinds: ['undefended', 'lost-material'], label: 'leaving pieces unprotected', lesson: 'stay-safe', theme: 'defensiveMove', themeLabel: 'Defending' },
  { kinds: ['fork'], label: 'walking into forks', lesson: 'forks', theme: 'fork', themeLabel: 'Forks' },
  { kinds: ['allowed-mate'], label: 'allowing checkmate', lesson: 'back-rank', theme: 'backRankMate', themeLabel: 'Back-rank mates' },
  { kinds: ['missed-mate'], label: 'missing checkmates', lesson: 'mate-in-two', theme: 'mateIn2', themeLabel: 'Mate in two' },
  { kinds: ['missed-win'], label: 'missing free material', lesson: 'free-pieces', theme: 'hangingPiece', themeLabel: 'Hanging pieces' },
  { kinds: ['early-queen', 'same-piece-twice', 'lost-castling'], label: 'slips in the opening', lesson: 'italian', theme: 'opening', themeLabel: 'Opening tricks' },
]

/** Your last this-many reviewed games. */
const RECENT = 10
/** It has to happen at least this often to be a focus. */
const MIN_COUNT = 2

/** The mistake you've made most in your recent reviewed games, or null if nothing stands out. */
export function trainingFocus(games: readonly Game[]): Focus | null {
  const reviewed = [...games]
    .filter((g) => outcomeOf(g) && g.evals?.length === g.moves.length + 1 && g.moves.length >= SHORTEST_REVIEW)
    .sort((a, b) => b.finishedAt - a.finishedAt)
    .slice(0, RECENT)
  const counts = new Map<number, number>()
  for (const g of reviewed) {
    const evals = settleEvals(g.moves, g.evals!)
    for (const kind of errorKindsIn(g.moves, evals, reviewMoves(g.moves, evals), g.playerColour, g.startPly ?? 0)) {
      const i = FOCUSES.findIndex((f) => f.kinds.includes(kind))
      if (i >= 0) counts.set(i, (counts.get(i) ?? 0) + 1)
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (!top || top[1] < MIN_COUNT) return null
  return { ...FOCUSES[top[0]], count: top[1] }
}
