// Icons for the match toolbar: simple, rounded strokes, readable at a glance.
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export const FlagIcon = () => (
  <Svg>
    <path d="M5 21V4" />
    <path d="M5 4h11l-2 4 2 4H5" />
  </Svg>
)

export const HalfIcon = () => (
  <Svg>
    <text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="800" fill="currentColor" stroke="none">
      ½
    </text>
  </Svg>
)

export const BulbIcon = () => (
  <Svg>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
  </Svg>
)

export const UndoIcon = () => (
  <Svg>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </Svg>
)

export const PrevIcon = () => (
  <Svg>
    <path d="m15 6-6 6 6 6" />
  </Svg>
)

export const NextIcon = () => (
  <Svg>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const PauseIcon = () => (
  <Svg>
    <path d="M9 5v14" />
    <path d="M15 5v14" />
  </Svg>
)
