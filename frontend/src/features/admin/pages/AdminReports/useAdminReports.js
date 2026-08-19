import { useState, useEffect } from 'react'
import { adminApi } from '@/api/admin'
import { DEFAULT_PAGE_SIZE } from '@/shared/ui/UiPagination/pageSizeOptions'

export default function useAdminReports() {
  const [page, setPage] = useState(0)
  const [size, setSizeState] = useState(DEFAULT_PAGE_SIZE)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notifyingId, setNotifyingId] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    adminApi
      .getReports({ page, size, sort: 'createdAt,desc' })
      .then(setData)
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [page, size])

  const setSize = (next) => {
    setSizeState(next)
    setPage(0)
  }

  const notifySeller = (report) => {
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

  return {
    page,
    setPage,
    size,
    setSize,
    data,
    loading,
    error,
    notifyingId,
    notifySeller,
  }
}
