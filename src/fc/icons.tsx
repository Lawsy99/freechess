// FreeChess's small icons, drawn in code (crisp at any size, no image files).
// Simple, rounded strokes to match Nunito.
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
  </Svg>
)

/** A pawn: the Play tab. */
export const PlayIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="6.5" r="3" />
    <path d="M9.5 10.5h5l1 6h-7z" />
    <path d="M6.5 20.5h11l-1-3.5h-9z" />
  </Svg>
)

export const PuzzleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 3h4v2.5a1.5 1.5 0 0 0 3 0V3h4v7h-2.5a1.5 1.5 0 0 0 0 3H21v8h-7v-2.5a1.5 1.5 0 0 0-3 0V21H3v-8h2.5a1.5 1.5 0 0 0 0-3H3V3h7z" />
  </Svg>
)

export const LearnIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 8.5 12 4l10 4.5-10 4.5z" />
    <path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />
    <path d="M22 8.5V14" />
  </Svg>
)

export const ProfileIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5" />
  </Svg>
)

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
)

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const SettingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Svg>
)

/** The streak flame: filled, warm. */
export function FlameIcon({ size = 24, lit = true }: { size?: number; lit?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5c.6 3-1.4 4.6-2.9 6.4C7.6 10.6 6 12.5 6 15.2 6 18.9 8.7 21.5 12 21.5s6-2.6 6-6.3c0-2.7-1.4-4.3-2.3-5.4-.3 1.4-1 2.3-2 2.8.4-3.4-.2-6.5-1.7-9.6z"
        fill={lit ? '#ff9a3c' : '#4a505b'}
      />
      <path d="M12 21.5c-1.9 0-3.3-1.4-3.3-3.3 0-1.9 1.6-3 2.4-4.4.4 1.2 1.1 1.8 2 2.1.1-.8.1-1.5-.1-2.3 1.4 1.1 2.3 2.5 2.3 4.6 0 1.9-1.4 3.3-3.3 3.3z" fill={lit ? '#ffd166' : '#5c636f'} />
    </svg>
  )
}

/** A star, filled or empty. */
export function StarIcon({ size = 18, filled }: { size?: number; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.8l2.8 5.7 6.3.9-4.5 4.4 1 6.2L12 17l-5.6 3 1-6.2L2.9 9.4l6.3-.9z"
        fill={filled ? 'var(--star)' : 'none'}
        stroke={filled ? 'var(--star)' : 'var(--muted-dim)'}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Three stars, some of them earned. */
export function Stars({ earned, size = 16 }: { earned: number; size?: number }) {
  return (
    <span className="fc-stars" aria-label={`${earned} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <StarIcon key={i} size={size} filled={i < earned} />
      ))}
    </span>
  )
}
