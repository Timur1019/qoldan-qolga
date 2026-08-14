import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useAuthModal } from '../../../hooks'
import { useLang } from '../../../context/LangContext'
import { useToast } from '../../../context/ToastContext'
import { formatPrice } from '../../../utils/formatters'
import {
  clearPriceWatch,
  isPriceWatched,
  setPriceWatch,
  syncPriceWatch,
} from '../utils/priceWatchStorage'

export function usePriceWatch(ad) {
  const { isAuthenticated, user } = useAuth()
  const openAuthModal = useAuthModal()
  const { showToast } = useToast()
  const { t } = useLang()
  const userId = user?.id
  const [watching, setWatching] = useState(false)

  useEffect(() => {
    setWatching(isAuthenticated && isPriceWatched(userId, ad?.id))
  }, [isAuthenticated, userId, ad?.id])

  useEffect(() => {
    if (!isAuthenticated || !userId || !ad?.id || !watching) return
    const change = syncPriceWatch(userId, ad)
    if (!change) return
    const amount = formatPrice(Math.abs(change.nextPrice - change.prevPrice), change.currency)
    if (change.dropped) {
      showToast(t('notify.priceWatchDropped').replace('{amount}', amount), 'success')
    } else {
      showToast(t('notify.priceWatchRose').replace('{amount}', amount), 'info')
    }
  }, [ad?.id, ad?.price, isAuthenticated, userId, watching, showToast, t])

  const toggle = useCallback(() => {
    if (!isAuthenticated || !userId) {
      openAuthModal()
      return
    }
    if (!ad?.id) return
    if (isPriceWatched(userId, ad.id)) {
      clearPriceWatch(userId, ad.id)
      setWatching(false)
      showToast(t('notify.priceWatchOff'), 'success')
      return
    }
    setPriceWatch(userId, ad)
    setWatching(true)
    showToast(t('notify.priceWatchOn'), 'success')
  }, [ad, isAuthenticated, openAuthModal, showToast, t, userId])

  return { watching, toggle }
}
