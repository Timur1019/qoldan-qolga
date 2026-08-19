import { useState, useEffect } from 'react'
import { adminApi } from '@/api/admin'
import { DEFAULT_PAGE_SIZE } from '@/shared/ui/UiPagination/pageSizeOptions'

export default function useAdminBusinessApplications() {
  const [page, setPage] = useState(0)
  const [size, setSizeState] = useState(DEFAULT_PAGE_SIZE)
  const [statusFilter, setStatusFilterState] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailId, setDetailId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [actionId, setActionId] = useState(null)

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
  }, [page, size, statusFilter])

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

  const setSize = (next) => {
    setSizeState(next)
    setPage(0)
  }

  const setStatusFilter = (next) => {
    setStatusFilterState(next)
    setPage(0)
  }

  const patchRow = (id, status) => {
    setData((prev) => {
      if (!prev?.content) return prev
      return {
        ...prev,
        content: prev.content.map((a) => (a.id === id ? { ...a, status } : a)),
      }
    })
    if (detailId === id) setDetail((d) => (d ? { ...d, status } : d))
    setDetailId(null)
  }

  const approve = (id) => {
    setActionId(id)
    adminApi
      .approveBusinessApplication(id)
      .then(() => patchRow(id, 'APPROVED'))
      .catch((e) => setError(e.message))
      .finally(() => setActionId(null))
  }

  const reject = (id) => {
    setActionId(id)
    adminApi
      .rejectBusinessApplication(id)
      .then(() => patchRow(id, 'REJECTED'))
      .catch((e) => setError(e.message))
      .finally(() => setActionId(null))
  }

  return {
    page,
    setPage,
    size,
    setSize,
    statusFilter,
    setStatusFilter,
    data,
    loading,
    error,
    detailId,
    setDetailId,
    detail,
    actionId,
    approve,
    reject,
  }
}
