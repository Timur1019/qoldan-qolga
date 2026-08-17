import { useEffect, useState } from 'react'
import { adsApi } from '@/api/ads'
import { useLang } from '../../../../context/LangContext'

/**
 * Загрузка тарифов + создание заказа и редирект на оплату.
 */
export default function usePromoCheckout(ad) {
  const { t, lang } = useLang()
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [selectedCode, setSelectedCode] = useState(null)
  const [provider, setProvider] = useState('PAYME')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoadingPlans(true)
    adsApi
      .getPromoServices()
      .then((list) => {
        if (cancelled) return
        const items = Array.isArray(list) ? list : []
        setPlans(items)
        if (items.length > 0) {
          setSelectedCode(items[0].code)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || t('common.error'))
      })
      .finally(() => {
        if (!cancelled) setLoadingPlans(false)
      })
    return () => {
      cancelled = true
    }
  }, [t])

  const submit = async () => {
    if (!ad?.id) return
    if (!selectedCode) {
      setError(t('ads.promoSelectServiceWarning'))
      return
    }
    if (!provider) {
      setError(t('ads.promoSelectProviderWarning'))
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const order = await adsApi.createPromoOrder(ad.id, {
        serviceCode: selectedCode,
        provider,
      })
      if (order?.paymentUrl) {
        window.location.href = order.paymentUrl
        return
      }
      setError(t('ads.promoPaymentUrlMissing'))
    } catch (e) {
      setError(e.message || t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const isUz = lang === 'uz'

  return {
    plans,
    loadingPlans,
    selectedCode,
    setSelectedCode,
    provider,
    setProvider,
    submitting,
    error,
    setError,
    submit,
    isUz,
  }
}
