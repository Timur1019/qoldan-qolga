/**
 * Пересчёт цены объявления в выбранную валюту отображения.
 * FROM_AD — как в объявлении; UZS / USD — конвертация по курсу usdToUzs.
 */

import { formatPrice } from '../../../utils/formatters'

const FALLBACK_USD_UZS = 12800

/**
 * @param {number|null|undefined} price
 * @param {string} [adCurrency]
 * @param {string} [displayMode] FROM_AD | UZS | USD
 * @param {number} [usdToUzs]
 * @returns {{ amount: number|null|undefined, currency: string }}
 */
export function convertPriceAmount(price, adCurrency = 'UZS', displayMode = 'FROM_AD', usdToUzs = FALLBACK_USD_UZS) {
  if (price == null) return { amount: price, currency: adCurrency || 'UZS' }
  const mode = displayMode || 'FROM_AD'
  const from = (adCurrency || 'UZS').toUpperCase()
  if (!mode || mode === 'FROM_AD') {
    return { amount: Number(price), currency: from }
  }
  const rate = usdToUzs > 0 ? usdToUzs : FALLBACK_USD_UZS
  const inUzs = from === 'USD' ? Number(price) * rate : Number(price)
  if (mode === 'UZS') return { amount: inUzs, currency: 'UZS' }
  if (mode === 'USD') return { amount: inUzs / rate, currency: 'USD' }
  return { amount: Number(price), currency: from }
}

/**
 * @param {number|null|undefined} price
 * @param {string} [adCurrency]
 * @param {string} [displayMode]
 * @param {number} [usdToUzs]
 * @returns {string}
 */
export function formatDisplayPrice(price, adCurrency = 'UZS', displayMode = 'FROM_AD', usdToUzs = FALLBACK_USD_UZS) {
  const { amount, currency } = convertPriceAmount(price, adCurrency, displayMode, usdToUzs)
  if (amount == null || Number.isNaN(amount)) return ''
  if (currency === 'USD') {
    const rounded = Math.round(amount * 100) / 100
    return `${rounded.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} у.е.`
  }
  return formatPrice(Math.round(amount), 'UZS')
}
