/**
 * Человекочитаемое название региона по коду (toshkent_shahar → «Ташкент» / «Toshkent»).
 */

export function humanizeRegionCode(code) {
  if (!code) return ''
  const raw = String(code).trim()
  if (!raw) return ''
  if (!raw.includes('_') && !/^[a-z0-9-]+$/i.test(raw)) return raw
  return raw
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part, i) => {
      const lower = part.toLowerCase()
      if (i === 0) return lower.charAt(0).toUpperCase() + lower.slice(1)
      return lower
    })
    .join(' ')
}

export function resolveRegionLabel(code, regions, lang = 'uz') {
  if (!code) return ''
  const key = String(code)
  const list = Array.isArray(regions) ? regions : []
  const found = list.find((r) => String(r?.code) === key)
  if (found) {
    const name = lang === 'ru' ? found.nameRu : found.nameUz
    if (name) return name
  }
  return humanizeRegionCode(key)
}

export function buildRegionLabelMap(regions, lang = 'uz') {
  const map = new Map()
  const list = Array.isArray(regions) ? regions : []
  list.forEach((r) => {
    if (!r?.code) return
    const name = lang === 'ru' ? r.nameRu : r.nameUz
    map.set(String(r.code), name || humanizeRegionCode(r.code))
  })
  return map
}
