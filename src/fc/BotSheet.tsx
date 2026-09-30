// A bot's page: who they are (a banner in their colour, their face, what
// they'd say about themselves), how they play, your record against them,
// then a colour and a clock, and the game. (Look reworked Sep 2026.)
import { useState } from 'react'
import { Portrait } from '../components/Portrait'
import { BOT_GROUPS, type Bot } from '../data/bots'
import { FACES } from '../data/faces'
import type { Profile } from '../logic/profile'
import type { TimeControlId } from '../logic/clock'
import { GameOptions } from './GameOptions'
import { BackIcon, Stars, StyleIcon } from './icons'
import { STYLE_LABELS } from '../logic/botPicks'

export type ColourChoice = 'w' | 'random' | 'b'

type Props = {
  bot: Bot
  profile: Profile
  onBack: () => void
  onPlay: (colour: ColourChoice, time: TimeControlId) => void
  /** The clock chosen last time. */
  timeControl: TimeControlId
}

export function BotSheet({ bot, profile, onBack, onPlay, timeControl }: Props) {
  const [colour, setColour] = useState<ColourChoice>('random')
  const [time, setTime] = useState<TimeControlId>(timeControl)
  const record = profile.results[bot.id]
  const style = STYLE_LABELS[bot.style]
  const group = BOT_GROUPS.find((g) => g.id === bot.group)
  const bg = FACES[bot.id]?.bg ?? '8fb3ff'
  return (
    <main className={`fc-page fc-bot-sheet lvl-${bot.group}`}>
      <BotBanner bg={bg} who={bot.id} onBack={onBack} />
      <div className="fc-bot-hero">
        <h1>
          {bot.name} <span className="fc-flag">{bot.flag}</span>
        </h1>
        <div className="fc-bot-chips">
          <span className={`fc-rating-tag lvl-${bot.group}`}>{bot.rating}</span>
          <span className="fc-chip">{group?.label}</span>
          <span className="fc-chip">{bot.country}</span>
        </div>
        <Stars earned={profile.stars[bot.id] ?? 0} size={24} />
      </div>
      <p className="fc-bubble">{bot.bio}</p>
      <div className="fc-card fc-style">
        <span className="fc-style-icon">
          <StyleIcon style={bot.style} size={22} />
        </span>
        <span className="fc-style-text">
          <strong>{style.label}</strong>
          <span>{style.detail}</span>
        </span>
      </div>
      {record && record.wins + record.losses + record.draws > 0 && (
        <p className="fc-record">
          You: {record.wins} won · {record.losses} lost{record.draws ? ` · ${record.draws} drawn` : ''}
        </p>
      )}
      <GameOptions colour={colour} onColour={setColour} time={time} onTime={setTime} />
      <button type="button" className="fc-primary" onClick={() => onPlay(colour, time)}>
        Play {bot.name}
      </button>
    </main>
  )
}

/** The top of a bot's page: their colour, a faint board pattern, and their face. */
export function BotBanner({ bg, who, onBack }: { bg: string; who: string; onBack: () => void }) {
  return (
    <div className="fc-bot-banner" style={{ ['--banner' as string]: `#${bg}` }}>
      <button type="button" className="fc-banner-back" onClick={onBack} aria-label="Back to the bots">
        <BackIcon size={22} /> Bots
      </button>
      <Portrait who={who} size={128} className="fc-face fc-banner-face" />
    </div>
  )
}
