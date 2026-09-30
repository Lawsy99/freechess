// The FreeChess logo: a knight on a rounded blue tile with a gold star (the
// app's reward), and the name beside it. The same drawing makes the app icons
// (public/favicon.svg, scripts/makeIcons.mjs). Redrawn Sep 2026.
const KNIGHT =
  'M18.5 49.5C18.5 44 21.5 40.5 27.5 37.5L16 36.5C13 36.3 11.2 34.2 11.8 31.4L13.2 27.8C15.2 21.8 19.5 16.8 25 13.6L28.2 5.2L32.4 11.8C40.4 12.8 46.4 18.6 47.8 27.2C48.8 34.2 47.4 41.6 46.6 49.5Z'

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="fc-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c9bff" />
          <stop offset="1" stopColor="#3d6fe0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#fc-tile)" />
      <path d={KNIGHT} fill="#000" fillOpacity={0.18} transform="translate(0 2)" />
      <path d={KNIGHT} fill="#fff" />
      <path d="M40 15.5C43.5 19 45 24 44.8 30" fill="none" stroke="#cfdcff" strokeWidth={2} strokeLinecap="round" />
      <rect x="14" y="49.5" width="36" height="6.5" rx="3.2" fill="#fff" />
      <circle cx="27" cy="20.5" r="2.3" fill="#3d6fe0" />
      <path d="M51 6.3l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" fill="#ffcb45" stroke="#e0a820" strokeWidth={0.8} />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="fc-logo">
      <LogoMark size={30} />
      <span>
        Free<b>Chess</b>
      </span>
    </span>
  )
}
