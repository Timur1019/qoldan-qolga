import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useAuthModal } from '../../../hooks'
import { useToast } from '../../../context/ToastContext'
import { useLang } from '../../../context/LangContext'
import { adsApi } from '@/api/ads'
import { chatApi } from '@/api/chat'
import { usersApi } from '@/api/users'
import { isAuthError } from '@/api/client'
import { ROUTES } from '../../../constants/routes'
import { setPendingChat, takePendingChat } from '../utils/pendingChat'

/**
 * Хук действий на странице объявления: чат, подписка, жалоба, избранное.
 */
export function useAdActions(ad, user, { setAd, setError }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const openAuthModal = useAuthModal()
  const { t } = useLang()
  const { showToast } = useToast()
  const [chatGoing, setChatGoing] = useState(false)

  const openConversation = useCallback((adId, initialText) => {
    setChatGoing(true)
    chatApi
      .getOrCreateConversation(adId)
      .then(async (conv) => {
        if (initialText) {
          await chatApi.sendMessage(conv.id, initialText)
        }
        navigate(`${ROUTES.CHAT}?conversation=${encodeURIComponent(conv.id)}`)
      })
      .catch(() => setChatGoing(false))
  }, [navigate])

  useEffect(() => {
    if (!isAuthenticated || !ad?.id || ad.userId === user?.id) return
    const pending = takePendingChat()
    if (!pending?.adId) return
    if (pending.adId !== ad.id) {
      setPendingChat(pending)
      return
    }
    openConversation(ad.id, pending.text)
  }, [ad?.id, ad?.userId, isAuthenticated, openConversation, user?.id])

  const handleWriteSeller = useCallback((initialText) => {
    if (!isAuthenticated) {
      if (ad?.id) setPendingChat({ adId: ad.id, text: initialText || '' })
      return openAuthModal()
    }
    if (!ad || ad.userId === user?.id) return
    openConversation(ad.id, initialText)
  }, [ad, user?.id, isAuthenticated, openAuthModal, openConversation])

  const handleSendFromAsk = useCallback((text) => {
    const trimmed = (text || '').trim()
    if (!trimmed) return
    if (!isAuthenticated) {
      if (ad?.id) setPendingChat({ adId: ad.id, text: trimmed })
      return openAuthModal()
    }
    if (!ad || ad.userId === user?.id) return
    setChatGoing(true)
    chatApi
      .getOrCreateConversation(ad.id)
      .then((conv) => chatApi.sendMessage(conv.id, trimmed))
      .then(() => showToast(t('notify.messageSent'), 'success'))
      .finally(() => setChatGoing(false))
  }, [ad, user?.id, isAuthenticated, openAuthModal, showToast, t])

  const handleSubscribe = useCallback((onSubscribed) => {
    if (!isAuthenticated) return openAuthModal()
    if (!ad || ad.userId === user?.id) return
    usersApi
      .toggleSubscribe(ad.userId)
      .then((subscribed) => {
        onSubscribed?.(subscribed)
        showToast(subscribed ? t('notify.subscribed') : t('notify.unsubscribed'), 'success')
      })
      .catch((err) => {
        if (isAuthError(err)) openAuthModal()
      })
  }, [ad, user?.id, isAuthenticated, openAuthModal, showToast, t])

  const handleReport = useCallback(() => {
    if (!isAuthenticated) return openAuthModal()
    if (!ad || ad.userId === user?.id) return
    return true
  }, [ad, user?.id, isAuthenticated, openAuthModal])

  const handleFavorite = useCallback(() => {
    if (!isAuthenticated) return openAuthModal()
    if (!ad) return
    adsApi.toggleFavorite(ad.id)
      .then((nowFavorite) => {
        setAd?.((prev) => (prev ? { ...prev, favorite: nowFavorite } : null))
        window.dispatchEvent(new CustomEvent('favorites-count-refresh'))
        showToast(nowFavorite ? t('notify.favoriteAdded') : t('notify.favoriteRemoved'), 'success')
      })
      .catch((err) => {
        if (isAuthError(err)) openAuthModal()
      })
  }, [ad, isAuthenticated, openAuthModal, setAd, showToast, t])

  const submitReport = useCallback((adId, reason) => {
    return adsApi.report(adId, { reason })
      .then(() => showToast(t('notify.reportSent'), 'success'))
      .catch((e) => setError?.(e.message))
  }, [setError, showToast, t])

  return {
    handleWriteSeller,
    handleSendFromAsk,
    handleSubscribe,
    handleReport,
    handleFavorite,
    submitReport,
    openAuthModal,
    isAuthenticated,
    chatGoing,
  }
}
