// The bottom tab bar, iPhone style: always there on the main screens.
import { HomeIcon, LearnIcon, PlayIcon, ProfileIcon, PuzzleIcon } from './icons'

export type Tab = 'home' | 'play' | 'puzzles' | 'learn' | 'profile'

const TABS: { id: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'play', label: 'Play', Icon: PlayIcon },
  { id: 'puzzles', label: 'Puzzles', Icon: PuzzleIcon },
  { id: 'learn', label: 'Learn', Icon: LearnIcon },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
]

/** `badges`: a small number on a tab (e.g. mistakes waiting on Puzzles). */
export function TabBar({ tab, onChange, badges = {} }: { tab: Tab; onChange: (t: Tab) => void; badges?: Partial<Record<Tab, number>> }) {
  return (
    <nav className="fc-tabbar" aria-label="Main">
      {TABS.map(({ id, label, Icon }) => (
        <button key={id} type="button" className={tab === id ? 'active' : undefined} aria-current={tab === id ? 'page' : undefined} onClick={() => onChange(id)}>
          <span className="fc-tab-icon">
            <Icon size={24} />
            {(badges[id] ?? 0) > 0 && <i className="fc-tab-badge">{badges[id]}</i>}
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

