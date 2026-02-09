import { useState, useEffect } from 'react'
import { adsApi, usersApi } from '../../../api/client'

/**
 * Хук загрузки и управления данными страницы объявления.
 * @param {string} id — ID объявления
 * @returns {{
 *   ad: object|null,
 *   loading: boolean,
 *   error: string,
 *   sellerProfile: object|null,
 *   sellerAds: { content: array },
 *   reviewsSummary: object|null,
 *   similar: { content: array },
 *   setAd: function
 * }}
 */
export function useAdDetail(id) {
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sellerProfile, setSellerProfile] = useState(null)
  const [sellerAds, setSellerAds] = useState({ content: [] })
  const [reviewsSummary, setReviewsSummary] = useState(null)
  const [similar, setSimilar] = useState({ content: [] })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    adsApi
      .getById(id)
      .then((data) => {
        setAd(data)
        if (!adsApi.wasAdViewedInSession(id)) {
          adsApi.markAdViewedInSession(id)
          adsApi.recordView(id).then(() => {
            setAd((prev) => (prev ? { ...prev, views: (prev.views ?? 0) + 1 } : null))
          }).catch(() => {})
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!ad?.userId) return
    usersApi.getProfile(ad.userId).then((p) => setSellerProfile(p)).catch(() => setSellerProfile(null))
  }, [ad?.userId])

  useEffect(() => {
    if (!ad?.userId) return
    usersApi.getReviews(ad.userId, { size: 1 }).then((data) => setReviewsSummary(data)).catch(() => setReviewsSummary(null))
  }, [ad?.userId])

  useEffect(() => {
    if (!ad?.userId) return
    usersApi.getAds(ad.userId, { size: 9 }).then((data) => {
      const list = (data.content || []).filter((a) => a.id !== ad.id).slice(0, 8)
      setSellerAds({ content: list })
    }).catch(() => setSellerAds({ content: [] }))
  }, [ad?.userId, ad?.id])

  useEffect(() => {
    if (!ad?.category) return
    adsApi.list({ category: ad.category, size: 8 }).then((data) => {
      const list = (data.content || []).filter((a) => a.id !== ad.id).slice(0, 8)
      setSimilar({ content: list })
    }).catch(() => setSimilar({ content: [] }))
  }, [ad?.id, ad?.category])

  return {
    ad,
    loading,
    error,
    setError,
    sellerProfile,
    sellerAds,
    reviewsSummary,
    similar,
    setAd,
  }
}
