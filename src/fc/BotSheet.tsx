// A bot's page: who they are, how they play, your record against them, and
// a colour to play. Then the game.
import { useState } from 'react'
import { Portrait } from '../components/Portrait'
import { BOT_GROUPS, type Bot } from '../data/bots'
import type { Profile } from '../logic/profile'
import type { TimeControlId } from '../logic/clock'
import { GameOptions } from './GameOptions'
import { BackIcon, Stars } from './icons'
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
  return (
    <main className="fc-page fc-bot-sheet">
      <button type="button" className="fc-back" onClick={onBack} aria-label="Back to the bots">
        <BackIcon size={22} /> Bots
      </button>
      <div className="fc-bot-hero">
        <Portrait who={bot.id} size={112} className="fc-face" />
        <h1>
          {bot.name} <span className="fc-flag">{bot.flag}</span>
        </h1>
        <p className="fc-bot-meta">
          {bot.rating} · {group?.label} · {bot.country}
        </p>
        <Stars earned={profile.stars[bot.id] ?? 0} size={22} />
      </div>
      <p className="fc-bot-quote">“{bot.bio}”</p>
      <div className="fc-card fc-style">
        <strong>{style.label}</strong>
        <span>{style.detail}</span>
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
