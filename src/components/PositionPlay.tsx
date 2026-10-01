// Playing a position from the analysis board against the computer (FreeChess,
// Oct 2026, as chess.com has it): you take the side to move, it plays at the
// strength you chose. Not rated and not reviewed: it's practice. You can
// take a move back or start again from the same position.
import { Chess } from 'chess.js'
import { useEffect, useMemo, useState } from 'react'
import { customBot } from '../data/customBot'
import { characterOpponentId, resolveOpponent } from '../data/opponents'
import { chooseOpponentMove } from '../engine/opponent'
import { applyUci, describeOutcome, getOutcome, type Colour } from '../logic/game'
import { lineSans, type AnalysisLine } from '../logic/analysisLine'
import { Board } from './Board'
import { Portrait } from './Portrait'
import './AnalysisBoard.css'

type Props = {
  startFen: string
  rating: number
  onBack: () => void
}

export function PositionPlay({ startFen, rating, onBack }: Props) {
  const you = new Chess(startFen).turn() as Colour
  const [moves, setMoves] = useState<string[]>([])
  const [error, setError] = useState(false)
  const opponent = useMemo(() => {
    const bot = customBot(rating, 'adaptive')
    return resolveOpponent(characterOpponentId(bot.id), bot.rating)
  }, [rating])
  const chess = useMemo(() => {
    const c = new Chess(startFen)
    for (const m of moves) applyUci(c, m)
    return c
  }, [startFen, moves])
  const fen = chess.fen()
  const outcome = getOutcome(chess)
  const theirTurn = !outcome && chess.turn() !== you
  const last = chess.history({ verbose: true }).at(-1)

  // The computer's move.
  useEffect(() => {
    if (!theirTurn) return
    let cancelled = false
    // (No opening book from here: the moves list starts from this position.)
    // (Practice: no long thinking pauses.)
    chooseOpponentMove(fen, [], opponent, undefined, null, 1000)
      .then(({ move }) => {
        if (!cancelled && move) setMoves((m) => [...m, move])
      })
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
    }
  }, [fen, theirTurn, opponent])

  const takeBack = () => setMoves((m) => m.slice(0, Math.max(0, m.length - (m.length % 2 === 0 ? 2 : 1))))
  const sans = lineSans({ startFen, moves, cursor: moves.length } as AnalysisLine)

  return (
    <main className="analysis">
      <header className="analysis-head">
        <button type="button" className="analysis-back" onClick={onBack}>
          ‹ Analysis
        </button>
        <h1>Play from here</h1>
      </header>
      <p className="position-play-who">
        <Portrait who="custom-adaptive" size={28} /> Computer · {rating} <span>· not rated</span>
      </p>
      <div className="analysis-board-row">
        <div className="analysis-board-cell">
          <Board
            fen={fen}
            orientation={you === 'w' ? 'white' : 'black'}
            movableColour={outcome ? null : you}
            lastMove={last ? { from: last.from, to: last.to } : null}
            onMove={(uci) => setMoves((m) => [...m, uci])}
          />
        </div>
      </div>
      <p className="position-play-status" aria-live="polite">
        {error
          ? 'The computer couldn’t move. Go back and try again.'
          : outcome
            ? describeOutcome(outcome)
            : theirTurn
              ? 'Thinking…'
              : 'Your move.'}
      </p>
      <ol className="analysis-moves" aria-label="Moves">
        {sans.map((san, i) => (
          <li key={i}>
            <button type="button" className={i === sans.length - 1 ? 'current' : undefined}>
              {san}
            </button>
          </li>
        ))}
      </ol>
      <div className="analysis-controls position-play-controls">
        <button type="button" onClick={takeBack} disabled={moves.length === 0 || theirTurn}>
          Take back
        </button>
        <button type="button" onClick={() => setMoves([])} disabled={moves.length === 0}>
          Start again
        </button>
      </div>
    </main>
  )
}
