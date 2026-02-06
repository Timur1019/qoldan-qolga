import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { adsApi, imageUrl } from '../../api/client'
import { ROUTES } from '../../constants/routes'
import styles from './MyAds.module.css'

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  return `${Number(price).toLocaleString()} ${currency}`
}

const TABS = [
  { key: 'active', labelKey: 'profile.tabActive' },
  { key: 'drafts', labelKey: 'profile.tabDrafts' },
  { key: 'pending', labelKey: 'profile.tabPending' },
  { key: 'archive', labelKey: 'profile.tabArchive' },
]

export default function MyAds() {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('active')
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
  const showActiveList = activeTab === 'active'

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <section className={styles.useful} aria-label={t('profile.usefulForYou')}>
          <h2 className={styles.usefulTitle}>{t('profile.usefulForYou')}</h2>
          <div className={styles.usefulCards}>
            <div className={styles.usefulCard}>
              <div className={styles.usefulCardIcon} aria-hidden />
              <h3 className={styles.usefulCardTitle}>{t('profile.sellGuide')}</h3>
              <button type="button" className={styles.guideBtn}>{t('profile.guide')}</button>
            </div>
            <div className={styles.usefulCard}>
              <div className={styles.usefulCardIconShield} aria-hidden />
              <h3 className={styles.usefulCardTitle}>{t('profile.sellerSafety')}</h3>
              <button type="button" className={styles.guideBtn}>{t('profile.guide')}</button>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.myAdsSection}>
        <h1 className={styles.title}>{t('ads.myAdsTitle')}</h1>
        <div className={styles.tabs} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={activeTab === tab.key ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab.key)}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {activeTab === 'active' && ads.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <p className={styles.emptyText}>{t('profile.myAdsEmpty')}</p>
            <Link to={ROUTES.ADS_CREATE} className={styles.placeAdBtn}>
              {t('profile.placeAd')}
            </Link>
          </div>
        )}

        {activeTab !== 'active' && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <p className={styles.emptyText}>{t('profile.myAdsEmpty')}</p>
          </div>
        )}

        {showActiveList && ads.length > 0 && (
          <>
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
            <div className={styles.placeAdWrap}>
              <Link to={ROUTES.ADS_CREATE} className={styles.placeAdBtn}>
                {t('profile.placeAd')}
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
