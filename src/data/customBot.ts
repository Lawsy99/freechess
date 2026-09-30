// The custom bot (FreeChess, Sep 2026, as on chess.com): you choose its
// strength and style. It plays like any other bot of that rating and style
// and counts for your rating, but it has no stars or record of its own (those
// are for the bots with names). Its id carries the style: "custom-solid".
import { groupFor } from '../logic/botPicks'
import type { Bot } from './bots'
import type { Style } from './characters'

export const CUSTOM_PREFIX = 'custom-'
export const CUSTOM_MIN = 250
export const CUSTOM_MAX = 2400
export const CUSTOM_STEP = 50

export const CUSTOM_STYLES: Style[] = ['adaptive', 'aggressive', 'solid', 'simplifying', 'grinding', 'theoretical']

export function isCustomBot(id: string): boolean {
  return id.startsWith(CUSTOM_PREFIX)
}

/** A custom bot as a Bot, from its id (or style) and rating. */
export function customBot(rating: number, style: Style): Bot {
  const r = Math.max(CUSTOM_MIN, Math.min(CUSTOM_MAX, Math.round(rating / CUSTOM_STEP) * CUSTOM_STEP))
  return { id: `${CUSTOM_PREFIX}${style}`, name: 'Custom bot', group: groupFor(r), rating: r, flag: '', country: '', bio: '', style }
}

/** The style from a custom bot's id, or null if it isn't one. */
export function customStyle(id: string): Style | null {
  if (!isCustomBot(id)) return null
  const style = id.slice(CUSTOM_PREFIX.length) as Style
  return CUSTOM_STYLES.includes(style) ? style : null
}
