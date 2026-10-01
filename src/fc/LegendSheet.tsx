// A chess legend's page (Oct 2026): who they were, what they were famous
// for, and the journey: eight levels from 200 to 2400. You play them at the
// level you've reached; each win moves them up one.
import { useState } from 'react'
import { FACES } from '../data/faces'
import { LEGEND_LEVELS, legendLevel, type Legend } from '../data/legends'
import { STYLE_LABELS } from '../logic/botPicks'
import type { TimeControlId } from '../logic/clock'
import { favouriteOpenings } from '../logic/favouriteOpenings'
import type { Profile } from '../logic/profile'
import { BotBanner, type ColourChoice } from './BotSheet'
import { GameOptions } from './GameOptions'
import { StyleIcon } from './icons'

type Props = {
  legend: Legend
  profile: Profile
  timeControl: TimeControlId
  onBack: () => void
  onPlay: (rating: number, colour: ColourChoice, time: TimeControlId) => void
}

export function LegendSheet({ legend, profile, timeControl, onBack, onPlay }: Props) {
  const [colour, setColour] = useState<ColourChoice>('random')
  const [time, setTime] = useState<TimeControlId>(timeControl)
  const beaten = profile.legends?.[legend.id] ?? 0
  const level = legendLevel(beaten)
  const finished = beaten >= LEGEND_LEVELS.length
  const rating = LEGEND_LEVELS[level]
  const style = STYLE_LABELS[legend.style]
  const openings = favouriteOpenings(legend.id)
  return (
    <main className="fc-page fc-bot-sheet fc-legend-sheet">
      <BotBanner bg={FACES[legend.id]?.bg ?? 'd9c7a3'} who={legend.id} onBack={onBack} />
      <div className="fc-bot-hero">
        <h1>
          {legend.name} <span className="fc-flag">{legend.flag}</span>
        </h1>
        <div className="fc-bot-chips">
          <span className="fc-chip">{legend.years}</span>
          <span className="fc-chip">{legend.country}</span>
        </div>
      </div>
      <p className="fc-legend-story">{legend.story}</p>

      {/* The journey: eight levels, the ones beaten ticked, the next one lit. */}
      <section className="fc-card fc-journey">
        <p className="fc-journey-head">
          {finished ? (
            <strong>You beat {legend.name} at their peak!</strong>
          ) : (
            <>
              <strong>
                Level {level + 1} of {LEGEND_LEVELS.length}
              </strong>
              <span>Beat them to make them stronger.</span>
            </>
          )}
        </p>
        <ol className="fc-journey-steps">
          {LEGEND_LEVELS.map((r, i) => (
            <li key={r} className={i < beaten ? 'beaten' : i === level && !finished ? 'current' : undefined}>
              <span>{i < beaten ? '✓' : i + 1}</span>
              <small>{r}</small>
            </li>
          ))}
        </ol>
      </section>

      <div className="fc-card fc-style">
        <span className="fc-style-icon">
          <StyleIcon style={legend.style} size={22} />
        </span>
        <span className="fc-style-text">
          <strong>{style.label}</strong>
          <span>{style.detail}</span>
          {(openings.white.length > 0 || openings.black.length > 0) && (
            <span className="fc-openings-line">
              {openings.white.length > 0 && <>Opens with {openings.white.join(' and ')} as White</>}
              {openings.white.length > 0 && openings.black.length > 0 && <>, and </>}
              {openings.black.length > 0 && <>{openings.black.join(' and ')} as Black</>}.
            </span>
          )}
        </span>
      </div>

      <GameOptions colour={colour} onColour={setColour} time={time} onTime={setTime} />
      <button type="button" className="fc-primary" onClick={() => onPlay(rating, colour, time)}>
        {finished ? `Play ${legend.name} again (${rating})` : `Play ${legend.name} · level ${level + 1} (${rating})`}
      </button>
    </main>
  )
}
