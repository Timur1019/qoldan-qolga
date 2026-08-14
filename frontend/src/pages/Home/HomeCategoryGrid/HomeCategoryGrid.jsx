import { Link } from 'react-router-dom'
import CategoryIcon from '../../../components/ui/CategoryIcon'
import { ROUTES, categoryPath, adsCategoryPath } from '../../../constants/routes'
import { categoryCardTint } from '../categoryCardTint'
import styles from './HomeCategoryGrid.module.css'

function categoryTo(cat) {
  if (cat.code === 'Xizmatlar') return adsCategoryPath(cat.code)
  if (cat.hasChildren) return categoryPath(cat.code)
  return adsCategoryPath(cat.code)
}

export default function HomeCategoryGrid({ categories = [], lang, t }) {
  const nameOf = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')

  return (
    <div className={styles.grid}>
      {categories.slice(0, 9).map((cat, i) => (
        <Link
          key={cat.code}
          to={categoryTo(cat)}
          className={styles.card}
          style={{
            '--card-tint': categoryCardTint(cat.code),
            animationDelay: `${Math.min(i, 10) * 35}ms`,
          }}
        >
          <span className={styles.title}>{nameOf(cat)}</span>
          <span className={styles.iconPeek} aria-hidden>
            <CategoryIcon code={cat.code} parentCode={cat.parentCode} className={styles.icon} />
          </span>
        </Link>
      ))}
      <Link
        to={ROUTES.CATEGORIES_OPEN}
        className={`${styles.card} ${styles.cardAll}`}
        style={{ animationDelay: `${Math.min(categories.length, 9) * 35}ms` }}
      >
        <span className={styles.title}>{t('home.allCategories')}</span>
        <span className={styles.arrow} aria-hidden>
          <i className="bi bi-arrow-right" />
        </span>
      </Link>
    </div>
  )
}
