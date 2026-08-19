import { buildPageItems } from './buildPageItems'
import styles from './UiPagination.module.css'

export default function UiPaginationNav({
  page,
  totalPages,
  onPageChange,
  prevLabel,
  nextLabel,
}) {
  const pages = Math.max(totalPages, 1)
  const items = buildPageItems(page, pages)

  return (
    <div className={styles.nav}>
      <button
        type="button"
        className={styles.navText}
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
      >
        {prevLabel}
      </button>
      <div className={styles.pages}>
        {items.map((item, index) => (
          item === 'ellipsis' ? (
            <span key={`e-${index}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={item}
              type="button"
              className={[styles.pageBtn, page === item - 1 ? styles.pageActive : ''].filter(Boolean).join(' ')}
              onClick={() => onPageChange(item - 1)}
            >
              {item}
            </button>
          )
        ))}
      </div>
      <button
        type="button"
        className={styles.navText}
        disabled={page >= pages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
      </button>
    </div>
  )
}
