import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { adsApi, imageUrl, referenceApi } from '../../api/client'
import { useAuthModal, useFavoriteClick } from '../../hooks'
import { formatPrice } from '../../utils/formatters'
import { PARAMS, adsPath } from '../../constants/routes'
import HeartIcon from '../../components/ui/HeartIcon'
import styles from './AdsList.module.css'

export default function AdsList() {
  const { t, lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get(PARAMS.CATEGORY) || ''
  const region = searchParams.get(PARAMS.REGION) || ''
  const [regions, setRegions] = useState([])
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const updateAdFavorite = useCallback((adId, favorite) => {
    setData((prev) => ({
      ...prev,
      content: prev.content.map((a) => (a.id === adId ? { ...a, favorite } : a)),
    }))
  }, [])
  const handleFavoriteClick = useFavoriteClick(updateAdFavorite)

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
    if (code) next.set(PARAMS.REGION, code)
    else next.delete(PARAMS.REGION)
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
              <Link to={adsPath(ad.id)} className={styles.cardLink}>
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
                    <HeartIcon
                      filled={!!ad.favorite}
                      className={`${styles.heartIcon} ${ad.favorite ? styles.heartFilled : styles.heartOutline}`}
                      size={20}
                    />
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
