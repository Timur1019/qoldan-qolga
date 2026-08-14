import { useState, useEffect } from 'react'
import { adsApi, usersApi } from '../../../api/client'
import { mergeAdsLists } from '../utils/mergeAdsLists'

const RELATED_LIMIT = 10

/**
 * Хук загрузки и управления данными страницы объявления.
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
    if (!ad?.id) return

    const profilePromise = ad.userId
      ? usersApi.getProfile(ad.userId).catch(() => null)
      : Promise.resolve(null)
    const reviewsPromise = ad.userId
      ? usersApi.getReviews(ad.userId, { size: 1 }).catch(() => null)
      : Promise.resolve(null)

    const sellerAdsPromise = ad.userId
      ? usersApi.getAds(ad.userId, { size: 20 }).then((data) => {
          const list = mergeAdsLists(data.content || [], [], {
            excludeIds: [ad.id],
            limit: RELATED_LIMIT,
          })
          return { content: list }
        }).catch(() => ({ content: [] }))
      : Promise.resolve({ content: [] })

    // Только та же категория — иначе «похожие» смешивают авто и квартиры.
    const similarPromise = ad.category
      ? adsApi
          .list({ category: ad.category, size: 40, sort: 'createdAt,desc' })
          .then((data) => ({
            content: mergeAdsLists(data.content || [], [], {
              excludeIds: [ad.id],
              limit: RELATED_LIMIT,
            }),
          }))
          .catch(() => ({ content: [] }))
      : Promise.resolve({ content: [] })

    Promise.all([profilePromise, reviewsPromise, sellerAdsPromise, similarPromise])
      .then(([profile, reviews, sellerAdsData, similarData]) => {
        setSellerProfile(profile)
        setReviewsSummary(reviews)
        setSellerAds(sellerAdsData)
        setSimilar(similarData)
      })
  }, [ad?.userId, ad?.id, ad?.category])

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
