import { UiChoiceList, UiToggle } from '@/shared/ui'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAdFlags.module.css'

export default function CreateAdFlags({
  form,
  filterFlags,
  isClothingCategory,
  onPatch,
  t,
  lang,
}) {
  const show =
    filterFlags.license ||
    filterFlags.contract ||
    filterFlags.urgentBargain ||
    filterFlags.condition ||
    filterFlags.canRent

  if (!show) return null

  const yesNo = [
    { value: 'no', label: lang === 'ru' ? 'Нет' : 'Yo\'q' },
    { value: 'yes', label: lang === 'ru' ? 'Да' : 'Ha' },
  ]

  const conditionOptions = [
    ...(!isClothingCategory ? [{ value: 'USED', label: t('ads.conditionUsed') }] : []),
    ...(isClothingCategory
      ? [
          { value: 'USED_LIKE_NEW', label: t('ads.conditionUsedLikeNew') },
          { value: 'USED_GOOD', label: t('ads.conditionUsedGood') },
          { value: 'USED_FAIR', label: t('ads.conditionUsedFair') },
        ]
      : []),
    { value: 'NEW', label: t('ads.conditionNew') },
    ...(filterFlags.handmade && !isClothingCategory
      ? [{ value: 'HANDMADE', label: t('ads.conditionHandmade') }]
      : []),
  ]

  return (
    <section className={`app-card ${shared.card}`}>
      {filterFlags.license && (
        <>
          <h2 className="h6 mb-2">{t('ads.hasLicense')}</h2>
          <UiChoiceList
            name="hasLicense"
            value={form.hasLicense ? 'yes' : 'no'}
            options={yesNo}
            onChange={(v) => onPatch({ hasLicense: v === 'yes' })}
          />
        </>
      )}

      {filterFlags.contract && (
        <>
          <h2 className="h6 mb-2 mt-3">{t('ads.worksByContract')}</h2>
          <UiChoiceList
            name="worksByContract"
            value={form.worksByContract ? 'yes' : 'no'}
            options={yesNo}
            onChange={(v) => onPatch({ worksByContract: v === 'yes' })}
          />
        </>
      )}

      {filterFlags.urgentBargain && (
        <div className={`${shared.giveAwayRow} ${styles.mtFlags}`}>
          <div className={shared.giveAwayLeft}>
            <span className={shared.giveAwayIcon} aria-hidden>⚡</span>
            <span className={shared.giveAwayLabel}>{t('ads.urgentBargain')}</span>
          </div>
          <UiToggle
            checked={form.urgentBargain}
            onChange={(urgentBargain) => onPatch({ urgentBargain })}
          />
        </div>
      )}

      {filterFlags.condition && (
        <div className={`mb-0 ${styles.mtFlags}`}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.conditionLabel')}</p>
          <UiChoiceList
            name="itemCondition"
            value={form.itemCondition}
            options={conditionOptions}
            onChange={(itemCondition) => onPatch({ itemCondition })}
          />
        </div>
      )}
      {filterFlags.canRent && (
        <label className={`${shared.checkRow} mt-2`}>
          <input
            type="checkbox"
            checked={!!form.canRent}
            onChange={(e) => onPatch({ canRent: e.target.checked })}
          />
          <span>{t('ads.canRentLabel')}</span>
        </label>
      )}
    </section>
  )
}
