// A player's clock in their name bar: lit while it's running, red when short.
// It ticks by itself (so the rest of the game screen isn't redrawn ten times
// a second) and says when it reaches zero.
import { useEffect, useState } from 'react'
import { formatClock } from '../logic/clock'

/** Under this, the clock turns red. */
const LOW_MS = 20_000

type Props = {
  /** Time left as saved at the start of this turn. */
  ms: number
  running: boolean
  /** Time used so far this turn (read on each tick). */
  used: () => number
  onFlag: () => void
}

export function ClockChip({ ms, running, used, onFlag }: Props) {
  const [, tick] = useState(0)
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      if (ms - used() <= 0) onFlag()
      tick((t) => t + 1)
    }, 100)
    return () => clearInterval(timer)
  }, [running, ms, used, onFlag])
  const left = Math.max(0, running ? ms - used() : ms)
  return (
    <span className={`clock-chip ${running ? 'running' : ''} ${left < LOW_MS ? 'low' : ''}`} role="timer" aria-label={`Time left ${formatClock(left)}`}>
      {formatClock(left)}
    </span>
  )
}
