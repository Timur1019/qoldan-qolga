import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { adsApi, imageUrl, referenceApi } from '../../services/adApi'
import { useFavoriteClick } from '../../hooks/useFavoriteClick'
import { formatPrice } from '../../../../utils/formatters'
import { PARAMS, adsPath } from '../../../../constants/routes'
import HeartIcon from '../../../../components/ui/HeartIcon'
import styles from './AdsList.module.css'

const PAGE_SIZE = 20

export default function AdsList() {
  const { t, lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get(PARAMS.CATEGORY) || ''
  const region = searchParams.get(PARAMS.REGION) || ''
  const page = Math.max(0, parseInt(searchParams.get(PARAMS.PAGE) || '0', 10) || 0)
  const [regions, setRegions] = useState([])
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
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
    const params = { page, size: PAGE_SIZE }
    if (category) params.category = category
    if (region) params.region = region
    setLoading(true)
    adsApi
      .list(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [category, region, page])

  const setPage = (newPage) => {
    const next = new URLSearchParams(searchParams)
    if (newPage <= 0) next.delete(PARAMS.PAGE)
    else next.set(PARAMS.PAGE, String(newPage))
    setSearchParams(next)
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
        <>
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
        {data.totalPages > 1 && (
          <nav className={styles.pagination} aria-label={t('ads.pagination')}>
            <button
              type="button"
              className={styles.paginationBtn}
              onClick={() => setPage(page - 1)}
              disabled={data.first ?? page <= 0}
              aria-label={t('ads.prevPage')}
            >
              ←
            </button>
            <span className={styles.paginationInfo}>
              {page + 1} / {data.totalPages}
              {data.totalElements != null && ` (${data.totalElements})`}
            </span>
            <button
              type="button"
              className={styles.paginationBtn}
              onClick={() => setPage(page + 1)}
              disabled={data.last ?? page >= data.totalPages - 1}
              aria-label={t('ads.nextPage')}
            >
              →
            </button>
          </nav>
        )}
        </>
      )}
    </div>
  )
}
