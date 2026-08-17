import { UiField, UiInput } from '@/shared/ui'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAdDescription.module.css'

const DESC_MAX = 1000

export default function CreateAdDescription({ value, onChange, t }) {
  const descLen = (value || '').length

  return (
    <section className={`app-card ${shared.card}`}>
      <UiField label={`${t('ads.formDescription')} *`} hint={t('ads.descriptionExample')} htmlFor="create-ad-desc">
        <div className={styles.descWrap}>
          <UiInput
            id="create-ad-desc"
            multiline
            name="description"
            value={value}
            onChange={onChange}
            required
            maxLength={DESC_MAX}
            rows={5}
            className={styles.descInput}
            placeholder={t('ads.descriptionPlaceholder')}
          />
          <span className={styles.descCounter}>{descLen}/{DESC_MAX}</span>
        </div>
      </UiField>
    </section>
  )
}
