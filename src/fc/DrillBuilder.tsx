// Build your own drills (FreeChess, Oct 2026, after maiachess.com's Drills):
// pick openings, tactics themes or finishing positions, how strong Maia
// plays, how many moves and how many drills; then play them, each with its
// report. Your last choice is remembered on the phone.
import { useState } from 'react'
import { ALL_LESSONS } from '../data/learnPath'
import { OPENING_DRILLS } from '../data/openingLessons'
import type { Drill, DrillSpec } from '../logic/drills'
import { THEME_GROUPS } from '../logic/puzzleThemes'
import { DrillSession } from './DrillSession'
import { loadDrills } from './loadDrills'
import './drills.css'

type Props = {
  playerRating: number
  /** Played through: counts as today's lesson. */
  onDone: () => void
}

type Kind = 'opening' | 'theme' | 'endgame'
type Choice = { kind: Kind; picks: string[]; level: number; moves: number; count: number }

const KEY = 'freechess.drillBuilder'
const KINDS: { id: Kind; label: string }[] = [
  { id: 'opening', label: 'Openings' },
  { id: 'theme', label: 'Tactics' },
  { id: 'endgame', label: 'Finishing' },
]
const LEVELS = [
  { id: -200, label: 'Easier' },
  { id: 0, label: 'My level' },
  { id: 200, label: 'Harder' },
]
const MOVES = [5, 10, 15, 20]
const COUNTS = [3, 5]

/** What can be picked for each kind, with friendly names. */
function options(kind: Kind): { id: string; label: string }[] {
  if (kind === 'opening')
    return Object.values(OPENING_DRILLS).map((o) => ({ id: o.id, label: `${o.name.replace(/^the /, '').replace(/^answer/, 'Answer')} (${o.colour === 'b' ? 'Black' : 'White'})` }))
  if (kind === 'theme') return THEME_GROUPS.flatMap((g) => g.themes)
  // Finishing positions: named after the lesson that teaches each one.
  return ALL_LESSONS.flatMap((l) => l.steps.flatMap((s) => (s.kind === 'drills' && s.spec.kind === 'endgame' ? [{ id: s.spec.drill, label: l.title }] : [])))
}

function loadChoice(): Choice {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    if (saved && Array.isArray(saved.picks) && KINDS.some((k) => k.id === saved.kind)) return saved
  } catch {
    // (nothing saved, or the phone won't keep it)
  }
  return { kind: 'opening', picks: [], level: 0, moves: 10, count: 3 }
}

function specFor(kind: Kind, id: string, moves: number): DrillSpec {
  if (kind === 'opening') return { kind, opening: id, moves }
  if (kind === 'theme') return { kind, theme: id, moves }
  return { kind, drill: id }
}

export function DrillBuilder({ playerRating, onDone }: Props) {
  const [choice, setChoice] = useState(loadChoice)
  const [drills, setDrills] = useState<Drill[] | null>(null)
  const [state, setState] = useState<'choosing' | 'loading' | 'failed' | 'playing'>('choosing')
  const maia = Math.max(400, playerRating + choice.level)
  const shown = options(choice.kind)
  const picks = choice.picks.filter((p) => shown.some((o) => o.id === p))

  const toggle = (id: string) => setChoice((c) => ({ ...c, picks: picks.includes(id) ? picks.filter((p) => p !== id) : [...picks, id] }))
  const start = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(choice))
    } catch {
      // (not remembered this time)
    }
    setState('loading')
    window.scrollTo(0, 0)
    loadDrills(
      picks.map((p) => specFor(choice.kind, p, choice.moves)),
      choice.count,
      playerRating,
    )
      .then((d) => {
        setDrills(d)
        setState('playing')
      })
      .catch(() => setState('failed'))
  }

  if (state === 'loading') return <p className="fc-muted">Setting up the drills…</p>
  if (state === 'failed') return <p className="fc-muted">The drills couldn’t load. Are you offline?</p>
  if (state === 'playing' && drills) return <DrillSession drills={drills} rating={maia} onDone={onDone} />

  return (
    <div className="drill-builder">
      <p className="fc-muted">Pick what to practise. You play each one out against Maia, who plays like a real person at the level you choose, then get a report.</p>

      <div className="fc-segmented" role="group" aria-label="What to practise">
        {KINDS.map((k) => (
          <button key={k.id} type="button" className={choice.kind === k.id ? 'selected' : ''} aria-pressed={choice.kind === k.id} onClick={() => setChoice((c) => ({ ...c, kind: k.id }))}>
            {k.label}
          </button>
        ))}
      </div>

      <section>
        <h2>{choice.kind === 'opening' ? 'Openings, from move 1' : choice.kind === 'theme' ? 'Positions from real games' : 'Positions to finish'}</h2>
        <div className="fc-themes">
          {shown.map((o) => {
            const on = picks.includes(o.id)
            return (
              <button key={o.id} type="button" className={`fc-theme ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggle(o.id)}>
                {o.label}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2>Maia plays at {maia}</h2>
        <div className="fc-segmented" role="group" aria-label="Maia's level">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" className={choice.level === l.id ? 'selected' : ''} aria-pressed={choice.level === l.id} onClick={() => setChoice((c) => ({ ...c, level: l.id }))}>
              {l.label}
            </button>
          ))}
        </div>
      </section>

      {choice.kind !== 'endgame' && (
        <section>
          <h2>Your moves in each drill</h2>
          <div className="fc-segmented four" role="group" aria-label="Moves in each drill">
            {MOVES.map((m) => (
              <button key={m} type="button" className={choice.moves === m ? 'selected' : ''} aria-pressed={choice.moves === m} onClick={() => setChoice((c) => ({ ...c, moves: m }))}>
                {m}
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>How many drills</h2>
        <div className="fc-segmented" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }} role="group" aria-label="How many drills">
          {COUNTS.map((n) => (
            <button key={n} type="button" className={choice.count === n ? 'selected' : ''} aria-pressed={choice.count === n} onClick={() => setChoice((c) => ({ ...c, count: n }))}>
              {n}
            </button>
          ))}
        </div>
      </section>

      <div className="fc-custom-start">
        <button type="button" className="fc-primary" disabled={picks.length === 0} onClick={start}>
          {picks.length === 0 ? 'Pick at least one' : `Start ${choice.count} drills`}
        </button>
      </div>
    </div>
  )
}
