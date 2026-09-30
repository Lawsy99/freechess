// Profile: your rating and its graph, stars, streaks, your record against the
// bots, and the way into past games and settings.
import { Portrait } from '../components/Portrait'
import { RatingGraph } from '../components/RatingGraph'
import { BOTS } from '../data/bots'
import { totalStars, type Profile } from '../logic/profile'
import { ChevronIcon, FlameIcon, SettingsIcon, StarIcon } from './icons'

type Props = {
  profile: Profile
  onPastGames: () => void
  onSettings: () => void
}

export function ProfileTab({ profile, onPastGames, onSettings }: Props) {
  const rating = profile.rating ? Math.round(profile.rating.rating) : null
  const played = BOTS.map((b) => ({ bot: b, r: profile.results[b.id] }))
    .filter((x) => x.r && x.r.wins + x.r.losses + x.r.draws > 0)
    .sort((a, b) => b.r!.wins + b.r!.losses + b.r!.draws - (a.r!.wins + a.r!.losses + a.r!.draws))
  const totals = played.reduce((t, x) => ({ w: t.w + x.r!.wins, l: t.l + x.r!.losses, d: t.d + x.r!.draws }), { w: 0, l: 0, d: 0 })

  return (
    <main className="fc-page">
      <header className="fc-page-head fc-profile-head">
        <h1>Profile</h1>
        <button type="button" className="fc-icon-button" onClick={onSettings} aria-label="Settings">
          <SettingsIcon size={22} />
        </button>
      </header>

      <section className="fc-card fc-rating-card">
        <span>Rating</span>
        <strong>{rating ?? '–'}</strong>
        <RatingGraph points={profile.ratingHistory} />
      </section>

      <div className="fc-quick-stats">
        <div className="fc-card">
          <span>Stars</span>
          <strong>
            <StarIcon size={18} filled /> {totalStars(profile)}
          </strong>
          <small>of {BOTS.length * 3}</small>
        </div>
        <div className="fc-card">
          <span>Best streak</span>
          <strong>
            <FlameIcon size={20} lit={profile.streak.best > 0} /> {profile.streak.best}
          </strong>
          <small>days</small>
        </div>
        <div className="fc-card">
          <span>Games</span>
          <strong>{totals.w + totals.l + totals.d}</strong>
          <small>
            {totals.w}W {totals.l}L {totals.d}D
          </small>
        </div>
      </div>

      <button type="button" className="fc-card fc-link-row" onClick={onPastGames}>
        <strong>Past games</strong>
        <span>Review any game</span>
        <ChevronIcon size={20} />
      </button>

      {played.length > 0 && (
        <section>
          <h2>Against the bots</h2>
          <ul className="fc-card fc-records">
            {played.map(({ bot, r }) => (
              <li key={bot.id}>
                <Portrait who={bot.id} size={36} className="fc-face" />
                <span className="fc-records-name">
                  {bot.name} <span className="fc-flag">{bot.flag}</span>
                </span>
                <span className="fc-records-score">
                  {r!.wins}–{r!.losses}
                  {r!.draws ? `–${r!.draws}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
