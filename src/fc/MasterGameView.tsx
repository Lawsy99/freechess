// A master game, move by move (FreeChess, Oct 2026): the board, a note on
// every move, the big picture at each turning point, and lines to play
// through on the board for every alternative a note names. Two ways to go
// through it: read along (with "Your move" stops), or guess the winner's every
// move and have the engine grade each guess. Ends with the lessons.
import { Chess, type Move } from 'chess.js'
import { useMemo, useState } from 'react'
import { Board } from '../components/Board'
import { Portrait } from '../components/Portrait'
import { SkipIcon, StepIcon } from '../components/StepIcons'
import type { MasterGame } from '../data/masterGames/types'
import { MASTER_EVALS, MASTER_LINES, type MasterLine } from '../data/masterGames'
import { getEngine } from '../engine/stockfish'
import { formatCp, scoreFor, toCentipawns } from '../logic/evaluation'
import { gradeGuess, POINTS_PER_MOVE, scorePercent } from '../logic/masterGuess'
import { CheckIcon } from './icons'
import './masterGames.css'

type Props = {
  game: MasterGame
  /** Finished; with your "Guess the move" score (a percentage) if you guessed. */
  onDone: (guessScore?: number) => void
  onBack: () => void
}

type Variation = MasterLine & { step: number; title: string }

type Guess = {
  san: string
  points: number
  verdict: string
  matched: boolean
  /** You asked to see the move instead (it scores nothing). */
  skipped?: boolean
  /** What the stop said about this move, when it was one of its options. */
  optionText?: string
  /** Your move and what the engine expects after it. */
  line?: MasterLine
}

const START = new Chess().fen()
/** The plan's arrows: the gold of the plan cards. */
const PLAN_ARROW = 'rgba(230, 201, 138, 0.85)'

/** "8.Qxb7" or "8…Qb4+" for the move at `ply`. */
function numbered(ply: number, san: string): string {
  return `${Math.floor(ply / 2) + 1}${ply % 2 === 0 ? '.' : '…'}${san}`
}

