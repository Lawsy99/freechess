// After a bot game: the result, the stars earned (they pop in one by one),
// the rating change and today's goal. Then the review, a rematch, or back.
import { Portrait } from '../components/Portrait'
import type { Bot } from '../data/bots'
import type { BotResult } from '../logic/profile'
import { StarIcon } from './icons'

export type LastResult = {
  bot: Bot
  result: BotResult
  stars: number
  /** Takebacks and hints used (each costs a star). */
  aidsUsed: number
  ratingChange: { from: number; to: number } | null
  /** Beat their best against this bot. */
  newBest: boolean
  /** A game with the Coach: no stars or rating, it's a lesson. */
  coach?: boolean
}

type Props = LastResult & {
  onReview: () => void
  onRematch: () => void
  onDone: () => void
}

const TITLES: Record<BotResult, string> = { win: 'You won!', loss: 'You lost', draw: 'Draw' }
const COACH_TITLES: Record<BotResult, string> = { win: 'You beat the Coach!', loss: 'Good game!', draw: 'A draw with the Coach' }

export function ResultScreen({ bot, result, stars, aidsUsed, ratingChange, newBest, coach = false, onReview, onRematch, onDone }: Props) {
  const diff = ratingChange ? ratingChange.to - ratingChange.from : 0
  // (The Coach is pleased whatever happened: a good game is a good game.)
  const expression = coach ? 'pleased' : result === 'win' ? 'annoyed' : result === 'loss' ? 'pleased' : 'neutral'
  return (
    <main className={`fc-result ${result}`}>
      <Portrait who={bot.id} size={96} expression={expression} className="fc-face" />
      <h1>{coach ? COACH_TITLES[result] : TITLES[result]}</h1>
      <p className="fc-result-sub">
        {coach ? `with the Coach · at your level (${bot.rating})` : `vs ${bot.name} ${bot.flag} · ${bot.rating}`}
      </p>
      {coach ? (
        <p className="fc-result-note fc-coach-note">
          Coach games aren’t rated: they’re for learning. Today’s coach goal is done. Have a look at the review to see what to work on.
        </p>
      ) : (
        <>
      <div className="fc-result-stars" aria-label={`${stars} of 3 stars`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < stars ? 'earned' : undefined} style={{ animationDelay: `${0.25 + i * 0.25}s` }}>
            <StarIcon size={52} filled={i < stars} />
          </span>
        ))}
      </div>
      <p className="fc-result-note">
        {result !== 'win'
          ? 'Win to earn stars.'
          : stars === 3
            ? 'All three: no takebacks, no hints.'
            : `${aidsUsed} ${aidsUsed === 1 ? 'takeback or hint' : 'takebacks and hints'} used. Win without any for all three.`}
        {newBest && stars > 0 ? ' A new best against them.' : ''}
      </p>
        </>
      )}
      {!coach && ratingChange && (
        <p className={`fc-rating-change ${diff >= 0 ? 'up' : 'down'}`}>
          <strong>{ratingChange.to}</strong> rating ({diff >= 0 ? '+' : ''}
          {diff})
        </p>
      )}
      <div className="fc-result-actions">
        <button type="button" className="fc-primary" onClick={onReview}>
          Game review
        </button>
        <button type="button" className="fc-secondary" onClick={onRematch}>
          {coach ? 'Play the Coach again' : 'Rematch'}
        </button>
        <button type="button" className="fc-text-button" onClick={onDone}>
          {coach ? 'Done' : 'Play someone else'}
        </button>
      </div>
    </main>
  )
}
