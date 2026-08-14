/** Мягкий оттенок фона карточки категории (без «AI-фиолетового»). */
const TINTS = [
  'rgba(4, 73, 45, 0.07)',
  'rgba(15, 118, 110, 0.07)',
  'rgba(68, 64, 60, 0.06)',
  'rgba(3, 84, 63, 0.08)',
  'rgba(55, 65, 81, 0.05)',
  'rgba(21, 128, 61, 0.06)',
]

export function categoryCardTint(code = '') {
  let h = 0
  for (let i = 0; i < code.length; i += 1) h = (h + code.charCodeAt(i) * (i + 1)) % 997
  return TINTS[h % TINTS.length]
}
