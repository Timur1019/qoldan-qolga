import { PAGE_SIZE_OPTIONS } from './pageSizeOptions'
import { formatRecordsRange } from './formatRecordsRange'
import styles from './UiPagination.module.css'

export default function UiPaginationMeta({
  page,
  size,
  totalElements,
  onSizeChange,
  rangeTemplate,
  sizeLabel,
  pageSizes = PAGE_SIZE_OPTIONS,
}) {
  return (
    <div className={styles.meta}>
      <span className={styles.range}>
        {formatRecordsRange(rangeTemplate, page, size, totalElements)}
      </span>
      <label className={styles.sizeWrap}>
        <span className={styles.sizeLabel}>{sizeLabel}</span>
        <select
          className={styles.size}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
        >
          {pageSizes.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
