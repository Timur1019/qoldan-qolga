import styles from './AdsListAdRow.module.css'

export default function AdsListAdRowRating({ averageRating, totalReviews, t }) {
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
