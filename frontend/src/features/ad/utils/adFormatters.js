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

/** Маска телефона: начало номера видно, остальное — X; при клике открывается звонок с полным номером */
export function maskPhone(phone) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 6) return `+${digits}`
  const visibleCount = 5
  const visible = digits.slice(0, visibleCount)
  const hiddenLen = digits.length - visibleCount
  return `+${visible}${'X'.repeat(hiddenLen)}`
}
