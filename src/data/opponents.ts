// One way to describe whoever the player faces: a club character (strength
// from the act baseline plus their offset) or a plain practice level.
import { characterRating, findCharacter, type Character } from './characters'
import { findLevel } from './testOpponents'

export type Opponent = {
  id: string
  name: string
  rating: number
  /**
   * 'maia': every bot (Oct 2026), at the Maia setting measured to match its
   * rating (logic/botStrength.ts). 'bot': the old Stockfish-based bot, now only
   * Maia's stand-in. 'full': Stockfish's best move every time.
   */
  engine: 'bot' | 'maia' | 'full'
  /** Rating hidden on screen (Toby on trial night: new members are unrated). */
  unrated?: boolean
  character?: Character
}

/** Until ratings arrive (phase 4), the test screen sets a stand-in baseline. */
export const DEFAULT_BASELINE = 1000

const CHARACTER_PREFIX = 'char:'

export const characterOpponentId = (characterId: string) => CHARACTER_PREFIX + characterId

/**
 * Works out the opponent for a game. `rating` is the strength saved with the
 * game when it started, so a character's rating never shifts mid-game.
 */
export function resolveOpponent(opponentId: string, rating?: number, fullStrength = false): Opponent {
  if (opponentId.startsWith(CHARACTER_PREFIX)) {
    const character = findCharacter(opponentId.slice(CHARACTER_PREFIX.length))
    if (character) {
      const r = rating ?? characterRating(character, DEFAULT_BASELINE)
      if (fullStrength) return { id: opponentId, name: character.name, rating: r, engine: 'full', unrated: true, character }
      return { id: opponentId, name: character.name, rating: r, engine: 'maia', character }
    }
  }
  const level = findLevel(opponentId)
  return { id: level.id, name: level.label, rating: level.rating, engine: level.engine }
}
