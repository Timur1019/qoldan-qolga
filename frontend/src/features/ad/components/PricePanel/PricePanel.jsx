import { memo } from 'react'
import { useLang } from '../../../../context/LangContext'
import { formatPrice, formatDate } from '../../utils/adFormatters'
import styles from './PricePanel.module.css'

function LightningIcon() {
  return (
    <svg className={styles.lightningIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function PaperPlaneIcon() {
  return (
    <svg className={styles.telegramIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  )
}

function PricePanel({
  ad,
  onChat,
  chatGoing,
  isOwner,
}) {
  const { t } = useLang()

  return (
    <>
      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(ad?.price, ad?.currency)}</span>
      </div>
      {ad?.isNegotiable && (
        <span className={styles.urgentPill}>
          <LightningIcon />
          {t('ads.urgentBargain')}
        </span>
      )}
      <h1 className={styles.title}>{ad?.title}</h1>
      <a href="#track" className={styles.trackPriceLink}>{t('ads.trackPrice')} ›</a>
      {ad?.canDeliver && (
        <div className={styles.deliveryLine}>🚚 {t('ads.delivery')}</div>
      )}
      <div className={styles.contactBtns}>
        <button
          type="button"
          className={styles.contactBtnChat}
          onClick={() => onChat?.()}
          disabled={chatGoing || isOwner}
        >
          {chatGoing ? t('common.loading') : t('ads.chatWith')}
        </button>
        <a href={`tel:${(ad?.phone || '').replace(/\D/g, '')}`} className={styles.contactBtnPhone}>
          {t('ads.phone')}
        </a>
        <a
          href={`https://t.me/${(ad?.phone || '').replace(/\D/g, '').slice(-9)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactBtnTelegram}
        >
          <PaperPlaneIcon />
          Telegram
        </a>
      </div>
      <div className={styles.centerMeta}>
        <span className={styles.centerMetaLine}>{t('ads.postedAt')}: {formatDate(ad?.createdAt)}</span>
        <span className={styles.centerMetaLine}>{t('ads.views')}: {ad?.views ?? 0}</span>
      </div>
    </>
  )
}

export default memo(PricePanel)
