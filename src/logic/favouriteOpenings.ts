// A bot's favourite openings, by name, from its opening book (FreeChess, Sep
// 2026): shown on its page so you know what's coming.
import { OPENING_BOOKS } from '../data/openingBooks'
import { OPENING_NAMES } from '../data/scouting'
import { detectOpening } from './openings'

const tokens = (line: string) => line.split(/\s+/).filter((t) => t && !/^\d+\.+$/.test(t))

/** "Exchange variations" is only a favourite for bots who love swapping; the rest just have one such line. */
const SWAPPERS = ['lukas', 'clive']

function names(lines: readonly string[], botId: string): string[] {
  const seen: string[] = []
  for (const line of lines) {
    const key = detectOpening(tokens(line))
    if (key === 'exchange' && !SWAPPERS.includes(botId)) continue
    const name = key ? OPENING_NAMES[key] : undefined
    if (name && !seen.includes(name)) seen.push(name)
  }
  return seen
}

/** "the Italian", "the Caro-Kann"… for each colour; empty when the bot has no book. */
export function favouriteOpenings(botId: string): { white: string[]; black: string[] } {
  const book = OPENING_BOOKS[botId]
  // (Terry's Bongcloud and Grob have no family to name: his bio says it all.)
  if (!book || botId === 'terry') return { white: [], black: [] }
  return { white: names(book.white, botId).slice(0, 2), black: names(book.black, botId).slice(0, 2) }
}
