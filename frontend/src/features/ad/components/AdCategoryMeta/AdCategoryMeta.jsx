import CategoryIcon from '../../../../components/ui/CategoryIcon'
import styles from './AdCategoryMeta.module.css'

export default function AdCategoryMeta({ categoryCode, categoryLabel, region, className = '' }) {
  if (!categoryCode && !region) return null
  return (
    <p className={`${styles.meta} ${className}`.trim()}>
      {categoryCode ? (
        <span className={styles.category}>
          <CategoryIcon code={categoryCode} className={styles.icon} />
          {categoryLabel || null}
        </span>
      ) : null}
      {categoryCode && region ? <span className={styles.sep}>·</span> : null}
      {region || null}
    </p>
  )
}
