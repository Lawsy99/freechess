// Setting up a position for the analysis board: pick a piece, tap squares to
// place it (tap again to take it off), drag pieces about, choose who's to
// move. Or paste a position (FEN) or a whole game (PGN) from elsewhere.
import { Chess, validateFen } from 'chess.js'
import { useState } from 'react'
import { Chessboard, defaultPieces } from 'react-chessboard'
import { checkSetup, fenOf, placementOf, START_FEN, type Placement } from '../logic/analysisLine'
import { toUci } from '../logic/game'
import { useBoardColours } from './boardTheme'
import './AnalysisBoard.css'

type Props = {
  fen: string
  onCancel: () => void
  onDone: (fen: string) => void
  /** A pasted game: where it starts, and its moves. */
  onGame: (startFen: string, moves: string[]) => void
}

const WHITE = ['K', 'Q', 'R', 'B', 'N', 'P']
const BLACK = ['k', 'q', 'r', 'b', 'n', 'p']
const ERASE = 'erase'

/** react-chessboard names pieces "wK", "bP" and so on. */
const pieceKey = (p: string) => (p === p.toUpperCase() ? 'w' : 'b') + p.toUpperCase()

export function PositionEditor({ fen, onCancel, onDone, onGame }: Props) {
  const colours = useBoardColours()
  const [placement, setPlacement] = useState<Placement>(() => placementOf(fen))
  const [turn, setTurn] = useState<'w' | 'b'>(fen.split(' ')[1] === 'b' ? 'b' : 'w')
  const [tool, setTool] = useState<string>('P')
  const [problem, setProblem] = useState<string | null>(null)
  const [pasted, setPasted] = useState('')

  const change = (next: Placement) => {
    setPlacement(next)
    setProblem(null)
  }

  function tapSquare(square: string) {
    const next = { ...placement }
    if (tool === ERASE || next[square] === tool) delete next[square]
    else next[square] = tool
    change(next)
  }

  function done() {
    const result = checkSetup(placement, turn)
    if ('problem' in result) setProblem(result.problem)
    else onDone(result.fen)
  }

  function loadPasted() {
    const text = pasted.trim()
    if (!text) return
    if (validateFen(text).ok) {
      onDone(text)
      return
    }
    try {
      const chess = new Chess()
      chess.loadPgn(text)
      const startFen = chess.getHeaders().FEN ?? START_FEN
      const moves = chess.history({ verbose: true }).map(toUci)
      if (moves.length === 0) throw new Error('no moves')
      onGame(startFen, moves)
    } catch {
      setProblem('That isn’t a position (FEN) or a game (PGN) I can read.')
    }
  }

  return (
    <main className="analysis">
      <header className="analysis-head">
        <button type="button" className="analysis-back" onClick={onCancel}>
          ‹ Cancel
        </button>
        <h1>Set up</h1>
        <button type="button" className="analysis-tool text primary" onClick={done}>
          Done
        </button>
      </header>

      <div className="editor-board">
        <Chessboard
          options={{
            id: 'position-editor',
            position: fenOf(placement, turn),
            lightSquareStyle: { backgroundColor: colours.light },
            darkSquareStyle: { backgroundColor: colours.dark },
            allowDragOffBoard: true,
            allowDrawingArrows: false,
            dragActivationDistance: 6,
            animationDurationInMs: 0,
            onSquareClick: ({ square }) => tapSquare(square),
            // Drag a piece to move it; drag it off the board to take it off.
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              const next = { ...placement }
              const piece = next[sourceSquare]
              delete next[sourceSquare]
              if (targetSquare && piece) next[targetSquare] = piece
              change(next)
              return true
            },
          }}
        />
      </div>

      <div className="editor-palette" role="radiogroup" aria-label="Piece to place">
        {[...WHITE, ...BLACK].map((p) => (
          <button key={p} type="button" role="radio" aria-checked={tool === p} className={tool === p ? 'on' : undefined} onClick={() => setTool(p)} aria-label={pieceName(p)}>
            {defaultPieces[pieceKey(p)]({ svgStyle: { width: 34, height: 34 } })}
          </button>
        ))}
      </div>

      <div className="editor-row">
        <button type="button" role="radio" aria-checked={tool === ERASE} className={`editor-chip ${tool === ERASE ? 'on' : ''}`} onClick={() => setTool(ERASE)}>
          Rubber
        </button>
        <button type="button" className="editor-chip" onClick={() => change(placementOf(START_FEN))}>
          Start position
        </button>
        <button type="button" className="editor-chip" onClick={() => change({})}>
          Empty
        </button>
      </div>

      <div className="editor-row" role="radiogroup" aria-label="Side to move">
        {(['w', 'b'] as const).map((t) => (
          <button key={t} type="button" role="radio" aria-checked={turn === t} className={`editor-chip ${turn === t ? 'on' : ''}`} onClick={() => setTurn(t)}>
            {t === 'w' ? 'White' : 'Black'} to move
          </button>
        ))}
      </div>

      {problem && (
        <p className="editor-problem" role="alert">
          {problem}
        </p>
      )}

      <div className="editor-paste">
        <input
          id="editor-paste"
          type="text"
          placeholder="Or paste a position (FEN) or game (PGN)"
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button type="button" className="editor-chip" onClick={loadPasted} disabled={!pasted.trim()}>
          Load
        </button>
      </div>
    </main>
  )
}

function pieceName(p: string): string {
  const names: Record<string, string> = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' }
  return `${p === p.toUpperCase() ? 'White' : 'Black'} ${names[p.toLowerCase()]}`
}
