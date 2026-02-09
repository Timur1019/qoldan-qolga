/**
 * Форматирование цен, дат и других данных объявления.
 */

export function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  const isSum = currency === 'UZS'
  const suffix = isSum ? ' сум' : ` ${currency}`
  return `${Number(price).toLocaleString()}${suffix}`
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatSellerSince(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
