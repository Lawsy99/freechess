// A master game, move by move (FreeChess, Oct 2026): the board, a note on
// every move, and "Your move" stops where you choose before the master's move
// is shown. Ends with the lessons to take away.
import { Chess } from 'chess.js'
import { useMemo, useState } from 'react'
import { Board } from '../components/Board'
import { Portrait } from '../components/Portrait'
import { SkipIcon, StepIcon } from '../components/StepIcons'
import type { MasterGame } from '../data/masterGames/types'
import { MASTER_EVALS } from '../data/masterGames'
import { formatCp } from '../logic/evaluation'
import { CheckIcon } from './icons'
import './masterGames.css'

type Props = {
  game: MasterGame
  onDone: () => void
  onBack: () => void
}

export function MasterGameView({ game, onDone, onBack }: Props) {
  const history = useMemo(() => {
    const c = new Chess()
    c.loadPgn(game.pgn)
    return c.history({ verbose: true })
  }, [game.pgn])
  // index: how many moves are on the board (0 = the start).
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [finished, setFinished] = useState(false)
  const last = history.length
  const fen = index === 0 ? new Chess().fen() : history[index - 1].after
  const move = index > 0 ? history[index - 1] : null
  const stop = game.stops.find((s) => s.ply === index)
  const waiting = stop && answers[stop.ply] === undefined
  const chosen = stop ? stop.options.find((o) => o.san === answers[stop.ply]) : undefined
  const evalCp = MASTER_EVALS[game.id]?.[index]
  const chapter = game.chapters.find((c) => c.ply === index)
  // (The engine's verdict from the side we're watching.)
  const forViewer = (cp: number) => (game.orientation === 'white' ? cp : -cp)

  if (finished) {
    return (
      <main className="fc-page mg">
        <div className="mg-done">
          <span className="fc-lesson-tick">
            <CheckIcon size={44} />
          </span>
          <h1>{game.title}</h1>
          <p className="fc-muted">
            {game.white} against {game.black}, {game.place} {game.year}. {game.ending}
          </p>
          <section className="fc-card mg-lessons">
            <h2>What to take away</h2>
            <ul>
              {game.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
          <button type="button" className="fc-primary" onClick={onDone}>
            Finish
          </button>
        </div>
      </main>
    )
  }

  const moveLabel = move ? `${Math.ceil(index / 2)}${move.color === 'w' ? '.' : '…'} ${move.san}` : 'The start'

  return (
    <main className="fc-page mg">
      <header className="fc-lesson-head">
        <button type="button" className="fc-icon-button" onClick={onBack} aria-label="Leave the game">
          ✕
        </button>
        <div className="fc-lesson-progress" aria-label={`Move ${index} of ${last}`}>
          <i style={{ width: `${(index / last) * 100}%` }} />
        </div>
      </header>
      <p className="mg-players">
        <strong>{game.white}</strong> against <strong>{game.black}</strong> · {game.place} {game.year}
      </p>

      <Board
        fen={fen}
        orientation={game.orientation}
        movableColour={null}
        lastMove={move ? { from: move.from, to: move.to } : null}
        onMove={() => {}}
      />

      <section className={`mg-note ${waiting ? 'stop' : ''}`} aria-live="polite">
        {/* A stop comes first, right under the board; its choices sit in the
            bottom bar, so the board, the question and the answers all fit on
            a phone. The note on the move just played stays below. */}
        {stop && (
          <div className="mg-stop">
            <p className="mg-stop-title">Your move</p>
            {waiting ? (
              <p>{stop.prompt}</p>
            ) : (
              chosen && (
                <>
                  <p className={`mg-verdict ${chosen.best ? 'best' : ''}`}>
                    {chosen.best ? `${chosen.san}: that’s what was played.` : chosen.san}
                  </p>
                  <p>{chosen.text}</p>
                  {!chosen.best && <p className="fc-muted">Step on to see what was played.</p>}
                </>
              )
            )}
          </div>
        )}
        <p className="mg-move">
          <Portrait who="coach" size={28} className="fc-face" />
          <strong>{moveLabel}</strong>
          {/* (Hidden while a stop waits: the score would give the answer away.) */}
          {!waiting && evalCp !== undefined && evalCp !== null && (
            <span className="mg-eval">
              {Math.abs(evalCp) >= 10000 ? 'Checkmate' : `${formatCp(forViewer(evalCp))} for ${game.orientation === 'white' ? 'White' : 'Black'}`}
            </span>
          )}
        </p>
        <p>{index === 0 ? game.intro : game.notes[index - 1]}</p>
        {index === 0 && (
          <div className="mg-plan">
            <p className="mg-plan-title">The big picture</p>
            <p>{game.plans}</p>
          </div>
        )}
        {chapter && (
          <div className="mg-plan">
            <p className="mg-plan-title">The plan now · {chapter.title}</p>
            <p>{chapter.text}</p>
          </div>
        )}
      </section>

      {waiting && stop ? (
        <div className="analysis-controls mg-controls mg-options">
          {stop.options.map((o) => (
            <button key={o.san} type="button" onClick={() => setAnswers((a) => ({ ...a, [stop.ply]: o.san }))}>
              {o.san}
            </button>
          ))}
        </div>
      ) : (
        <div className="analysis-controls mg-controls">
          <button type="button" aria-label="Start" onClick={() => setIndex(0)} disabled={index === 0}>
            <SkipIcon flip />
          </button>
          <button type="button" aria-label="Previous move" onClick={() => setIndex(index - 1)} disabled={index === 0}>
            <StepIcon flip />
          </button>
          {index < last ? (
            <button type="button" className="mg-next" aria-label="Next move" onClick={() => setIndex(index + 1)}>
              <StepIcon />
            </button>
          ) : (
            <button type="button" className="mg-next" onClick={() => setFinished(true)}>
              Finish
            </button>
          )}
          <button type="button" aria-label="End" onClick={() => setIndex(last)} disabled={index === last || game.stops.some((s) => s.ply >= index && answers[s.ply] === undefined)}>
            <SkipIcon />
          </button>
        </div>
      )}
    </main>
  )
}
