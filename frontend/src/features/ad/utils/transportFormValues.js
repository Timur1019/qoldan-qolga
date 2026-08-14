/** Форма ↔ API для мест / владельцев (8PLUS → 8, 4PLUS → 4). */

export function seatsToApi(value) {
  if (value == null || value === '') return undefined
  if (String(value) === '8PLUS' || String(value) === '8+') return 8
  const n = parseInt(value, 10)
  return Number.isFinite(n) ? n : undefined
}

export function seatsFromApi(value) {
  if (value == null || value === '') return ''
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  if (n >= 8) return '8PLUS'
  return String(n)
}

export function ownersToApi(value) {
  if (value == null || value === '') return undefined
  if (String(value) === '4PLUS' || String(value) === '4+') return 4
  const n = parseInt(value, 10)
  return Number.isFinite(n) ? n : undefined
}

export function ownersFromApi(value) {
  if (value == null || value === '') return ''
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  if (n >= 4) return '4PLUS'
  return String(n)
}
