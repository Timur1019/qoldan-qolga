import { UiInput, UiToggle } from '@/shared/ui'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAdDealPrice.module.css'

const CURRENCIES = [
  { value: 'UZS', short: 'сум' },
  { value: 'USD', short: 'у.е.' },
]

export default function CreateAdDealPrice({
  form,
  filterFlags,
  onChange,
  onPatch,
  t,
}) {
  return (
    <section className={`app-card ${shared.card}`}>
      <h2 className="h6 mb-2">{t('ads.dealConditions')}</h2>
      {filterFlags.giveAway && (
        <div className={shared.giveAwayRow}>
          <div className={shared.giveAwayLeft}>
            <span className={shared.giveAwayIcon} aria-hidden>🎈</span>
            <span className={shared.giveAwayLabel}>{t('ads.giveAway')}</span>
          </div>
          <UiToggle
            checked={form.giveAway}
            onChange={(on) => onPatch({ giveAway: on, ...(on ? { price: '0' } : {}) })}
          />
        </div>
      )}

      <h2 className="h6 mb-2 mt-3">{t('ads.formPrice')} *</h2>
      <div className={styles.priceRow}>
        <div className={styles.priceInputWrap}>
          <UiInput
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={onChange}
            required
            disabled={form.giveAway}
            placeholder={t('ads.pricePlaceholder')}
          />
        </div>
        <div className={styles.currencyBtns}>
          {CURRENCIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`${styles.currencyBtn} ${form.currency === c.value ? styles.active : ''}`}
              onClick={() => onPatch({ currency: c.value })}
            >
              {c.short}
            </button>
          ))}
        </div>
      </div>
      <label className={shared.checkRow}>
        <input
          name="isNegotiable"
          type="checkbox"
          checked={form.isNegotiable}
          onChange={onChange}
        />
        <span>{t('ads.formNegotiable')}</span>
      </label>
    </section>
  )
}
