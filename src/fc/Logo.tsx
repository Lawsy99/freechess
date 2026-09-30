// The FreeChess logo: a knight on a rounded blue tile, with the name beside it.
// The same knight makes the app icon (public/favicon.svg).
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="fc-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c9bff" />
          <stop offset="1" stopColor="#3d6fe0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#fc-tile)" />
      <path
        d="M22 50h24c0-3-1.5-5-4-6.5l-1.5-8c3.5 1 6.5.5 8.5-2 1.5-2 .5-4.5-1.5-6.5L41 20c-1-1.5-2.5-2.5-4.5-3l-2-4-3 3.5c-6 1.5-10 6.5-10.5 13l-.5 14.5C18.5 45 18 47.5 22 50z"
        fill="#fff"
      />
      <circle cx="38.5" cy="24.5" r="1.8" fill="#3d6fe0" />
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
