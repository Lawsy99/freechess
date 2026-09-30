// After a bot game: the result, the stars earned (they burst in one by one),
// the rating change (counting up) and any new badges. Then the review, a
// rematch, or back. A win gets confetti; a loss is kind. (Look reworked Sep 2026.)
import { useEffect, useState } from 'react'
import { Portrait } from '../components/Portrait'
import type { Bot } from '../data/bots'
import { FACES } from '../data/faces'
import type { BotResult } from '../logic/profile'
import { MedalIcon } from './AchievementsScreen'
import { Confetti } from './Confetti'
import { StarIcon } from './icons'
import './result.css'

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
  /** The custom bot: rated, but no stars. */
  custom?: boolean
  /** Badges this game earned. */
  badges?: string[]
}

type Props = LastResult & {
  onReview: () => void
  onRematch: () => void
  onDone: () => void
}

const TITLES: Record<BotResult, string> = { win: 'You won!', loss: 'You lost', draw: 'Draw' }
const COACH_TITLES: Record<BotResult, string> = { win: 'You beat the Coach!', loss: 'Good game!', draw: 'A draw with the Coach' }
const LOSS_LINES = [
  'Good fight. The review shows where it turned.',
  'Every loss is a lesson. Have a look at the review.',
  'Close games teach the most. See what you’d change.',
]

export function ResultScreen({ bot, result, stars, aidsUsed, ratingChange, newBest, coach = false, custom = false, badges = [], onReview, onRematch, onDone }: Props) {
  // The Coach is pleased whatever happened; a bot is put out by losing, pleased by winning.
  const expression = coach ? 'pleased' : result === 'win' ? 'annoyed' : result === 'loss' ? 'pleased' : 'neutral'
  const [lossLine] = useState(() => LOSS_LINES[Math.floor(Math.random() * LOSS_LINES.length)])
  const ring = `#${FACES[bot.id]?.bg ?? '8fb3ff'}`
  return (
    <main className={`fc-result ${result}`}>
      {result === 'win' && <Confetti />}
      <div className="fc-result-face" style={{ ['--ring' as string]: ring }}>
        <Portrait who={bot.id} size={112} expression={expression} className="fc-face" />
      </div>
      <h1>{coach ? COACH_TITLES[result] : TITLES[result]}</h1>
      <p className="fc-result-sub">
        {coach ? `with the Coach · at your level (${bot.rating})` : `vs ${bot.name} ${bot.flag} · ${bot.rating}`.replace('  ', ' ')}
      </p>
      {result === 'loss' && !coach && <p className="fc-result-kind">{lossLine}</p>}

      {coach ? (
        <p className="fc-result-note fc-coach-note">
          Coach games aren’t rated: they’re for learning. Today’s coach goal is done. Have a look at the review to see what to work on.
        </p>
      ) : custom ? null : (
        <div className="fc-result-tray">
          <div className="fc-result-stars" aria-label={`${stars} of 3 stars`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < stars ? 'earned' : undefined} style={{ animationDelay: `${0.35 + i * 0.3}s` }}>
                <StarIcon size={i === 1 ? 60 : 48} filled={i < stars} />
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
        </div>
      )}

      {!coach && ratingChange && <RatingChange from={ratingChange.from} to={ratingChange.to} />}

      {badges.length > 0 && (
        <ul className="fc-new-badges" aria-label="New badges">
          {badges.map((b) => (
            <li key={b}>
              <MedalIcon earned size={24} /> {b}
            </li>
          ))}
        </ul>
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

/** The new rating, counting up (or down) from the old one, with the change beside it. */
function RatingChange({ from, to }: { from: number; to: number }) {
  const [shown, setShown] = useState(from)
  useEffect(() => {
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const DURATION = 900
    let frame = 0
    let start = 0
    const step = (now: number) => {
      start ||= now
      const t = still ? 1 : Math.min(1, (now - start) / DURATION)
      const eased = 1 - (1 - t) ** 3
      setShown(Math.round(from + (to - from) * eased))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    // (Starts once the stars have landed.)
    const wait = setTimeout(() => (frame = requestAnimationFrame(step)), still ? 0 : 1100)
    return () => {
      clearTimeout(wait)
      cancelAnimationFrame(frame)
    }
  }, [from, to])
  const diff = to - from
  return (
    <p className={`fc-rating-change ${diff >= 0 ? 'up' : 'down'}`}>
      <span className="fc-rating-label">Rating</span>
      <strong>{shown}</strong>
      <span className="fc-rating-diff">
        {diff >= 0 ? '+' : '−'}
        {Math.abs(diff)}
      </span>
    </p>
  )
}
