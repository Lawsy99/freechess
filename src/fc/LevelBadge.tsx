// A level's badge (Sep 2026): its colour, with a chess piece that grows with
// the level: pawn, knight, rook, king. The pieces are the board's own.
import { defaultPieces } from 'react-chessboard'
import type { BotGroup } from '../data/bots'

const PIECE: Record<BotGroup, string> = { beginner: 'wP', intermediate: 'wN', advanced: 'wR', master: 'wK' }

export function LevelBadge({ group, size = 40 }: { group: BotGroup; size?: number }) {
  return (
    <span className={`fc-level-badge lvl-${group}`} style={{ width: size, height: size }} aria-hidden="true">
      {defaultPieces[PIECE[group]]({ svgStyle: { width: size * 0.78, height: size * 0.78 } })}
    </span>
  )
}
