import { useState } from 'react'
import styles from '../AdsFilterBar.module.css'

export default function RangeFilterPanel({
  from = '',
  to = '',
  onDone,
  fromLabel,
  toLabel,
  min,
  max,
  step,
  t,
}) {
  const [draftFrom, setDraftFrom] = useState(from || '')
  const [draftTo, setDraftTo] = useState(to || '')

  return (
    <div className={styles.panel}>
      <div className={styles.priceRow}>
        <input
          type="number"
          className={styles.priceInput}
          placeholder={fromLabel}
          min={min}
          max={max}
          step={step}
          value={draftFrom}
          onChange={(e) => setDraftFrom(e.target.value)}
        />
        <span className={styles.priceDash}>—</span>
        <input
          type="number"
          className={styles.priceInput}
          placeholder={toLabel}
          min={min}
          max={max}
          step={step}
          value={draftTo}
          onChange={(e) => setDraftTo(e.target.value)}
        />
      </div>
      <button
        type="button"
        className={`${styles.doneBtn} ${draftFrom || draftTo || from || to ? styles.doneBtnActive : ''}`}
        onClick={() => onDone({ from: draftFrom, to: draftTo })}
      >
        {t('ads.filterDone')}
      </button>
    </div>
  )
}
