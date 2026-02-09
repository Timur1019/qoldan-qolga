/**
 * SellerProfile — публичный профиль пользователя (/users/:id). Виден всем.
 *
 * Показывает только публичную информацию:
 * - Данные пользователя (имя, аватар, статистика)
 * - Его объявления (активные/архив)
 * - Отзывы О НЁМ от других пользователей (reviewsData = GET /users/:id/reviews)
 *
 * Кнопки по роли:
 * - Владелец (id === currentUser.id): «Редактировать», «Мои отзывы» → /dashboard/reviews, «Поделиться»
 * - Гость: «Подписаться», «Оставить отзыв» (модалка)
 *
 * Приватная страница «Мои отзывы» (отзывы, которые я оставил) — отдельно: /dashboard/reviews.
 */
import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { usersApi } from '../../api/client'
import { useFavoriteClick } from '../../hooks'
import SellerProfileSidebar from './SellerProfileSidebar'
import SellerAdsSection from './SellerAdsSection'
import SellerReviewsSection from './SellerReviewsSection'
import ReviewModal from './ReviewModal'
import CTABlock from './CTABlock'
import styles from './SellerProfile.module.css'

const STATUS_ACTIVE = 'ACTIVE'

export default function SellerProfile() {
  const { id } = useParams()
  const { t } = useLang()
  const { isAuthenticated, user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [profile, setProfile] = useState(null)
  const [adsData, setAdsData] = useState({ content: [], totalElements: 0 })
  const [reviewsData, setReviewsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [activeTab, setActiveTab] = useState('active')

  const openAuthModal = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('auth', 'login')
      return next
    }, { replace: true })
  }

  const updateAdFavorite = (adId, favorite) => {
    setAdsData((prev) => ({
      ...prev,
      content: prev.content.map((a) => (a.id === adId ? { ...a, favorite } : a)),
    }))
  }
  const handleFavoriteClick = useFavoriteClick(updateAdFavorite)

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    if (id != null && user?.id != null && String(id) === String(user.id)) return
    usersApi
      .toggleSubscribe(id)
      .then((subscribed) => {
        setProfile((prev) => (prev ? { ...prev, subscribed } : null))
      })
      .catch((err) => {
        if (err?.message?.includes('401') || err?.message?.includes('авторизац')) openAuthModal()
      })
  }

  const loadProfile = useCallback(() => {
    if (!id) return
    setLoading(true)
    setError('')
    Promise.all([
      usersApi.getProfile(id),
      usersApi.getAds(id, { size: 50 }),
      usersApi.getReviews(id, { size: 10 }).catch(() => null),
    ])
      .then(([profileData, adsResult, reviewsResult]) => {
        setProfile(profileData)
        setAdsData(adsResult ?? { content: [], totalElements: 0 })
        setReviewsData(reviewsResult ?? null)
      })
      .catch((e) => setError(e?.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (id && isAuthenticated && user?.id && String(id) === String(user.id)) {
      const onProfileUpdated = () => loadProfile()
      window.addEventListener('profile-updated', onProfileUpdated)
      return () => window.removeEventListener('profile-updated', onProfileUpdated)
    }
  }, [id, isAuthenticated, user?.id, loadProfile])

  const handleLeaveReviewClick = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    if (id != null && user?.id != null && String(id) === String(user.id)) return
    setReviewModalOpen(true)
    setReviewError('')
  }

  const handleReviewSubmit = ({ rating, text }) => {
    setReviewSubmitting(true)
    setReviewError('')
    usersApi
      .createReview(id, { rating, text: text || null })
      .then(() => {
        setReviewModalOpen(false)
        return usersApi.getReviews(id, { size: 10 })
      })
      .then(setReviewsData)
      .catch((e) => setReviewError(e.message || t('common.error')))
      .finally(() => setReviewSubmitting(false))
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || t('ads.noAds')}</p>
        <Link to="/">{t('common.back')}</Link>
      </div>
    )
  }

  const ads = adsData.content || []
  const isOwner = isAuthenticated && id != null && user?.id != null && String(id) === String(user.id)
  const canSubscribe = isAuthenticated && !isOwner
  const canLeaveReview = isAuthenticated && !isOwner
  const avgRating = reviewsData?.averageRating ?? 0
  const totalReviews = reviewsData?.totalCount ?? 0
  const activeCount = ads.filter((a) => a.status === STATUS_ACTIVE).length
  const archiveCount = ads.filter((a) => a.status !== STATUS_ACTIVE).length
  const showCTA = isOwner && totalReviews < 3

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <SellerProfileSidebar
          profile={profile}
          avatarKey={isOwner ? (user?.avatar ?? profile?.avatar) : (profile?.avatar ?? null)}
          isOwner={isOwner}
          canSubscribe={canSubscribe}
          canLeaveReview={canLeaveReview}
          avgRating={avgRating}
          totalReviews={totalReviews}
          idVerified={false}
          onSubscribe={handleSubscribe}
          onLeaveReview={handleLeaveReviewClick}
        />

        <main className={styles.main}>
          <SellerAdsSection
            ads={ads}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeCount={activeCount}
            archiveCount={archiveCount}
            isAuthenticated={isAuthenticated}
            sellerId={id}
            currentUserId={user?.id}
            onFavoriteClick={handleFavoriteClick}
            getFavoriteAriaLabel={(ad) =>
              ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')
            }
          />
          <SellerReviewsSection
            reviewsData={reviewsData}
            canLeaveReview={canLeaveReview}
            onLeaveReview={handleLeaveReviewClick}
            isOwner={isOwner}
          />
          {showCTA && <CTABlock />}
        </main>
      </div>

      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        submitting={reviewSubmitting}
        error={reviewError}
      />
    </div>
  )
}
