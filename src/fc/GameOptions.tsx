// Before a bot game: your colour, and the clock (FreeChess, Sep 2026: no
// clock unless you pick one). Shared by the bot page and the custom bot.
import { TIME_CONTROLS, type TimeControlId } from '../logic/clock'
import type { ColourChoice } from './BotSheet'

type Props = {
  colour: ColourChoice
  onColour: (c: ColourChoice) => void
  time: TimeControlId
  onTime: (t: TimeControlId) => void
}

export function GameOptions({ colour, onColour, time, onTime }: Props) {
  return (
    <div className="fc-game-options">
      <div className="fc-segmented" role="radiogroup" aria-label="Your colour">
        {(
          [
            ['w', 'White'],
            ['random', 'Random'],
            ['b', 'Black'],
          ] as const
        ).map(([value, label]) => (
          <button key={value} type="button" role="radio" aria-checked={colour === value} className={colour === value ? 'selected' : undefined} onClick={() => onColour(value)}>
            <span className={`fc-colour-dot ${value}`} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div className="fc-segmented four" role="radiogroup" aria-label="Clock">
        {TIME_CONTROLS.map((t) => (
          <button key={t.id} type="button" role="radio" aria-checked={time === t.id} className={time === t.id ? 'selected' : undefined} onClick={() => onTime(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
