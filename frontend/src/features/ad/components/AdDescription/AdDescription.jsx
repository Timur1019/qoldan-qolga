import { memo } from 'react'
import { useLang } from '../../../../context/LangContext'
import { QUICK_QUESTIONS } from '../../utils/constants'
import styles from './AdDescription.module.css'

function AdDescription({
  ad,
  categoryLabel,
  isAuthenticated,
  isOwner,
  askText,
  onAskChange,
  onAskSend,
  chatGoing,
}) {
  const { t } = useLang()

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('ads.description')}</h2>
        <p className={styles.description}>{ad?.description}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('ads.characteristics')}</h2>
        <dl className={styles.charList}>
          <div className={styles.charRow}>
            <dt>{t('ads.category')}</dt>
            <dd>{categoryLabel}</dd>
          </div>
          {ad?.region && (
            <div className={styles.charRow}>
              <dt>{t('ads.region')}</dt>
              <dd>{ad.region}</dd>
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
          <div className={styles.askRow}>
            <input
              type="text"
              className={styles.askInput}
              placeholder={t('ads.askPlaceholder')}
              value={askText}
              onChange={(e) => onAskChange?.(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAskSend?.(askText || t('ads.askPlaceholder'))}
            />
            <button
              type="button"
              className={styles.askSend}
              onClick={() => onAskSend?.(askText || t('ads.askPlaceholder'))}
              disabled={chatGoing}
              aria-label={t('chat.send')}
            >
              <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
          <div className={styles.quickChips}>
            {QUICK_QUESTIONS.map((key, i) => (
              <button
                key={key}
                type="button"
                className={i === 0 ? `${styles.quickChip} ${styles.quickChipPrimary}` : styles.quickChip}
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
