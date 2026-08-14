export function loc(lang, value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return lang === 'ru' ? (value.ru || value.uz || '') : (value.uz || value.ru || '')
}

export function formatDocDate(iso, lang) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return lang === 'ru' ? `${d}.${m}.${y}` : `${y}-${m}-${d}`
}
