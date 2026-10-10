// The full-game view at the end of the review: the game move by move, with
// the Coach's comments, the evaluation graph and a tappable move list (the
// list is also the text version of the graph). By default "Next" plays quickly
// through the quiet moves and stops where there's something to talk about,
// as chess.com's game review does (Joseph, Oct 2026); "Every move" steps one
// at a time.
import { useEffect, useMemo, useState } from 'react'
import { nextStop, quietSummary, reviewStops } from '../logic/reviewStops'
import { formatCp, winChance } from '../logic/evaluation'
import { replay, type Colour } from '../logic/game'
import { RATING_GLYPHS, RATING_LABELS } from '../logic/moveRating'
import type { PositionEval, ReviewedMove } from '../logic/review'
import { momentAt } from '../logic/mistakeCards'
import { SPECIAL_GLYPHS, SPECIAL_LABELS, type Special } from '../logic/reviewExtras'
import { START_FEN } from '../logic/analysisLine'
import { AnalysisBoard } from './AnalysisBoard'
import { Portrait } from './Portrait'
import { stepExplanation } from '../logic/stepExplain'
import { nameOf } from '../logic/notation'
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
  /** Book, great and brilliant moves, by ply. */
  specials?: ReadonlyMap<number, Special>
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

/** How long each quiet move shows while "Next" plays through them. */
const ZOOM_MS = 320
/** Remembered on the phone: step every move, or skip the quiet ones. */
const EVERY_MOVE_KEY = 'freechess.review.everyMove'

function loadEveryMove(): boolean {
  try {
    return localStorage.getItem(EVERY_MOVE_KEY) === '1'
  } catch {
    return false
  }
}

