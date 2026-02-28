import { useState, useEffect } from 'react'
import { adminApi, imageUrl } from '../../api/client'
import styles from './AdminBusinessApplications.module.css'

const STATUS_LABELS = {
  PENDING: 'На рассмотрении',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена',
}

export default function AdminBusinessApplications() {
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailId, setDetailId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [actionId, setActionId] = useState(null)

  const size = 20

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = { page, size, sort: 'createdAt,desc' }
    if (statusFilter) params.status = statusFilter
    adminApi
      .getBusinessApplications(params)
      .then(setData)
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  useEffect(() => {
    if (!detailId) {
      setDetail(null)
      return
    }
    adminApi
      .getBusinessApplication(detailId)
      .then(setDetail)
      .catch(() => setDetail(null))
  }, [detailId])

  const handleApprove = (id) => {
    setActionId(id)
    adminApi
      .approveBusinessApplication(id)
      .then(() => {
        setData((prev) => {
          if (!prev?.content) return prev
          return {
            ...prev,
            content: prev.content.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a)),
          }
        })
        if (detailId === id) setDetail((d) => (d ? { ...d, status: 'APPROVED' } : d))
        setDetailId(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setActionId(null))
  }

  const handleReject = (id) => {
    setActionId(id)
    adminApi
      .rejectBusinessApplication(id)
      .then(() => {
        setData((prev) => {
          if (!prev?.content) return prev
          return {
            ...prev,
            content: prev.content.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a)),
          }
        })
        if (detailId === id) setDetail((d) => (d ? { ...d, status: 'REJECTED' } : d))
        setDetailId(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setActionId(null))
  }

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—')

  const docUrl = (path) => (path ? imageUrl(path) : '')

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Заявки на статус «Магазин»</h2>
      <div className={styles.filters}>
        <label className={styles.filterLabel}>
          Статус:
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
            className={styles.select}
          >
            <option value="">Все</option>
            <option value="PENDING">На рассмотрении</option>
            <option value="APPROVED">Одобрены</option>
            <option value="REJECTED">Отклонённые</option>
          </select>
        </label>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? (
        <p className={styles.muted}>Загрузка…</p>
      ) : data?.content?.length === 0 ? (
        <p className={styles.muted}>Нет заявок</p>
      ) : (
        <>
          <div className={styles.tableWrap}>
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
                {data?.content?.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.date}>{formatDate(row.createdAt)}</td>
                    <td>{row.fullName || '—'}</td>
                    <td>{row.shopName || '—'}</td>
                    <td>
                      {row.phone && <span>{row.phone}</span>}
                      {row.userId && (
                        <span className={styles.userId}> user: {row.userId}</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          row.status === 'APPROVED'
                            ? styles.badgeOk
                            : row.status === 'REJECTED'
                              ? styles.badgeReject
                              : styles.badgePending
                        }
                      >
                        {STATUS_LABELS[row.status] ?? row.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.btnSmall}
                        onClick={() => setDetailId(row.id)}
                      >
                        Подробнее
                      </button>
                      {row.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            className={styles.btnApprove}
                            onClick={() => handleApprove(row.id)}
                            disabled={actionId !== null}
                          >
                            {actionId === row.id ? '…' : 'Подтвердить'}
                          </button>
                          <button
                            type="button"
                            className={styles.btnReject}
                            onClick={() => handleReject(row.id)}
                            disabled={actionId !== null}
                          >
                            {actionId === row.id ? '…' : 'Отклонить'}
                          </button>
                        </>
                      )}
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

      {detail && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <div className={styles.modalBackdrop} onClick={() => setDetailId(null)} />
          <div className={styles.modalContent}>
            <h3 id="detail-title" className={styles.modalTitle}>
              Заявка: {detail.shopName}
            </h3>
            <div className={styles.detailGrid}>
              <p><strong>ФИО:</strong> {detail.fullName}</p>
              <p><strong>Магазин:</strong> {detail.shopName}</p>
              <p><strong>Тип:</strong> {detail.businessType}</p>
              <p><strong>Город:</strong> {detail.city}</p>
              <p><strong>Категория товаров:</strong> {detail.productCategory}</p>
              <p><strong>Телефон:</strong> {detail.phone}</p>
              {detail.shopUrl && <p><strong>Сайт/соцсеть:</strong> <a href={detail.shopUrl} target="_blank" rel="noopener noreferrer">{detail.shopUrl}</a></p>}
              <p><strong>Статус:</strong> {STATUS_LABELS[detail.status] ?? detail.status}</p>
              <p><strong>Дата:</strong> {formatDate(detail.createdAt)}</p>
            </div>
            <div className={styles.docLinks}>
              <p><strong>Документы:</strong></p>
              {detail.passportUrl && (
                <a href={docUrl(detail.passportUrl)} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  Паспорт
                </a>
              )}
              {detail.registrationCertificateUrl && (
                <a href={docUrl(detail.registrationCertificateUrl)} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  Свидетельство о регистрации
                </a>
              )}
            </div>
            {detail.status === 'PENDING' && (
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnApprove}
                  onClick={() => handleApprove(detail.id)}
                  disabled={actionId !== null}
                >
                  {actionId === detail.id ? '…' : 'Подтвердить'}
                </button>
                <button
                  type="button"
                  className={styles.btnReject}
                  onClick={() => handleReject(detail.id)}
                  disabled={actionId !== null}
                >
                  {actionId === detail.id ? '…' : 'Отклонить'}
                </button>
              </div>
            )}
            <button type="button" className={styles.modalClose} onClick={() => setDetailId(null)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
