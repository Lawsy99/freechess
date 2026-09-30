// Board colours (Settings: "board style"). Shared through React context so
// every board in the app (games, reviews, lessons, the deck) follows the
// player's choice without each screen passing it down.
import { createContext, useContext } from 'react'

/** 'club' is FreeChess blue (the default); the ids are kept from Club Night. */
export type BoardThemeId = 'club' | 'wood' | 'slate'

export const BOARD_THEMES: Record<BoardThemeId, { label: string; light: string; dark: string; frame: string }> = {
  // FreeChess's own board: a soft blue-grey, easy on the eyes (the default).
  club: { label: 'FreeChess blue', light: '#e6ebf2', dark: '#7b96b9', frame: '#2a2e36' },
  wood: { label: 'Wood', light: '#f0d9b5', dark: '#b58863', frame: '#6b4a2b' },
  slate: { label: 'Green', light: '#e7ecd6', dark: '#76985a', frame: '#3c4a33' },
}

export const BoardThemeContext = createContext<BoardThemeId>('club')

export function useBoardColours() {
  return BOARD_THEMES[useContext(BoardThemeContext)] ?? BOARD_THEMES.club
}
