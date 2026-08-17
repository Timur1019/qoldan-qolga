import { Link } from 'react-router-dom'
import UserAvatar from '@/components/ui/UserAvatar'
import { sellerPath } from '../../../../constants/routes'
import { maskPhone } from '../../utils/adFormatters'
import styles from './AdGallerySellerFooter.module.css'

export default function AdGallerySellerFooter({
  ad,
  sellerDisplayName,
  sellerAvatar,
  sellerCreatedAt,
  phoneRevealed,
  isAuthenticated,
  isOwner,
  chatGoing,
  lang,
  t,
  onWriteSeller,
  onPhoneClick,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.seller}>
        <UserAvatar
          avatar={sellerAvatar}
          name={sellerDisplayName}
          size={40}
          className={styles.avatar}
        />
        <div>
          <Link to={sellerPath(ad.userId)} className={styles.name} onClick={(e) => e.stopPropagation()}>
            {sellerDisplayName} ›
          </Link>
          {sellerCreatedAt && (
            <div className={styles.since}>
              {t('ads.onPlatformSince')} {new Date(sellerCreatedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={(e) => { e.stopPropagation(); onWriteSeller() }}
          disabled={chatGoing || isOwner}
        >
          <i className="bi bi-chat-dots me-1" aria-hidden /> {chatGoing ? t('common.loading') : t('ads.chatWith')}
        </button>
        {phoneRevealed && ad.phone ? (
          <span className="d-flex align-items-center gap-2">
            <span className="small">+{(ad.phone || '').replace(/\D/g, '')}</span>
            <a href={`tel:${(ad.phone || '').replace(/\D/g, '')}`} className="btn btn-outline-success btn-sm" onClick={(e) => e.stopPropagation()}>
              <i className="bi bi-telephone me-1" aria-hidden /> {t('ads.call')}
            </a>
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={(e) => { e.stopPropagation(); onPhoneClick() }}
            title={!isAuthenticated ? t('ads.phoneLoginRequired') : t('ads.phone')}
          >
            <i className="bi bi-telephone me-1" aria-hidden /> {ad.phone ? (maskPhone(ad.phone) ?? t('ads.phone')) : t('ads.phone')}
          </button>
        )}
        {(ad.telegramUsername?.trim() || ((ad.phone || '').replace(/\D/g, '').length >= 9)) && (
          <a
            href={ad.telegramUsername?.trim()
              ? `https://t.me/${String(ad.telegramUsername).replace(/^@/, '').trim()}`
              : `https://t.me/+${(ad.phone || '').replace(/\D/g, '').slice(-12)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="bi bi-send me-1" aria-hidden />
            {lang === 'ru' ? 'Написать в Telegram' : 'Telegramda yozish'}
          </a>
        )}
      </div>
    </div>
  )
}
