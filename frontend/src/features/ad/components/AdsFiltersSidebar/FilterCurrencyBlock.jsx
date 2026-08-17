import styles from './AdsFiltersSidebar.module.css'

const CURRENCIES = [
  { value: 'FROM_AD', labelKey: 'ads.currencyFromAd' },
  { value: 'UZS', labelKey: 'ads.currencyUzs' },
  { value: 'USD', labelKey: 'ads.currencyCu' },
]

export default function FilterCurrencyBlock({
  currency,
  setFilterDraft,
  onCurrencyChange,
  t,
}) {
  const current = currency || 'FROM_AD'
  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{t('ads.currency')}</p>
      <div className="btn-group btn-group-sm w-100" role="group">
        {CURRENCIES.map(({ value, labelKey }) => (
          <button
            key={value}
            type="button"
            className={`btn ${current === value || (value === 'FROM_AD' && (!currency || currency === 'FROM_AD')) ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => {
              if (typeof onCurrencyChange === 'function') {
                onCurrencyChange(value)
              } else {
                setFilterDraft((d) => ({ ...d, currency: value }))
              }
            }}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
