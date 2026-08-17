/**
 * SellerProfileSidebar — блок информации о пользователе (карточка + одна панель по роли).
 * Владелец: карточка + «Редактировать» + панель «Мои отзывы» (ссылка, поделиться).
 * Гость: карточка + «Подписаться» + панель «Оставить отзыв».
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { ROUTES, sellerPath } from '../../../../constants/routes'
import UserAvatar from '@/components/ui/UserAvatar'
import { isSellerStore } from '@/features/ad'
import styles from './SellerProfile.module.css'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
}

export default function SellerProfileSidebar({
  profile,
  avatarKey,
  isOwner,
  canSubscribe,
  canLeaveReview,
  avgRating,
  totalReviews,
  idVerified,
  onSubscribe,
  onLeaveReview,
}) {
  const { t } = useLang()
  const [linkCopied, setLinkCopied] = useState(false)
  const isAvatarPhotoUrl = profile?.avatar && (String(profile.avatar).startsWith('/') || String(profile.avatar).startsWith('http'))
  const photoAvatar = profile?.avatarUrl || profile?.uploadedAvatar || (isAvatarPhotoUrl ? profile.avatar : null)
  const avatarValue = photoAvatar || avatarKey || profile?.avatar
  const ratingText = totalReviews > 0
    ? `${avgRating.toFixed(1)} ${totalReviews === 1 ? t('reviews.count') : t('reviews.countPlural')}`
    : t('reviews.noReviews')

  const shareUrl = profile?.id ? (typeof window !== 'undefined' ? `${window.location.origin}${sellerPath(profile.id)}` : '') : ''
  const handleShare = () => {
    if (!shareUrl) return
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      }).catch(() => {})
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={`app-card ${styles.profileCard}`}>
        <div className={styles.profileHeader}>
          <UserAvatar
            avatar={avatarValue}
            name={profile?.displayName || ''}
            size={56}
            className={styles.avatar}
          />
          <h1 className={styles.sellerName}>{profile.displayName}{isOwner ? ` (${t('chat.you')})` : ''}</h1>
        </div>
        {profile.createdAt && (
          <p className={styles.profileSince}>
            {t('ads.onPlatformSince')} {formatDate(profile.createdAt)}
          </p>
        )}
        <ul className={styles.profileStatsList}>
          <li>• {profile.adsCount} {t('ads.sellerAds')}</li>
          <li>• {profile.subscribersCount} {t('ads.subscriber')}</li>
          <li>• {ratingText}</li>
          <li>
            • {isSellerStore(profile) ? t('ads.sellerTypes.STORE') : t('ads.sellerTypes.PRIVATE')}
          </li>
        </ul>
        <div className={`${styles.verificationBadge} ${idVerified ? styles.verificationBadgeOk : styles.verificationBadgeNone}`}>
          {idVerified ? t('profile.idVerified') : t('profile.idNotVerified')}
        </div>

        <div className={styles.profileCardActions}>
          {isOwner ? (
            <Link to={ROUTES.PROFILE_EDIT} className="btn btn-primary btn-sm text-white text-decoration-none">
              {t('chat.edit')}
            </Link>
          ) : (
            canSubscribe && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onSubscribe}
              >
                {profile.subscribed ? t('ads.youAreSubscribed') : t('ads.subscribe')}
              </button>
            )
          )}
        </div>
      </div>

      {isOwner ? (
        <div className={`app-card ${styles.ownerPanelCard}`}>
          <h3 className={styles.ownerPanelTitle}>{t('profile.myReviews')}</h3>
          <Link to={ROUTES.REVIEWS_MY} className={styles.ownerPanelLink}>
            {t('profile.myReviews')} →
          </Link>
          <button type="button" className="btn btn-outline-primary btn-sm w-100" onClick={handleShare}>
            {linkCopied ? t('reviews.linkCopied') : t('profile.shareProfile')}
          </button>
        </div>
      ) : canLeaveReview ? (
        <div className={styles.leaveReviewCard}>
          <p className={styles.leaveReviewHint}>{t('reviews.leaveReviewHint')}</p>
          <button
            type="button"
            className="btn btn-primary btn-sm w-100"
            onClick={onLeaveReview}
          >
            {t('reviews.leaveReview')}
          </button>
        </div>
      ) : null}
    </aside>
  )
}
