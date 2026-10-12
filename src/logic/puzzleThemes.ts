// Puzzle themes (FreeChess, Oct 2026, the way chess.com lays out puzzles):
// friendly names, the groups for choosing custom puzzles, and how you do in
// each theme, so "Themes to work on" follows your real results. The theme ids
// are the Lichess puzzle database's own.

export type ThemeGroup = { title: string; themes: { id: string; label: string }[] }

export const THEME_GROUPS: ThemeGroup[] = [
  {
    title: 'Checkmates',
    themes: [
      { id: 'mateIn1', label: 'Mate in one' },
      { id: 'mateIn2', label: 'Mate in two' },
      { id: 'mateIn3', label: 'Mate in three' },
      { id: 'backRankMate', label: 'Back-rank mates' },
      { id: 'smotheredMate', label: 'Smothered mates' },
      { id: 'doubleCheck', label: 'Double check' },
    ],
  },
  {
    title: 'Tactics',
    themes: [
      { id: 'fork', label: 'Forks' },
      { id: 'pin', label: 'Pins' },
      { id: 'skewer', label: 'Skewers' },
      { id: 'discoveredAttack', label: 'Discovered attacks' },
      { id: 'hangingPiece', label: 'Hanging pieces' },
      { id: 'trappedPiece', label: 'Trapped pieces' },
      { id: 'sacrifice', label: 'Sacrifices' },
      { id: 'deflection', label: 'Deflection' },
      { id: 'attraction', label: 'Attraction' },
      { id: 'capturingDefender', label: 'Take the defender' },
      { id: 'xRayAttack', label: 'X-ray attacks' },
      { id: 'intermezzo', label: 'In-between moves' },
      { id: 'clearance', label: 'Clearance' },
      { id: 'interference', label: 'Interference' },
      { id: 'quietMove', label: 'Quiet moves' },
    ],
  },
  {
    title: 'Endgames',
    themes: [
      { id: 'pawnEndgame', label: 'Pawn endgames' },
      { id: 'rookEndgame', label: 'Rook endgames' },
      { id: 'bishopEndgame', label: 'Bishop endgames' },
      { id: 'knightEndgame', label: 'Knight endgames' },
      { id: 'queenEndgame', label: 'Queen endgames' },
      { id: 'promotion', label: 'Promotion' },
      { id: 'zugzwang', label: 'Zugzwang' },
    ],
  },
  {
    title: 'Other',
    themes: [
      { id: 'kingsideAttack', label: 'Kingside attack' },
      { id: 'exposedKing', label: 'Exposed king' },
      { id: 'advancedPawn', label: 'Advanced pawns' },
      { id: 'opening', label: 'Opening tricks' },
      { id: 'defensiveMove', label: 'Defending' },
    ],
  },
]

/** Every theme you can choose, in order. */
export const CHOOSABLE_THEMES = THEME_GROUPS.flatMap((g) => g.themes)

const LABELS = new Map(CHOOSABLE_THEMES.map((t) => [t.id, t.label]))
/** Tags that describe every other puzzle and say nothing about the idea. */
const GENERIC = new Set(['crushing', 'advantage', 'equality', 'middlegame', 'endgame', 'short', 'long', 'veryLong', 'oneMove', 'master', 'masterVsMaster', 'superGM'])

/** A theme's friendly name ("fork" → "Forks"). */
export function themeLabel(id: string): string {
  return LABELS.get(id) ?? id.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}

/** The themes worth showing for a puzzle once it's done ("Forks · Hanging pieces"). */
export function shownThemes(themes: readonly string[]): string[] {
  return themes.filter((t) => LABELS.has(t) && !GENERIC.has(t)).map(themeLabel)
}

/** How you've done in each theme: puzzles tried and solved cleanly. */
export type ThemeStats = Record<string, { tried: number; solved: number }>

/** Your stats with one more puzzle counted (only the themes you can choose). */
export function recordThemes(stats: ThemeStats | undefined, themes: readonly string[], solved: boolean): ThemeStats {
  const out: ThemeStats = { ...stats }
  for (const t of themes) {
    if (!LABELS.has(t)) continue
    const s = out[t] ?? { tried: 0, solved: 0 }
    out[t] = { tried: s.tried + 1, solved: s.solved + (solved ? 1 : 0) }
  }
  return out
}

/** Enough puzzles in a theme to judge it. */
export const MIN_TRIED = 5

/** Your weakest themes by success rate (at least MIN_TRIED each), weakest first. */
export function weakestThemes(stats: ThemeStats | undefined, count = 3): { id: string; label: string; rate: number }[] {
  return Object.entries(stats ?? {})
    .filter(([id, s]) => LABELS.has(id) && s.tried >= MIN_TRIED)
    .map(([id, s]) => ({ id, label: themeLabel(id), rate: s.solved / s.tried }))
    .sort((a, b) => a.rate - b.rate || a.label.localeCompare(b.label))
    .slice(0, count)
}

export type Difficulty = 'easier' | 'normal' | 'harder'
export const DIFFICULTIES: { id: Difficulty; label: string; offset: number }[] = [
  { id: 'easier', label: 'Easier', offset: -250 },
  { id: 'normal', label: 'Normal', offset: 0 },
  { id: 'harder', label: 'Harder', offset: 250 },
]
