import { useState, useEffect } from 'react'
import { currencyApi } from '@/api/currency'
import { referenceApi } from '@/api/reference'
import { usersApi } from '@/api/users'

export default function useAdDetailExtras(ad, user, isAuthenticated, lang) {
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [askText, setAskText] = useState('')
  const [sellerSubscribed, setSellerSubscribed] = useState(null)
  const [phoneRevealed, setPhoneRevealed] = useState(false)
  const [categoryName, setCategoryName] = useState(null)
  const [usdToUzs, setUsdToUzs] = useState(12800)

  useEffect(() => {
    currencyApi
      .getRate()
      .then((rate) => {
        const value = Number(rate?.usdToUzs)
        if (value > 0) setUsdToUzs(value)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!ad?.userId || ad.userId === user?.id || !isAuthenticated) return
    usersApi.getProfile(ad.userId).then((p) => setSellerSubscribed(p.subscribed ?? false)).catch(() => setSellerSubscribed(false))
  }, [ad?.userId, user?.id, isAuthenticated])

  useEffect(() => {
    if (!ad) {
      setCategoryName(null)
      return
    }
    if (ad.category) {
      referenceApi.getCategory(ad.category).then((c) => {
        if (c) setCategoryName(lang === 'ru' ? c.nameRu : c.nameUz)
        else setCategoryName(ad.category)
      }).catch(() => setCategoryName(ad.category))
    } else {
      setCategoryName(null)
    }
  }, [ad?.id, ad?.category, lang])

  return {
    reportModalOpen,
    setReportModalOpen,
    reportReason,
    setReportReason,
    reportSubmitting,
    setReportSubmitting,
    askText,
    setAskText,
    sellerSubscribed,
    setSellerSubscribed,
    phoneRevealed,
    setPhoneRevealed,
    categoryName,
    usdToUzs,
  }
}
