// The vision trainer (FreeChess, Sep 2026, as on chess.com): a square is named,
// you tap it on a board with no letters or numbers. As many as you can in 30
// seconds. Knowing the squares by heart makes reading moves (and notation) easy.
export const VISION_SECONDS = 30

const FILES = 'abcdefgh'

/** A random square, never the same as the last one. */
export function nextSquare(previous: string | null, random: () => number = Math.random): string {
  for (;;) {
    const sq = `${FILES[Math.floor(random() * 8)]}${1 + Math.floor(random() * 8)}`
    if (sq !== previous) return sq
  }
}
