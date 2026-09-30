// Home: the streak, today's three goals (Joseph, Sep 2026: Duolingo-style,
// one bot game, one coached game and one lesson a day), a game to carry on
// if one is paused, and a suggested bot at about your level.
import { Portrait } from '../components/Portrait'
import type { Bot } from '../data/bots'
import { currentStreak, dayKey, todaysGoals, totalStars, type Goal, type Profile } from '../logic/profile'
import { CheckIcon, ChevronIcon, FlameIcon, Stars, StarIcon } from './icons'
import { Logo } from './Logo'
import { suggestedBot } from '../logic/botPicks'

type Props = {
  profile: Profile
  /** A game left unfinished: who it's against. */
  paused: Bot | null
  onResume: () => void
  onPickBot: (bot: Bot) => void
  onOpenPlay: () => void
  onPlayCoach: () => void
}

const GOAL_TEXT: Record<Goal, { title: string; detail: string; ready: boolean }> = {
  bot: { title: 'Play a bot', detail: 'Any bot, any result.', ready: true },
  coach: { title: 'Play the Coach', detail: 'At your level, with tips as you go.', ready: true },
  lesson: { title: 'Do a lesson', detail: 'Coming soon: the Learn path.', ready: false },
}

export function HomeTab({ profile, paused, onResume, onPickBot, onOpenPlay, onPlayCoach }: Props) {
  const today = dayKey(new Date())
  const done = todaysGoals(profile, today)
  const streak = currentStreak(profile, today)
  const doneToday = done.length > 0
  const suggestion = suggestedBot(profile)
  const rating = profile.rating ? Math.round(profile.rating.rating) : null

  return (
    <main className="fc-page fc-home">
      <header className="fc-home-head">
        <Logo />
        <span className={`fc-streak ${doneToday ? 'lit' : ''}`} aria-label={`${streak} day streak`}>
          <FlameIcon size={22} lit={streak > 0} />
          {streak}
        </span>
      </header>

      <section className="fc-card fc-today">
        <div className="fc-today-head">
          <GoalRing done={done.length} total={3} />
          <div>
            <h2>Today’s goals</h2>
            <p>
              {done.length === 3
                ? 'All three done. See you tomorrow.'
                : streak > 0 && !doneToday
                  ? `Keep your ${streak}-day streak going.`
                  : doneToday
                    ? `${3 - done.length} to go.`
                    : 'Do one to start a streak.'}
            </p>
          </div>
        </div>
        <ul className="fc-goals">
          {(['bot', 'coach', 'lesson'] as Goal[]).map((goal) => {
            const text = GOAL_TEXT[goal]
            const isDone = done.includes(goal)
            return (
              <li key={goal} className={`${isDone ? 'done' : ''} ${text.ready ? '' : 'later'}`}>
                <span className="fc-goal-check" aria-hidden="true">
                  {isDone && <CheckIcon size={16} />}
                </span>
                <span>
                  <strong>{text.title}</strong>
                  <span>{text.detail}</span>
                </span>
                {goal === 'bot' && !isDone && (
                  <button type="button" className="fc-chip-button" onClick={onOpenPlay}>
                    Play
                  </button>
                )}
                {goal === 'coach' && !isDone && (
                  <button type="button" className="fc-chip-button" onClick={onPlayCoach}>
                    Play
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {paused && (
        <button type="button" className="fc-card fc-continue" onClick={onResume}>
          <Portrait who={paused.id} size={44} className="fc-face" />
          <span>
            <strong>Carry on against {paused.name}</strong>
            <span>Your game is waiting where you left it.</span>
          </span>
          <ChevronIcon size={20} />
        </button>
      )}

      <section>
        <h2>Suggested for you</h2>
        <button type="button" className="fc-card fc-suggest" onClick={() => onPickBot(suggestion)}>
          <Portrait who={suggestion.id} size={60} className="fc-face" />
          <span className="fc-bot-main">
            <strong>
              {suggestion.name} <span className="fc-flag">{suggestion.flag}</span>
            </strong>
            <span className="fc-bot-bio">{suggestion.bio}</span>
            <Stars earned={profile.stars[suggestion.id] ?? 0} size={14} />
          </span>
          <span className="fc-rating-tag">{suggestion.rating}</span>
        </button>
      </section>

      <div className="fc-quick-stats">
        <div className="fc-card">
          <span>Rating</span>
          <strong>{rating ?? '–'}</strong>
        </div>
        <div className="fc-card">
          <span>Stars</span>
          <strong>
            <StarIcon size={18} filled /> {totalStars(profile)}
          </strong>
        </div>
        <div className="fc-card">
          <span>Best streak</span>
          <strong>{profile.streak.best}</strong>
        </div>
      </div>
    </main>
  )
}

/** A ring that fills a third for each goal done. */
function GoalRing({ done, total }: { done: number; total: number }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="fc-ring" aria-label={`${done} of ${total} goals done`}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={done === total ? 'var(--good)' : 'var(--buff)'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(done / total) * c} ${c}`}
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="28" y="33" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--text)">
        {done}/{total}
      </text>
    </svg>
  )
}
