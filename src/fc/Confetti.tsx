// A burst of confetti for a win (Sep 2026). Plain shapes falling with a
// little sway, in FreeChess's colours; nothing to download. Hidden for anyone
// who has asked their phone for less motion.
import { useState } from 'react'

const COLOURS = ['#4f86f7', '#ffcb45', '#5fd38d', '#ff7a6b', '#b98cff', '#ffffff']
const PIECES = 56

export function Confetti() {
  // Fixed once per win, so the pieces don't jump about on a re-render.
  const [pieces] = useState(() =>
    Array.from({ length: PIECES }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.2 + Math.random() * 1.6,
      spin: (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540),
      sway: (Math.random() - 0.5) * 80,
      colour: COLOURS[i % COLOURS.length],
      round: i % 3 === 0,
    })),
  )
  return (
    <div className="fc-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          className={p.round ? 'round' : undefined}
          style={{
            left: `${p.left}%`,
            background: p.colour,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--spin' as string]: `${p.spin}deg`,
            ['--sway' as string]: `${p.sway}px`,
          }}
        />
      ))}
    </div>
  )
}
