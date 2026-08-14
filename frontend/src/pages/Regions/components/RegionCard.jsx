import { Link } from 'react-router-dom'
import { allCategoriesInRegionPath, categoryInRegionPath, regionHomePath } from '../regionPaths'
import styles from './RegionCard.module.css'

export default function RegionCard({
  region,
  categories,
  expanded,
  onToggle,
  lang,
  t,
}) {
  const regionName = lang === 'ru' ? region.nameRu : region.nameUz
  const districts = Array.isArray(region.districts) ? region.districts : []
  const regionPath = regionHomePath(region.code)

  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          <Link to={regionPath} className={styles.titleLink}>
            {regionName}
          </Link>
        </h2>
        <span className={styles.count}>
          {districts.length}
        </span>
      </div>

      <ul className={styles.districts}>
        {districts.map((d) => (
          <li key={d.id}>
            <Link to={regionPath} className={styles.districtLink}>
              {lang === 'ru' ? d.nameRu : d.nameUz}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span>{t('regions.allCategoriesIn')} {regionName}</span>
        <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden />
      </button>

      {expanded && (
        <div className={styles.categories}>
          {categories.map((cat) => (
            <Link
              key={cat.code}
              to={categoryInRegionPath(cat, region.code)}
              className={styles.categoryChip}
            >
              {lang === 'ru' ? cat.nameRu : cat.nameUz}
            </Link>
          ))}
          <Link to={allCategoriesInRegionPath(region.code)} className={styles.categoryAll}>
            {t('home.allCategories')}
          </Link>
        </div>
      )}
    </article>
  )
}
