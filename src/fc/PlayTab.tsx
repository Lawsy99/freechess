// Play: every bot, in drop-down groups by level (Joseph, Sep 2026). Each
// group shows the stars collected in it; each bot, their face, flag, rating
// and your best stars against them. The group nearest your rating starts open.
import { useState } from 'react'
import { Portrait } from '../components/Portrait'
import { BOT_GROUPS, botsIn, type Bot, type BotGroup } from '../data/bots'
import type { Profile } from '../logic/profile'
import { ChevronIcon, Stars, StarIcon } from './icons'
import { groupFor } from '../logic/botPicks'
import { MenuList } from './MenuList'

type Props = {
  profile: Profile
  onPick: (bot: Bot) => void
  onPlayCoach: () => void
  onAnalysis: () => void
  onCustom: () => void
}

export function PlayTab({ profile, onPick, onPlayCoach, onAnalysis, onCustom }: Props) {
  const rating = profile.rating ? Math.round(profile.rating.rating) : 800
  const [open, setOpen] = useState<BotGroup[]>([groupFor(rating)])
  const toggle = (g: BotGroup) => setOpen((o) => (o.includes(g) ? o.filter((x) => x !== g) : [...o, g]))

  return (
    <main className="fc-page">
      <header className="fc-page-head">
        <h1>Play bots</h1>
        <p>Win without takebacks or hints for all three stars.</p>
      </header>
      {/* The Coach first: a game at your level with tips as you go (not rated). */}
      <button type="button" className="fc-card fc-coach-card" onClick={onPlayCoach}>
        <Portrait who="coach" size={56} expression="pleased" className="fc-face" />
        <span className="fc-bot-main">
          <strong>Play the Coach</strong>
          <span className="fc-bot-bio">At your level, with tips as you go and a full review after. Not rated.</span>
        </span>
        <span className="fc-chip-button">Play</span>
      </button>
      {BOT_GROUPS.map((group) => {
        const bots = botsIn(group.id)
        const stars = bots.reduce((sum, b) => sum + (profile.stars[b.id] ?? 0), 0)
        const isOpen = open.includes(group.id)
        return (
          <section key={group.id} className={`fc-group ${isOpen ? 'open' : ''}`}>
            <button type="button" className="fc-group-head" aria-expanded={isOpen} onClick={() => toggle(group.id)}>
              <span className="fc-group-title">
                <strong>{group.label}</strong>
                <span>
                  {group.range} · {bots.length} bots
                </span>
              </span>
              <span className="fc-group-stars">
                <StarIcon size={15} filled /> {stars}/{bots.length * 3}
              </span>
              <ChevronIcon size={20} className="fc-chevron" />
            </button>
            {isOpen && (
              <div className="fc-group-body">
                <p className="fc-group-about">{group.about}</p>
                <ul className="fc-bot-list">
                  {bots.map((bot) => (
                    <li key={bot.id}>
                      <button type="button" className="fc-bot-row" onClick={() => onPick(bot)}>
                        <Portrait who={bot.id} size={48} className="fc-face" />
                        <span className="fc-bot-main">
                          <strong>
                            {bot.name} <span className="fc-flag">{bot.flag}</span>
                          </strong>
                          <span className="fc-bot-bio">{bot.bio}</span>
                        </span>
                        <span className="fc-bot-side">
                          <span className="fc-rating-tag">{bot.rating}</span>
                          <Stars earned={profile.stars[bot.id] ?? 0} size={13} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )
      })}

      <MenuList
        label="More"
        items={[
          { id: 'custom', title: 'Custom bot', detail: 'Choose any strength and style', onClick: onCustom },
          { id: 'analysis', title: 'Analysis board', detail: 'Set up or paste any position and explore it', onClick: onAnalysis },
        ]}
      />
    </main>
  )
}
