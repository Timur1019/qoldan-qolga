import { useState, useEffect } from 'react'
import { imageUrl } from '@/api/client'
import { adminApi } from '@/api/admin'
import { UiAlert, UiButton, UiPagination, UiSelect } from '@/shared/ui'
import AdminApplicationDetail from './AdminApplicationDetail'
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
        <UiSelect
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(0)
          }}
        >
          <option value="">Все статусы</option>
          <option value="PENDING">На рассмотрении</option>
          <option value="APPROVED">Одобрены</option>
          <option value="REJECTED">Отклонённые</option>
        </UiSelect>
      </div>
      {error ? <UiAlert>{error}</UiAlert> : null}
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
                      <UiButton variant="outline" size="sm" onClick={() => setDetailId(row.id)}>
                        Подробнее
                      </UiButton>
                      {row.status === 'PENDING' && (
                        <>
                          <UiButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(row.id)}
                            disabled={actionId !== null}
                          >
                            {actionId === row.id ? '…' : 'Подтвердить'}
                          </UiButton>
                          <UiButton
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(row.id)}
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
          <UiPagination page={page} totalPages={data?.totalPages} onPageChange={setPage} />
        </>
      )}

      <AdminApplicationDetail
        detail={detail}
        actionId={actionId}
        docUrl={docUrl}
        formatDate={formatDate}
        onClose={() => setDetailId(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
