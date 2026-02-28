import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/client'
import styles from './AdminReports.module.css'

export default function AdminReports() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notifyingId, setNotifyingId] = useState(null)

  const size = 20

  useEffect(() => {
    setLoading(true)
    setError('')
    adminApi
      .getReports({ page, size, sort: 'createdAt,desc' })
      .then(setData)
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [page])

  const handleNotifySeller = (report) => {
    setNotifyingId(report.id)
    adminApi
      .notifySeller(report.id)
      .then(() =>
        setData((prev) => {
          if (!prev?.content) return prev
          return {
            ...prev,
            content: prev.content.map((r) =>
              r.id === report.id ? { ...r, sellerNotifiedAt: new Date().toISOString() } : r
            ),
          }
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setNotifyingId(null))
  }

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—')

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Жалобы на объявления</h2>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.muted}>Загрузка…</p>
      ) : data?.content?.length === 0 ? (
        <p className={styles.muted}>Нет жалоб</p>
      ) : (
        <>
          <div className={styles.tableWrap}>
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
                {data?.content?.map((r) => (
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
                    <td>
                      {r.reporterDisplayName || r.reporterId}
                    </td>
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
                      <button
                        type="button"
                        className={styles.btnSmall}
                        onClick={() => handleNotifySeller(r)}
                        disabled={!!r.sellerNotifiedAt || notifyingId === r.id}
                        title="Уведомить продавца о жалобе"
                      >
                        {notifyingId === r.id ? '…' : r.sellerNotifiedAt ? 'Уведомлён' : 'Уведомить продавца'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Назад
              </button>
              <span className={styles.pageInfo}>
                {page + 1} / {data.totalPages}
              </span>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
