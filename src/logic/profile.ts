// The player's FreeChess profile: rating, stars against each bot, results,
// and the daily goals with their streak (Joseph, Sep 2026: Duolingo-style
// goals: one bot game, one coached game, one lesson a day). Pure functions;
// saving lives in storage/db.ts.
import { NEW_PLAYER, rateGame, type PlayerRating } from './glicko2'
import type { Style } from '../data/characters'

export type Level = 'new' | 'beginner' | 'intermediate' | 'advanced'

/** Where each answer to "How much chess have you played?" starts the rating. */
export const START_RATINGS: Record<Level, number> = { new: 400, beginner: 800, intermediate: 1200, advanced: 1600 }

/** A new player's rating starts this unsure: it moves quickly, but not wildly. */
export const NEW_DEVIATION = 200
/** The most one game can move the rating. */
export const MAX_CHANGE = 80

// Joseph, Oct 2026: the lesson first, and puzzles get a goal of their own.
export type Goal = 'lesson' | 'puzzles' | 'bot' | 'coach'
export const GOALS: Goal[] = ['lesson', 'puzzles', 'bot', 'coach']
/** Puzzles solved in a day for the puzzle goal. */
export const PUZZLE_GOAL = 3

export type Record3 = { wins: number; losses: number; draws: number }

export type Profile = {
  level: Level | null
  rating: PlayerRating | null
  /** Rating after each rated game, oldest first (for the graph). */
  ratingHistory: { at: number; rating: number }[]
  /** Best stars earned against each bot (0 to 3). */
  stars: Record<string, number>
  results: Record<string, Record3>
  /** Today's goals, by local date ("2026-09-30"). */
  daily: { day: string; done: Goal[] }
  /** Days in a row with at least one goal done. */
  streak: { count: number; lastDay: string | null; best: number }
  /** Games played with the Coach (not rated). */
  coachGames?: number
  /** Puzzles: how many solved in all, the best Puzzle Rush score, and the last day the daily puzzle was solved. */
  puzzlesSolved?: number
  rushBest?: number
  /** Best score in the vision trainer (squares named in 30 seconds). */
  visionBest?: number
  dailySolvedOn?: string
  /** Learn: lessons passed, by id (data/learnPath.ts). */
  lessonsDone?: string[]
  /** The most rating points above you of a bot you've beaten (for the Giant killer badges). */
  bestUpset?: number
  /**
   * Streak freezes (Sep 2026, as Duolingo has them): one earned each day all
   * three goals are done, two at most. A missed day uses one, and the streak
   * carries on. The days they covered are kept for the week on Home.
   */
  freezes?: number
  frozenDays?: string[]
  /** When this profile was last saved (for combining devices: the newest decides the rating and streak). */
  updatedAt?: number
  /** Master Games finished, by id (data/masterGames). */
  masterGames?: string[]
  /** Chess legends: how many of each one's levels you've beaten (data/legends.ts). */
  legends?: Record<string, number>
  /** Puzzles solved today, for the puzzle goal. */
  puzzlesToday?: { day: string; count: number }
  /** Days with at least one goal done ("2026-09-30"), the last 60, for the week on Home. */
  activeDays?: string[]
  /** The custom bot you last set up (strength and style), to start from next time. */
  customBot?: { rating: number; style: Style }
}

export const NEW_PROFILE: Profile = {
  level: null,
  rating: null,
  ratingHistory: [],
  stars: {},
  results: {},
  daily: { day: '', done: [] },
  streak: { count: 0, lastDay: null, best: 0 },
}

/** Local date as "YYYY-MM-DD" (the day, as the player sees it). */
export function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function previousDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d - 1))
}

/** Answering the first question: the starting rating, not yet settled (it moves quickly at first). */
export function withLevel(p: Profile, level: Level, now: number): Profile {
  const rating = { ...NEW_PLAYER, rating: START_RATINGS[level] }
  return { ...p, level, rating, ratingHistory: [{ at: now, rating: rating.rating }] }
}

/**
 * Stars for a game against a bot (Joseph, Sep 2026): three for a win with no
 * help, one fewer for each takeback or hint, none below that. Draws and
 * losses earn none.
 */
export function starsFor(won: boolean, aidsUsed: number): number {
  return won ? Math.max(0, 3 - aidsUsed) : 0
}

/** The day's goals as they stand today (yesterday's ticks don't carry over). */
export function todaysGoals(p: Profile, today: string): Goal[] {
  return p.daily.day === today ? p.daily.done : []
}

/** Most streak freezes you can hold. */
export const MAX_FREEZES = 2

