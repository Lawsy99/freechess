// The analysis board (FreeChess, Sep 2026, from a look at chess.com): move
// either side's pieces freely and see what the engine thinks, with its top
// three lines. Opens from any move of a review, or empty from Play, where you
// can set up or paste any position.
import { Chess } from 'chess.js'
import { useMemo, useState } from 'react'
import { useEngineLines } from '../engine/useEngineLines'
import { fenAt, lineSans, playMove, START_FEN, stepTo, toggle, type AnalysisLine } from '../logic/analysisLine'
import { formatScore } from '../logic/evaluation'
import { formatLine } from '../logic/game'
import { Board, DRAW_COLOUR } from './Board'
import { DrawLayer } from './DrawLayer'
import { EvalBar } from './EvalBar'
import { PositionEditor } from './PositionEditor'
import { PositionPlay } from './PositionPlay'
import { SkipIcon, StepIcon } from './StepIcons'
import './AnalysisBoard.css'

type Props = {
  /** Where to start: a game's moves and the move you were looking at, or the starting position. */
  initial?: AnalysisLine
  orientation?: 'white' | 'black'
  onBack: () => void
  /** Offer "Set up a position" (not when opened from a game's review). */
  canSetUp?: boolean
  /** Your rating: the computer's strength to start from for "Play from here". */
  playerRating?: number
}

const ARROW = 'rgba(79, 134, 247, 0.85)'

