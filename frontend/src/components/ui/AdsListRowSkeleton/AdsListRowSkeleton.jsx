import Skeleton from '../Skeleton/Skeleton'
import styles from './AdsListRowSkeleton.module.css'

export default function AdsListRowSkeleton() {
  return (
    <li className={styles.row}>
      <Skeleton variant="block" className={styles.image} />
      <div className={styles.body}>
        <Skeleton variant="title" className={styles.title} />
        <Skeleton variant="text" className={styles.price} />
        <Skeleton variant="text" className={styles.line} />
        <Skeleton variant="text" className={styles.short} />
        <Skeleton variant="text" className={styles.seller} />
      </div>
    </li>
  )
}
