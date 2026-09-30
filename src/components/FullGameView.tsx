// The optional full-game view at the end of the review: step through every
// move, with the evaluation graph and a tappable move list (the list is also
// the text version of the graph).
import { useMemo, useState } from 'react'
import { formatCp, winChance } from '../logic/evaluation'
import { replay, type Colour } from '../logic/game'
import { RATING_GLYPHS, RATING_LABELS } from '../logic/moveRating'
import type { PositionEval, ReviewedMove } from '../logic/review'
import { momentAt } from '../logic/mistakeCards'
import { Board } from './Board'
import { MomentTrainer } from './MomentTrainer'
import { EvalGraph } from './EvalGraph'
import { SkipIcon, StepIcon } from './StepIcons'
import './FullGameView.css'
import './ratings.css'

type Props = {
  moves: readonly string[]
  evals: readonly PositionEval[]
  reviewed: readonly ReviewedMove[]
  playerColour: Colour
  onBack: () => void
  /** The way on at the bottom (Joseph, Sep 2026: the review ends here, then Home). */
  onDone?: () => void
  doneLabel?: string
  /** Open at this position (0 = the start), e.g. a key moment from the summary. */
  startAt?: number
  /** Open straight into Try it again on this move (its ply). */
  retryAt?: number | null
}

const isError = (m: ReviewedMove) => ['inaccuracy', 'mistake', 'blunder'].includes(m.rating)

export function FullGameView({ moves, evals, reviewed, playerColour, onBack, onDone, doneLabel = 'Continue', startAt = 0, retryAt = null }: Props) {
  // Position index: 0 = start, i = after the i-th move.
  const [index, setIndex] = useState(startAt)
  // "Try it again" (Joseph, Sep 2026): the position before one of your moves,
  // to look for a better one, then back to the step-through at the same place.
  const [retryPly, setRetryPly] = useState<number | null>(retryAt)
  const retry = useMemo(() => (retryPly === null ? null : momentAt(moves, evals, retryPly, playerColour)), [retryPly, moves, evals, playerColour])
  const last = moves.length
  const fen = useMemo(() => replay(moves.slice(0, index)).fen(), [moves, index])
  const move = index > 0 ? reviewed[index - 1] : null
  const forPlayer = (cp: number) => (playerColour === 'w' ? cp : -cp)

  const points = useMemo(
    () => evals.map((e) => winChance({ type: 'cp', value: forPlayer(e.cp) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- forPlayer depends only on playerColour
    [evals, playerColour],
  )
  const markers = reviewed
    .filter((m) => m.mover === playerColour && isError(m))
    .map((m) => ({ index: m.ply + 1, rating: m.rating }))

  const step = (to: number) => setIndex(Math.max(0, Math.min(last, to)))

  if (retry && retryPly !== null) {
    return (
      <main className="full-game">
        <header>
          <button type="button" className="back" onClick={() => setRetryPly(null)}>
            ‹ Back
          </button>
          <h1>Try it again</h1>
        </header>
        <MomentTrainer key={retryPly} moment={retry} />
        <button type="button" className="review-continue" onClick={() => setRetryPly(null)}>
          Back to the game
        </button>
      </main>
    )
  }

  return (
    <main className="full-game">
      <header>
        <button type="button" className="back" onClick={onBack}>
          ‹ Back
        </button>
        <h1>Full game</h1>
      </header>

      <Board
        fen={fen}
        orientation={playerColour === 'w' ? 'white' : 'black'}
        movableColour={null}
        lastMove={move ? { from: move.uci.slice(0, 2), to: move.uci.slice(2, 4) } : null}
        onMove={() => {}}
      />

      <p className="full-game-info">
        {move ? (
          <>
            <strong>
              {moveNumber(move)} {move.san}
              {RATING_GLYPHS[move.rating]}
            </strong>
            {move.mover === playerColour && (
              <span className={`info-pill rating-${move.rating}`}>{RATING_LABELS[move.rating]}</span>
            )}
          </>
        ) : (
          <strong>Starting position</strong>
        )}
        <span className="info-eval">{formatCp(forPlayer(evals[index].cp))} for you</span>
      </p>

      <EvalGraph points={points} markers={markers} current={index} onSelect={step} />

      <ol className="move-list">
        {reviewed.map((m) => {
          const mine = m.mover === playerColour
          return (
            <li key={m.ply}>
              <button
                type="button"
                className={[index === m.ply + 1 ? 'current' : '', mine && isError(m) ? `rating-${m.rating} flagged` : '']
                  .join(' ')
                  .trim()}
                onClick={() => step(m.ply + 1)}
              >
                {m.mover === 'w' && <span className="num">{Math.floor(m.ply / 2) + 1}.</span>}
                {m.san}
                {mine ? RATING_GLYPHS[m.rating] : ''}
              </button>
            </li>
          )
        })}
      </ol>

      {onDone && (
        <button type="button" className="review-continue" onClick={onDone}>
          {doneLabel}
        </button>
      )}

      {/* Pinned to the bottom, every button always in the same place, so
          stepping through never makes the controls jump (Joseph, Sep 2026).
          Try again greys out on moves that can't be retried. */}
      <div className="full-game-controls">
        <button type="button" aria-label="Start" onClick={() => step(0)} disabled={index === 0}>
          <SkipIcon flip />
        </button>
        <button type="button" aria-label="Previous move" onClick={() => step(index - 1)} disabled={index === 0}>
          <StepIcon flip />
        </button>
        <button
          type="button"
          className="try-again"
          disabled={!(move && move.mover === playerColour && move.rating !== 'best')}
          onClick={() => move && setRetryPly(move.ply)}
        >
          Try again
        </button>
        <button type="button" aria-label="Next move" onClick={() => step(index + 1)} disabled={index === last}>
          <StepIcon />
        </button>
        <button type="button" aria-label="End" onClick={() => step(last)} disabled={index === last}>
          <SkipIcon />
        </button>
      </div>
    </main>
  )
}

function moveNumber(m: ReviewedMove): string {
  const n = Math.floor(m.ply / 2) + 1
  return m.mover === 'w' ? `${n}.` : `${n}…`
}