export function AnalysisBoard({ initial, orientation = 'white', onBack, canSetUp = false, playerRating = 800 }: Props) {
  const [line, setLine] = useState<AnalysisLine>(initial ?? { startFen: START_FEN, moves: [], cursor: 0 })
  const [flipped, setFlipped] = useState(orientation === 'black')
  const [editing, setEditing] = useState(false)
  // Play from here (Oct 2026): choosing a strength, then playing the position out.
  const [choosing, setChoosing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [strength, setStrength] = useState(() => Math.max(100, Math.min(2400, Math.round(playerRating / 50) * 50)))
  // Your own arrows and circles: for this position only (a new move clears them).
  const [drawing, setDrawing] = useState(false)
  const [drawn, setDrawn] = useState<{ at: string; arrows: { from: string; to: string }[]; circles: string[] }>({ at: '', arrows: [], circles: [] })
  const fen = useMemo(() => fenAt(line), [line])
  const sans = useMemo(() => lineSans(line), [line])
  const { current, latest } = useEngineLines(fen, !editing)
  const turn = new Chess(fen).turn()
  const lastUci = line.cursor > 0 ? line.moves[line.cursor - 1] : null
  const bottom = flipped ? 'b' : 'w'
  const mine = drawn.at === fen ? drawn : { at: fen, arrows: [], circles: [] }

  if (playing) return <PositionPlay startFen={fen} rating={strength} onBack={() => setPlaying(false)} />

  if (editing) {
    return (
      <PositionEditor
        fen={fen}
        onCancel={() => setEditing(false)}
        onDone={(startFen) => {
          setLine({ startFen, moves: [], cursor: 0 })
          setEditing(false)
        }}
        onGame={(startFen, moves) => {
          setLine({ startFen, moves, cursor: moves.length })
          setEditing(false)
        }}
      />
    )
  }

  // The evaluation bar reads the engine's best line (from the side to move's point of view).
  const top = latest?.lines[0]
  const barAnalysis = top && latest ? { fen: latest.fen, sideToMove: new Chess(latest.fen).turn(), score: top.score, bestMove: top.pv[0] ?? null, pv: top.pv } : null
  const best = current?.lines[0]?.pv[0]
  const whiteView = (score: NonNullable<typeof top>['score']) =>
    turn === 'w' ? score : ({ ...score, value: -score.value } as typeof score)

  return (
    <main className="analysis">
      <header className="analysis-head">
        <button type="button" className="analysis-back" onClick={onBack}>
          ‹ Back
        </button>
        <h1>Analysis</h1>
        <button
          type="button"
          className={`analysis-tool ${drawing ? 'on' : ''}`}
          onClick={() => setDrawing(!drawing)}
          aria-pressed={drawing}
          aria-label="Draw arrows and circles"
        >
          <PencilIcon />
        </button>
        <button type="button" className={`analysis-tool text ${choosing ? 'on-blue' : ''}`} onClick={() => setChoosing(!choosing)} disabled={new Chess(fen).isGameOver()}>
          Play
        </button>
        <button type="button" className="analysis-tool" onClick={() => setFlipped(!flipped)} aria-label="Turn the board round">
          <FlipIcon />
        </button>
        {canSetUp && (
          <button type="button" className="analysis-tool text" onClick={() => setEditing(true)}>
            Set up
          </button>
        )}
      </header>

      <div className="analysis-board-row">
        <EvalBar analysis={barAnalysis} playerColour={bottom} />
        <div className="analysis-board-cell">
          <Board
            fen={fen}
            orientation={flipped ? 'black' : 'white'}
            movableColour={turn}
            lastMove={lastUci ? { from: lastUci.slice(0, 2), to: lastUci.slice(2, 4) } : null}
            onMove={(uci) => setLine((l) => playMove(l, uci))}
            arrows={[
              ...(best ? [{ from: best.slice(0, 2), to: best.slice(2, 4), colour: ARROW }] : []),
              ...mine.arrows.map((a) => ({ ...a, colour: DRAW_COLOUR })),
            ]}
            circles={mine.circles}
          />
          {drawing && (
            <DrawLayer
              onArrow={(from, to) => setDrawn({ ...mine, arrows: toggle(mine.arrows, { from, to }, (a, b) => a.from === b.from && a.to === b.to) })}
              onCircle={(sq) => setDrawn({ ...mine, circles: toggle(mine.circles, sq, (a, b) => a === b) })}
            />
          )}
        </div>
      </div>

      {choosing && (
        <section className="play-from-here">
          <span>
            Play this position against the computer, as {turn === 'w' ? 'White' : 'Black'}. Not rated.
          </span>
          <div className="play-from-here-row">
            <button type="button" aria-label="Weaker" onClick={() => setStrength((s) => Math.max(100, s - 100))}>
              −
            </button>
            <strong>{strength}</strong>
            <button type="button" aria-label="Stronger" onClick={() => setStrength((s) => Math.min(2400, s + 100))}>
              +
            </button>
          </div>
          <button type="button" className="go" onClick={() => setPlaying(true)}>
            Play from here
          </button>
        </section>
      )}

      {/* The engine's top three lines. Tap one to play its first move. */}
      <section className="analysis-lines" aria-live="polite">
        {new Chess(fen).isGameOver() ? (
          <p className="analysis-note">The game is over in this position.</p>
        ) : !current ? (
          <p className="analysis-note">Thinking…</p>
        ) : (
          current.lines.map((l) => (
            <button key={l.rank} type="button" className="analysis-line" onClick={() => l.pv[0] && setLine((x) => playMove(x, l.pv[0]))}>
              <span className={`analysis-score ${whiteView(l.score).value >= 0 ? 'white' : 'black'}`}>{formatScore(whiteView(l.score))}</span>
              <span className="analysis-pv">{formatLine(fen, l.pv, 6)}</span>
            </button>
          ))
        )}
      </section>

      <ol className="analysis-moves" aria-label="Moves">
        {sans.map((san, i) => (
          <li key={i}>
            <button type="button" className={i + 1 === line.cursor ? 'current' : undefined} onClick={() => setLine((l) => stepTo(l, i + 1))}>
              {moveNumberAt(line.startFen, i)}
              {san}
            </button>
          </li>
        ))}
        {sans.length === 0 && <li className="analysis-note">Move any piece, for either side.</li>}
      </ol>

      <div className="analysis-controls">
        <button type="button" aria-label="Start" onClick={() => setLine((l) => stepTo(l, 0))} disabled={line.cursor === 0}>
          <SkipIcon flip />
        </button>
        <button type="button" aria-label="Previous move" onClick={() => setLine((l) => stepTo(l, l.cursor - 1))} disabled={line.cursor === 0}>
          <StepIcon flip />
        </button>
        <button type="button" aria-label="Next move" onClick={() => setLine((l) => stepTo(l, l.cursor + 1))} disabled={line.cursor === line.moves.length}>
          <StepIcon />
        </button>
        <button type="button" aria-label="End" onClick={() => setLine((l) => stepTo(l, l.moves.length))} disabled={line.cursor === line.moves.length}>
          <SkipIcon />
        </button>
      </div>
    </main>
  )
}

/** "12." before White's moves, and before the very first move if Black starts ("12…"). */
function moveNumberAt(startFen: string, index: number): string {
  const [, turn, , , , full] = startFen.split(' ')
  const plyFromWhite = index + (turn === 'b' ? 1 : 0)
  const number = Number(full || 1) + Math.floor(plyFromWhite / 2)
  if (plyFromWhite % 2 === 0) return `${number}. `
  return index === 0 ? `${number}… ` : ''
}

function PencilIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" />
    </svg>
  )
}

function FlipIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4v14M7 18l-3-3M7 18l3-3M17 20V6M17 6l-3 3M17 6l3 3" />
    </svg>
  )
}