/** The days missed between the last goal and today (none if it was today or yesterday). */
function missedDays(lastDay: string | null, today: string): string[] {
  if (!lastDay || lastDay >= today) return []
  const missed: string[] = []
  for (let d = previousDay(today); d > lastDay && missed.length <= MAX_FREEZES; d = previousDay(d)) missed.push(d)
  return missed
}

/**
 * The streak as it stands today: it counts if the last goal was today or
 * yesterday, or if your freezes cover the days missed since.
 */
export function currentStreak(p: Profile, today: string): number {
  const last = p.streak.lastDay
  if (last === null) return 0
  return missedDays(last, today).length <= (p.freezes ?? 0) ? p.streak.count : 0
}

/** Ticks off one of today's goals, and keeps the streak going. */
export function completeGoal(p: Profile, goal: Goal, today: string): Profile {
  const done = todaysGoals(p, today)
  const daily = { day: today, done: done.includes(goal) ? done : [...done, goal] }
  let streak = p.streak
  let freezes = p.freezes ?? 0
  let frozenDays = p.frozenDays ?? []
  if (streak.lastDay !== today) {
    const missed = missedDays(streak.lastDay, today)
    // Missed days your freezes can cover: used up, and the streak carries on.
    const bridged = streak.lastDay !== null && missed.length > 0 && missed.length <= freezes
    if (bridged) {
      freezes -= missed.length
      frozenDays = [...frozenDays, ...missed].slice(-30)
    }
    const count = streak.lastDay !== null && (missed.length === 0 || bridged) ? streak.count + 1 : 1
    streak = { count, lastDay: today, best: Math.max(streak.best, count) }
  }
  // All three goals done today, for the first time today: a freeze earned.
  if (daily.done.length === GOALS.length && done.length < GOALS.length) freezes = Math.min(MAX_FREEZES, freezes + 1)
  const days = p.activeDays ?? []
  const activeDays = days.includes(today) ? days : [...days, today].slice(-60)
  return { ...p, daily, streak, activeDays, freezes, frozenDays }
}

export type WeekDay = { day: string; label: string; active: boolean; frozen: boolean; today: boolean; future: boolean }

/**
 * This week, Monday to Sunday, with the days you practised (Sep 2026, as
 * Duolingo shows it). Days inside the current streak count too, for players
 * from before the days were kept.
 */
export function thisWeek(p: Profile, now: Date): WeekDay[] {
  const today = dayKey(now)
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7))
  const streakDays = new Set<string>()
  if (p.streak.lastDay) {
    const [y, m, d] = p.streak.lastDay.split('-').map(Number)
    for (let i = 0; i < p.streak.count; i++) streakDays.add(dayKey(new Date(y, m - 1, d - i)))
  }
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => {
    const day = dayKey(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i))
    const frozen = (p.frozenDays ?? []).includes(day)
    return { day, label, active: !frozen && ((p.activeDays ?? []).includes(day) || streakDays.has(day)), frozen, today: day === today, future: day > today }
  })
}

export type BotResult = 'win' | 'loss' | 'draw'

/**
 * After a game against a bot: the rating (every bot game is rated), the best
 * stars against that bot, the record, and today's bot goal.
 */
export function recordBotGame(
  p: Profile,
  bot: { id: string; rating: number },
  result: BotResult,
  aidsUsed: number,
  now: Date,
  /** Stars and a record against this bot (not for the custom bot, which has neither). */
  keepRecord = true,
): { profile: Profile; stars: number; ratingChange: { from: number; to: number } | null } {
  const stars = starsFor(result === 'win', aidsUsed)
  const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0
  // No question at the start (Joseph, Sep 2026): a new player starts at 800,
  // not yet settled, so the first few games place them quickly.
  const before = p.rating ?? { ...NEW_PLAYER, rating: START_RATINGS.beginner, deviation: NEW_DEVIATION }
  const rated = rateGame(before, bot.rating, score)
  // No single game moves it wildly (a loss to a much weaker bot was costing
  // over 500 points at first).
  const change = Math.max(-MAX_CHANGE, Math.min(MAX_CHANGE, rated.rating - before.rating))
  const after = { ...rated, rating: before.rating + change }
  const record = p.results[bot.id] ?? { wins: 0, losses: 0, draws: 0 }
  const results = {
    ...p.results,
    [bot.id]: {
      wins: record.wins + (result === 'win' ? 1 : 0),
      losses: record.losses + (result === 'loss' ? 1 : 0),
      draws: record.draws + (result === 'draw' ? 1 : 0),
    },
  }
  const next: Profile = {
    ...p,
    rating: after,
    ratingHistory: [...p.ratingHistory, { at: now.getTime(), rating: Math.round(after.rating) }].slice(-200),
    stars: keepRecord ? { ...p.stars, [bot.id]: Math.max(p.stars[bot.id] ?? 0, stars) } : p.stars,
    bestUpset: result === 'win' ? Math.max(p.bestUpset ?? 0, Math.round(bot.rating - before.rating)) : p.bestUpset,
    results: keepRecord ? results : p.results,
  }
  return {
    profile: completeGoal(next, 'bot', dayKey(now)),
    stars: keepRecord ? stars : 0,
    ratingChange: { from: Math.round(before.rating), to: Math.round(after.rating) },
  }
}

