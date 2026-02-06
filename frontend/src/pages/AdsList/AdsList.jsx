import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { adsApi, imageUrl, referenceApi } from '../../api/client'
import styles from './AdsList.module.css'

function HeartIcon({ filled, className }) {
  return (
    <svg className={`${className} ${filled ? styles.heartFilled : ''}`} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  return `${Number(price).toLocaleString()} ${currency}`
}

export default function AdsList() {
  const { t, lang } = useLang()
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const region = searchParams.get('region') || ''
  const [regions, setRegions] = useState([])
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const openAuthModal = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('auth', 'login')
      return next
    }, { replace: true })
  }

  const handleFavoriteClick = (e, ad) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    adsApi.toggleFavorite(ad.id)
      .then((nowFavorite) => {
        setData((prev) => ({
          ...prev,
          content: prev.content.map((a) => (a.id === ad.id ? { ...a, favorite: nowFavorite } : a)),
        }))
      })
      .catch((err) => {
        const msg = err.message || ''
        if (msg.includes('401') || msg.includes('403') || msg.includes('Ошибка запроса') || msg.includes('авторизац') || msg.includes('Forbidden')) {
          openAuthModal()
        }
      })
  }

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
  }, [])

  useEffect(() => {
    const params = {}
    if (category) params.category = category
    if (region) params.region = region
    setLoading(true)
    adsApi
      .list(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [category, region])

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

  const setRegion = (code) => {
    const next = new URLSearchParams(searchParams)
    if (code) next.set('region', code)
    else next.delete('region')
    setSearchParams(next)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('ads.listTitle')}</h1>
      <div className={styles.filters}>
        <label className={styles.filterLabel}>
          {t('ads.region')}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">— {t('ads.allRegions')}</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {lang === 'ru' ? r.nameRu : r.nameUz}
              </option>
            ))}
          </select>
        </label>
      </div>
      {ads.length === 0 ? (
        <p className={styles.noAds}>{t('ads.noAds')}</p>
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
                    onClick={(e) => handleFavoriteClick(e, ad)}
                    aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
                  >
                    <HeartIcon filled={!!ad.favorite} className={styles.heartIcon} />
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
