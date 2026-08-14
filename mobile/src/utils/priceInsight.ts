const MIN_SAMPLE = 3;
const FALLBACK_USD_UZS = 12800;
const OUTLIER_LOW = 0.25;
const OUTLIER_HIGH = 4;
const RATIO_MIN = 0.7;
const RATIO_MAX = 1.35;

export type PriceInsightTier = 'excellent' | 'good' | 'fair' | 'high';

export type PriceInsight = {
  tier: PriceInsightTier;
  ratio: number;
  position: number;
  median: number;
  medianUzs: number;
  diff: number;
  cheaper: boolean;
  sampleSize: number;
  currency: string;
};

type PriceLike = {
  id?: string;
  price?: number | string | null;
  currency?: string | null;
  category?: string | null;
};

function toNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function priceToUzs(
  price: number | string | null | undefined,
  currency = 'UZS',
  usdToUzs = FALLBACK_USD_UZS
): number | null {
  const amount = toNumber(price);
  if (amount == null || amount <= 0) return null;
  const cur = String(currency || 'UZS').toUpperCase();
  const rate = usdToUzs > 0 ? usdToUzs : FALLBACK_USD_UZS;
  return cur === 'USD' ? amount * rate : amount;
}

export function uzsToCurrency(
  amountUzs: number | null,
  currency = 'UZS',
  usdToUzs = FALLBACK_USD_UZS
): number | null {
  if (amountUzs == null) return null;
  const cur = String(currency || 'UZS').toUpperCase();
  const rate = usdToUzs > 0 ? usdToUzs : FALLBACK_USD_UZS;
  if (cur === 'USD') return Math.round((amountUzs / rate) * 100) / 100;
  return Math.round(amountUzs);
}

function tierFromRatio(ratio: number): PriceInsightTier {
  if (ratio <= 0.85) return 'excellent';
  if (ratio <= 0.97) return 'good';
  if (ratio <= 1.08) return 'fair';
  return 'high';
}

function collectComparableUzs(ad: PriceLike, similarAds: PriceLike[], usdToUzs: number) {
  const category = ad?.category || null;
  return (Array.isArray(similarAds) ? similarAds : [])
    .filter((item) => item && item.id !== ad?.id)
    .filter((item) => !category || !item.category || item.category === category)
    .map((item) => priceToUzs(item.price, item.currency || 'UZS', usdToUzs))
    .filter((n): n is number => n != null && n > 0);
}

function filterOutliers(pricesUzs: number[]) {
  if (pricesUzs.length < MIN_SAMPLE) return pricesUzs;
  const rough = median(pricesUzs);
  if (!rough) return pricesUzs;
  const filtered = pricesUzs.filter((p) => p >= rough * OUTLIER_LOW && p <= rough * OUTLIER_HIGH);
  return filtered.length >= MIN_SAMPLE ? filtered : pricesUzs;
}

export function buildPriceInsight(
  ad: PriceLike | null | undefined,
  similarAds: PriceLike[] = [],
  usdToUzs = FALLBACK_USD_UZS
): PriceInsight | null {
  if (!ad) return null;
  const priceUzs = priceToUzs(ad.price, ad.currency || 'UZS', usdToUzs);
  if (priceUzs == null) return null;

  const prices = filterOutliers(collectComparableUzs(ad, similarAds, usdToUzs));
  if (prices.length < MIN_SAMPLE) return null;

  const midUzs = median(prices);
  if (!midUzs || midUzs <= 0) return null;

  const ratio = priceUzs / midUzs;
  const position = clamp((ratio - RATIO_MIN) / (RATIO_MAX - RATIO_MIN), 0.08, 0.92);
  const displayCurrency = String(ad.currency || 'UZS').toUpperCase();
  const diff = uzsToCurrency(Math.abs(priceUzs - midUzs), displayCurrency, usdToUzs) ?? 0;

  return {
    tier: tierFromRatio(ratio),
    ratio,
    position,
    median: uzsToCurrency(midUzs, displayCurrency, usdToUzs) ?? midUzs,
    medianUzs: midUzs,
    diff,
    cheaper: priceUzs < midUzs,
    sampleSize: prices.length,
    currency: displayCurrency,
  };
}
