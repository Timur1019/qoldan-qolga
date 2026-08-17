import UiButton from '../UiButton/UiButton'
import styles from './UiPagination.module.css'

export default function UiPagination({
  page,
  totalPages,
  onPageChange,
  prevLabel = 'Назад',
  nextLabel = 'Вперёд',
}) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className={styles.bar}>
      <UiButton
        variant="outline"
        size="sm"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
      >
        {prevLabel}
      </UiButton>
      <span className={styles.info}>
        {page + 1} / {totalPages}
      </span>
      <UiButton
        variant="outline"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
      </UiButton>
    </div>
  )
}
