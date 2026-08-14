import AdCard from '../../components/AdCard'
import gridStyles from '../../components/AdCardGrid/AdCardGrid.module.css'
import styles from './FavoritesAdsSection.module.css'

/** Сетка избранных / рекомендаций рядом с сайдбаром. */
export default function FavoritesAdsSection({
  title,
  ads,
  t,
  categoryLabels,
  onFavoriteClick,
  favorite,
  heartAriaLabel,
  showDate = true,
  footer = null,
}) {
  if (!ads?.length) return null

  return (
    <section className={styles.section}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      <ul className={gridStyles.gridBesideNav}>
        {ads.map((ad) => (
          <AdCard
            key={ad.id}
            ad={ad}
            t={t}
            categoryLabel={categoryLabels[ad.category]}
            showCategoryMeta
            onFavoriteClick={onFavoriteClick}
            favorite={favorite}
            heartAriaLabel={heartAriaLabel}
            showDate={showDate}
          />
        ))}
      </ul>
      {footer}
    </section>
  )
}
