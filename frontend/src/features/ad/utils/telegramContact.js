/**
 * Ссылки на Telegram для объявления: по username или по номеру телефона.
 */
export function telegramHrefFromAd(ad) {
  const username = String(ad?.telegramUsername || '').replace(/^@/, '').trim()
  if (username) return `https://t.me/${username}`
  const digits = String(ad?.phone || '').replace(/\D/g, '')
  if (digits.length >= 9) return `https://t.me/+${digits.slice(-12)}`
  return null
}

export function hasTelegramContact(ad) {
  return Boolean(telegramHrefFromAd(ad))
}
