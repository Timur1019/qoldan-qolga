import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import UserAvatar from '@/components/ui/UserAvatar'
import { sellerPath } from '../../../../constants/routes'
import { resolveSellerBadge } from '../../../../constants/sellerTypes'
import styles from './SellerInfo.module.css'

function SellerInfo({
  sellerId,
  sellerDisplayName,
  sellerAvatar,
  sellerIsStore,
  sellerType,
  adsCount,
  sinceIso,
  ratingText,
  subscribed,
  isOwner,
  onSubscribe,
}) {
  const { t } = useLang()
  const badge = resolveSellerBadge({ sellerIsStore, sellerType })

  return (
    <>
      <div className={styles.sellerDivider} />
      <div className={styles.sellerCardHeader}>
        <div className={styles.sellerCardInfo}>
          <Link to={sellerId ? sellerPath(sellerId) : '#'} className={styles.sellerCardName}>
            {sellerDisplayName} ›
          </Link>
          {(sellerIsStore != null || sellerType) && (
            <span className={`badge ms-1 ${badge.tone === 'private' ? 'bg-secondary' : 'bg-success'}`} style={{ fontSize: '0.7rem' }}>
              {t(badge.labelKey)}
            </span>
          )}
          <div className={styles.sellerCardStat}>{adsCount} {t('ads.sellerAds')}</div>
          {sinceIso && (
            <div className={styles.sellerCardSince}>
              {t('ads.onPlatformSince')} {new Date(sinceIso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          )}
        </div>
        <div className={styles.sellerCardAvatarWrap}>
          <UserAvatar avatar={sellerAvatar} name={sellerDisplayName} size={56} />
        </div>
      </div>
      <div className={styles.sellerRatingLine}>{ratingText}</div>
      {!isOwner && (
        <button
          type="button"
          className={`btn btn-sm w-100 mt-2 ${subscribed ? 'btn-success' : 'btn-outline-primary'}`}
          onClick={onSubscribe}
        >
          {subscribed ? t('ads.youAreSubscribed') : t('ads.subscribe')}
        </button>
      )}
    </>
  )
}

export default memo(SellerInfo)
