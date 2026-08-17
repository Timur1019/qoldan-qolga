import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { adsApi } from '@/api/ads'
import { useAuthModal } from './useAuthModal'
import { isAuthError } from '@/api/client'
import { useToast } from '../context/ToastContext'
import { useLang } from '../context/LangContext'

/**
 * Обработчик клика по «избранное»: переключает состояние и обновляет список через callback.
 * При неавторизованном пользователе открывает модалку входа.
 *
 * @param {function(adId: number, favorite: boolean): void} onUpdate — обновить объявление в локальном state (adId, newFavorite)
 * @returns {function(e: Event, ad: object): void} handleFavoriteClick
 */
export function useFavoriteClick(onUpdate) {
  const { isAuthenticated } = useAuth()
  const openAuthModal = useAuthModal()
  const { showToast } = useToast()
  const { t } = useLang()

  return useCallback(
    (e, ad) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isAuthenticated) {
        openAuthModal()
        return
      }
      adsApi
        .toggleFavorite(ad.id)
        .then((nowFavorite) => {
          onUpdate(ad.id, nowFavorite)
          window.dispatchEvent(new CustomEvent('favorites-count-refresh'))
          showToast(nowFavorite ? t('notify.favoriteAdded') : t('notify.favoriteRemoved'), 'success')
        })
        .catch((err) => {
          if (isAuthError(err)) openAuthModal()
        })
    },
    [isAuthenticated, openAuthModal, onUpdate, showToast, t]
  )
}
