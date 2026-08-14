import Skeleton from '../Skeleton/Skeleton'
import styles from './AdCardSkeleton.module.css'

export default function AdCardSkeleton() {
  return (
    <li className={styles.card}>
      <Skeleton variant="block" className={styles.image} />
      <Skeleton variant="title" className={styles.title} />
      <Skeleton variant="text" className={styles.price} />
      <Skeleton variant="text" className={styles.meta} />
    </li>
  )
}
