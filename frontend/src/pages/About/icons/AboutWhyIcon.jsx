const stroke = {
  fill: 'none',
  stroke: '#04492d',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const ICONS = {
  boxes: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <rect x="6" y="18" width="16" height="16" rx="3" {...stroke} />
      <rect x="26" y="12" width="16" height="16" rx="3" {...stroke} />
      <path d="M10 18v-3h8v3M30 12V9h8v3" {...stroke} />
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path d="M8 26c6-7 12-8 16-4l8 7c4-4 10-3 16 4" {...stroke} />
      <path d="M18 24l5 6 5-4 5 5" {...stroke} />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <circle cx="22" cy="22" r="10" {...stroke} />
      <path d="M30 30l9 9" {...stroke} />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path d="M24 8l14 5v11c0 9-6 15-14 18-8-3-14-9-14-18V13l14-5z" {...stroke} />
      <path d="M18 24l4 4 8-9" {...stroke} />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path d="M10 14h18a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H20l-8 6v-6h-2a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6z" {...stroke} />
      <path d="M28 18h10a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6h-2v5l-6-5" {...stroke} />
    </svg>
  ),
  thumb: (
    <svg viewBox="0 0 48 48" aria-hidden>
      <path d="M18 22V14a5 5 0 0 1 9-3c1.5 1 2 3.2 2 6v5" {...stroke} />
      <path d="M14 22h22a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H18l-8-2v-12h4z" {...stroke} />
    </svg>
  ),
}

export default function AboutWhyIcon({ name }) {
  return ICONS[name] || null
}
