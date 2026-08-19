import { useEffect, useState } from 'react'
import { adminApi } from '@/api/admin'
import { STAT_CARDS } from './statCards'
import { DEFAULT_PAGE_SIZE } from '@/shared/ui/UiPagination/pageSizeOptions'

const AD_KEYS = new Set(STAT_CARDS.filter((c) => c.kind === 'ads').map((c) => c.key))

export default function useAdminStats() {
  const [summary, setSummary] = useState(null)
  const [summaryError, setSummaryError] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [filter, setFilterState] = useState('activeToday')
  const [page, setPage] = useState(0)
  const [size, setSizeState] = useState(DEFAULT_PAGE_SIZE)
  const [table, setTable] = useState(null)
  const [tableLoading, setTableLoading] = useState(true)
  const [tableError, setTableError] = useState('')

  useEffect(() => {
    setSummaryLoading(true)
    adminApi
      .dashboard()
      .then(setSummary)
      .catch((e) => setSummaryError(e.message))
      .finally(() => setSummaryLoading(false))
  }, [])

  useEffect(() => {
    setTableLoading(true)
    setTableError('')
    const request = AD_KEYS.has(filter)
      ? adminApi.getStatsAds({ filter, page, size, sort: 'createdAt,desc' })
      : adminApi.getStatsUsers({ filter, page, size, sort: 'createdAt,desc' })
    request
      .then(setTable)
      .catch((e) => setTableError(e.message))
      .finally(() => setTableLoading(false))
  }, [filter, page, size])

  const setFilter = (next) => {
    setFilterState(next)
    setPage(0)
  }

  const setSize = (next) => {
    setSizeState(next)
    setPage(0)
  }

  return {
    summary,
    summaryError,
    summaryLoading,
    filter,
    setFilter,
    isAds: AD_KEYS.has(filter),
    page,
    setPage,
    size,
    setSize,
    table,
    tableLoading,
    tableError,
  }
}
