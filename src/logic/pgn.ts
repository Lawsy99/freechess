// A game as PGN, the standard way to write a chess game down (FreeChess, Oct
// 2026: "Share this game"). Any chess site or app can open it.
import { replay } from './game'
import { outcomeOf, type GameRecord } from './gameRecord'

export function gamePgn(game: GameRecord, opponentName: string, playerName = 'You', when = new Date(game.startedAt)): string {
  const chess = replay(game.moves)
  const outcome = outcomeOf(game)
  const result = !outcome ? '*' : outcome.winner === null ? '1/2-1/2' : outcome.winner === 'w' ? '1-0' : '0-1'
  const date = `${when.getFullYear()}.${String(when.getMonth() + 1).padStart(2, '0')}.${String(when.getDate()).padStart(2, '0')}`
  const white = game.playerColour === 'w' ? playerName : opponentName
  const black = game.playerColour === 'w' ? opponentName : playerName
  for (const [k, v] of [
    ['Event', 'FreeChess game'],
    ['Site', 'FreeChess'],
    ['Date', date],
    ['White', white],
    ['Black', black],
    ['Result', result],
  ]) chess.setHeader(k, v)
  // (chess.js leaves the result off the move text unless the board shows it.)
  const text = chess.pgn()
  return text.trimEnd().endsWith(result) ? text : `${text} ${result}`
}
