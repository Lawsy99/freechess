// Master Games (FreeChess, Oct 2026): famous games explained move by move, in
// plain words, every claim checked with Stockfish. The moves are published
// game records (checked against a source and replayed by the rules); the
// notes are our own. See docs/freechess-plan.md.

/** A "Your move" stop: the board pauses before this move and asks what you'd play. */
export type MasterGameStop = {
  /** The move (0 = White's first) the stop is before. */
  ply: number
  prompt: string
  /** The game's move is marked best; the others are real alternatives, judged by the engine. */
  options: { san: string; text: string; best?: boolean }[]
}

export type MasterGame = {
  id: string
  title: string
  white: string
  black: string
  /** A short "White v Black" for the game card, when surnames don't do. */
  players?: string
  place: string
  year: number
  result: '1-0' | '0-1' | '1/2-1/2'
  /** The idea the game teaches, in a few words ("Development and open lines"). */
  theme: string
  /** Which side to watch from (the winner's). */
  orientation: 'white' | 'black'
  /** A chess legend from the Legends row who played it, if any. */
  legend?: string
  intro: string
  /** Before move 1: the big picture, what each side should be aiming for. */
  plans: string
  /**
   * The game in chapters (Joseph, Oct 2026: it needs the big picture). At each
   * turning point, "The plan now": where the game stands and what each side wants.
   * Shown when the board reaches `ply` moves.
   */
  chapters: { ply: number; title: string; text: string }[]
  /** The moves, as published. */
  pgn: string
  /** One note for each move, in order (notes[0] is White's first move). */
  notes: string[]
  stops: MasterGameStop[]
  /** What happened after the last move (a resignation, an announced mate). */
  ending: string
  /** The lessons to take away, three or four. */
  lessons: string[]
}
