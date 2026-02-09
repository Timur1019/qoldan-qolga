/**
 * MyReviews — приватная страница «Мои отзывы» (/dashboard/reviews).
 * Показывает только отзывы, которые текущий пользователь оставил другим.
 * Не путать с публичным профилем: отзывы О пользователе — на /users/{id}.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { authApi } from '../../api/client'
import { sellerPath } from '../../constants/routes'
import RatingStars from '../SellerProfile/RatingStars'
import styles from './MyReviews.module.css'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function MyReviews() {
  const { user } = useAuth()
  const { t } = useLang()
  const [reviews, setReviews] = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    authApi
      .getMyReviews({ size: 50, page: 0 })
      .then((data) => {
        setReviews(data?.content ?? [])
        setTotalElements(data?.totalElements ?? 0)
      })
      .catch((e) => {
        setError(e?.message || t('common.error'))
        setReviews([])
      })
      .finally(() => setLoading(false))
  }, [user?.id, t])

  if (!user) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('profile.myReviews')}</h1>
      <p className={styles.subtitle}>{t('profile.myReviewsSubtitle')}</p>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : reviews.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>{t('profile.myReviewsEmpty')}</p>
          <Link to="/ads" className={styles.emptyLink}>{t('ads.listTitle')}</Link>
        </div>
      ) : (
        <div className={styles.reviewsWrap}>
          <p className={styles.stats}>
            {totalElements} {totalElements === 1 ? t('reviews.count') : t('reviews.countPlural')}
          </p>
          <ul className={styles.list}>
            {reviews.map((r) => (
              <li key={r.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <Link to={sellerPath(r.targetUserId)} className={styles.targetLink}>
                    {r.targetDisplayName || '—'} →
                  </Link>
                  <span className={styles.itemDate}>{formatDate(r.createdAt)}</span>
                </div>
                <div className={styles.itemStars}>
                  <RatingStars rating={r.rating || 0} />
                </div>
                {r.text && <p className={styles.itemText}>{r.text}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
