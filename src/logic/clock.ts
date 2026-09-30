// Clocks for bot games (FreeChess, Sep 2026, as on chess.com): optional, off
// unless you pick a time. Each side's time left is saved with the game after
// every move. Time only runs while the game is on screen: closing the app or
// pausing stops it, so nobody loses on time for answering the phone.
import type { Colour } from './game'

export type Clock = {
  /** Time left for each side, in milliseconds, as of the last move. */
  w: number
  b: number
  /** Added to a side's clock after each of its moves. */
  incrementMs: number
}

export type TimeControlId = 'none' | '10' | '5' | '3+2'

export const TIME_CONTROLS: { id: TimeControlId; label: string; minutes: number; increment: number }[] = [
  { id: 'none', label: 'No clock', minutes: 0, increment: 0 },
  { id: '10', label: '10 min', minutes: 10, increment: 0 },
  { id: '5', label: '5 min', minutes: 5, increment: 0 },
  { id: '3+2', label: '3 + 2', minutes: 3, increment: 2 },
]

/** A fresh clock for a time control, or undefined for "No clock". */
export function startClock(id: TimeControlId): Clock | undefined {
  const tc = TIME_CONTROLS.find((t) => t.id === id)
  if (!tc || tc.minutes === 0) return undefined
  const ms = tc.minutes * 60_000
  return { w: ms, b: ms, incrementMs: tc.increment * 1000 }
}

/** After `side` moved, having used `usedMs`: their time goes down, then the increment goes on. */
export function afterMove(clock: Clock, side: Colour, usedMs: number): Clock {
  const left = Math.max(0, clock[side] - Math.max(0, usedMs))
  return { ...clock, [side]: left > 0 ? left + clock.incrementMs : 0 }
}

/** "4:59"; under ten seconds, tenths too ("0:09.4"). */
export function formatClock(ms: number): string {
  const safe = Math.max(0, ms)
  const minutes = Math.floor(safe / 60_000)
  const seconds = Math.floor((safe % 60_000) / 1000)
  const base = `${minutes}:${String(seconds).padStart(2, '0')}`
  return safe < 10_000 ? `${base}.${Math.floor((safe % 1000) / 100)}` : base
}

/**
 * How long a bot may take over a move with this much time left: its usual
 * pace, but never more than a fortieth of what's left (so it hurries when short).
 */
export function botPauseCap(timeLeftMs: number | undefined): number {
  if (timeLeftMs === undefined) return Infinity
  return Math.max(150, timeLeftMs / 40)
}
