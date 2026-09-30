// The post-game review. Every game, won or lost, ends here: Stockfish checks
// every move (with a progress bar), then a short sequence: summary, your
// biggest moments (find a better move), and the best move of the game.
import { useEffect, useMemo, useState } from 'react'
import { EvalGraph } from '../components/EvalGraph'
import { FullGameView } from '../components/FullGameView'
import { MomentTrainer } from '../components/MomentTrainer'
import { MoveReplay } from '../components/MoveReplay'
import { drawRule } from '../logic/path'
import { analyseGame } from '../engine/reviewAnalysis'
import { explainGoodMove } from '../logic/explain'
import { describeOutcome, replay, type Colour } from '../logic/game'
import { outcomeOf, type GameRecord } from '../logic/gameRecord'
import { RATING_LABELS, type MoveRating } from '../logic/moveRating'
import { moveName } from '../logic/notation'
import { bestMoveOfGame, gameAccuracy, ratingCounts, reviewMoves, settleEvals, SHORTEST_REVIEW, type PositionEval } from '../logic/review'
import { bookLength, PHASE_LABELS, PHASES, phaseAccuracy, playedLike, SPECIAL_LABELS, specialMoves, winPoints, type Special } from '../logic/reviewExtras'
import { coachTip } from '../logic/stepExplain'
import { detectOpening } from '../logic/openings'
import { OPENING_NAMES } from '../data/scouting'
import { ALL_LESSONS } from '../data/learnPath'
import { Portrait } from '../components/Portrait'
import { cardId, cardsFromMoments, gameMoments, moveLabel } from '../logic/mistakeCards'
import { addCardsIfNew, getArchivedGame, retireCardById, saveGameAnalysis } from '../storage/db'
import '../components/ratings.css'
import './ReviewScreen.css'

type Props = {
  /** Practice and coached games: play on again from just before a mistake (the ply). */
  onPlayFrom?: (ply: number) => void
  game: GameRecord
  onContinue: () => void
  /** Opened from Past games: the way out goes back to the list. */
  fromHistory?: boolean
  /** Open a Learn lesson (the Coach's tip points to one). */
  onLesson?: (lessonId: string) => void
  /** For rated games: the player's rating before and after this result. */
  ratingChange?: { from: number; to: number } | null
}

type KeyKind = 'mistake' | 'missed' | 'best' | 'brilliant' | 'great'
const KEY_LABELS: Record<KeyKind, string> = {
  mistake: 'Biggest mistake',
  missed: 'Chance missed',
  best: 'Best move',
  brilliant: 'Brilliant move',
  great: 'Great move',
}

const RATING_ORDER: MoveRating[] = ['best', 'good', 'inaccuracy', 'mistake', 'blunder']

const COUNT_LABELS: Record<MoveRating, [one: string, many: string]> = {
  best: ['Best move', 'Best moves'],
  good: ['Good move', 'Good moves'],
  inaccuracy: ['Inaccuracy', 'Inaccuracies'],
  mistake: ['Mistake', 'Mistakes'],
  blunder: ['Blunder', 'Blunders'],
}

/** The opponent's move just before `ply`, named for the player ("Nf6" or "the knight move to f6"). */
function theirMoveName(moves: readonly string[], ply: number): string {
  const move = replay(moves.slice(0, ply)).history({ verbose: true }).at(-1)
  return move ? moveName(move) : 'their move'
}

