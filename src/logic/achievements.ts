// Achievements (FreeChess, Sep 2026, from a look at chess.com): badges for
// milestones, worked out from what the profile already records, so they
// count what you'd done before they existed. Pure, so it can be tested.
import { BOTS, botsIn, type BotGroup } from '../data/bots'
import { ALL_LESSONS } from '../data/learnPath'
import type { Profile } from './profile'

export type BadgeGroup = 'play' | 'stars' | 'rating' | 'puzzles' | 'learn' | 'streak'

export type Badge = {
  id: string
  title: string
  detail: string
  group: BadgeGroup
  /** How far along you are, and how far there is to go. */
  progress: (p: Profile) => { value: number; target: number }
}

export const BADGE_GROUPS: { id: BadgeGroup; label: string }[] = [
  { id: 'play', label: 'Playing' },
  { id: 'stars', label: 'Stars' },
  { id: 'rating', label: 'Rating' },
  { id: 'puzzles', label: 'Puzzles' },
  { id: 'learn', label: 'Learning' },
  { id: 'streak', label: 'Streaks' },
]

const wins = (p: Profile) => Object.values(p.results).reduce((n, r) => n + r.wins, 0)
const games = (p: Profile) => Object.values(p.results).reduce((n, r) => n + r.wins + r.losses + r.draws, 0)
const stars = (p: Profile) => Object.values(p.stars).reduce((n, s) => n + s, 0)
const bestRating = (p: Profile) => Math.max(0, ...p.ratingHistory.map((r) => r.rating), Math.round(p.rating?.rating ?? 0))
const beaten = (p: Profile, group: BotGroup) => botsIn(group).filter((b) => (p.results[b.id]?.wins ?? 0) > 0).length

function groupBadge(group: BotGroup, title: string): Badge {
  return {
    id: `beat-${group}`,
    title,
    detail: `Beat every ${group} bot.`,
    group: 'play',
    progress: (p) => ({ value: beaten(p, group), target: botsIn(group).length }),
  }
}

const count = (id: string, title: string, detail: string, group: BadgeGroup, target: number, value: (p: Profile) => number): Badge => ({
  id,
  title,
  detail,
  group,
  progress: (p) => ({ value: value(p), target }),
})

export const BADGES: Badge[] = [
  count('first-win', 'First win', 'Beat any bot.', 'play', 1, wins),
  count('games-25', 'Regular', 'Play 25 bot games.', 'play', 25, games),
  count('games-100', 'Centurion', 'Play 100 bot games.', 'play', 100, games),
  groupBadge('beginner', 'Beginner graduate'),
  groupBadge('intermediate', 'Club strength'),
  groupBadge('advanced', 'Expert'),
  groupBadge('master', 'Master slayer'),

  count('three-stars', 'Clean win', 'Win three stars against any bot.', 'stars', 1, (p) => Object.values(p.stars).filter((s) => s >= 3).length),
  count('stars-50', 'Star collector', 'Collect 50 stars.', 'stars', 50, stars),
  count('stars-all', 'Every star', 'Collect every star from every bot.', 'stars', BOTS.length * 3, stars),

  count('rating-1000', '1000', 'Reach a rating of 1000.', 'rating', 1000, bestRating),
  count('rating-1500', '1500', 'Reach a rating of 1500.', 'rating', 1500, bestRating),
  count('rating-2000', '2000', 'Reach a rating of 2000.', 'rating', 2000, bestRating),

  count('puzzles-100', 'Puzzler', 'Solve 100 puzzles.', 'puzzles', 100, (p) => p.puzzlesSolved ?? 0),
  count('puzzles-500', 'Puzzle master', 'Solve 500 puzzles.', 'puzzles', 500, (p) => p.puzzlesSolved ?? 0),
  count('rush-10', 'Quick eyes', 'Score 10 in Puzzle Rush.', 'puzzles', 10, (p) => p.rushBest ?? 0),
  count('rush-20', 'Lightning', 'Score 20 in Puzzle Rush.', 'puzzles', 20, (p) => p.rushBest ?? 0),

  count('lesson-1', 'First lesson', 'Finish a lesson.', 'learn', 1, (p) => p.lessonsDone?.length ?? 0),
  count('lessons-half', 'Halfway', 'Finish half the Learn path.', 'learn', Math.ceil(ALL_LESSONS.length / 2), (p) => p.lessonsDone?.length ?? 0),
  count('lessons-all', 'Graduate', 'Finish the whole Learn path.', 'learn', ALL_LESSONS.length, (p) => p.lessonsDone?.length ?? 0),
  count('coach-10', 'Coached', 'Play 10 games with the Coach.', 'learn', 10, (p) => p.coachGames ?? 0),

  count('streak-3', 'Three in a row', 'Keep a 3-day streak.', 'streak', 3, (p) => p.streak.best),
  count('streak-7', 'A week', 'Keep a 7-day streak.', 'streak', 7, (p) => p.streak.best),
  count('streak-30', 'A month', 'Keep a 30-day streak.', 'streak', 30, (p) => p.streak.best),
]

export function earned(p: Profile): Set<string> {
  return new Set(BADGES.filter((b) => {
    const { value, target } = b.progress(p)
    return value >= target
  }).map((b) => b.id))
}

/** Badges earned in `after` that weren't in `before` (for "New badge" after a game). */
export function newlyEarned(before: Profile, after: Profile): Badge[] {
  const had = earned(before)
  const now = earned(after)
  return BADGES.filter((b) => now.has(b.id) && !had.has(b.id))
}
