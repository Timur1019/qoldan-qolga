import { memo } from 'react'
import { useLang } from '../../../../context/LangContext'
import { formatPrice, formatDate, maskPhone } from '../../utils/adFormatters'
import TrackPriceButton from './TrackPriceButton'
import styles from './PricePanel.module.css'


function PricePanel({
  ad,
  onChat,
  chatGoing,
  isOwner,
  isAuthenticated,
  phoneRevealed,
  onPhoneClick,
  priceWatching,
  onTrackPrice,
  onFavorite,
}) {
  const { t } = useLang()
  const rawDigits = (ad?.phone || '').replace(/\D/g, '')
  const fullNumber = rawDigits ? `+${rawDigits}` : ''
  const handlePhoneAction = () => {
    if (onPhoneClick) onPhoneClick()
  }

  return (
    <>
      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(ad?.price, ad?.currency)}</span>
      </div>
      {ad?.isNegotiable && (
        <span className="badge bg-warning text-dark mb-2">
          <i className="bi bi-lightning-charge me-1" aria-hidden /> {t('ads.urgentBargain')}
        </span>
      )}
      <div className={styles.titleRow}>
        <h1 className={`h5 mb-0 ${styles.title}`}>{ad?.title}</h1>
        {onFavorite && (
          <button
            type="button"
            className={styles.favoriteBtn}
            onClick={onFavorite}
            aria-label={ad?.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
          >
            <i className={`bi ${ad?.favorite ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden />
          </button>
        )}
      </div>
      <TrackPriceButton
        watching={priceWatching}
        onClick={onTrackPrice}
        label={t('ads.trackPrice')}
        stopLabel={t('ads.trackPriceStop')}
      />
      {ad?.canDeliver && (
        <div className="small text-muted mt-1"><i className="bi bi-truck me-1" aria-hidden /> {t('ads.delivery')}</div>
      )}
      <div className={`d-flex flex-wrap gap-2 mt-3 ${styles.actions}`}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onChat?.()}
          disabled={chatGoing || isOwner}
        >
          <i className="bi bi-chat-dots me-1" aria-hidden /> {chatGoing ? t('common.loading') : t('ads.chatWith')}
        </button>
        {phoneRevealed && fullNumber ? (
          <span className="btn btn-outline-secondary btn-sm disabled">{fullNumber}</span>
        ) : (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handlePhoneAction}
            title={!isAuthenticated ? t('ads.phoneLoginRequired') : t('ads.phone')}
          >
            <i className="bi bi-telephone me-1" aria-hidden /> {ad?.phone ? (maskPhone(ad.phone) ?? t('ads.phone')) : t('ads.phone')}
          </button>
        )}
        {((ad?.telegramUsername && String(ad.telegramUsername).trim()) || (ad?.phone && (ad.phone || '').replace(/\D/g, '').length >= 9)) && (
          <a
            href={ad?.telegramUsername?.trim()
              ? `https://t.me/${String(ad.telegramUsername).replace(/^@/, '').trim()}`
              : `https://t.me/+${(ad?.phone || '').replace(/\D/g, '').slice(-12)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm"
          >
            <i className="bi bi-send me-1" aria-hidden /> Telegram
          </a>
        )}
      </div>
      <div className="small text-muted mt-2 d-flex flex-wrap gap-2">
        <span>{t('ads.postedAt')}: {formatDate(ad?.createdAt)}</span>
        <span>{t('ads.views')}: {ad?.views ?? 0}</span>
      </div>
    </>
  )
}

export default memo(PricePanel)
