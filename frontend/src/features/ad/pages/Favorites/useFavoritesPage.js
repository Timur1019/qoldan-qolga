import { useState, useEffect, useCallback } from 'react'
import { adsApi, favoritesApi } from '@/api/ads'
import { usersApi } from '@/api/users'

const PAGE_SIZE = 80
const REC_SIZE = 12

/**
 * Загрузка и действия страницы избранного.
 * Снятие ♥ — объявление уходит вниз (рекомендации), а не пропадает.
 */
export function useFavoritesPage() {
  const [activeTab, setActiveTab] = useState('ads')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const [recommended, setRecommended] = useState([])
  const [profiles, setProfiles] = useState([])
  const [profilesLoading, setProfilesLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    Promise.all([
      favoritesApi.list({ page: 0, size: PAGE_SIZE }).catch((e) => {
        setError(e.message)
        return { content: [] }
      }),
      adsApi.list({ page: 0, size: REC_SIZE }).catch(() => ({ content: [] })),
    ])
      .then(([favRes, recRes]) => {
        const fav = favRes || { content: [] }
        const favItems = fav.content || []
        setItems(favItems)
        const currentPage = typeof fav.number === 'number' ? fav.number : 0
        const totalPages = typeof fav.totalPages === 'number' ? fav.totalPages : 1
        const isLast = typeof fav.last === 'boolean' ? fav.last : currentPage + 1 >= totalPages
        setPage(currentPage)
        setLastPage(isLast)

        const favIds = new Set(favItems.map((a) => a.id))
        const rec = (recRes?.content || [])
          .filter((a) => a?.id && !favIds.has(a.id))
          .map((a) => ({ ...a, favorite: false }))
        setRecommended(rec)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (activeTab !== 'profiles') return
    setProfilesLoading(true)
    usersApi
      .getMySubscriptions()
      .then((list) => setProfiles(Array.isArray(list) ? list : []))
      .catch(() => setProfiles([]))
      .finally(() => setProfilesLoading(false))
  }, [activeTab])

  const loadMore = () => {
    if (lastPage || loadingMore) return
    const nextPage = page + 1
    setLoadingMore(true)
    favoritesApi
      .list({ page: nextPage, size: PAGE_SIZE })
      .then((res) => {
        const content = res?.content || []
        setItems((prev) => [...prev, ...content])
        const currentPage = typeof res.number === 'number' ? res.number : nextPage
        const totalPages = typeof res.totalPages === 'number' ? res.totalPages : currentPage + 1
        const isLast = typeof res.last === 'boolean' ? res.last : currentPage + 1 >= totalPages
        setPage(currentPage)
        setLastPage(isLast)
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false))
  }

  const handleRemoveFavorite = (e, ad) => {
    e.preventDefault()
    e.stopPropagation()
    adsApi
      .removeFavorite(ad.id)
      .then(() => {
        setItems((prev) => prev.filter((a) => a.id !== ad.id))
        setRecommended((prev) => {
          const without = prev.filter((a) => a.id !== ad.id)
          return [{ ...ad, favorite: false }, ...without]
        })
        window.dispatchEvent(new CustomEvent('favorites-count-refresh'))
      })
      .catch(() => {})
  }

  const handleAddFavorite = (e, ad) => {
    e.preventDefault()
    e.stopPropagation()
    adsApi
      .addFavorite(ad.id)
      .then(() => {
        setRecommended((prev) => prev.filter((a) => a.id !== ad.id))
        setItems((prev) => {
          if (prev.some((a) => a.id === ad.id)) return prev
          return [{ ...ad, favorite: true }, ...prev]
        })
        window.dispatchEvent(new CustomEvent('favorites-count-refresh'))
      })
      .catch(() => {})
  }

  const handleUnsubscribe = (e, profileId) => {
    e.preventDefault()
    e.stopPropagation()
    usersApi
      .unsubscribe(profileId)
      .then(() => {
        setProfiles((prev) => prev.filter((p) => p.id !== profileId && String(p.id) !== String(profileId)))
      })
      .catch(() => {})
  }

  return {
    activeTab,
    setActiveTab,
    items,
    recommended,
    profiles,
    profilesLoading,
    loading,
    loadingMore,
    lastPage,
    error,
    loadMore,
    handleRemoveFavorite,
    handleAddFavorite,
    handleUnsubscribe,
  }
}
