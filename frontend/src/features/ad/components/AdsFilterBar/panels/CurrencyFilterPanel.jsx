import styles from '../AdsFilterBar.module.css'

const OPTIONS = [
  { value: 'FROM_AD', labelKey: 'ads.currencyFromAd' },
  { value: 'UZS', labelKey: 'ads.currencyUzs' },
  { value: 'USD', labelKey: 'ads.currencyCu' },
]

export default function CurrencyFilterPanel({ value = 'FROM_AD', onSelect, t }) {
  return (
    <div className={styles.panel}>
      <ul className={styles.radioList}>
        {OPTIONS.map(({ value: v, labelKey }) => (
          <li key={v}>
            <button
              type="button"
              className={styles.radioRow}
              onClick={() => onSelect(v)}
            >
              <span>{t(labelKey)}</span>
              <span className={`${styles.radio} ${value === v || (!value && v === 'FROM_AD') ? styles.radioOn : ''}`} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
