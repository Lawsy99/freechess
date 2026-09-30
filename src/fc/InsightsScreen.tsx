// Insights (FreeChess, Sep 2026): your results, how accurately you play, which
// part of the game costs you most, and how your openings go. One card each.
import { useEffect, useState } from 'react'
import { RatingGraph } from '../components/RatingGraph'
import { insights, scorePercent, type Insights, type Tally } from '../logic/insights'
import { PHASE_LABELS, PHASES } from '../logic/reviewExtras'
import { listArchivedGames } from '../storage/db'
import { BackIcon } from './icons'

const PHASE_TIPS = {
  opening: 'The Openings unit in Learn is a good place to start.',
  middlegame: 'Tactics puzzles help most here: forks, pins and hanging pieces.',
  endgame: 'The Endgames unit in Learn will help.',
} as const

export function InsightsScreen({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<Insights | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    listArchivedGames()
      .then((games) => setData(insights(games)))
      .catch(() => setFailed(true))
  }, [])

  return (
    <main className="fc-page fc-insights">
      <button type="button" className="fc-back" onClick={onBack}>
        <BackIcon size={22} /> Profile
      </button>
      <header className="fc-page-head">
        <h1>Insights</h1>
        <p>What your games say about your play.</p>
      </header>

      {failed ? (
        <p className="fc-muted">Your games couldn’t be loaded.</p>
      ) : !data ? (
        <p className="fc-muted">Looking through your games…</p>
      ) : data.results.games === 0 && data.analysed === 0 ? (
        <p className="fc-card fc-insight-empty">Play a few bot games and your insights will appear here.</p>
      ) : (
        <>
          <section className="fc-card fc-insight">
            <h2>Results</h2>
            <ResultBar t={data.results} />
            <p className="fc-insight-line">
              {data.results.wins} won · {data.results.draws} drawn · {data.results.losses} lost
            </p>
            <div className="fc-insight-pair">
              <span>
                <i className="fc-colour-dot w" aria-hidden="true" /> As White <strong>{pct(data.asWhite)}</strong>
              </span>
              <span>
                <i className="fc-colour-dot b" aria-hidden="true" /> As Black <strong>{pct(data.asBlack)}</strong>
              </span>
            </div>
          </section>

          <section className="fc-card fc-insight">
            <h2>Accuracy</h2>
            {data.analysed === 0 ? (
              <p className="fc-insight-line">Open Game review after a game and it’s added here.</p>
            ) : (
              <>
                <p className="fc-insight-big">
                  {data.averageAccuracy}% <span>on average</span>
                </p>
                <RatingGraph points={data.accuracyTrend} scale={{ lo: 0, hi: 100 }} suffix="%" name="Accuracy" empty="The graph starts after two reviewed games." />
                <p className="fc-insight-line">
                  {data.blundersPerGame} {data.blundersPerGame === 1 ? 'blunder' : 'blunders'} a game. From {data.analysed} reviewed{' '}
                  {data.analysed === 1 ? 'game' : 'games'}.
                </p>
              </>
            )}
          </section>

          {data.analysed > 0 && (
            <section className="fc-card fc-insight">
              <h2>By phase</h2>
              <div className="phase-row">
                {PHASES.map((p) => {
                  const v = data.phases[p]
                  return (
                    <div key={p} className={`phase ${v === null ? 'none' : v >= 80 ? 'good' : v >= 60 ? 'ok' : 'poor'} ${data.weakestPhase === p ? 'weakest' : ''}`}>
                      <span className="phase-label">{PHASE_LABELS[p]}</span>
                      <span className="phase-value">{v ?? '–'}</span>
                    </div>
                  )
                })}
              </div>
              {data.weakestPhase && (
                <p className="fc-insight-line">
                  Your {PHASE_LABELS[data.weakestPhase].toLowerCase()} costs you most. {PHASE_TIPS[data.weakestPhase]}
                </p>
              )}
            </section>
          )}

          {data.openings.length > 0 && (
            <section className="fc-card fc-insight">
              <h2>Your openings</h2>
              <ul className="fc-openings">
                {data.openings.map((o) => (
                  <li key={`${o.key}:${o.colour}`}>
                    <i className={`fc-colour-dot ${o.colour}`} aria-label={o.colour === 'w' ? 'As White' : 'As Black'} />
                    <span className="fc-opening-name">{o.name}</span>
                    <span className="fc-muted">
                      {o.games} {o.games === 1 ? 'game' : 'games'}
                    </span>
                    <strong>{pct(o)}</strong>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  )
}

function pct(t: Tally): string {
  const p = scorePercent(t)
  return p === null ? '–' : `${p}%`
}

/** Wins, draws and losses as one bar, each in proportion. */
function ResultBar({ t }: { t: Tally }) {
  if (!t.games) return null
  const w = (n: number) => `${(n / t.games) * 100}%`
  return (
    <div className="fc-result-bar" role="img" aria-label={`${t.wins} won, ${t.draws} drawn, ${t.losses} lost`}>
      {t.wins > 0 && <span className="won" style={{ width: w(t.wins) }} />}
      {t.draws > 0 && <span className="drawn" style={{ width: w(t.draws) }} />}
      {t.losses > 0 && <span className="lost" style={{ width: w(t.losses) }} />}
    </div>
  )
}
