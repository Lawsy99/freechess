import type { TimeControlId } from './clock'
import type { BoardThemeId } from '../components/boardTheme'

// The player's settings (design document, "Chatter setting" and "Screens").

/**
 * Full: everything. Quiet: lines before and after the game only.
 * Off: story beats only.
 */
export type Chatter = 'full' | 'quiet' | 'off'

export type Settings = {
  chatter: Chatter
  /** A click for each move. */
  sound: boolean
  /** Board colours: see components/boardTheme.ts. */
  board: BoardThemeId
  /**
   * Full help in every game (Joseph, Sep 2026): unlimited hints and takebacks,
   * the evaluation bar and move ratings. Before each must-win game Pemberton
   * asks whether you want it; games won with it move the story on but don't
   * change the rating.
   */
  unlimitedHelp?: boolean
  /** A tick and a cross before each move is played (Joseph, Sep 2026, as on chess.com). On unless turned off. */
  confirmMoves?: boolean
  /** Dots on the squares a piece can move to (FreeChess, Sep 2026). On unless turned off. */
  showMoves?: boolean
  /** The clock picked last time for bot games (logic/clock.ts); none unless chosen. */
  timeControl?: TimeControlId
}

export const DEFAULT_SETTINGS: Settings = { chatter: 'full', sound: true, board: 'club', unlimitedHelp: false, confirmMoves: true }

export const CHATTER_OPTIONS: { value: Chatter; label: string; detail: string }[] = [
  { value: 'full', label: 'Full', detail: 'Lines before, during and after games.' },
  { value: 'quiet', label: 'Quiet', detail: 'Before and after the game only.' },
  { value: 'off', label: 'Off', detail: 'The bots play without a word.' },
]
