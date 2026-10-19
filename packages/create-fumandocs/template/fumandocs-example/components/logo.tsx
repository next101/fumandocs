/** The Fumandocs logo tile (dark gradient with a folded-book M), as inline SVG. */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Fumandocs"
    >
      <defs>
        <linearGradient id="fumandocs-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b3b3b" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#fumandocs-logo-bg)" />
      {/* open book: two pages whose silhouette forms a chunky M */}
      <path
        d="M15.5 17 L30.5 33.5 L30.5 41 L15.5 41 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M48.5 17 L35.5 33.5 L35.5 41 L48.5 41 Z"
        fill="#c9c9c9"
        stroke="#c9c9c9"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect
        x="12"
        y="45.5"
        width="40"
        height="3.5"
        rx="1.75"
        fill="#ffffff"
        opacity="0.85"
      />
    </svg>
  )
}

/** Logo tile followed by the wordmark, for headers and brand slots. */
export function LogoWithTitle({ size = 24 }: { size?: number }) {
  return (
    <>
      <Logo size={size} />
      Fumandocs
    </>
  )
}