export function FullGameView({ moves, evals, reviewed, specials = new Map(), playerColour, onBack, onDone, doneLabel = 'Continue', startAt = 0, retryAt = null }: Props) {
  // Position index: 0 = start, i = after the i-th move.
  const [index, setIndex] = useState(startAt)
  // "Try it again" (Joseph, Sep 2026): the position before one of your moves,
  // to look for a better one, then back to the step-through at the same place.
  const [retryPly, setRetryPly] = useState<number | null>(retryAt)
  // The analysis board, from the move on the board now (and back to it after).
  const [analysing, setAnalysing] = useState(false)
  const retry = useMemo(() => (retryPly === null ? null : momentAt(moves, evals, retryPly, playerColour)), [retryPly, moves, evals, playerColour])
  const last = moves.length
  const fen = useMemo(() => replay(moves.slice(0, index)).fen(), [moves, index])
  const move = index > 0 ? reviewed[index - 1] : null
  const special = move ? specials.get(move.ply) : undefined
  // The Coach's line on this move (FreeChess, Sep 2026, like chess.com's coach explanations).
  const coachSays = useMemo(
    () =>
      move
        ? stepExplanation(moves, evals, reviewed, move.ply, playerColour, specials.get(move.ply))
        : 'Tap Next and I’ll take you through the moments that matter. The quiet moves go by quickly.',
    [move, moves, evals, reviewed, playerColour, specials],
  )
  /** "!!" for brilliant, "!" for great, else the error marks (?!, ?, ??). */
  const glyph = (m: ReviewedMove) => {
    const sp = specials.get(m.ply)
    return sp ? SPECIAL_GLYPHS[sp] : RATING_GLYPHS[m.rating]
  }
  const forPlayer = (cp: number) => (playerColour === 'w' ? cp : -cp)

  const points = useMemo(
    () => evals.map((e) => winChance({ type: 'cp', value: forPlayer(e.cp) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- forPlayer depends only on playerColour
    [evals, playerColour],
  )
  const markers = reviewed
    .filter((m) => m.mover === playerColour && isError(m))
    .map((m) => ({ index: m.ply + 1, rating: m.rating }))

  // The guided review: where Next stops, and the quiet stretch being played through.
  const stops = useMemo(() => reviewStops(reviewed, specials, playerColour), [reviewed, specials, playerColour])
  const [everyMove, setEveryMove] = useState(loadEveryMove)
  const [zoom, setZoom] = useState<{ from: number; to: number } | null>(null)
  // What was skipped on the way to this stop, for the Coach to sum up.
  const [skipped, setSkipped] = useState<{ from: number; to: number } | null>(null)
  useEffect(() => {
    if (!zoom) return
    if (index >= zoom.to) {
      setSkipped(zoom)
      setZoom(null)
      return
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), ZOOM_MS)
    return () => window.clearTimeout(t)
  }, [zoom, index])

  const step = (to: number) => {
    setZoom(null)
    setSkipped(null)
    setIndex(Math.max(0, Math.min(last, to)))
  }
  const next = () => {
    // A second tap while playing through: straight to the stop.
    if (zoom) return step(zoom.to)
    if (everyMove) return step(index + 1)
    const to = nextStop(stops, index, last)
    if (to <= index + 1) return step(to)
    setSkipped(null)
    setZoom({ from: index, to })
    setIndex(index + 1)
  }
  const toggleEveryMove = () => {
    const on = !everyMove
    setEveryMove(on)
    try {
      localStorage.setItem(EVERY_MOVE_KEY, on ? '1' : '0')
    } catch {
      // (private browsing: it just isn't remembered)
    }
  }
  const summary = skipped && skipped.to === index ? quietSummary(reviewed, specials, playerColour, skipped.from, skipped.to) : null
  // At the end of the opening theory, say so rather than "a standard opening move".
  const openingEnd = stops.find((s) => s.reason === 'opening')?.index
  const atOpeningEnd = !everyMove && index === openingEnd

  if (analysing) {
    return (
      <AnalysisBoard
        initial={{ startFen: START_FEN, moves: [...moves], cursor: index }}
        orientation={playerColour === 'w' ? 'white' : 'black'}
        onBack={() => setAnalysing(false)}
      />
    )
  }

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
        <button type="button" className={`every-move ${everyMove ? 'on' : ''}`} onClick={toggleEveryMove} aria-pressed={everyMove}>
          {everyMove ? 'Every move' : 'Key moves'}
        </button>
        <button type="button" className="analyse" onClick={() => setAnalysing(true)}>
          Analyse
        </button>
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
              {glyph(move)}
            </strong>
            {(move.mover === playerColour || special === 'book') && (
              <span className={`info-pill rating-${special ?? move.rating}`}>{special ? SPECIAL_LABELS[special] : RATING_LABELS[move.rating]}</span>
            )}
          </>
        ) : (
          <strong>Starting position</strong>
        )}
        <span className="info-eval">{formatCp(forPlayer(evals[index].cp))} for you</span>
      </p>

      <p className="full-game-coach" aria-live="polite">
        <Portrait who="coach" size={32} expression={move && move.mover === playerColour && isError(move) ? 'neutral' : 'pleased'} className="fc-face" />
        <span>
          {zoom
            ? 'Playing through the quiet moves…'
            : atOpeningEnd
              ? `That’s the opening: the first ${Math.ceil(index / 2)} ${Math.ceil(index / 2) === 1 ? 'move was' : 'moves were'} known theory. Now the game is your own.`
              : `${summary ? summary + ' ' : ''}${coachSays ?? (move && move.mover !== playerColour ? `They played ${nameOf(move.fenBefore, move.uci) ?? move.san}.` : 'A sensible move. Nothing to add.')}`}
        </span>
      </p>

      <EvalGraph points={points} markers={markers} current={index} onSelect={step} />

      <ol className="move-list">
        {reviewed.map((m) => {
          const mine = m.mover === playerColour
          return (
            <li key={m.ply}>
              <button
                type="button"
                className={[
                  index === m.ply + 1 ? 'current' : '',
                  mine && isError(m) ? `rating-${m.rating} flagged` : '',
                  mine && (specials.get(m.ply) === 'brilliant' || specials.get(m.ply) === 'great') ? `rating-${specials.get(m.ply)} flagged` : '',
                ]
                  .join(' ')
                  .trim()}
                onClick={() => step(m.ply + 1)}
              >
                {m.mover === 'w' && <span className="num">{Math.floor(m.ply / 2) + 1}.</span>}
                {m.san}
                {mine ? glyph(m) : ''}
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
          disabled={!!zoom || !(move && move.mover === playerColour && move.rating !== 'best')}
          onClick={() => move && setRetryPly(move.ply)}
        >
          Try again
        </button>
        <button type="button" className="next" aria-label={everyMove ? 'Next move' : 'Next key moment'} onClick={next} disabled={index === last}>
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
