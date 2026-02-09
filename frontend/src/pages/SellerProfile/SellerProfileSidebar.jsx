/**
 * SellerProfileSidebar — блок информации о пользователе (карточка + одна панель по роли).
 * Владелец: карточка + «Редактировать» + панель «Мои отзывы» (ссылка, поделиться).
 * Гость: карточка + «Подписаться» + панель «Оставить отзыв».
 *
 * Аватар: 1) avatarUrl → картинка, 2) preset (avatar) → эмодзи, 3) иначе → инициалы имени.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { ROUTES, sellerPath } from '../../constants/routes'
import { imageUrl } from '../../api/client'
import styles from './SellerProfile.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
}

function getInitials(displayName) {
  if (!displayName || !String(displayName).trim()) return '?'
  const parts = String(displayName).trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return displayName.slice(0, 2).toUpperCase()
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
  const avatarUrl = profile?.avatarUrl || profile?.uploadedAvatar || (isAvatarPhotoUrl ? profile.avatar : null)
  const avatarSrc = avatarUrl ? imageUrl(avatarUrl) : null
  const avatarKeyResolved = !isAvatarPhotoUrl && (avatarKey ?? profile?.avatar) ? (avatarKey ?? profile.avatar) : null
  const avatarEmoji = avatarKeyResolved && AVATAR_EMOJI[avatarKeyResolved] ? AVATAR_EMOJI[avatarKeyResolved] : null
  const avatarInitials = !avatarSrc && !avatarEmoji ? getInitials(profile?.displayName) : null
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
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar} aria-hidden>
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className={styles.avatarImg} />
            ) : avatarEmoji ? (
              <span className={styles.avatarEmoji}>{avatarEmoji}</span>
            ) : (
              <span className={styles.avatarInitials}>{avatarInitials}</span>
            )}
          </div>
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
        </ul>
        <div className={`${styles.verificationBadge} ${idVerified ? styles.verificationBadgeOk : styles.verificationBadgeNone}`}>
          {idVerified ? t('profile.idVerified') : t('profile.idNotVerified')}
        </div>

        {isOwner ? (
          <>
            <Link to={ROUTES.PROFILE_EDIT} className={styles.editBtn}>
              {t('chat.edit')}
            </Link>
          </>
        ) : (
          canSubscribe && (
            <button
              type="button"
              className={profile.subscribed ? styles.subscribeBtnActive : styles.subscribeBtn}
              onClick={onSubscribe}
            >
              {profile.subscribed ? t('ads.youAreSubscribed') : t('ads.subscribe')}
            </button>
          )
        )}
      </div>

      {isOwner ? (
        <div className={styles.ownerPanelCard}>
          <h3 className={styles.ownerPanelTitle}>{t('profile.myReviews')}</h3>
          <Link to={ROUTES.REVIEWS_MY} className={styles.ownerPanelLink}>
            {t('profile.myReviews')} →
          </Link>
          <button type="button" className={styles.shareProfileBtn} onClick={handleShare}>
            {linkCopied ? t('reviews.linkCopied') : t('profile.shareProfile')}
          </button>
        </div>
      ) : canLeaveReview ? (
        <div className={styles.leaveReviewCard}>
          <p className={styles.leaveReviewHint}>{t('reviews.leaveReviewHint')}</p>
          <button
            type="button"
            className={styles.leaveReviewBtn}
            onClick={onLeaveReview}
          >
            {t('reviews.leaveReview')}
          </button>
        </div>
      ) : null}
    </aside>
  )
}
