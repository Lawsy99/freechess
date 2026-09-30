// Choosing bots for the player: which group suits a rating, and a bot worth
// playing next. Pure, so it can be tested on its own.
import { BOTS, type Bot, type BotGroup } from '../data/bots'
import type { Style } from '../data/characters'
import type { Profile } from './profile'

/** The group whose bots best match a rating. */
export function groupFor(rating: number): BotGroup {
  if (rating < 1000) return 'beginner'
  if (rating < 1600) return 'intermediate'
  if (rating < 2050) return 'advanced'
  return 'master'
}

/** A bot worth playing next: at or just above your rating, with stars still to win. */
export function suggestedBot(profile: Profile): Bot {
  const rating = profile.rating ? profile.rating.rating : 800
  const byCloseness = [...BOTS].sort((a, b) => Math.abs(a.rating - rating - 50) - Math.abs(b.rating - rating - 50))
  return byCloseness.find((b) => (profile.stars[b.id] ?? 0) < 3) ?? byCloseness[0]
}

/** How each playing style is described on a bot's page. */
export const STYLE_LABELS: Record<Style, { label: string; detail: string }> = {
  aggressive: { label: 'Attacker', detail: 'Goes for your king, and takes risks to get there.' },
  solid: { label: 'Solid', detail: 'Safe, sensible moves. Rarely gives anything away.' },
  simplifying: { label: 'Swapper', detail: 'Trades pieces off and heads for the endgame.' },
  grinding: { label: 'Grinder', detail: 'Squeezes small advantages and never lets go.' },
  theoretical: { label: 'Book player', detail: 'Knows the openings well. Get them out of the book.' },
  adaptive: { label: 'All-rounder', detail: 'Plays whatever the position needs.' },
}
