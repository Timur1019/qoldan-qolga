import { memo } from 'react'
import { useLang } from '../../../../context/LangContext'
import { QUICK_QUESTIONS } from '../../utils/constants'
import { descriptionWithoutLocation } from '../../utils/descriptionLocation'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import AdVehicleCharacteristics from './AdVehicleCharacteristics'
import AdJobCharacteristics from './AdJobCharacteristics'
import styles from './AdDescription.module.css'

function AdDescription({
  ad,
  categoryLabel,
  regionLabel,
  isAuthenticated,
  isOwner,
  askText,
  onAskChange,
  onAskSend,
  chatGoing,
}) {
  const { t, lang } = useLang()
  const regionDisplay = regionLabel ?? ad?.region
  const descriptionText = descriptionWithoutLocation(ad?.description)

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('ads.description')}</h2>
        <p className={styles.description}>{descriptionText}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('ads.characteristics')}</h2>
        <dl className={styles.charList}>
          <div className={styles.charRow}>
            <dt>{t('ads.category')}</dt>
            <dd className={styles.categoryValue}>
              {ad?.category ? <CategoryIcon code={ad.category} className={styles.categoryIcon} /> : null}
              {categoryLabel}
            </dd>
          </div>
          {regionDisplay && (
            <div className={styles.charRow}>
              <dt>{t('ads.region')}</dt>
              <dd>{regionDisplay}</dd>
            </div>
          )}
          <AdVehicleCharacteristics ad={ad} lang={lang} t={t} />
          <AdRealEstateCharacteristics ad={ad} t={t} />
          <AdJobCharacteristics ad={ad} lang={lang} />
          {ad?.itemCondition && ad?.dealType == null && !ad?.jobProfession && (
            <div className={styles.charRow}>
              <dt>{t('ads.conditionLabel')}</dt>
              <dd>
                {ad.itemCondition === 'NEW'
                  ? t('ads.conditionNew')
                  : ad.itemCondition === 'HANDMADE'
                    ? t('ads.conditionHandmade')
                    : ad.itemCondition === 'USED_LIKE_NEW'
                      ? t('ads.conditionUsedLikeNew')
                      : ad.itemCondition === 'USED_GOOD'
                        ? t('ads.conditionUsedGood')
                        : ad.itemCondition === 'USED_FAIR'
                          ? t('ads.conditionUsedFair')
                          : t('ads.conditionUsed')}
              </dd>
            </div>
          )}
          {ad?.canRent && (
            <div className={styles.charRow}>
              <dt>{t('ads.canRentLabel')}</dt>
              <dd>{t('ads.canRentYes')}</dd>
            </div>
          )}
          {ad?.district && (
            <div className={styles.charRow}>
              <dt>{t('ads.district')}</dt>
              <dd>{ad.district}</dd>
            </div>
          )}
          <div className={styles.charRow}>
            <dt>{t('ads.views')}</dt>
            <dd>{ad?.views}</dd>
          </div>
        </dl>
      </section>

      {isAuthenticated && !isOwner && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('ads.askSeller')}</h2>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={t('ads.askPlaceholder')}
              value={askText}
              onChange={(e) => onAskChange?.(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAskSend?.(askText || t('ads.askPlaceholder'))}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm flex-shrink-0"
              onClick={() => onAskSend?.(askText || t('ads.askPlaceholder'))}
              disabled={chatGoing}
              aria-label={t('chat.send')}
            >
              <i className="bi bi-send" aria-hidden />
            </button>
          </div>
          <div className="d-flex flex-wrap gap-1 mt-2">
            {QUICK_QUESTIONS.map((key, i) => (
              <button
                key={key}
                type="button"
                className={`btn btn-sm ${i === 0 ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => onAskChange?.(t(key))}
                disabled={chatGoing}
              >
                {t(key)}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default memo(AdDescription)
