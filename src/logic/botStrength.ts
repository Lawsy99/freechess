// Bot strength (FreeChess, Oct 2026). Every bot is pure Maia at its own
// rating (Joseph: "all bots just follow Maia 100%"), as maiachess.com plays.
// The calibration measured what each Maia setting really plays like
// (docs/bot-calibration.md); the bots don't adjust for it, by choice.

/** The ratings Maia is asked to play at: maiachess.com offers 600 to 2600; below that it still plays, weaker. */
export const MAIA_MIN = 100
export const MAIA_MAX = 2600

/** The Maia setting for a bot of this rating: the rating itself. */
export function maiaSetting(rating: number): number {
  return Math.max(MAIA_MIN, Math.min(MAIA_MAX, Math.round(rating)))
}

/**
 * The old Stockfish-based bot stands in while Maia can't load. Measured, its
 * own rating setting plays far stronger than it says (set to 700, it plays
 * like about 1310), so it's set lower to play near the bot's rating. It can't
 * play weaker than about 660, or much stronger than about 1300.
 */
const STAND_IN: readonly [strength: number, setting: number][] = [
  [668, 200],
  [950, 400],
  [1315, 700],
]

export function standInRating(rating: number): number {
  if (rating <= STAND_IN[0][0]) return 100
  for (let i = 1; i < STAND_IN.length; i++) {
    const [s1, r1] = STAND_IN[i]
    const [s0, r0] = STAND_IN[i - 1]
    if (rating <= s1) return Math.round(r0 + ((rating - s0) / (s1 - s0)) * (r1 - r0))
  }
  return 800
}
