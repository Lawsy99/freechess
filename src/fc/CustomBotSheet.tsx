// The custom bot: pick any strength and a style, then a colour, then play
// (FreeChess, Sep 2026). Starts from what you chose last time, or your rating.
import { useState } from 'react'
import { Portrait } from '../components/Portrait'
import { BOT_GROUPS } from '../data/bots'
import type { Style } from '../data/characters'
import { CUSTOM_MAX, CUSTOM_MIN, CUSTOM_STEP, CUSTOM_STYLES, customBot } from '../data/customBot'
import { groupFor, STYLE_LABELS } from '../logic/botPicks'
import type { Bot } from '../data/bots'
import type { Profile } from '../logic/profile'
import type { ColourChoice } from './BotSheet'
import type { TimeControlId } from '../logic/clock'
import { GameOptions } from './GameOptions'
import { BackIcon } from './icons'

type Props = {
  profile: Profile
  onBack: () => void
  onPlay: (bot: Bot, colour: ColourChoice, time: TimeControlId) => void
  /** The clock chosen last time. */
  timeControl: TimeControlId
}

export function CustomBotSheet({ profile, onBack, onPlay, timeControl }: Props) {
  const yours = Math.round(profile.rating?.rating ?? 800)
  const [rating, setRating] = useState(profile.customBot?.rating ?? Math.round(yours / CUSTOM_STEP) * CUSTOM_STEP)
  const [style, setStyle] = useState<Style>(profile.customBot?.style ?? 'adaptive')
  const [colour, setColour] = useState<ColourChoice>('random')
  const [time, setTime] = useState<TimeControlId>(timeControl)
  const bot = customBot(rating, style)
  const group = BOT_GROUPS.find((g) => g.id === groupFor(bot.rating))
  const nudge = (by: number) => setRating((r) => Math.max(CUSTOM_MIN, Math.min(CUSTOM_MAX, r + by)))

  return (
    <main className="fc-page fc-bot-sheet">
      <button type="button" className="fc-back" onClick={onBack} aria-label="Back to the bots">
        <BackIcon size={22} /> Bots
      </button>
      <div className="fc-bot-hero">
        <Portrait who={bot.id} size={96} className="fc-face" />
        <h1>Custom bot</h1>
        <p className="fc-bot-meta">Choose how strong it is and how it plays.</p>
      </div>

      <section className="fc-card fc-custom-strength">
        <div className="fc-custom-row">
          <button type="button" className="fc-round-button" onClick={() => nudge(-CUSTOM_STEP)} aria-label="Weaker">
            −
          </button>
          <div className="fc-custom-number">
            <strong>{bot.rating}</strong>
            <span>
              {group?.label}
              {Math.abs(bot.rating - yours) <= 50 ? ' · about your level' : bot.rating > yours ? ` · ${bot.rating - yours} above you` : ` · ${yours - bot.rating} below you`}
            </span>
          </div>
          <button type="button" className="fc-round-button" onClick={() => nudge(CUSTOM_STEP)} aria-label="Stronger">
            +
          </button>
        </div>
        <input
          id="custom-strength"
          type="range"
          min={CUSTOM_MIN}
          max={CUSTOM_MAX}
          step={CUSTOM_STEP}
          value={bot.rating}
          onChange={(e) => setRating(Number(e.target.value))}
          aria-label="Strength"
        />
      </section>

      <section>
        <h2 className="fc-menu-label">Style</h2>
        <div className="fc-style-grid" role="radiogroup" aria-label="Style">
          {CUSTOM_STYLES.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={style === s} className={style === s ? 'selected' : undefined} onClick={() => setStyle(s)}>
              {STYLE_LABELS[s].label}
            </button>
          ))}
        </div>
        <p className="fc-style-detail">{STYLE_LABELS[style].detail}</p>
      </section>

      <GameOptions colour={colour} onColour={setColour} time={time} onTime={setTime} />
      <button type="button" className="fc-primary" onClick={() => onPlay(bot, colour, time)}>
        Play
      </button>
      <p className="fc-muted fc-custom-note">Counts for your rating. No stars: those are for the named bots.</p>
    </main>
  )
}
