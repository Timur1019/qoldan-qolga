import { imageUrl } from '@/api/client'
import { UiAlert, UiPagination, UiSelect } from '@/shared/ui'
import AdminApplicationDetail from './AdminApplicationDetail'
import AdminBusinessApplicationsTable from './AdminBusinessApplicationsTable'
import useAdminBusinessApplications from './useAdminBusinessApplications'
import styles from './AdminBusinessApplications.module.css'

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleString() : '—'
}

export default function AdminBusinessApplications() {
  const apps = useAdminBusinessApplications()
  const docUrl = (path) => (path ? imageUrl(path) : '')

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Заявки на статус «Магазин»</h2>
      <div className={styles.filters}>
        <UiSelect value={apps.statusFilter} onChange={(e) => apps.setStatusFilter(e.target.value)}>
          <option value="">Все статусы</option>
          <option value="PENDING">На рассмотрении</option>
          <option value="APPROVED">Одобрены</option>
          <option value="REJECTED">Отклонённые</option>
        </UiSelect>
      </div>
      {apps.error ? <UiAlert>{apps.error}</UiAlert> : null}
      {apps.loading ? (
        <p className={styles.muted}>Загрузка…</p>
      ) : apps.data?.content?.length === 0 ? (
        <p className={styles.muted}>Нет заявок</p>
      ) : (
        <AdminBusinessApplicationsTable
          rows={apps.data?.content || []}
          actionId={apps.actionId}
          onOpen={apps.setDetailId}
          onApprove={apps.approve}
          onReject={apps.reject}
          footer={
            <UiPagination
              page={apps.page}
              size={apps.size}
              totalElements={apps.data?.totalElements}
              totalPages={apps.data?.totalPages}
              onPageChange={apps.setPage}
              onSizeChange={apps.setSize}
            />
          }
        />
      )}
      <AdminApplicationDetail
        detail={apps.detail}
        actionId={apps.actionId}
        docUrl={docUrl}
        formatDate={formatDate}
        onClose={() => apps.setDetailId(null)}
        onApprove={apps.approve}
        onReject={apps.reject}
      />
    </div>
  )
}
