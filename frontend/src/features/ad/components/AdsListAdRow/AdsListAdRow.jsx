import { Link } from 'react-router-dom'
import { imageUrl } from '../../services/adApi'
import { formatAdCardDate } from '../../../../utils/formatters'
import { formatDisplayPrice } from '../../utils/priceDisplay'
import { vehicleBrandModel, vehicleMetaLine } from '../../utils/transportDisplay'
import { realEstateMetaLine } from '../../utils/realEstateDisplay'
import { telegramHrefFromAd } from '../../utils/telegramContact'
import { adsPath, sellerPath } from '../../../../constants/routes'
import HeartIcon from '../../../../components/ui/HeartIcon'
import { useRegionLabel } from '../../../../context/RegionsContext'
import CardGallery from '../CardGallery'
import AdImageBadges from '../AdImageBadges/AdImageBadges'
import styles from '../../pages/AdsList/AdsList.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

function RatingStars({ averageRating, totalReviews, t }) {
  const avg = averageRating ?? 0
  const count = totalReviews ?? 0
  const full = Math.floor(avg)
  const half = (avg - full) >= 0.5 ? 1 : 0
  const empty = Math.max(0, 5 - full - half)
  return (
    <div className={styles.ratingLine}>
      <span className={styles.stars} aria-hidden title={`${avg.toFixed(1)}`}>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
      </span>
      {count > 0 && (
        <span className={styles.ratingText}>
          {avg.toFixed(1)} · {count} {t('reviews.countPlural')}
        </span>
      )}
    </div>
  )
}

function formatPhone(phone) {
  if (!phone) return ''
  const digits = String(phone).replace(/\D/g, '')
  if (digits.length >= 10) return `+${digits}`
  return phone
}

/**
 * Строка списка объявлений — вынесена из AdsList, чтобы не remount при каждом рендере родителя.
 */
export default function AdsListAdRow({
  ad,
  lang,
  t,
  userId,
  displayCurrency,
  usdToUzs,
  phoneRevealed,
  isAuthenticated,
  onFavoriteClick,
  onWriteSeller,
  onShowPhone,
}) {
  const regionLabel = useRegionLabel(ad?.region)
  const urls = ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])
  const sellerName = ad.userDisplayName || t('ads.seller')
  const isAvatarPhoto = ad.userAvatar && (ad.userAvatar.startsWith('/') || ad.userAvatar.startsWith('http'))
  const avatarEmoji = ad.userAvatar && AVATAR_EMOJI[ad.userAvatar] ? AVATAR_EMOJI[ad.userAvatar] : null
  const desc = (ad.description || '').trim()
  const dateLabels = { today: t('chat.today'), yesterday: t('chat.yesterday') }
  const telegramHref = telegramHrefFromAd(ad)
  const isOwnAd = ad.userId && String(ad.userId) === String(userId)

  return (
    <li className={`${styles.adRow} ${ad.isHighlighted ? styles.adRowHighlighted : ''}`.trim()}>
      <Link to={adsPath(ad.id)} className={styles.adRowLink}>
        <span className={styles.adRowImageWrap}>
          <AdImageBadges ad={ad} t={t} />
          <CardGallery
            imageUrls={urls}
            className={styles.adRowGalleryWrap}
            imageWrapClassName={styles.adRowGallery}
          />
        </span>
        <div className={styles.adRowBody}>
          <button
            type="button"
            className={styles.adRowFavorite}
            onClick={(e) => onFavoriteClick(e, ad)}
            aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
          >
            <HeartIcon
              filled={!!ad.favorite}
              className={`${styles.heartIcon} ${ad.favorite ? styles.heartFilled : styles.heartOutline}`}
              size={16}
            />
          </button>
          <h2 className={styles.adRowTitle}>{ad.title}</h2>
          {(vehicleBrandModel(ad, lang) || vehicleMetaLine(ad, t) || realEstateMetaLine(ad, t)) && (
            <p className={styles.adRowMeta}>
              {[vehicleBrandModel(ad, lang), vehicleMetaLine(ad, t), realEstateMetaLine(ad, t)].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className={styles.adRowPrice}>
            {formatDisplayPrice(ad.price, ad.currency, displayCurrency, usdToUzs)}
            {ad.isNegotiable && ` (${t('ads.negotiable')})`}
          </p>
          {regionLabel && (
            <p className={styles.adRowMeta}>{regionLabel}</p>
          )}
          {desc && (
            <p className={styles.adRowDesc}>{desc.length > 80 ? `${desc.slice(0, 80)}…` : desc}</p>
          )}
          {ad.createdAt && (
            <p className={styles.adRowDate}>{formatAdCardDate(ad.createdAt, dateLabels)}</p>
          )}
        </div>
      </Link>
      <div className={styles.adRowSeller}>
        <div className={styles.adRowSellerTop}>
          <div className={styles.adRowAvatarWrap}>
            {isAvatarPhoto ? (
              <img src={imageUrl(ad.userAvatar)} alt="" className={styles.adRowAvatar} />
            ) : avatarEmoji ? (
              <span className={styles.adRowAvatarEmoji} aria-hidden>{avatarEmoji}</span>
            ) : (
              <span className={styles.adRowAvatarInitial} aria-hidden>
                {sellerName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <Link to={sellerPath(ad.userId)} className={styles.adRowSellerName} onClick={(e) => e.stopPropagation()}>
            {sellerName}
          </Link>
        </div>
        {(ad.totalReviews ?? 0) > 0 && (
          <RatingStars averageRating={ad.averageRating} totalReviews={ad.totalReviews} t={t} />
        )}
        <div className={styles.adRowActions}>
          {!isOwnAd && ad.userId && (
            <button
              type="button"
              className={styles.adRowWriteBtn}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWriteSeller(ad) }}
            >
              <i className="bi bi-chat-dots me-1" aria-hidden /> {t('ads.chatWith')}
            </button>
          )}
          {telegramHref && (
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.adRowTelegramBtn}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-send me-1" aria-hidden />
              Telegram
            </a>
          )}
          {ad.phone && (
            phoneRevealed ? (
              <a
                href={`tel:${(ad.phone || '').replace(/\D/g, '')}`}
                className={styles.adRowPhoneLink}
                onClick={(e) => e.stopPropagation()}
              >
                {formatPhone(ad.phone)}
              </a>
            ) : (
              <button
                type="button"
                className={styles.adRowShowPhoneBtn}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShowPhone(ad.id) }}
                title={!isAuthenticated ? t('ads.phoneLoginRequired') : undefined}
              >
                {t('ads.showPhone')}
              </button>
            )
          )}
        </div>
      </div>
    </li>
  )
}
