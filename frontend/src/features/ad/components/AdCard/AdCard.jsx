import { Link } from 'react-router-dom'
import HeartIcon from '../../../../components/ui/HeartIcon'
import CardGallery from '../CardGallery'
import { galleryImageUrls } from '../../utils/galleryImageUrls'
import AdCategoryMeta from '../AdCategoryMeta/AdCategoryMeta'
import AdImageBadges from '../AdImageBadges/AdImageBadges'
import { useRegionLabel } from '../../../../context/RegionsContext'
import { adsPath } from '../../../../constants/routes'
import { formatPrice, formatAdDate } from '../../../../utils/formatters'
import styles from './AdCard.module.css'

/**
 * Единая карточка объявления.
 * Кнопка избранного не внутри Link — иначе клик ломается.
 */
export default function AdCard({
  ad,
  t,
  onFavoriteClick,
  favorite,
  heartAriaLabel,
  categoryLabel,
  showCategoryMeta = false,
  showDate = true,
  showFavorite = true,
  active = false,
  idPrefix,
  onHover,
}) {
  const regionLabel = useRegionLabel(ad?.region)

  if (!ad?.id) return null
  const href = adsPath(ad.id)

  const isFav = favorite != null ? !!favorite : !!ad.favorite

  return (
    <li
      id={idPrefix ? `${idPrefix}${ad.id}` : undefined}
      className={`${styles.card} ${ad.isHighlighted ? styles.highlighted : ''} ${active ? styles.active : ''}`.trim()}
      onMouseEnter={() => onHover?.(ad.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <Link to={href} className={styles.mediaLink}>
        <span className={styles.imageWrap}>
          <AdImageBadges ad={ad} t={t} />
          <CardGallery
            square
            imageUrls={galleryImageUrls(ad)}
          />
        </span>
      </Link>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <Link to={href} className={styles.titleLink}>
            <span className={styles.title}>{ad.title}</span>
          </Link>
          {showFavorite && onFavoriteClick ? (
            <button
              type="button"
              className={styles.favoriteBtn}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onFavoriteClick(e, ad)
              }}
              aria-label={
                heartAriaLabel ||
                (isFav ? t?.('common.removeFromFavorites') : t?.('common.addToFavorites'))
              }
            >
              <HeartIcon
                filled={isFav}
                className={`${styles.heartIcon} ${isFav ? styles.heartFilled : styles.heartOutline}`}
                size={18}
              />
            </button>
          ) : null}
        </div>

        <Link to={href} className={styles.detailsLink}>
          <span className={styles.price}>
            <span className={styles.priceValue}>{formatPrice(ad.price, ad.currency)}</span>
            {ad.isNegotiable && t ? (
              <span className={styles.negotiable}> {t('ads.negotiable')}</span>
            ) : null}
          </span>

          {showCategoryMeta ? (
            <AdCategoryMeta
              categoryCode={ad.category}
              categoryLabel={categoryLabel}
              region={regionLabel}
              className={styles.meta}
            />
          ) : regionLabel ? (
            <span className={styles.location}>
              <i className={`bi bi-geo-alt ${styles.locIcon}`} aria-hidden />
              <span className={styles.locText}>{regionLabel}</span>
            </span>
          ) : null}

          {showDate && ad.createdAt ? (
            <span className={styles.date}>{formatAdDate(ad.createdAt)}</span>
          ) : null}
        </Link>
      </div>
    </li>
  )
}
