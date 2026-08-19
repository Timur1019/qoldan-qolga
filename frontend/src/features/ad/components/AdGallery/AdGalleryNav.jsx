import styles from './AdGalleryNav.module.css'

export default function AdGalleryNav({ index, count, onPrev, onNext, prevLabel, nextLabel }) {
  if (count < 2) return null

  return (
    <>
      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        onClick={onPrev}
        disabled={index <= 0}
        aria-label={prevLabel}
      >
        ‹
      </button>
      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        onClick={onNext}
        disabled={index >= count - 1}
        aria-label={nextLabel}
      >
        ›
      </button>
    </>
  )
}
