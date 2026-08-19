import { UiButton } from '@/shared/ui'
import styles from './AdminBusinessApplications.module.css'

const STATUS_LABELS = {
  PENDING: 'На рассмотрении',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена',
}

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleString() : '—'
}

function statusClass(status) {
  if (status === 'APPROVED') return styles.badgeOk
  if (status === 'REJECTED') return styles.badgeReject
  return styles.badgePending
}

export default function AdminBusinessApplicationsTable({
  rows,
  actionId,
  onOpen,
  onApprove,
  onReject,
  footer,
}) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Дата</th>
            <th>ФИО</th>
            <th>Магазин</th>
            <th>Контакты</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className={styles.date}>{formatDate(row.createdAt)}</td>
              <td>{row.fullName || '—'}</td>
              <td>{row.shopName || '—'}</td>
              <td>
                {row.phone && <span>{row.phone}</span>}
                {row.userId && <span className={styles.userId}> user: {row.userId}</span>}
              </td>
              <td>
                <span className={statusClass(row.status)}>
                  {STATUS_LABELS[row.status] ?? row.status}
                </span>
              </td>
              <td>
                <UiButton variant="outline" size="sm" onClick={() => onOpen(row.id)}>
                  Подробнее
                </UiButton>
                {row.status === 'PENDING' && (
                  <>
                    <UiButton
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove(row.id)}
                      disabled={actionId !== null}
                    >
                      {actionId === row.id ? '…' : 'Подтвердить'}
                    </UiButton>
                    <UiButton
                      variant="danger"
                      size="sm"
                      onClick={() => onReject(row.id)}
                      disabled={actionId !== null}
                    >
                      {actionId === row.id ? '…' : 'Отклонить'}
                    </UiButton>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {footer}
    </div>
  )
}
