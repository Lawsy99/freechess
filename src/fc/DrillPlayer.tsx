// One drill (FreeChess, Oct 2026, after maiachess.com): the position on the
// board, you play your side, Maia answers like a real player at the chosen
// level (following the opening's lines while you do). It ends after your
// moves, when the game ends, or, for a finishing drill, when the goal is met
// or missed. Then the report.
import { Chess } from 'chess.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Board } from '../components/Board'
import { Portrait } from '../components/Portrait'
import type { Opponent } from '../data/opponents'
import { chooseOpponentMove } from '../engine/opponent'
import { bookReply, drillState, type Drill } from '../logic/drills'
import type { DrillVerdict } from '../logic/endgameDrill'
import { applyUci } from '../logic/game'

type Props = {
  drill: Drill
  /** Maia's level: the rating it plays at. */
  rating: number
  /** Which drill this is in the set, for the header. */
  position: { index: number; total: number }
  onFinished: (moves: string[], verdict: DrillVerdict | null) => void
}

const GOALS = { mate: 'Checkmate them', promote: 'Make a queen that survives', hold: 'Hold on: don’t lose' }

export function DrillPlayer({ drill, rating, position, onFinished }: Props) {
  const [moves, setMoves] = useState<string[]>([])
  const [error, setError] = useState(false)
  const chess = useMemo(() => {
    const c = new Chess(drill.startFen)
    for (const m of moves) applyUci(c, m)
    return c
  }, [drill.startFen, moves])
  const fen = chess.fen()
  // Your moves so far: every other one, starting with yours if you move first.
  const youFirst = new Chess(drill.startFen).turn() === drill.player
  const yourMoves = youFirst ? Math.ceil(moves.length / 2) : Math.floor(moves.length / 2)
  const yourTurn = chess.turn() === drill.player
  // Finishing drills are judged on your turn (after their reply); others end after your last move.
  const state = drill.endgame
    ? yourTurn || chess.isGameOver()
      ? drillState(drill, fen, yourMoves)
      : { over: false, verdict: null }
    : chess.isGameOver() || (yourMoves >= drill.playMoves && !yourTurn)
      ? { over: true, verdict: null }
      : { over: false, verdict: null }

  // Maia's reply.
  const opponent = useMemo<Opponent>(() => ({ id: 'drill', name: 'Maia', rating, engine: 'maia' }), [rating])
  useEffect(() => {
    if (state.over || yourTurn) return
    let cancelled = false
    const book = drill.lines ? bookReply(drill.lines, moves) : null
    chooseOpponentMove(fen, moves, opponent, undefined, book, 1200)
      .then(({ move }) => {
        if (!cancelled && move) setMoves((m) => [...m, move])
      })
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per position
  }, [fen, state.over, yourTurn])

  // Done: hand over to the report, once.
  const reported = useRef(false)
  useEffect(() => {
    if (!state.over || reported.current) return
    reported.current = true
    const t = window.setTimeout(() => onFinished(moves, state.verdict), 700)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when it ends
  }, [state.over])

  const last = chess.history({ verbose: true }).at(-1)
  const shown = Math.min(yourMoves + (yourTurn && !state.over ? 1 : 0), drill.playMoves)

  return (
    <div className="drill-play">
      <p className="drill-head">
        <strong>{drill.title}</strong>
        <span>
          Drill {position.index + 1} of {position.total} · {drill.endgame ? `move ${shown} of ${drill.playMoves} at most` : `move ${shown} of ${drill.playMoves}`}
        </span>
      </p>
      <Board
        fen={fen}
        orientation={drill.player === 'w' ? 'white' : 'black'}
        movableColour={yourTurn && !state.over ? drill.player : null}
        lastMove={last ? { from: last.from, to: last.to } : (drill.lastMove ?? null)}
        onMove={(uci) => {
          const c = new Chess(fen)
          if (applyUci(c, uci)) setMoves((m) => [...m, uci])
        }}
      />
      <div className="drill-note">
        <Portrait who="coach" size={32} className="fc-face" />
        <p>
          {error
            ? 'Maia couldn’t answer. Check your connection and try again.'
            : state.over
              ? 'That’s the drill. Let’s see how you did…'
              : moves.length === 0
                ? (drill.endgame ? `${GOALS[drill.endgame.goal]}. ${drill.intro ?? ''}` : drill.intro)
                : yourTurn
                  ? 'Your move.'
                  : 'Maia is thinking…'}
        </p>
      </div>
    </div>
  )
}
