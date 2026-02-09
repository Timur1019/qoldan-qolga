/**
 * Единое место форматирования данных для отображения.
 * Исключает дублирование и расхождения между страницами.
 */

const CURRENCY_NAMES = { UZS: 'сум' }

/**
 * @param {number|null|undefined} price
 * @param {string} [currency='UZS']
 * @returns {string}
 */
export function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  const cur = (currency || 'UZS').toUpperCase()
  const name = CURRENCY_NAMES[cur] ?? cur
  return `${Number(price).toLocaleString('ru-RU')} ${name}`
}

/**
 * @param {string|null|undefined} isoString — ISO date string
 * @returns {string} DD.MM.YYYY, HH:mm
 */
export function formatAdDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year}, ${h}:${m}`
}

/**
 * @param {string|null|undefined} isoString — ISO date string
 * @param {{ today?: string, yesterday?: string }} [labels] — локализованные метки
 * @returns {string} "Сегодня, HH:mm" | "Вчера, HH:mm" | "DD.MM.YYYY, HH:mm"
 */
export function formatAdCardDate(isoString, labels = {}) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const now = new Date()
  const today = now.toDateString()
  const dateStr = d.toDateString()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const time = `${h}:${m}`
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const fullDate = `${day}.${month}.${year}, ${time}`
  if (dateStr === today) return (labels.today || 'Сегодня') + `, ${time}`
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateStr === yesterday.toDateString()) return (labels.yesterday || 'Вчера') + `, ${time}`
  return fullDate
}
