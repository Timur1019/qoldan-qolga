import { Link } from 'react-router-dom'
import { UiButton } from '@/shared/ui'
import styles from './AdminReports.module.css'

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleString() : '—'
}

export default function AdminReportsTable({ rows, notifyingId, onNotify, footer }) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Объявление</th>
            <th>Продавец</th>
            <th>Жалобщик</th>
            <th>Причина</th>
            <th>Комментарий</th>
            <th>Дата</th>
            <th>Уведомлён</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <Link to={`/ads/${r.adId}`} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {r.adTitle || r.adId}
                </Link>
              </td>
              <td>
                {r.ownerId ? (
                  <Link to={`/users/${r.ownerId}`} className={styles.link}>
                    {r.ownerDisplayName || r.ownerId}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
              <td>{r.reporterDisplayName || r.reporterId}</td>
              <td className={styles.reason}>{r.reason}</td>
              <td className={styles.comment}>{r.comment || '—'}</td>
              <td className={styles.date}>{formatDate(r.createdAt)}</td>
              <td>
                {r.sellerNotifiedAt ? (
                  <span className={styles.badgeOk}>✓ {formatDate(r.sellerNotifiedAt)}</span>
                ) : (
                  '—'
                )}
              </td>
              <td>
                <UiButton
                  variant="outline"
                  size="sm"
                  onClick={() => onNotify(r)}
                  disabled={!!r.sellerNotifiedAt || notifyingId === r.id}
                  title="Уведомить продавца о жалобе"
                >
                  {notifyingId === r.id ? '…' : r.sellerNotifiedAt ? 'Уведомлён' : 'Уведомить продавца'}
                </UiButton>
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
