// Combining progress from two devices (FreeChess sync, Oct 2026). Nothing is
// lost: games, mistakes, lessons, badges and stars from both are kept; the
// rating, the streak and other "where you are now" values come from whichever
// device was used most recently. Pure, so it can be tested.
import type { MistakeCard } from './mistakesDeck'
import type { Profile } from './profile'

/** What syncs: progress only. Settings and a game in progress stay on each device. */
export type SyncData = {
  v: 1
  savedAt: number
  profile: Profile | null
  puzzles: SyncPuzzles | null
  games: SyncGame[]
  cards: MistakeCard[]
}

export type SyncPuzzles = { rating: unknown; seen: string[]; ownSeen?: string[]; updatedAt?: number }
type SyncGame = { id: string; finishedAt?: number; evals?: unknown[] } & Record<string, unknown>

const union = <T>(a: readonly T[] = [], b: readonly T[] = []) => [...new Set([...a, ...b])]

function maxRecord(a: Record<string, number> = {}, b: Record<string, number> = {}): Record<string, number> {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v)
  return out
}

const maxOpt = (a?: number, b?: number) => (a === undefined && b === undefined ? undefined : Math.max(a ?? 0, b ?? 0))

export function mergeProfiles(a: Profile | null, b: Profile | null): Profile | null {
  if (!a || !b) return a ?? b
  // The more recently used device decides "where you are now".
  const [newer, older] = (a.updatedAt ?? 0) >= (b.updatedAt ?? 0) ? [a, b] : [b, a]
  const ratingHistory = [...new Map([...older.ratingHistory, ...newer.ratingHistory].map((r) => [r.at, r])).values()]
    .sort((x, y) => x.at - y.at)
    .slice(-200)
  // Results against each bot: the larger count of each (a game is only ever on one device before it syncs).
  const results: Profile['results'] = { ...older.results }
  for (const [id, r] of Object.entries(newer.results)) {
    const o = results[id] ?? { wins: 0, losses: 0, draws: 0 }
    results[id] = { wins: Math.max(o.wins, r.wins), losses: Math.max(o.losses, r.losses), draws: Math.max(o.draws, r.draws) }
  }
  // Today's goals: if both are the same day, everything done on either.
  const daily =
    newer.daily.day === older.daily.day ? { day: newer.daily.day, done: union(newer.daily.done, older.daily.done) } : newer.daily.day > older.daily.day ? newer.daily : older.daily
  const puzzlesToday =
    newer.puzzlesToday && older.puzzlesToday && newer.puzzlesToday.day === older.puzzlesToday.day
      ? { day: newer.puzzlesToday.day, count: Math.max(newer.puzzlesToday.count, older.puzzlesToday.count) }
      : (newer.puzzlesToday ?? older.puzzlesToday)
  const streak =
    (newer.streak.lastDay ?? '') >= (older.streak.lastDay ?? '')
      ? { ...newer.streak, best: Math.max(newer.streak.best, older.streak.best) }
      : { ...older.streak, best: Math.max(newer.streak.best, older.streak.best) }
  return {
    ...older,
    ...newer,
    ratingHistory,
    stars: maxRecord(older.stars, newer.stars),
    results,
    daily,
    puzzlesToday,
    streak,
    legends: maxRecord(older.legends, newer.legends),
    lessonsDone: union(older.lessonsDone, newer.lessonsDone),
    activeDays: union(older.activeDays, newer.activeDays).sort().slice(-60),
    frozenDays: union(older.frozenDays, newer.frozenDays).sort().slice(-30),
    coachGames: maxOpt(older.coachGames, newer.coachGames),
    puzzlesSolved: maxOpt(older.puzzlesSolved, newer.puzzlesSolved),
    rushBest: maxOpt(older.rushBest, newer.rushBest),
    visionBest: maxOpt(older.visionBest, newer.visionBest),
    bestUpset: maxOpt(older.bestUpset, newer.bestUpset),
    dailySolvedOn: [older.dailySolvedOn, newer.dailySolvedOn].filter(Boolean).sort().at(-1),
    updatedAt: Math.max(newer.updatedAt ?? 0, older.updatedAt ?? 0),
  }
}

export function mergePuzzles(a: SyncPuzzles | null, b: SyncPuzzles | null): SyncPuzzles | null {
  if (!a || !b) return a ?? b
  const [newer, older] = (a.updatedAt ?? 0) >= (b.updatedAt ?? 0) ? [a, b] : [b, a]
  return { ...newer, seen: union(older.seen, newer.seen).slice(-3000), ownSeen: union(older.ownSeen, newer.ownSeen) }
}

/** Every game from both; where both have it, the one that's been analysed (or finished later). */
export function mergeGames(a: readonly SyncGame[], b: readonly SyncGame[]): SyncGame[] {
  const out = new Map<string, SyncGame>()
  for (const g of [...a, ...b]) {
    const known = out.get(g.id)
    if (!known) out.set(g.id, g)
    else if (!known.evals && g.evals) out.set(g.id, g)
    else if (!!known.evals === !!g.evals && (g.finishedAt ?? 0) > (known.finishedAt ?? 0)) out.set(g.id, g)
  }
  return [...out.values()]
}

/** Every mistake card from both; where both have it, the one that's been played. */
export function mergeCards(a: readonly MistakeCard[], b: readonly MistakeCard[]): MistakeCard[] {
  const out = new Map<string, MistakeCard>()
  for (const c of [...a, ...b]) {
    const known = out.get(c.id)
    if (!known || (!known.retired && c.retired)) out.set(c.id, c)
  }
  return [...out.values()]
}

export function mergeSync(a: SyncData, b: SyncData): SyncData {
  return {
    v: 1,
    savedAt: Math.max(a.savedAt, b.savedAt),
    profile: mergeProfiles(a.profile, b.profile),
    puzzles: mergePuzzles(a.puzzles, b.puzzles),
    games: mergeGames(a.games, b.games),
    cards: mergeCards(a.cards, b.cards),
  }
}

/** A new sync code: 24 letters and numbers (no look-alikes like 0/O, 1/I), shown in groups of four. */
export function newSyncCode(random: () => number = Math.random): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(24)) : null
  return Array.from({ length: 24 }, (_, i) => chars[(bytes ? bytes[i] : Math.floor(random() * 256)) % chars.length]).join('')
}

/** "ABCD-EFGH-…" for showing; any spaces, dashes or lower case typed in are tidied away. */
export const showCode = (code: string) => code.match(/.{1,4}/g)?.join('-') ?? code
export const cleanCode = (typed: string) => typed.toUpperCase().replace(/[^A-Z0-9]/g, '')
