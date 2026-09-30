// A glimpse of the review on the result screen (FreeChess, Sep 2026): your
// accuracy and a rough rating for the game, as soon as the moves have been
// checked (that starts the moment the game ends). A nudge to open the review.
import { useEffect, useState } from 'react'
import { analyseInBackground, onProgress } from '../engine/reviewJobs'
import { outcomeOf, type GameRecord } from '../logic/gameRecord'
import { gameAccuracy, reviewMoves, settleEvals, SHORTEST_REVIEW } from '../logic/review'
import { playedLike } from '../logic/reviewExtras'
import { getArchivedGame } from '../storage/db'

type Teaser = { accuracy: number | null; like: number | null }

export function ResultTeaser({ game }: { game: GameRecord }) {
  const [teaser, setTeaser] = useState<Teaser | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (game.moves.length < SHORTEST_REVIEW) return
    let cancelled = false
    let stop = () => {}
    ;(async () => {
      const saved = await getArchivedGame(game.id)
      let evals = saved?.evals?.length === game.moves.length + 1 ? saved.evals : null
      if (!evals) {
        const job = analyseInBackground(game.id, game.moves)
        stop = onProgress(job, (p) => !cancelled && setProgress(p.done / p.total))
        evals = await job.result
      }
      if (!evals || cancelled) return
      const moves = reviewMoves(game.moves, settleEvals(game.moves, evals)).filter((m) => m.ply >= (game.startPly ?? 0))
      const player = game.playerColour
      const outcome = outcomeOf(game)
      const yours = gameAccuracy(moves, player)
      setTeaser({
        accuracy: yours,
        like: playedLike({
          yours,
          theirs: gameAccuracy(moves, player === 'w' ? 'b' : 'w'),
          opponentRating: game.opponentRating,
          result: !outcome || outcome.winner === null ? 'draw' : outcome.winner === player ? 'win' : 'loss',
          yourMoves: moves.filter((m) => m.mover === player).length,
        }),
      })
    })().catch(() => undefined)
    return () => {
      cancelled = true
      stop()
    }
  }, [game])

  if (game.moves.length < SHORTEST_REVIEW) return null
  return (
    <div className="fc-teaser" aria-live="polite">
      {teaser ? (
        <>
          <span>
            <strong>{teaser.accuracy ?? '–'}%</strong> accuracy
          </span>
          {teaser.like && (
            <span>
              played like <strong>{teaser.like}</strong>
            </span>
          )}
        </>
      ) : (
        <span className="fc-teaser-wait">
          Checking your moves…
          <i style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      )}
    </div>
  )
}
