import { resolveSellerBadge } from '../../../../constants/sellerTypes'
import styles from './AdImageBadges.module.css'

/**
 * Ленточные бейджи на фото карточки: VIP/TOP + тип продавца + онлайн-показ.
 */
export default function AdImageBadges({ ad, t, className = '' }) {
  if (!ad) return null

  const seller = resolveSellerBadge(ad)
  const sellerLabel = t ? t(seller.labelKey) : seller.code
  const showOnline = Boolean(ad.onlineShowing)
  const showPremium = Boolean(ad.isHighlighted)
  const showTop = Boolean(ad.isTop) && !showPremium
  const showVip = Boolean(ad.isVip) && !showTop && !showPremium

  const toneClass =
    seller.tone === 'private'
      ? styles.private
      : seller.tone === 'accent'
        ? styles.accent
        : seller.tone === 'agent'
          ? styles.agent
          : seller.tone === 'service'
            ? styles.service
            : seller.tone === 'farm'
              ? styles.farm
              : styles.store

  return (
    <span className={`${styles.stack} ${className}`.trim()} aria-hidden>
      {showPremium ? (
        <span className={`${styles.ribbon} ${styles.premium}`}>
          {t ? t('ads.badgePremium') : 'Premium'}
        </span>
      ) : null}
      {showTop ? (
        <span className={`${styles.ribbon} ${styles.top}`}>
          {t ? t('ads.badgeTop') : 'TOP'}
        </span>
      ) : null}
      {showVip ? (
        <span className={`${styles.ribbon} ${styles.vip}`}>
          {t ? t('ads.badgeVip') : 'VIP'}
        </span>
      ) : null}
      {showOnline ? (
        <span className={`${styles.ribbon} ${styles.online}`}>
          {t ? t('ads.onlineShowing') : 'Онлайн-показ'}
        </span>
      ) : null}
      <span className={`${styles.ribbon} ${toneClass}`}>{sellerLabel}</span>
    </span>
  )
}
