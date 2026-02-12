import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { adsApi, favoritesApi } from '../../services/adApi'
import { formatPrice } from '../../../../utils/formatters'
import { ROUTES, adsPath } from '../../../../constants/routes'
import HeartIcon from '../../../../components/ui/HeartIcon'
import CardGallery from '../../components/CardGallery'
import styles from './Favorites.module.css'

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
      setData((prev) => {
        const newTotal = (prev.totalElements ?? prev.content.length) - 1
        return {
          ...prev,
          content: prev.content.filter((a) => a.id !== ad.id),
          totalElements: newTotal,
        }
      })
      window.dispatchEvent(new CustomEvent('favorites-count-refresh'))
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
          <Link to={ROUTES.ADS}>{t('home.viewAds')}</Link>
        </p>
      ) : (
        <ul className={styles.grid}>
          {ads.map((ad) => (
            <li key={ad.id} className={styles.card}>
              <Link to={adsPath(ad.id)} className={styles.cardLink}>
                <span className={styles.cardImageWrap}>
                  <CardGallery
                    imageUrls={ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])}
                  />
                  <button
                    type="button"
                    className={styles.favoriteBtn}
                    onClick={(e) => handleRemoveFavorite(e, ad)}
                    aria-label={t('common.removeFromFavorites')}
                  >
                    <HeartIcon filled className={`${styles.heartIcon} ${styles.heartFilled}`} size={20} />
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
