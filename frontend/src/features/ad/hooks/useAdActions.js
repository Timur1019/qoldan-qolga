import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useAuthModal } from '../../../hooks'
import { adsApi, chatApi, usersApi } from '../services/adApi'
import { ROUTES } from '../../../constants/routes'

/**
 * Хук действий на странице объявления: чат, подписка, жалоба, избранное.
 */
export function useAdActions(ad, user, { setAd, setError }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const openAuthModal = useAuthModal()
  const [chatGoing, setChatGoing] = useState(false)

  const handleWriteSeller = useCallback((initialText) => {
    if (!isAuthenticated) return openAuthModal()
    if (!ad || ad.userId === user?.id) return
    setChatGoing(true)
    chatApi
      .getOrCreateConversation(ad.id)
      .then((conv) => {
        navigate(`${ROUTES.CHAT}?conversation=${encodeURIComponent(conv.id)}${initialText ? `&initial=${encodeURIComponent(initialText)}` : ''}`)
      })
      .catch(() => setChatGoing(false))
  }, [ad, user?.id, isAuthenticated, openAuthModal, navigate])

  /** Отправить сообщение продавцу со страницы объявления без перехода в чат */
  const handleSendFromAsk = useCallback((text) => {
    const trimmed = (text || '').trim()
    if (!trimmed) return
    if (!isAuthenticated) return openAuthModal()
    if (!ad || ad.userId === user?.id) return
    setChatGoing(true)
    chatApi
      .getOrCreateConversation(ad.id)
      .then((conv) => chatApi.sendMessage(conv.id, trimmed))
      .finally(() => setChatGoing(false))
  }, [ad, user?.id, isAuthenticated, openAuthModal])

  const handleSubscribe = useCallback((onSubscribed) => {
    if (!isAuthenticated) return openAuthModal()
    if (!ad || ad.userId === user?.id) return
    usersApi
      .toggleSubscribe(ad.userId)
      .then((subscribed) => onSubscribed?.(subscribed))
      .catch((err) => {
        if (err?.message?.includes('401') || err?.message?.includes('авторизац')) openAuthModal()
      })
  }, [ad, user?.id, isAuthenticated, openAuthModal])

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
      })
      .catch((err) => {
        const msg = err.message || ''
        if (msg.includes('401') || msg.includes('403') || msg.includes('Ошибка запроса') || msg.includes('авторизац') || msg.includes('Forbidden')) {
          openAuthModal()
        }
      })
  }, [ad, isAuthenticated, openAuthModal, setAd])

  const submitReport = useCallback((adId, reason) => {
    return adsApi.report(adId, { reason }).catch((e) => setError?.(e.message))
  }, [setError])

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
