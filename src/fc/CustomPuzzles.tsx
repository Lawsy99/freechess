// Custom puzzles (FreeChess, Oct 2026, as chess.com lays them out): pick any
// themes and a difficulty, then solve as many as you like. Unrated, so you can
// practise what you choose without it touching your puzzle rating. Your last
// choice is remembered on the phone.
import { useState } from 'react'
import { DIFFICULTIES, THEME_GROUPS, type Difficulty } from '../logic/puzzleThemes'
import { BackIcon } from './icons'

type Props = {
  onStart: (themes: string[], difficulty: Difficulty) => void
  onBack: () => void
}

const KEY = 'freechess.customPuzzles'

function loadChoice(): { themes: string[]; difficulty: Difficulty } {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (saved && Array.isArray(saved.themes)) return saved
  } catch {
    // (nothing saved, or the phone won't keep it)
  }
  return { themes: [], difficulty: 'normal' }
}

export function CustomPuzzles({ onStart, onBack }: Props) {
  const [choice, setChoice] = useState(loadChoice)
  const toggle = (id: string) =>
    setChoice((c) => ({ ...c, themes: c.themes.includes(id) ? c.themes.filter((t) => t !== id) : [...c.themes, id] }))
  const start = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(choice))
    } catch {
      // (not remembered this time)
    }
    onStart(choice.themes, choice.difficulty)
  }

  return (
    <main className="fc-page fc-custom-puzzles">
      <header className="fc-run-head">
        <button type="button" className="fc-back" onClick={onBack}>
          <BackIcon size={22} /> Puzzles
        </button>
        <strong>Custom puzzles</strong>
      </header>
      <p className="fc-muted">Pick the themes you want to practise. They don’t change your puzzle rating.</p>

      {THEME_GROUPS.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          <div className="fc-themes">
            {group.themes.map((t) => {
              const on = choice.themes.includes(t.id)
              return (
                <button key={t.id} type="button" className={`fc-theme ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggle(t.id)}>
                  {t.label}
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <section>
        <h2>Difficulty</h2>
        <div className="fc-segmented" role="group" aria-label="Difficulty">
          {DIFFICULTIES.map((d) => (
            <button key={d.id} type="button" className={choice.difficulty === d.id ? 'selected' : ''} aria-pressed={choice.difficulty === d.id} onClick={() => setChoice((c) => ({ ...c, difficulty: d.id }))}>
              {d.label}
            </button>
          ))}
        </div>
      </section>

      <div className="fc-custom-start">
        <button type="button" className="fc-primary" disabled={choice.themes.length === 0} onClick={start}>
          {choice.themes.length === 0 ? 'Pick at least one theme' : `Start (${choice.themes.length} ${choice.themes.length === 1 ? 'theme' : 'themes'})`}
        </button>
      </div>
    </main>
  )
}