/** Stars collected across all bots, out of three per bot. */
export function totalStars(p: Profile): number {
  return Object.values(p.stars).reduce((a, b) => a + b, 0)
}

/**
 * After a game with the Coach: not rated (it's a lesson), but it counts for
 * today's coach goal and the streak.
 */
export function recordCoachGame(p: Profile, now: Date): Profile {
  return completeGoal({ ...p, coachGames: (p.coachGames ?? 0) + 1 }, 'coach', dayKey(now))
}

/** A puzzle finished (the puzzle rating itself is kept with the puzzles). */
export function countPuzzle(p: Profile, solved: boolean, now = new Date()): Profile {
  return solved ? addPuzzlesToday({ ...p, puzzlesSolved: (p.puzzlesSolved ?? 0) + 1 }, 1, now) : p
}

/** A Puzzle Rush finished: keeps the best score, and its puzzles count for today. */
export function withRushScore(p: Profile, score: number, now = new Date()): Profile {
  return addPuzzlesToday({ ...p, rushBest: Math.max(p.rushBest ?? 0, score) }, score, now)
}

/** How many puzzles you've solved today (for the goal's "1 of 3"). */
export function puzzlesSolvedToday(p: Profile, today: string): number {
  return p.puzzlesToday?.day === today ? p.puzzlesToday.count : 0
}

function addPuzzlesToday(p: Profile, solved: number, now: Date): Profile {
  if (solved <= 0) return p
  const today = dayKey(now)
  const count = puzzlesSolvedToday(p, today) + solved
  const next = { ...p, puzzlesToday: { day: today, count } }
  return count >= PUZZLE_GOAL ? completeGoal(next, 'puzzles', today) : next
}

/** A lesson passed: remembered (it unlocks the next), and today's lesson goal. */
export function recordLesson(p: Profile, lessonId: string, now: Date): Profile {
  const done = p.lessonsDone ?? []
  // (Practising your own openings counts for the day, but isn't a step on the path.)
  const keep = done.includes(lessonId) || lessonId.startsWith('my-')
  return completeGoal({ ...p, lessonsDone: keep ? done : [...done, lessonId] }, 'lesson', dayKey(now))
}

/** A vision trainer score: the best is remembered. */
export function withVisionScore(p: Profile, score: number): Profile {
  return { ...p, visionBest: Math.max(p.visionBest ?? 0, score) }
}

/**
 * After a game against a chess legend (Oct 2026): rated like any bot game (no
 * stars), and a win at their current level moves them up one.
 */
export function recordLegendGame(
  p: Profile,
  legend: { id: string },
  rating: number,
  result: BotResult,
  aidsUsed: number,
  now: Date,
  levels: readonly number[],
): { profile: Profile; ratingChange: { from: number; to: number } | null; levelUp: { level: number; rating: number } | null } {
  const recorded = recordBotGame(p, { id: legend.id, rating }, result, aidsUsed, now, false)
  const beaten = p.legends?.[legend.id] ?? 0
  const atLevel = levels[Math.min(beaten, levels.length - 1)] === rating
  if (result !== 'win' || !atLevel || beaten >= levels.length) return { profile: recorded.profile, ratingChange: recorded.ratingChange, levelUp: null }
  const next = beaten + 1
  const profile = { ...recorded.profile, legends: { ...p.legends, [legend.id]: next } }
  // (Beating the last level finishes the journey: no level beyond it.)
  const levelUp = next < levels.length ? { level: next + 1, rating: levels[next] } : null
  return { profile, ratingChange: recorded.ratingChange, levelUp }
}

/** A master game studied to the end: remembered, and today's lesson goal. */
export function recordMasterGame(p: Profile, id: string, now: Date): Profile {
  const done = p.masterGames ?? []
  return completeGoal({ ...p, masterGames: done.includes(id) ? done : [...done, id] }, 'lesson', dayKey(now))
}
