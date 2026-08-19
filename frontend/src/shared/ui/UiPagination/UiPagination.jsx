import { useLang } from '@/context/LangContext'
import { DEFAULT_PAGE_SIZE } from './pageSizeOptions'
import UiPaginationMeta from './UiPaginationMeta'
import UiPaginationNav from './UiPaginationNav'
import styles from './UiPagination.module.css'

export default function UiPagination({
  page = 0,
  size = DEFAULT_PAGE_SIZE,
  totalElements = 0,
  totalPages = 0,
  onPageChange,
  onSizeChange,
}) {
  const { t } = useLang()
  if (!totalElements) return null

  return (
    <div className={styles.bar}>
      <UiPaginationMeta
        page={page}
        size={size}
        totalElements={totalElements}
        onSizeChange={onSizeChange}
        rangeTemplate={t('pagination.recordsRange')}
        sizeLabel={t('pagination.pageSize')}
      />
      <UiPaginationNav
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        prevLabel={t('pagination.prev')}
        nextLabel={t('pagination.next')}
      />
    </div>
  )
}
