// How every bot chooses its move (FreeChess, Oct 2026). The old low bots
// played Stockfish's good moves and then, now and then, a completely random
// one: "brilliant, then hangs the queen" (Joseph). Now every bot uses Maia, a
// model of what real players at a rating actually play, so mistakes are the
// ones people make: a loose piece, a missed threat, a slow move.
//
// Maia is asked to play at the setting measured to match the bot's rating
// (logic/botStrength.ts). The very weakest bots loosen its choice; the
// strongest sharpen it, and at the top Stockfish checks Maia's few likeliest
// moves and plays the soundest, still a move a person would play.

export type PolicyMove = { move: string; p: number }

/** Stockfish checks Maia's likeliest moves and plays the soundest of them. */
export type MoveCheck = {
  /** How deep Stockfish looks at each candidate. */
  depth: number
  /** How many of Maia's likeliest moves it compares (each at least 5% likely). */
  candidates: number
}

/** How a bot of a given rating plays. */
export type BotPlan = {
  /** The rating Maia is asked to imitate. */
  maiaElo: number
  /** 1 is Maia as it is; higher flattens the choice (weaker), lower sharpens it (stronger). */
  temperature: number
  /** How many of the likeliest moves are in the running. */
  considered: number
  /** The very weakest bots: rarer moves are in the running too. */
  includeRare?: boolean
  /** The strongest bots: the check, and how often it's used (0 to 1). */
  check?: MoveCheck
  checkChance?: number
}

/** Moves rarer than this are ones almost nobody would play (as in sampleMove.ts). */
const MIN_LIKELIHOOD = 0.01
/** A candidate for the check must be at least this likely: a move people really play. */
const CHECK_LIKELIHOOD = 0.05

const byLikelihood = (policy: readonly PolicyMove[]) => [...policy].sort((a, b) => b.p - a.p)

/**
 * Picks a move from Maia's likelihoods the way the plan says. At temperature
 * 1, each move is played about as often as real players at that rating play
 * it. `policy` needn't be sorted.
 */
export function pickHumanMove(policy: readonly PolicyMove[], plan: BotPlan, random: () => number = Math.random): string | null {
  if (policy.length === 0) return null
  const pool = byLikelihood(policy)
    .slice(0, Math.max(1, plan.considered))
    .filter((m, i) => i === 0 || plan.includeRare || m.p >= MIN_LIKELIHOOD)
  const weights = pool.map((m) => Math.pow(m.p, 1 / plan.temperature))
  let roll = random() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return pool[i].move
  }
  return pool[pool.length - 1].move
}

/** The moves Stockfish compares for a check: Maia's likeliest, each a move people really play. */
export function checkCandidates(policy: readonly PolicyMove[], check: MoveCheck): string[] {
  return byLikelihood(policy)
    .slice(0, Math.max(1, check.candidates))
    .filter((m, i) => i === 0 || m.p >= CHECK_LIKELIHOOD)
    .map((m) => m.move)
}

/** Whether this move gets the check (strong bots only, as often as the plan says). */
export function usesCheck(plan: BotPlan, random: () => number = Math.random): boolean {
  return !!plan.check && random() < (plan.checkChance ?? 1)
}
