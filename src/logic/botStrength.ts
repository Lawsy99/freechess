// Which Maia setting plays at each bot rating (FreeChess, Oct 2026).
//
// Maia's own rating setting doesn't match its playing strength when it picks
// moves by chance, the way the bots do: asked for 400 it plays like about 730,
// asked for 2400 like about 1850. So every setting was measured, in about two
// thousand games between Maia settings, fitted to one Elo scale pinned at
// Maia 1500 = 1500 (scratch/calibrate.mjs, scratch/fitElo.mjs; method and
// results in docs/bot-calibration.md). A bot's rating is a measured strength.
//
// The ladder below runs from loosened Maia (weakest), through plain Maia, to
// sharpened Maia (strongest). Between two rungs the settings are blended in
// proportion; neighbouring rungs differ in one setting only.
import type { BotPlan } from './humanBot'

export type Rung = BotPlan & { strength: number }

/**
 * Measured rungs, weakest first (scratch/fit.json, Oct 2026). "considered 60"
 * with temperature 1 is Maia as it is: every move people play now and then.
 */
export const LADDER: readonly Rung[] = [
  // The weakest: loosened Maia, rarer moves allowed too (a total beginner).
  // Completely random moves measure about 230 as well: this is the floor.
  { maiaElo: 200, temperature: 30, considered: 200, includeRare: true, strength: 224 },
  // Loosened Maia, among the moves people consider.
  { maiaElo: 200, temperature: 12, considered: 60, strength: 426 },
  { maiaElo: 200, temperature: 6, considered: 40, strength: 494 },
  { maiaElo: 200, temperature: 3, considered: 30, strength: 623 },
  // Maia as it is, at the setting that measured at each strength.
  { maiaElo: 200, temperature: 1, considered: 60, strength: 713 },
  { maiaElo: 400, temperature: 1, considered: 60, strength: 852 },
  { maiaElo: 600, temperature: 1, considered: 60, strength: 1052 },
  { maiaElo: 800, temperature: 1, considered: 60, strength: 1220 },
  { maiaElo: 1000, temperature: 1, considered: 60, strength: 1321 },
  { maiaElo: 1200, temperature: 1, considered: 60, strength: 1422 },
  { maiaElo: 1500, temperature: 1, considered: 60, strength: 1500 },
  { maiaElo: 1800, temperature: 1, considered: 60, strength: 1535 },
  { maiaElo: 2100, temperature: 1, considered: 60, strength: 1712 },
  { maiaElo: 2400, temperature: 1, considered: 60, strength: 1742 },
  // Sharpened: Maia's likeliest moves, much more often.
  { maiaElo: 2400, temperature: 0.1, considered: 60, strength: 1976 },
  // The check: Stockfish picks the soundest of Maia's few likeliest moves.
  { maiaElo: 2400, temperature: 0.1, considered: 60, check: { depth: 8, candidates: 4 }, checkChance: 0.5, strength: 2215 },
  { maiaElo: 2400, temperature: 0.1, considered: 60, check: { depth: 8, candidates: 4 }, checkChance: 1, strength: 2393 },
  { maiaElo: 2400, temperature: 0.1, considered: 60, check: { depth: 12, candidates: 6 }, checkChance: 1, strength: 2539 },
]

function blend(rating: number, a: Rung, b: Rung): BotPlan {
  const t = b.strength === a.strength ? 0 : (rating - a.strength) / (b.strength - a.strength)
  const mix = (x: number, y: number) => x + t * (y - x)
  const out: BotPlan = {
    maiaElo: Math.round(mix(a.maiaElo, b.maiaElo)),
    temperature: +mix(a.temperature, b.temperature).toFixed(3),
    considered: Math.round(mix(a.considered, b.considered)),
  }
  // Rarer moves: only while both rungs allow them (the weakest bots).
  if (a.includeRare && b.includeRare) out.includeRare = true
  else if (a.includeRare) out.includeRare = t < 0.5
  // The check: used more often towards the stronger rung.
  const chance = (r: Rung) => (r.check ? (r.checkChance ?? 1) : 0)
  if (a.check || b.check) {
    out.check = (t < 0.5 && a.check) || !b.check ? a.check : b.check
    out.checkChance = +mix(chance(a), chance(b)).toFixed(3)
  }
  return out
}

const plan = ({ strength: _strength, ...rest }: Rung): BotPlan => rest

/** How a bot of this rating plays. Beyond either end of the ladder, the end rung. */
export function botPlan(rating: number): BotPlan {
  if (rating <= LADDER[0].strength) return plan(LADDER[0])
  for (let i = 1; i < LADDER.length; i++) {
    if (rating <= LADDER[i].strength) return blend(rating, LADDER[i - 1], LADDER[i])
  }
  return plan(LADDER[LADDER.length - 1])
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
