import { sellerTypeOptionsForCategory, normalizeSellerType } from '../../../../constants/sellerTypes'
import styles from '../../pages/CreateAd/CreateAd.module.css'

/**
 * Выбор типа продавца — опции зависят от категории объявления.
 */
export default function CreateAdSellerTypeFields({
  sellerType,
  categoryCode,
  breadcrumb = [],
  onChange,
  t,
}) {
  const options = sellerTypeOptionsForCategory(categoryCode, breadcrumb)
  const current = normalizeSellerType(sellerType) || sellerType || ''

  return (
    <section className={`app-card ${styles.card}`}>
      <h2 className="h6 mb-2">{t('ads.sellerType')}</h2>
      <div className={styles.filterOptions}>
        {options.map((opt) => (
          <label key={opt.value} className={styles.filterRadio}>
            <input
              type="radio"
              name="sellerType"
              value={opt.value}
              checked={current === opt.value}
              onChange={onChange}
            />
            <span>{t(opt.labelKey)}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
