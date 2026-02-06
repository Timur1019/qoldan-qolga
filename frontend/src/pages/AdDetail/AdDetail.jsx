import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { adsApi, imageUrl } from '../../api/client'
import styles from './AdDetail.module.css'

function HeartIcon({ filled }) {
  return (
    <svg className={filled ? styles.heartFilled : styles.heartOutline} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  return `${Number(price).toLocaleString()} ${currency}`
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString()
}

export default function AdDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const openAuthModal = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('auth', 'login')
      return next
    }, { replace: true })
  }

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    adsApi.toggleFavorite(ad.id)
      .then((nowFavorite) => {
        setAd((prev) => (prev ? { ...prev, favorite: nowFavorite } : null))
      })
      .catch((err) => {
        const msg = err.message || ''
        if (msg.includes('401') || msg.includes('403') || msg.includes('Ошибка запроса') || msg.includes('авторизац') || msg.includes('Forbidden')) {
          openAuthModal()
        }
      })
  }

  useEffect(() => {
    if (!id) return
    adsApi
      .getById(id)
      .then(setAd)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || t('ads.noAds')}</p>
        <Link to="/ads">{t('common.back')}</Link>
      </div>
    )
  }

  const mainImage = ad.images?.find((i) => i.isMain) || ad.images?.[0]

  return (
    <div className={styles.page}>
      <p className={styles.back}>
        <Link to="/ads">← {t('common.back')}</Link>
      </p>
      <article className={styles.article}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{ad.title}</h1>
          <button
            type="button"
            className={styles.favoriteBtn}
            onClick={handleFavoriteClick}
            aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
          >
            <HeartIcon filled={!!ad.favorite} />
          </button>
        </div>
        <div className={styles.meta}>
          <span>{formatPrice(ad.price, ad.currency)}</span>
          {ad.isNegotiable && <span>({t('ads.negotiable')})</span>}
          <span>{t('ads.views')}: {ad.views}</span>
          <span>{t('ads.createdAt')}: {formatDate(ad.createdAt)}</span>
        </div>
        {mainImage && (
          <img src={imageUrl(mainImage.url)} alt="" className={styles.mainImage} />
        )}
        {(ad.images?.length > 1) && (
          <div className={styles.gallery}>
            {ad.images.map((img) => (
              <img key={img.id} src={imageUrl(img.url)} alt="" className={styles.thumb} />
            ))}
          </div>
        )}
        <div className={styles.section}>
          <h2>{t('ads.description')}</h2>
          <p className={styles.description}>{ad.description}</p>
        </div>
        <div className={styles.section}>
          <h2>{t('ads.contact')}</h2>
          <p><strong>{t('ads.phone')}:</strong> {ad.phone}</p>
          {ad.email && <p><strong>{t('ads.email')}:</strong> {ad.email}</p>}
          {ad.region && <p><strong>{t('ads.region')}:</strong> {ad.region}</p>}
          {ad.district && <p><strong>{t('ads.district')}:</strong> {ad.district}</p>}
        </div>
        <p className={styles.expires}>
          {t('ads.expiresAt')}: {formatDate(ad.expiresAt)}
        </p>
      </article>
    </div>
  )
}
