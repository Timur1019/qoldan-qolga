import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { referenceApi, adsApi, imageUrl } from '../../api/client'
import { useFavoriteClick } from '../../hooks'
import { formatPrice, formatAdDate } from '../../utils/formatters'
import { ROUTES, adsPath, categoryPath, adsCategoryPath } from '../../constants/routes'
import HeartIcon from '../../components/ui/HeartIcon'
import styles from './Home.module.css'

const CATEGORY_ICONS = {
  Xizmatlar: 'clipboard',
  Ish: 'briefcase',
  Transport: 'car',
}

function CategoryCardIcon({ code }) {
  const name = CATEGORY_ICONS[code] || 'folder'
  const svgProps = { className: styles.cardIcon, viewBox: '0 0 48 48', fill: 'none', 'aria-hidden': true }
  if (name === 'clipboard') {
    return (
      <svg {...svgProps}>
        <path d="M14 8v4h20V8h2v32H12V8h2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="10" y="16" width="24" height="20" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M14 22h20M14 26h16M14 30h12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'briefcase') {
    return (
      <svg {...svgProps}>
        <path d="M8 8v4h8V8h4v4h8V8h2v14H6V8h2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M6 22h12v8H6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    )
  }
  if (name === 'car') {
    return (
      <svg {...svgProps}>
        <path d="M6 18l2-6h8l2 6M6 18h12v4H6z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8" cy="22" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="22" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    )
  }
  return (
    <svg {...svgProps}>
      <path d="M12 8l-4 4 4 4M8 12h16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="6" y="18" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default function Home() {
  const { t, lang } = useLang()
  const [categories, setCategories] = useState([])
  const [adsData, setAdsData] = useState({ content: [] })
  const [adsLoading, setAdsLoading] = useState(true)

  const updateAdFavorite = useCallback((adId, favorite) => {
    setAdsData((prev) => ({
      ...prev,
      content: (prev.content || []).map((a) => (a.id === adId ? { ...a, favorite } : a)),
    }))
  }, [])
  const handleFavoriteClick = useFavoriteClick(updateAdFavorite)

  useEffect(() => {
    referenceApi.getCategoriesForHome()
      .then((list) => {
        const arr = Array.isArray(list) ? list : []
        if (arr.length > 0) return setCategories(arr)
        return referenceApi.getCategories().then((root) => setCategories(Array.isArray(root) ? root : []))
      })
      .catch(() => referenceApi.getCategories().then((root) => setCategories(Array.isArray(root) ? root : [])).catch(() => setCategories([])))
  }, [])

  useEffect(() => {
    setAdsLoading(true)
    adsApi.list({ size: 24 })
      .then((data) => setAdsData(data || { content: [] }))
      .catch(() => setAdsData({ content: [] }))
      .finally(() => setAdsLoading(false))
  }, [])

  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const ads = adsData.content || []

  return (
    <div className={styles.home}>
      <h1 className={styles.title}>{t('home.title')}</h1>
      <p className={styles.lead}>{t('home.subtitle')}</p>
      <p className={styles.welcome}>{t('home.welcome')}</p>
      <div className={styles.cardsGrid}>
        {categories.map((cat) => (
          <Link
            key={cat.code}
            to={cat.hasChildren ? categoryPath(cat.code) : adsCategoryPath(cat.code)}
            className={styles.card}
          >
            <span className={styles.cardTitle}>{categoryName(cat)}</span>
            <span className={styles.cardIconPeek}>
              <CategoryCardIcon code={cat.code} />
            </span>
          </Link>
        ))}
        <Link to={ROUTES.CATEGORIES_OPEN} className={styles.card + ' ' + styles.cardAll}>
          <span className={styles.cardTitle}>{t('home.allCategories')}</span>
          <span className={styles.cardArrow} aria-hidden>→</span>
        </Link>
      </div>
      <Link to={ROUTES.ADS} className={styles.cta}>
        {t('home.viewAds')}
      </Link>

      <section className={styles.adsSection}>
        <h2 className={styles.adsSectionTitle}>{t('ads.listTitle')}</h2>
        {adsLoading ? (
          <p className={styles.adsLoading}>{t('common.loading')}</p>
        ) : ads.length === 0 ? (
          <p className={styles.adsEmpty}>{t('ads.noAds')}</p>
        ) : (
          <ul className={styles.adsGrid}>
            {ads.map((ad) => (
              <li key={ad.id} className={styles.adCard}>
                <Link to={adsPath(ad.id)} className={styles.adCardLink}>
                  <span className={styles.adCardImageWrap}>
                    {ad.mainImageUrl ? (
                      <img src={imageUrl(ad.mainImageUrl)} alt="" className={styles.adCardImage} />
                    ) : (
                      <div className={styles.adCardImagePlaceholder} />
                    )}
                    <button
                      type="button"
                      className={styles.favoriteBtn}
                      onClick={(e) => handleFavoriteClick(e, ad)}
                      aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
                    >
                      <HeartIcon filled={!!ad.favorite} className={ad.favorite ? styles.heartFilled : ''} size={20} />
                    </button>
                  </span>
                  <div className={styles.adCardBody}>
                    <p className={styles.adCardPrice}>
                      {formatPrice(ad.price, ad.currency)}
                      {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                    </p>
                    <h3 className={styles.adCardTitle}>{ad.title}</h3>
                    {ad.region && <p className={styles.adCardMeta}>{ad.region}</p>}
                    {ad.createdAt && <p className={styles.adCardDate}>{formatAdDate(ad.createdAt)}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!adsLoading && ads.length > 0 && (
          <Link to={ROUTES.ADS} className={styles.adsMoreLink}>
            {t('home.allAds')}
          </Link>
        )}
      </section>
    </div>
  )
}
