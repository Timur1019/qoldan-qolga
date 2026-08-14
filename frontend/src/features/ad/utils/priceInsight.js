const MIN_SAMPLE = 3
const FALLBACK_USD_UZS = 12800
/** Выкидываем явный мусор относительно черновой медианы. */
const OUTLIER_LOW = 0.25
const OUTLIER_HIGH = 4
const RATIO_MIN = 0.7
const RATIO_MAX = 1.35

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function median(values) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/**
 * Приводит цену к сумам.
 * @param {number} price
 * @param {string} currency
 * @param {number} usdToUzs
 */
export function priceToUzs(price, currency = 'UZS', usdToUzs = FALLBACK_USD_UZS) {
  const amount = toNumber(price)
  if (amount == null || amount <= 0) return null
  const cur = String(currency || 'UZS').toUpperCase()
  const rate = usdToUzs > 0 ? usdToUzs : FALLBACK_USD_UZS
  return cur === 'USD' ? amount * rate : amount
}

/**
 * Из сум в валюту объявления (для текста «дешевле на …»).
 */
export function uzsToCurrency(amountUzs, currency = 'UZS', usdToUzs = FALLBACK_USD_UZS) {
  if (amountUzs == null) return null
  const cur = String(currency || 'UZS').toUpperCase()
  const rate = usdToUzs > 0 ? usdToUzs : FALLBACK_USD_UZS
  if (cur === 'USD') return Math.round((amountUzs / rate) * 100) / 100
  return Math.round(amountUzs)
}

function tierFromRatio(ratio) {
  if (ratio <= 0.85) return 'excellent'
  if (ratio <= 0.97) return 'good'
  if (ratio <= 1.08) return 'fair'
  return 'high'
}

function collectComparableUzs(ad, similarAds, usdToUzs) {
  const category = ad?.category || null
  return (Array.isArray(similarAds) ? similarAds : [])
    .filter((item) => item && item.id !== ad?.id)
    .filter((item) => !category || !item.category || item.category === category)
    .map((item) => priceToUzs(item.price, item.currency, usdToUzs))
    .filter((n) => n != null && n > 0)
}

function filterOutliers(pricesUzs) {
  if (pricesUzs.length < MIN_SAMPLE) return pricesUzs
  const rough = median(pricesUzs)
  if (!rough) return pricesUzs
  const filtered = pricesUzs.filter(
    (p) => p >= rough * OUTLIER_LOW && p <= rough * OUTLIER_HIGH,
  )
  return filtered.length >= MIN_SAMPLE ? filtered : pricesUzs
}

/**
 * Сравнение с похожими в той же категории.
 * Все цены сначала в UZS (курс usdToUzs), diff показываем в валюте текущего объявления.
 *
 * @param {object} ad
 * @param {object[]} similarAds
 * @param {number} [usdToUzs]
 * @returns {null | object}
 */
export function buildPriceInsight(ad, similarAds, usdToUzs = FALLBACK_USD_UZS) {
  const priceUzs = priceToUzs(ad?.price, ad?.currency, usdToUzs)
  if (priceUzs == null) return null

  const raw = collectComparableUzs(ad, similarAds, usdToUzs)
  const prices = filterOutliers(raw)
  if (prices.length < MIN_SAMPLE) return null

  const midUzs = median(prices)
  if (!midUzs || midUzs <= 0) return null

  const ratio = priceUzs / midUzs
  const position = clamp((ratio - RATIO_MIN) / (RATIO_MAX - RATIO_MIN), 0.08, 0.92)
  const diffUzs = Math.abs(priceUzs - midUzs)
  const displayCurrency = String(ad?.currency || 'UZS').toUpperCase()
  const diff = uzsToCurrency(diffUzs, displayCurrency, usdToUzs)

  return {
    tier: tierFromRatio(ratio),
    ratio,
    position,
    median: uzsToCurrency(midUzs, displayCurrency, usdToUzs),
    medianUzs: midUzs,
    diff,
    cheaper: priceUzs < midUzs,
    sampleSize: prices.length,
    currency: displayCurrency,
  }
}
