import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { adsApi, imageUrl } from '../../api/client'
import styles from './MyAds.module.css'

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  return `${Number(price).toLocaleString()} ${currency}`
}

export default function MyAds() {
  const { t } = useLang()
  const [data, setData] = useState({ content: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adsApi
      .myAds()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

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
      <h1 className={styles.title}>{t('ads.myAdsTitle')}</h1>
      {ads.length === 0 ? (
        <p className={styles.noAds}>{t('ads.noAds')}</p>
      ) : (
        <ul className={styles.grid}>
          {ads.map((ad) => (
            <li key={ad.id} className={styles.card}>
              <Link to={`/ads/${ad.id}`} className={styles.cardLink}>
                {ad.mainImageUrl ? (
                  <img src={imageUrl(ad.mainImageUrl)} alt="" className={styles.cardImage} />
                ) : (
                  <div className={styles.cardImagePlaceholder} />
                )}
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{ad.title}</h2>
                  <p className={styles.cardPrice}>
                    {formatPrice(ad.price, ad.currency)}
                    {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
