import { UiAlert, UiPagination } from '@/shared/ui'
import AdminReportsTable from './AdminReportsTable'
import useAdminReports from './useAdminReports'
import styles from './AdminReports.module.css'

export default function AdminReports() {
  const reports = useAdminReports()

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Жалобы на объявления</h2>
      {reports.error ? <UiAlert>{reports.error}</UiAlert> : null}
      {reports.loading ? (
        <p className={styles.muted}>Загрузка…</p>
      ) : reports.data?.content?.length === 0 ? (
        <p className={styles.muted}>Нет жалоб</p>
      ) : (
        <AdminReportsTable
          rows={reports.data?.content || []}
          notifyingId={reports.notifyingId}
          onNotify={reports.notifySeller}
          footer={
            <UiPagination
              page={reports.page}
              size={reports.size}
              totalElements={reports.data?.totalElements}
              totalPages={reports.data?.totalPages}
              onPageChange={reports.setPage}
              onSizeChange={reports.setSize}
            />
          }
        />
      )}
    </div>
  )
}