export function ReviewScreen({ game, onContinue, fromHistory = false, ratingChange = null, onPlayFrom, onLesson }: Props) {
  const [evals, setEvals] = useState<PositionEval[] | null>(null)
  const [progress, setProgress] = useState({ done: 0, total: game.moves.length + 1 })
  const [failed, setFailed] = useState(false)
  // Bumped by "Try again" to run the analysis afresh.
  const [attempt, setAttempt] = useState(0)
  // 0 = summary, 1…n = the moments, n + 1 = best move of the game
  const [step, setStep] = useState(0)
  const [momentDone, setMomentDone] = useState(false)
  const [fullGame, setFullGame] = useState(false)
  // Where the step-through opens: the start, or a key moment (and maybe straight into Try again).
  const [fullGameAt, setFullGameAt] = useState<{ index: number; retry: number | null }>({ index: 0, retry: null })
  const openAt = (index: number, retry: number | null) => {
    setFullGameAt({ index, retry })
    setFullGame(true)
    window.scrollTo({ top: 0 })
  }

  // Use saved analysis if this game was reviewed before; otherwise run it.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const saved = await getArchivedGame(game.id)
      // Analysed before Sep 2026 (no engine lines saved): analyse again, once,
      // so the coach's explanations can follow the real lines.
      const hasLines = saved?.evals?.some((e) => e.pv?.length)
      if (saved?.evals?.length === game.moves.length + 1 && hasLines) {
        if (!cancelled) setEvals(settleEvals(game.moves, saved.evals))
        return
      }
      const result = await analyseGame(
        game.moves,
        (done, total) => !cancelled && setProgress({ done, total }),
        () => cancelled,
      )
      if (!result || cancelled) return
      setEvals(settleEvals(game.moves, result))
      await saveGameAnalysis(game.id, result)
    })().catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [game.id, game.moves, attempt])

  const player = game.playerColour
  const opponent: Colour = player === 'w' ? 'b' : 'w'
  const outcome = outcomeOf(game)
  const reviewed = useMemo(() => (evals ? reviewMoves(game.moves, evals) : null), [evals, game.moves])
  const moments = useMemo(
    // (A retry: only what happened from the retried move on.)
    () => (evals ? gameMoments(game.moves, evals, player).filter((m) => m.ply >= (game.startPly ?? 0)) : []),
    [evals, game.moves, player, game.startPly],
  )
  // The one to play again from: the costliest mistake (Joseph, Sep 2026: retry the moment).
  const retryFrom = useMemo(() => {
    const cost = (m: (typeof moments)[number]) => (m.rating === 'blunder' ? 1000 : 0) + m.bestCp - (m.playedCp ?? m.bestCp)
    return moments.length ? [...moments].sort((a, b) => cost(b) - cost(a))[0].ply : null
  }, [moments])
  const canRetry =
    !fromHistory && !!onPlayFrom && retryFrom !== null && (game.path?.kind === 'friendly' || game.path?.kind === 'coaching')
  const best = useMemo(() => {
    const b = reviewed ? bestMoveOfGame(reviewed, player) : null
    // (Not one of a retry's copied moves.)
    return b && b.move.ply >= (game.startPly ?? 0) ? b : null
  }, [reviewed, player, game.startPly])
  // Book, great and brilliant moves (FreeChess, Sep 2026, as chess.com shows them).
  const specials = useMemo(() => (reviewed ? specialMoves(reviewed) : new Map<number, Special>()), [reviewed])
  // The one thing to work on from this game, and the lesson that practises it.
  const tip = useMemo(
    () => (reviewed && evals ? coachTip(game.moves, evals, reviewed, player, game.startPly ?? 0) : null),
    [reviewed, evals, game.moves, player, game.startPly],
  )
  const tipLesson = tip ? ALL_LESSONS.find((l) => l.id === tip.lesson) : undefined
  // The opening, by name, and how long the game followed known theory.
  const opening = useMemo(() => {
    const key = detectOpening(replay(game.moves.slice(0, 12)).history())
    const name = key ? (OPENING_NAMES[key] ?? key).replace(/^the /, '') : null
    const book = bookLength(game.moves)
    return { name: name ? name.charAt(0).toUpperCase() + name.slice(1) : null, bookMoves: Math.ceil(book / 2) }
  }, [game.moves])
  // Key moments for the summary: your biggest mistake, a chance you missed,
  // and your best move. Each opens the step-through there (FreeChess).
  const keyMoments = useMemo(() => {
    const out: { kind: KeyKind; ply: number; label: string; retry: boolean }[] = []
    const cost = (m: (typeof moments)[number]) => m.bestCp - (m.playedCp ?? m.bestCp)
    const label = (m: (typeof moments)[number]) => moveLabel({ fenBefore: m.fenBefore, uci: m.played, ply: m.ply, rating: m.rating })
    const worst = moments.filter((m) => m.kind === 'mistake').sort((x, y) => cost(y) - cost(x))[0]
    if (worst) out.push({ kind: 'mistake', ply: worst.ply, label: label(worst), retry: true })
    const missed = moments.find((m) => m.kind === 'missed')
    if (missed) out.push({ kind: 'missed', ply: missed.ply, label: label(missed), retry: true })
    // Your finest move: a brilliant one, else a great one, else the best of the game.
    const mine = (reviewed ?? []).filter((m) => m.mover === player && m.ply >= (game.startPly ?? 0))
    const star = mine.find((m) => specials.get(m.ply) === 'brilliant') ?? mine.find((m) => specials.get(m.ply) === 'great')
    if (star) out.push({ kind: specials.get(star.ply) as KeyKind, ply: star.ply, label: moveLabel(star), retry: false })
    else if (best) out.push({ kind: 'best', ply: best.move.ply, label: moveLabel(best.move), retry: false })
    return out
  }, [moments, best, reviewed, specials, player, game.startPly])
  // The moves actually played in this game (a retry's first moves were the original game's).
  const played = useMemo(() => reviewed?.filter((m) => m.ply >= (game.startPly ?? 0)) ?? [], [reviewed, game.startPly])
  const specialCount = (kind: Special) => played.filter((m) => m.mover === player && specials.get(m.ply) === kind).length

  // Real errors (mistakes and blunders) become Tuesday warm-ups. Done as soon
  // as the analysis is in, so they're kept even if the review is skipped.
  useEffect(() => {
    const cards = cardsFromMoments(game, moments)
    if (cards.length) addCardsIfNew(cards).catch((err) => console.error('Deck save failed', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per game's moments
  }, [moments, game.id])

  const resultLine = outcome
    ? outcome.winner === null
      ? fromHistory || !game.path || drawRule(game.path.kind) !== 'replay'
        ? 'Drawn.'
        : 'Drawn: replayed next.'
      : outcome.winner === player
        ? 'You won.'
        : 'You lost.'
    : ''
  const stampKind = !outcome ? '' : outcome.winner === null ? 'drawn' : outcome.winner === player ? 'won' : 'lost'
  const finalLabel = fromHistory ? 'Back to past games' : outcome?.winner === null ? 'Replay' : 'Continue'

  function goTo(next: number) {
    setStep(next)
    setMomentDone(false)
    window.scrollTo({ top: 0 })
  }

  // --- The steps -----------------------------------------------------------

  if (fullGame && reviewed && evals) {
    return (
      <FullGameView
        key={`${fullGameAt.index}:${fullGameAt.retry ?? ''}`}
        startAt={fullGameAt.index}
        retryAt={fullGameAt.retry}
        moves={game.moves}
        evals={evals}
        reviewed={reviewed}
        specials={specials}
        playerColour={player}
        onBack={() => {
          setFullGame(false)
          window.scrollTo({ top: 0 })
        }}
        // FreeChess (Joseph, Sep 2026): no "biggest moments" to play through;
        // "Try it again" in the step-through does that job. The step-through ends the review.
        onDone={onContinue}
        doneLabel={finalLabel}
      />
    )
  }

  // The review is optional (Joseph's decision, Sep 2026): skip straight on.
  const skipButton = (
    <button type="button" className="review-skip" onClick={onContinue}>
      {fromHistory ? 'Back' : 'Skip'}
    </button>
  )

  if (reviewed && step >= 1 && step <= moments.length) {
    const moment = moments[step - 1]
    return (
      <main className="review-screen with-board">
        <header>
          <div className="review-topline">
            <p className="review-kicker">
              Biggest moment {step} of {moments.length}
            </p>
            {skipButton}
          </div>
          <h1>
            {moveLabel({ fenBefore: moment.fenBefore, uci: moment.played, ply: moment.ply, rating: moment.rating })}{' '}
            <span className={`review-pill rating-${moment.rating}`}>
              {moment.kind === 'missed' ? 'Missed chance' : RATING_LABELS[moment.rating]}
            </span>
          </h1>
        </header>
        <MomentTrainer
          key={step}
          moment={moment}
          onFinished={() => {
            setMomentDone(true)
            // Retried here, so it won't come back as a warm-up: warm-ups are
            // always a first look (Joseph, Sep 2026).
            retireCardById(cardId(game.id, moment.ply)).catch(() => undefined)
          }}
        />
        <button
          type="button"
          className="review-continue"
          disabled={!momentDone}
          onClick={() => goTo(step + 1)}
        >
          {step < moments.length ? 'Next moment' : 'Best move of the game'}
        </button>
      </main>
    )
  }

  if (reviewed && step === moments.length + 1) {
    return (
      <main className="review-screen with-board">
        <header>
          <p className="review-kicker">Best move of the game</p>
          {best && <h1>{moveLabel(best.move)}</h1>}
        </header>
        {best ? (
          <>
            <MoveReplay moves={game.moves} ply={best.move.ply} orientation={player === 'w' ? 'white' : 'black'} />
            <p className="review-explanation">
              {best.move.ply > 0 && <>They played {theirMoveName(game.moves, best.move.ply)}. </>}
              {explainGoodMove(best.move.fenBefore, best.move.uci, best.punished, evals?.[best.move.ply]?.pv, game.moves.slice(best.move.ply))}
            </p>
          </>
        ) : (
          <p className="review-note">No standout move this time. Next game.</p>
        )}
        <button type="button" className="review-continue" onClick={onContinue}>
          {finalLabel}
        </button>
        <button
          type="button"
          className="review-secondary"
          onClick={() => {
            setFullGame(true)
            window.scrollTo({ top: 0 })
          }}
        >
          See the whole game again
        </button>
      </main>
    )
  }

  // A game over in a handful of moves (a resignation, a four-move mate) has
  // nothing worth grading: say so, rather than showing empty numbers.
  if (game.moves.length < SHORTEST_REVIEW) {
    return (
      <main className="review-screen">
        <header>
          <div className="review-topline">
            <h1>Review</h1>
          </div>
          <p className="review-result">
            {resultLine} {outcome && <span>{describeOutcome(outcome)}</span>}
          </p>
        </header>
        <p className="review-note">Too short to review: only {Math.ceil(game.moves.length / 2)} moves.</p>
        <button type="button" className="review-continue" onClick={onContinue}>
          {finalLabel}
        </button>
      </main>
    )
  }

  // Summary (and the progress bar while analysing).
  return (
    <main className="review-screen">
      <header>
        <div className="review-topline">
          <h1>Review</h1>
          {skipButton}
        </div>
        <p className="review-result">
          {/* The result, stamped as on the club's results sheet. */}
          <strong className={`result-stamp ${stampKind}`}>{resultLine}</strong>{' '}
          {outcome && <span>{describeOutcome(outcome)}</span>}
        </p>
        {(opening.name || opening.bookMoves > 0) && (
          <p className="review-opening">
            {opening.name ?? 'Opening'}
            {opening.bookMoves > 0 ? ` · ${opening.bookMoves} ${opening.bookMoves === 1 ? 'move' : 'moves'} of known theory` : ''}
          </p>
        )}
        {ratingChange && (
          <p className={`review-rating ${ratingChange.to >= ratingChange.from ? 'up' : 'down'}`}>
            Rating {Math.round(ratingChange.from)} → {Math.round(ratingChange.to)} (
            {ratingChange.to >= ratingChange.from ? '+' : '−'}
            {Math.abs(Math.round(ratingChange.to) - Math.round(ratingChange.from))})
          </p>
        )}
      </header>

      {failed ? (
        <section className="review-progress">
          <p className="review-note">The analysis stopped part way (phones sometimes pause it). Your game is still saved.</p>
          <button
            type="button"
            className="review-secondary"
            onClick={() => {
              setFailed(false)
              setProgress({ done: 0, total: game.moves.length + 1 })
              setAttempt((a) => a + 1)
            }}
          >
            Try again
          </button>
        </section>
      ) : !reviewed ? (
        <section className="review-progress" aria-live="polite">
          <p>Checking every move…</p>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
            />
          </div>
          <p className="review-note">
            {progress.done} of {progress.total} positions
          </p>
        </section>
      ) : (
        <section className="review-summary">
          <div className="review-headline">
            <div className="accuracy">
              <span className="accuracy-value">{gameAccuracy(played, player) ?? '–'}%</span>
              <span className="accuracy-label">your accuracy</span>
              <span className="accuracy-opponent">Opponent: {gameAccuracy(played, opponent) ?? '–'}%</span>
            </div>
            {/* A rough rating for this one game, as chess.com does. */}
            {(() => {
              const like = playedLike({
                yours: gameAccuracy(played, player),
                theirs: gameAccuracy(played, opponent),
                opponentRating: game.opponentRating,
                result: !outcome || outcome.winner === null ? 'draw' : outcome.winner === player ? 'win' : 'loss',
                yourMoves: played.filter((m) => m.mover === player).length,
              })
              return like ? (
                <div className="played-like">
                  <span className="played-like-value">{like}</span>
                  <span className="accuracy-label">you played like</span>
                  <span className="accuracy-opponent">a rough guess</span>
                </div>
              ) : null
            })()}
          </div>

          {/* The game at a glance: tap it to step through from that point. */}
          {evals && (
            <EvalGraph
              compact
              points={winPoints(evals, player)}
              markers={played.filter((m) => m.mover === player && ['mistake', 'blunder'].includes(m.rating)).map((m) => ({ index: m.ply + 1, rating: m.rating }))}
              current={-1}
              onSelect={(i) => openAt(i, null)}
            />
          )}

          <div className="phase-row">
            {(() => {
              const acc = phaseAccuracy(played, player)
              return PHASES.map((p) => (
                <div key={p} className={`phase ${acc[p] === null ? 'none' : acc[p]! >= 80 ? 'good' : acc[p]! >= 60 ? 'ok' : 'poor'}`}>
                  <span className="phase-label">{PHASE_LABELS[p]}</span>
                  <span className="phase-value">{acc[p] ?? '–'}</span>
                </div>
              ))
            })()}
          </div>

          <ul className="rating-counts">
            {(['brilliant', 'great'] as const).map((kind) => {
              const count = specialCount(kind)
              return count > 0 ? (
                <li key={kind} className={`rating-${kind}`}>
                  <span className="dot" />
                  <span className="count">{count}</span>
                  <span className="label">{count === 1 ? SPECIAL_LABELS[kind] : kind === 'brilliant' ? 'Brilliant moves' : 'Great moves'}</span>
                </li>
              ) : null
            })}
            {RATING_ORDER.map((rating) => {
              const count = ratingCounts(played, player)[rating]
              return (
                <li key={rating} className={`rating-${rating}`}>
                  <span className="dot" />
                  <span className="count">{count}</span>
                  <span className="label">{COUNT_LABELS[rating][count === 1 ? 0 : 1]}</span>
                </li>
              )
            })}
          </ul>

          {moments.length === 0 && <p className="review-note">No big mistakes this game.</p>}

          {/* The Coach's tip: the thing to work on, and where to practise it. */}
          {tip && tipLesson && (
            <div className="review-tip">
              <Portrait who="coach" size={40} expression="neutral" className="fc-face" />
              <div>
                <p className="review-tip-title">Coach’s tip</p>
                <p className="review-tip-text">
                  {tip.text} The lesson “{tipLesson.title}” practises exactly this.
                </p>
                {onLesson && (
                  <button type="button" className="review-tip-go" onClick={() => onLesson(tipLesson.id)}>
                    Practise it
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Key moments you can tap (Joseph, Sep 2026: the coach's notes weren't
              useful; these go straight to the move, or straight into Try again). */}
          {keyMoments.length > 0 && (
            <div className="review-keys">
              <p className="review-keys-title">Key moments</p>
              {keyMoments.map((k) => (
                <button key={k.kind} type="button" className={`review-key ${k.kind}`} onClick={() => openAt(k.ply + 1, k.retry ? k.ply : null)}>
                  <span className="review-key-kind">{KEY_LABELS[k.kind]}</span>
                  <span className="review-key-move">{k.label}</span>
                  <span className="review-key-go">{k.retry ? 'Try again' : 'See it'}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {reviewed ? (
        <>
          {/* The whole game, with Try it again on your moves (Joseph, Sep 2026). */}
          <button
            type="button"
            className="review-continue"
            onClick={() => openAt(0, null)}
          >
            Step through the game
          </button>
          <button type="button" className="review-secondary" onClick={onContinue}>
            {finalLabel}
          </button>
          {canRetry && (
            <button type="button" className="review-secondary" onClick={() => onPlayFrom!(retryFrom!)}>
              Play on from before your mistake (move {Math.floor(retryFrom! / 2) + 1})
            </button>
          )}
        </>
      ) : (
        failed && (
          <button type="button" className="review-continue" onClick={onContinue}>
            {finalLabel}
          </button>
        )
      )}
    </main>
  )
}
