import { Link } from 'react-router-dom'
import { formatAdminDate } from '../../utils/formatAdminDate'
import styles from './AdminStatsTable.module.css'

export default function AdminStatsUsersTable({ rows, lang, t, footer }) {
  if (!rows?.length) {
    return <p className={styles.empty}>{t('adminPanel.tableEmpty')}</p>
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('adminPanel.colName')}</th>
            <th>Email</th>
            <th>{t('adminPanel.colPhone')}</th>
            <th>{t('adminPanel.colRole')}</th>
            <th>{t('adminPanel.colCreated')}</th>
            <th>{t('adminPanel.colLastSeen')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`} className={styles.link}>{u.displayName || '—'}</Link>
              </td>
              <td>{u.email || '—'}</td>
              <td>{u.phone || '—'}</td>
              <td>{u.role || 'USER'}</td>
              <td>{formatAdminDate(u.createdAt, lang)}</td>
              <td>{formatAdminDate(u.lastSeenAt, lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {footer}
    </div>
  )
}
