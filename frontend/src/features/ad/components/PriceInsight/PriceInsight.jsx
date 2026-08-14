import { formatPrice } from '../../../../utils/formatters'
import styles from './PriceInsight.module.css'

const TITLE_KEYS = {
  excellent: 'ads.priceInsightExcellent',
  good: 'ads.priceInsightGood',
  fair: 'ads.priceInsightFair',
  high: 'ads.priceInsightHigh',
}

export default function PriceInsight({ insight, t, overlay = false }) {
  if (!insight) return null

  const amount =
    String(insight.currency || '').toUpperCase() === 'USD'
      ? formatPrice(insight.diff, 'USD')
      : formatPrice(Math.round(insight.diff), 'UZS')
  let hint = t('ads.priceInsightSimilar')
  if (insight.diff > 0) {
    hint = insight.cheaper
      ? t('ads.priceInsightCheaperBy').replace('{amount}', amount)
      : t('ads.priceInsightPricierBy').replace('{amount}', amount)
  }

  return (
    <div className={`${overlay ? styles.overlay : styles.inline} ${styles[insight.tier] || ''}`.trim()}>
      <div className={styles.card}>
        <div className={styles.head}>
          <p className={styles.title}>{t(TITLE_KEYS[insight.tier] || TITLE_KEYS.fair)}</p>
        </div>
        <p className={styles.hint}>{hint}</p>
        <div className={styles.track} aria-hidden>
          <span className={styles.marker} style={{ left: `${insight.position * 100}%` }} />
        </div>
        <div className={styles.labels}>
          <span>{t('ads.priceInsightRangeCheap')}</span>
          <span>{t('ads.priceInsightRangeExpensive')}</span>
        </div>
      </div>
    </div>
  )
}
