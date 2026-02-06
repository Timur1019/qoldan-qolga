import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAuth } from '../../context/AuthContext'
import { referenceApi, adsApi, imageUrl } from '../../api/client'
import styles from './Home.module.css'

function HeartIcon({ filled, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden style={{ width: 20, height: 20 }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  const cur = (currency || 'UZS').toUpperCase()
  const name = cur === 'UZS' ? 'сум' : cur
  return `${Number(price).toLocaleString('ru-RU')} ${name}`
}

function formatAdDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year}, ${h}:${m}`
}

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
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [adsData, setAdsData] = useState({ content: [] })
  const [adsLoading, setAdsLoading] = useState(true)

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
        setAdsData((prev) => ({
          ...prev,
          content: (prev.content || []).map((a) => (a.id === ad.id ? { ...a, favorite: nowFavorite } : a)),
        }))
      })
      .catch((err) => {
        const msg = err.message || ''
        if (msg.includes('401') || msg.includes('403') || msg.includes('Ошибка') || msg.includes('авторизац') || msg.includes('Forbidden')) {
          openAuthModal()
        }
      })
  }

  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const allCategoriesLabel = lang === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'
  const adsTitle = t('ads.listTitle')
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
            to={cat.hasChildren ? `/categories/${encodeURIComponent(cat.code)}` : `/ads?category=${encodeURIComponent(cat.code)}`}
            className={styles.card}
          >
            <span className={styles.cardTitle}>{categoryName(cat)}</span>
            <span className={styles.cardIconPeek}>
              <CategoryCardIcon code={cat.code} />
            </span>
          </Link>
        ))}
        <Link to="/?open=categories" className={styles.card + ' ' + styles.cardAll}>
          <span className={styles.cardTitle}>{allCategoriesLabel}</span>
          <span className={styles.cardArrow} aria-hidden>→</span>
        </Link>
      </div>
      <Link to="/ads" className={styles.cta}>
        {t('home.viewAds')}
      </Link>

      <section className={styles.adsSection}>
        <h2 className={styles.adsSectionTitle}>{adsTitle}</h2>
        {adsLoading ? (
          <p className={styles.adsLoading}>{t('common.loading')}</p>
        ) : ads.length === 0 ? (
          <p className={styles.adsEmpty}>{t('ads.noAds')}</p>
        ) : (
          <ul className={styles.adsGrid}>
            {ads.map((ad) => (
              <li key={ad.id} className={styles.adCard}>
                <Link to={`/ads/${ad.id}`} className={styles.adCardLink}>
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
                      <HeartIcon filled={!!ad.favorite} className={ad.favorite ? styles.heartFilled : ''} />
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
          <Link to="/ads" className={styles.adsMoreLink}>
            {lang === 'ru' ? 'Все объявления' : 'Barcha e\'lonlar'}
          </Link>
        )}
      </section>
    </div>
  )
}
