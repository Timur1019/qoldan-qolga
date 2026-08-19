import { Link } from 'react-router-dom'
import { formatAdminDate } from '../../utils/formatAdminDate'
import styles from './AdminStatsTable.module.css'

export default function AdminStatsAdsTable({ rows, lang, t, footer }) {
  if (!rows?.length) {
    return <p className={styles.empty}>{t('adminPanel.tableEmpty')}</p>
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('adminPanel.colAdTitle')}</th>
            <th>{t('adminPanel.colSeller')}</th>
            <th>{t('adminPanel.colCategory')}</th>
            <th>{t('adminPanel.colStatus')}</th>
            <th>{t('adminPanel.colCreated')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((ad) => (
            <tr key={ad.id}>
              <td>
                <Link to={`/ads/${ad.id}`} className={styles.link}>{ad.title || '—'}</Link>
              </td>
              <td>
                {ad.userId ? (
                  <Link to={`/users/${ad.userId}`} className={styles.link}>{ad.userDisplayName || '—'}</Link>
                ) : (ad.userDisplayName || '—')}
              </td>
              <td>{ad.category || '—'}</td>
              <td>{ad.status || '—'}</td>
              <td>{formatAdminDate(ad.createdAt, lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {footer}
    </div>
  )
}
