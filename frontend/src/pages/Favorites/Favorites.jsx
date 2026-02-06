import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { adsApi, favoritesApi, imageUrl } from '../../api/client'
import styles from './Favorites.module.css'

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  return `${Number(price).toLocaleString()} ${currency}`
}

function HeartIcon({ filled, className }) {
  return (
    <svg className={`${className} ${filled ? styles.heartFilled : ''}`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function Favorites() {
  const { t } = useLang()
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    favoritesApi
      .list({ page: 0, size: 50 })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleRemoveFavorite = (e, ad) => {
    e.preventDefault()
    e.stopPropagation()
    adsApi.removeFavorite(ad.id).then(() => {
      setData((prev) => ({
        ...prev,
        content: prev.content.filter((a) => a.id !== ad.id),
        totalElements: (prev.totalElements ?? prev.content.length) - 1,
      }))
    }).catch(() => {})
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  const ads = data.content || []

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('nav.favorites')}</h1>
      {ads.length === 0 ? (
        <p className={styles.noAds}>
          {t('ads.noAds')}
          <br />
          <Link to="/ads">{t('home.viewAds')}</Link>
        </p>
      ) : (
        <ul className={styles.grid}>
          {ads.map((ad) => (
            <li key={ad.id} className={styles.card}>
              <Link to={`/ads/${ad.id}`} className={styles.cardLink}>
                <span className={styles.cardImageWrap}>
                  {ad.mainImageUrl ? (
                    <img src={imageUrl(ad.mainImageUrl)} alt="" className={styles.cardImage} />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
                  <button
                    type="button"
                    className={styles.favoriteBtn}
                    onClick={(e) => handleRemoveFavorite(e, ad)}
                    aria-label={t('common.removeFromFavorites')}
                  >
                    <HeartIcon filled className={styles.heartIcon} />
                  </button>
                </span>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{ad.title}</h2>
                  <p className={styles.cardPrice}>
                    {formatPrice(ad.price, ad.currency)}
                    {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                  </p>
                  {(ad.region || ad.category) && (
                    <p className={styles.cardMeta}>
                      {ad.category}
                      {ad.region && ` · ${ad.region}`}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
