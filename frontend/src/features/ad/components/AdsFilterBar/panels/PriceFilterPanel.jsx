import { useState } from 'react'
import styles from '../AdsFilterBar.module.css'

export default function PriceFilterPanel({ priceFrom = '', priceTo = '', onDone, t }) {
  const [from, setFrom] = useState(priceFrom || '')
  const [to, setTo] = useState(priceTo || '')

  return (
    <div className={styles.panel}>
      <div className={styles.priceRow}>
        <input
          type="number"
          min="0"
          className={styles.priceInput}
          placeholder={t('ads.priceFrom')}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <span className={styles.priceDash}>—</span>
        <input
          type="number"
          min="0"
          className={styles.priceInput}
          placeholder={t('ads.priceTo')}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <button
        type="button"
        className={`${styles.doneBtn} ${from || to || priceFrom || priceTo ? styles.doneBtnActive : ''}`}
        onClick={() => onDone({ priceFrom: from, priceTo: to })}
      >
        {t('ads.filterDone')}
      </button>
    </div>
  )
}
