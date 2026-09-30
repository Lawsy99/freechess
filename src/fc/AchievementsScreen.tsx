// Achievements (FreeChess, Sep 2026): every badge, in groups. Earned ones in
// gold; the rest greyed, with how far along you are.
import { BADGE_GROUPS, BADGES, earned } from '../logic/achievements'
import type { Profile } from '../logic/profile'
import { BackIcon } from './icons'

export function AchievementsScreen({ profile, onBack }: { profile: Profile; onBack: () => void }) {
  const got = earned(profile)
  return (
    <main className="fc-page">
      <button type="button" className="fc-back" onClick={onBack}>
        <BackIcon size={22} /> Profile
      </button>
      <header className="fc-page-head">
        <h1>Achievements</h1>
        <p>
          {got.size} of {BADGES.length} earned.
        </p>
      </header>
      {BADGE_GROUPS.map((group) => (
        <section key={group.id}>
          <h2 className="fc-menu-label">{group.label}</h2>
          <ul className="fc-badges">
            {BADGES.filter((b) => b.group === group.id).map((b) => {
              const has = got.has(b.id)
              const { value, target } = b.progress(profile)
              return (
                <li key={b.id} className={`fc-card fc-badge ${has ? 'earned' : ''}`}>
                  <MedalIcon earned={has} />
                  <strong>{b.title}</strong>
                  <span>{b.detail}</span>
                  {!has && (
                    <span className="fc-badge-progress" aria-label={`${Math.min(value, target)} of ${target}`}>
                      <i style={{ width: `${Math.min(1, value / target) * 100}%` }} />
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}

export function MedalIcon({ earned: on, size = 36 }: { earned: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" className="fc-medal">
      <path d="M11 2h6l-3 12h-6zM19 2h6l3 12h-6z" fill={on ? '#4f86f7' : 'var(--line)'} />
      <circle cx="18" cy="23" r="11" fill={on ? 'var(--star)' : 'var(--panel)'} stroke={on ? '#e0a820' : 'var(--line)'} strokeWidth="2" />
      <path d="M18 17l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill={on ? '#fff6d8' : 'var(--line)'} />
    </svg>
  )
}
