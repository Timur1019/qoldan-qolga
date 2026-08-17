import { useCallback, useEffect, useMemo, useState } from 'react'
import { adsApi } from '@/api/ads'
import { filterPublicAds } from '../utils/publicAds'
import { filtersToListApiParams } from './useAdsListFilters'

const PAGE_SIZE = 12

/**
 * Ads list fetch, pagination and favorite patch.
 */
export default function useAdsListData(filters) {
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0, last: true })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadedPage, setLoadedPage] = useState(0)
  const [error, setError] = useState('')

  const listQueryKey = useMemo(
    () => JSON.stringify(filtersToListApiParams({ ...filters, page: 0 }, { pageSize: PAGE_SIZE })),
    [filters],
  )

  useEffect(() => {
    const params = filtersToListApiParams({ ...filters, page: 0 }, { pageSize: PAGE_SIZE })
    const ac = new AbortController()
    setLoading(true)
    setError('')
    adsApi
      .list(params, { signal: ac.signal })
      .then((res) => {
        if (ac.signal.aborted) return
        setData({
          ...res,
          content: filterPublicAds(res?.content),
        })
        setLoadedPage(0)
      })
      .catch((e) => {
        if (ac.signal.aborted || e?.name === 'AbortError') return
        setError(e.message)
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })
    return () => ac.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listQueryKey])

  const loadMoreAds = useCallback(() => {
    if (data.last || loading || loadingMore) return
    const nextPage = loadedPage + 1
    setLoadingMore(true)
    adsApi
      .list(filtersToListApiParams({ ...filters, page: nextPage }, { pageSize: PAGE_SIZE }))
      .then((res) => {
        setData((prev) => ({
          ...res,
          content: [...(prev.content || []), ...filterPublicAds(res?.content)],
        }))
        setLoadedPage(nextPage)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingMore(false))
  }, [data.last, loading, loadingMore, loadedPage, filters])

  const updateAdFavorite = useCallback((adId, favorite) => {
    setData((prev) => ({
      ...prev,
      content: prev.content.map((a) => (a.id === adId ? { ...a, favorite } : a)),
    }))
  }, [])

  return {
    data,
    loading,
    loadingMore,
    error,
    loadMoreAds,
    updateAdFavorite,
  }
}
