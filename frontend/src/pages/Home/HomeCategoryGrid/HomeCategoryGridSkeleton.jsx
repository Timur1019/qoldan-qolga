import Skeleton from '../../../components/ui/Skeleton/Skeleton'
import styles from './HomeCategoryGrid.module.css'
import skStyles from './HomeCategoryGridSkeleton.module.css'

export default function HomeCategoryGridSkeleton({ count = 10 }) {
  return (
    <div className={styles.grid} aria-busy="true" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={skStyles.card}>
          <Skeleton variant="title" className={skStyles.title} />
        </div>
      ))}
    </div>
  )
}