export function MasterGameView({ game, onDone, onBack }: Props) {
  const history = useMemo(() => {
    const c = new Chess()
    c.loadPgn(game.pgn)
    return c.history({ verbose: true })
  }, [game.pgn])
  const lines = MASTER_LINES[game.id]
  const evals = MASTER_EVALS[game.id] ?? []
  const hero = game.orientation === 'white' ? 'w' : 'b'
  const master = (hero === 'w' ? game.white : game.black).split(' ').at(-1)!

  // index: how many moves are on the board (0 = the start).
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<'read' | 'guess'>('read')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [guesses, setGuesses] = useState<Record<number, Guess>>({})
  const [checking, setChecking] = useState(false)
  const [variation, setVariation] = useState<Variation | null>(null)
  const [finished, setFinished] = useState(false)

  const last = history.length
  const fenAt = (i: number) => (i === 0 ? START : history[i - 1].after)
  const fen = fenAt(index)
  const move = index > 0 ? history[index - 1] : null
  const stop = game.stops.find((s) => s.ply === index)
  const guessing = mode === 'guess'
  // Read along: the stop waits for your choice. Guessing: your move on the board.
  const waiting = !guessing && stop && answers[stop.ply] === undefined
  const chosen = !guessing && stop ? stop.options.find((o) => o.san === answers[stop.ply]) : undefined
  const guessTurn = guessing && index < last && history[index].color === hero && !guesses[index]
  const evalCp = evals[index]
  const chapter = game.chapters.find((c) => c.ply === index)
  const forViewer = (cp: number) => (game.orientation === 'white' ? cp : -cp)
  const scored = Object.values(guesses)
  const points = scored.reduce((s, g) => s + g.points, 0)

  // The board in a variation: the line's moves played on from where it starts.
  const variationBoard = useMemo(() => {
    if (!variation) return null
    const b = new Chess(fenAt(variation.at))
    let lastMove: Move | null = null
    for (const san of variation.sans.slice(0, variation.step)) lastMove = b.move(san)
    return { fen: b.fen(), lastMove }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fenAt follows history
  }, [variation, history])

  const openLine = (line: MasterLine, title: string) => setVariation({ ...line, step: 1, title })

  async function guess(uci: string) {
    const board = new Chess(fen)
    let mine: Move
    try {
      mine = board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' })
    } catch {
      return
    }
    const at = index
    const optionText = stop?.options.find((o) => o.san === mine.san && !o.best)?.text
    if (mine.san === history[at].san) {
      setGuesses((g) => ({ ...g, [at]: { san: mine.san, points: POINTS_PER_MOVE, verdict: `You found ${master}’s move.`, matched: true } }))
      setIndex(at + 1)
      return
    }
    setChecking(true)
    try {
      let cp: number
      let pv: string[] = []
      if (board.isCheckmate()) cp = hero === 'w' ? 10000 : -10000
      else if (board.isDraw()) cp = 0
      else {
        const { lines: found } = await getEngine().search(board.fen(), { depth: 16, movetime: 1500 })
        const top = found[0]
        cp = top ? toCentipawns(scoreFor('w', board.turn(), top.score)) : 0
        pv = top?.pv ?? []
      }
      const gameCp = evals[at + 1] ?? cp
      const grade = gradeGuess(gameCp, cp, hero, master)
      // Your move and the engine's reply, to see on the board.
      const sans = [mine.san]
      const b = new Chess(board.fen())
      for (const u of pv.slice(0, 7)) {
        try {
          sans.push(b.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san)
        } catch {
          break
        }
      }
      setGuesses((g) => ({ ...g, [at]: { san: mine.san, points: grade.points, verdict: grade.verdict, matched: false, optionText, line: { label: mine.san, at, sans, cp } } }))
    } catch {
      setGuesses((g) => ({ ...g, [at]: { san: mine.san, points: 0, verdict: 'The engine couldn’t check that one, so it scores nothing this time.', matched: false } }))
    }
    setChecking(false)
    setIndex(at + 1)
  }

  if (finished) {
    const pct = guessing ? scorePercent(points, scored.length) : undefined
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
          {pct !== undefined && (
            <section className="fc-card mg-score">
              <p className="mg-score-value">{pct}%</p>
              <p>
                {points} of {scored.length * POINTS_PER_MOVE} points guessing {master}’s moves.{' '}
                {pct >= 85 ? 'Master class.' : pct >= 70 ? 'Strong play.' : pct >= 50 ? 'Good going.' : 'Every guess teaches something: try it again another day.'}
              </p>
            </section>
          )}
          <section className="fc-card mg-lessons">
            <h2>What to take away</h2>
            <ul>
              {game.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
          <button type="button" className="fc-primary" onClick={() => onDone(pct)}>
            Finish
          </button>
        </div>
      </main>
    )
  }

  // --- A line on the board -------------------------------------------------
  if (variation && variationBoard) {
    // ("7…Bc5 8.Bxf7+ Kf8": a number for White's moves and the first move only.)
    const moves = variation.sans.map((san, i) => ((variation.at + i) % 2 === 0 || i === 0 ? numbered(variation.at + i, san) : san))
    return (
      <main className="fc-page mg">
        <header className="fc-lesson-head">
          <button type="button" className="fc-icon-button" onClick={() => setVariation(null)} aria-label="Back to the game">
            ✕
          </button>
          <p className="mg-line-head">{variation.title}</p>
        </header>
        <Board
          fen={variationBoard.fen}
          orientation={game.orientation}
          movableColour={null}
          lastMove={variationBoard.lastMove ? { from: variationBoard.lastMove.from, to: variationBoard.lastMove.to } : null}
          onMove={() => {}}
        />
        <section className="mg-note">
          <p className="mg-line-moves">
            {moves.map((m, i) => (
              <button key={m + i} type="button" className={i === variation.step - 1 ? 'on' : ''} onClick={() => setVariation({ ...variation, step: i + 1 })}>
                {m}
              </button>
            ))}
          </p>
          {variation.cp !== null && (
            <p className="fc-muted">
              At the end of the line the engine says {Math.abs(variation.cp) >= 10000 ? 'checkmate' : `${formatCp(forViewer(variation.cp))} for ${game.orientation === 'white' ? 'White' : 'Black'}`}.
            </p>
          )}
        </section>
        <div className="analysis-controls mg-controls mg-line-controls">
          <button type="button" className="mg-back-game" onClick={() => setVariation(null)}>
            Back to the game
          </button>
          <button type="button" aria-label="Previous move" onClick={() => setVariation({ ...variation, step: variation.step - 1 })} disabled={variation.step === 0}>
            <StepIcon flip />
          </button>
          <button type="button" className="mg-next" aria-label="Next move" onClick={() => setVariation({ ...variation, step: variation.step + 1 })} disabled={variation.step === variation.sans.length}>
            <StepIcon />
          </button>
        </div>
      </main>
    )
  }

  const moveLabel = move ? numbered(index - 1, move.san) : 'The start'
  // Lines for this note. (While you're guessing, none that show the move to find.)
  const noteLines = (index > 0 ? (lines?.notes[index - 1] ?? []) : []).filter((l) => !(guessTurn && l.at === index))
  const lastGuess = guessing && index > 0 ? guesses[index - 1] : undefined
  const chosenLine = chosen && !chosen.best ? lines?.stops[`${stop!.ply}:${chosen.san}`] : null
  const hideEval = waiting || guessTurn

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
        {guessing && scored.length > 0 && (
          <span className="mg-running">
            {' '}
            · Score {points}/{scored.length * POINTS_PER_MOVE}
          </span>
        )}
      </p>

      <Board
        fen={fen}
        orientation={game.orientation}
        movableColour={guessTurn && !checking ? hero : null}
        lastMove={move ? { from: move.from, to: move.to } : null}
        onMove={(uci) => void guess(uci)}
        // (The plan drawn on the board, with "The plan now"; never while you choose.)
        arrows={chapter?.arrows && !waiting && !guessTurn ? chapter.arrows.map((a) => ({ from: a.slice(0, 2), to: a.slice(2, 4), colour: PLAN_ARROW })) : undefined}
      />

      <section className={`mg-note ${waiting || guessTurn ? 'stop' : ''}`} aria-live="polite">
        {/* How your guess went, above the note on the master's move. */}
        {lastGuess && (
          <div className={`mg-stop mg-guess ${lastGuess.points === POINTS_PER_MOVE ? 'good' : ''}`}>
            <p className="mg-stop-title">
              {lastGuess.skipped ? 'Shown' : `Your guess · ${lastGuess.points} ${lastGuess.points === 1 ? 'point' : 'points'}`}
            </p>
            <p>
              {lastGuess.skipped
                ? `${master} played ${move?.san}.`
                : lastGuess.matched
                  ? `${lastGuess.san}: ${lastGuess.verdict}`
                  : `You played ${lastGuess.san}; ${master} played ${move?.san}. ${lastGuess.verdict}`}
            </p>
            {lastGuess.optionText && <p>{lastGuess.optionText}</p>}
            {lastGuess.line && (
              <button type="button" className="mg-see" onClick={() => openLine(lastGuess.line!, `After your ${lastGuess.san}`)}>
                See what happens after {lastGuess.san} ›
              </button>
            )}
          </div>
        )}
        {guessTurn && (
          <div className="mg-stop">
            <p className="mg-stop-title">Your move as {master}</p>
            <p>{checking ? 'Checking your move…' : (stop?.prompt ?? `What would ${master} play? Make the move on the board.`)}</p>
          </div>
        )}
        {/* Read along: a stop comes first, its choices in the bottom bar. */}
        {!guessing && stop && (
          <div className="mg-stop">
            <p className="mg-stop-title">Your move</p>
            {waiting ? (
              <p>{stop.prompt}</p>
            ) : (
              chosen && (
                <>
                  <p className={`mg-verdict ${chosen.best ? 'best' : ''}`}>{chosen.best ? `${chosen.san}: that’s what was played.` : chosen.san}</p>
                  <p>{chosen.text}</p>
                  {chosenLine && (
                    <button type="button" className="mg-see" onClick={() => openLine({ label: chosen.san, at: stop.ply, ...chosenLine }, `After ${numbered(stop.ply, chosen.san)}`)}>
                      See what happens after {chosen.san} ›
                    </button>
                  )}
                  {!chosen.best && <p className="fc-muted">Step on to see what was played.</p>}
                </>
              )
            )}
          </div>
        )}
        <p className="mg-move">
          <Portrait who="coach" size={28} className="fc-face" />
          <strong>{moveLabel}</strong>
          {/* (Hidden while you choose: the score would give the answer away.) */}
          {!hideEval && evalCp !== undefined && evalCp !== null && (
            <span className="mg-eval">
              {Math.abs(evalCp) >= 10000 ? 'Checkmate' : `${formatCp(forViewer(evalCp))} for ${game.orientation === 'white' ? 'White' : 'Black'}`}
            </span>
          )}
        </p>
        <p>{index === 0 ? game.intro : game.notes[index - 1]}</p>
        {noteLines.length > 0 && (
          <div className="mg-sees">
            {noteLines.map((l) => (
              <button key={l.label} type="button" className="mg-see" onClick={() => openLine(l, `The line ${l.label}`)}>
                See {l.label} ›
              </button>
            ))}
          </div>
        )}
        {index === 0 && (
          <>
            <div className="mg-plan">
              <p className="mg-plan-title">The big picture</p>
              <p>{game.plans}</p>
            </div>
            <p className="fc-muted mg-howto">
              The number at the top right is the engine’s verdict, in pawns: +1.0 means {game.orientation === 'white' ? 'White' : 'Black'} is about a pawn better.
            </p>
            {/* Two ways through the game. */}
            <div className="mg-modes" role="group" aria-label="How to go through the game">
              <button type="button" className={mode === 'read' ? 'on' : ''} onClick={() => setMode('read')}>
                <strong>Read along</strong>
                <span>Every move explained, with a few questions</span>
              </button>
              <button type="button" className={mode === 'guess' ? 'on' : ''} onClick={() => setMode('guess')}>
                <strong>Guess the moves</strong>
                <span>Play {master}’s moves yourself, scored by the engine</span>
              </button>
            </div>
          </>
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
          <button type="button" aria-label="Start" onClick={() => setIndex(0)} disabled={index === 0 || checking}>
            <SkipIcon flip />
          </button>
          <button type="button" aria-label="Previous move" onClick={() => setIndex(index - 1)} disabled={index === 0 || checking}>
            <StepIcon flip />
          </button>
          {guessTurn ? (
            <button
              type="button"
              className="mg-next mg-showme"
              disabled={checking}
              onClick={() => {
                setGuesses((g) => ({ ...g, [index]: { san: '', points: 0, verdict: '', matched: false, skipped: true } }))
                setIndex(index + 1)
              }}
            >
              Show me
            </button>
          ) : index < last ? (
            <button type="button" className="mg-next" aria-label="Next move" onClick={() => setIndex(index + 1)}>
              <StepIcon />
            </button>
          ) : (
            <button type="button" className="mg-next" onClick={() => setFinished(true)}>
              Finish
            </button>
          )}
          <button
            type="button"
            aria-label="End"
            onClick={() => setIndex(last)}
            disabled={index === last || guessing || game.stops.some((s) => s.ply >= index && answers[s.ply] === undefined)}
          >
            <SkipIcon />
          </button>
        </div>
      )}
    </main>
  )
}
