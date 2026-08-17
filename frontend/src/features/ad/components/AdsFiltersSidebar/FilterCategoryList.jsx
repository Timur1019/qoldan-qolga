import { Link } from 'react-router-dom'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import styles from './AdsFiltersSidebar.module.css'

export default function FilterCategoryList({
  sidebarCategories,
  currentCategoryCode,
  buildAdsLink,
  expanded,
  onToggleExpanded,
  categoryName,
  t,
}) {
  const hasMore = sidebarCategories.length > 8
  const displayCategories = hasMore && !expanded
    ? sidebarCategories.slice(0, 8)
    : sidebarCategories

  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{t('ads.adsInUzbekistan')}</p>
      <ul className="list-unstyled mb-0">
        {displayCategories.map((c) => {
          const code = c.code ?? c.id
          if (!code) return null
          const isActive = String(code) === String(currentCategoryCode)
          return (
            <li key={code}>
              <Link
                to={buildAdsLink(code)}
                className={`${styles.sidebarCatItem} ${isActive ? styles.sidebarCatItemActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.sidebarCatMain}>
                  <CategoryIcon code={code} parentCode={c.parentCode} className={styles.sidebarCatIcon} />
                  <span>{categoryName(c)}</span>
                </span>
                <i className="bi bi-chevron-right small" aria-hidden />
              </Link>
            </li>
          )
        })}
        {hasMore && (
          <li>
            <button
              type="button"
              className="btn btn-link p-0 small text-primary text-decoration-none"
              onClick={onToggleExpanded}
              aria-expanded={expanded}
            >
              {expanded ? `${t('ads.showLess')} ↑` : `${t('ads.showAll')} ↓`}
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}
