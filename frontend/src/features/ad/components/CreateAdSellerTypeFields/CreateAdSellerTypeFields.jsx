import { sellerTypeOptionsForCategory, normalizeSellerType } from '@/constants/sellerTypes'
import { UiChoiceList } from '@/shared/ui'
import styles from '../../styles/createAdShared.module.css'

export default function CreateAdSellerTypeFields({
  sellerType,
  categoryCode,
  breadcrumb = [],
  onPatch,
  t,
}) {
  const options = sellerTypeOptionsForCategory(categoryCode, breadcrumb)
  const current = normalizeSellerType(sellerType) || sellerType || ''

  return (
    <section className={`app-card ${styles.card}`}>
      <h2 className="h6 mb-2">{t('ads.sellerType')}</h2>
      <UiChoiceList
        name="sellerType"
        type="radio"
        value={current}
        options={options.map((opt) => ({ value: opt.value, label: t(opt.labelKey) }))}
        onChange={(sellerType) => onPatch({ sellerType })}
      />
    </section>
  )
}
