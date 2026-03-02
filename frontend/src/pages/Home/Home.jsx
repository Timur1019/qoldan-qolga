import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { referenceApi, adsApi, imageUrl } from '../../api/client'
import { useFavoriteClick } from '../../hooks'
import { formatPrice, formatAdDate } from '../../utils/formatters'
import { ROUTES, PARAMS, adsPath, categoryPath, adsCategoryPath } from '../../constants/routes'
import HeartIcon from '../../components/ui/HeartIcon'
import CardGallery from '../../features/ad/components/CardGallery'
import bannerBg from '../../img/baner/baner.png'
import styles from './Home.module.css'

function CategoryCardIcon({ code }) {
  const iconClass = `bi ${
    code === 'Xizmatlar' ? 'bi-clipboard-check' : code === 'Ish' ? 'bi-briefcase' : code === 'Transport' ? 'bi-truck' : 'bi-folder2-open'
  }`
  return <i className={`${iconClass} ${styles.cardIcon}`} aria-hidden="true" />
}

const HOME_ADS_PAGE_SIZE = 100

export default function Home() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const region = searchParams.get(PARAMS.REGION) || ''
  const [categories, setCategories] = useState([])
  const [adsData, setAdsData] = useState({ content: [] })
  const [adsPage, setAdsPage] = useState(0)
  const [adsLastPage, setAdsLastPage] = useState(false)
  const [adsLoading, setAdsLoading] = useState(true)
  const [adsLoadingMore, setAdsLoadingMore] = useState(false)
  const [promoBanners, setPromoBanners] = useState([])
  const [promoPage, setPromoPage] = useState(0)
  const PROMO_PER_PAGE = 4

  const updateAdFavorite = useCallback((adId, favorite) => {
    setAdsData((prev) => ({
      ...prev,
      content: (prev.content || []).map((a) => (a.id === adId ? { ...a, favorite } : a)),
    }))
  }, [])
  const handleFavoriteClick = useFavoriteClick(updateAdFavorite)

  useEffect(() => {
    const categoriesPromise = referenceApi.getCategoriesForHome()
      .then((list) => {
        const arr = Array.isArray(list) ? list : []
        if (arr.length > 0) return arr
        return referenceApi.getCategories().then((root) => (Array.isArray(root) ? root : []))
      })
      .catch(() => referenceApi.getCategories().then((root) => (Array.isArray(root) ? root : [])).catch(() => []))
    const adsParams = { page: 0, size: HOME_ADS_PAGE_SIZE }
    if (region) adsParams.region = region
    const adsPromise = adsApi.list(adsParams).then((data) => data || { content: [] }).catch(() => ({ content: [] }))
    const promoPromise = referenceApi.getHomePromoBanners().then((list) => (Array.isArray(list) ? list : [])).catch(() => [])

    setAdsLoading(true)
    setAdsPage(0)
    Promise.all([categoriesPromise, adsPromise, promoPromise])
      .then(([cats, ads, promo]) => {
        setCategories(cats)
        setAdsData(ads)
        const totalPages = typeof ads.totalPages === 'number' ? ads.totalPages : 1
        const isLast = typeof ads.last === 'boolean' ? ads.last : true
        setAdsLastPage(isLast || 1 >= totalPages)
        setPromoBanners(promo)
      })
      .finally(() => setAdsLoading(false))
  }, [region])

  const loadMoreAds = useCallback(() => {
    if (adsLastPage || adsLoadingMore) return
    const nextPage = adsPage + 1
    setAdsLoadingMore(true)
    const params = { page: nextPage, size: HOME_ADS_PAGE_SIZE }
    if (region) params.region = region
    adsApi
      .list(params)
      .then((res) => {
        const data = res || { content: [] }
        const newContent = data.content || []
        setAdsData((prev) => ({ ...prev, content: [...(prev.content || []), ...newContent] }))
        setAdsPage(nextPage)
        const totalPages = typeof data.totalPages === 'number' ? data.totalPages : nextPage + 1
        const isLast = typeof data.last === 'boolean' ? data.last : nextPage + 1 >= totalPages
        setAdsLastPage(isLast)
      })
      .catch(() => {})
      .finally(() => setAdsLoadingMore(false))
  }, [adsPage, adsLastPage, adsLoadingMore, region])

  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const ads = adsData.content || []

  if (adsLoading && categories.length === 0 && ads.length === 0) {
    return (
      <div className={styles.globalLoading} aria-busy="true">
        <span className={styles.globalLoadingSpinner} aria-hidden />
        <p className={styles.globalLoadingText}>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="page-container app-page">
      <h1 className={styles.title}>{t('home.title')}</h1>
      {/*<p className={styles.lead}>{t('home.subtitle')}</p>*/}
      {/*<p className={styles.welcome}>{t('home.welcome')}</p>*/}
      <div className={styles.cardsGrid}>
        {categories.slice(0, 11).map((cat) => (
          <Link
            key={cat.code}
            to={cat.code === 'Xizmatlar' ? adsCategoryPath(cat.code) : (cat.hasChildren ? categoryPath(cat.code) : adsCategoryPath(cat.code))}
            className={styles.card}
          >
            <span className={styles.cardTitle}>{categoryName(cat)}</span>
            <span className={styles.cardIconPeek}>
              <CategoryCardIcon code={cat.code} />
            </span>
          </Link>
        ))}
        <Link to={ROUTES.CATEGORIES_OPEN} className={`${styles.card} ${styles.cardAll}`}>
          <span className={styles.cardTitle}>{t('home.allCategories')}</span>
          <span className={styles.cardArrow} aria-hidden>→</span>
        </Link>
      </div>
      <div className={`${styles.sellBanner} app-card`}>
        <div className={styles.sellBannerText}>
          <p className={styles.sellBannerTitle}>{t('ads.sellAndEarn')}</p>
          <p className={styles.sellBannerSubtitle}>{t('profile.ctaReviewsHint')}</p>
        </div>
        <div className={styles.sellBannerImgWrap}>
          <img src={bannerBg} alt="" className={styles.sellBannerImg} />
        </div>
        <div className={styles.sellBannerActions}>
          <Link to={ROUTES.ADS_CREATE} className="btn btn-primary btn-lg text-white">
            {t('ads.postAd')}
          </Link>
        </div>
      </div>

      {promoBanners.length > 0 && (() => {
        const sortedBanners = [...promoBanners].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        const totalPages = Math.ceil(sortedBanners.length / PROMO_PER_PAGE)
        const pageBanners = sortedBanners.slice(promoPage * PROMO_PER_PAGE, promoPage * PROMO_PER_PAGE + PROMO_PER_PAGE)
        const canPrev = promoPage > 0
        const canNext = promoPage < totalPages - 1
        return (
          <section className={styles.promoSection}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h2 className={`${styles.promoTitle} mb-0`}>Выгодно и полезно</h2>
              {totalPages > 1 && (
                <div className="btn-group" role="group" aria-label="Навигация по баннерам">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPromoPage((p) => Math.max(0, p - 1))}
                    disabled={!canPrev}
                    aria-label="Предыдущие"
                  >
                    <i className="bi bi-chevron-left" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPromoPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={!canNext}
                    aria-label="Следующие"
                  >
                    <i className="bi bi-chevron-right" aria-hidden />
                  </button>
                </div>
              )}
            </div>
            <div className={styles.promoRow}>
              {pageBanners.map((banner) => {
                const href = banner.link?.trim()
                const isExternal = href?.startsWith('http')
                const cardStyle = banner.imageUrl
                  ? {
                      backgroundImage: `url(${imageUrl(banner.imageUrl)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : { background: 'var(--color-bg-card)' }
                const content = (
                  <>
                    <div className={styles.promoCardOverlay} aria-hidden />
                    <div className={styles.promoContent}>
                      {banner.badge && <span className={styles.promoBadge}>{banner.badge}</span>}
                      <p className={styles.promoCardTitle}>{banner.title}</p>
                      <p className={styles.promoCardSubtitle}>{banner.subtitle}</p>
                    </div>
                  </>
                )
                const cardClasses = `${styles.promoCard} ${styles.promoCardLink}`
                return isExternal ? (
                  <a key={banner.id} href={href} className={cardClasses} style={cardStyle}>
                    {content}
                  </a>
                ) : (
                  <Link key={banner.id} to={href || '#'} className={cardClasses} style={cardStyle}>
                    {content}
                  </Link>
                )
              })}
            </div>
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-2">
                <span className="small text-muted">
                  {promoPage + 1} / {totalPages}
                </span>
              </div>
            )}
          </section>
        )
      })()}

      <section className={styles.adsSection}>
        <h2 className={styles.adsSectionTitle}>{t('ads.listTitle')}</h2>
        {adsLoading ? (
          <p className={styles.adsLoading}>{t('common.loading')}</p>
        ) : ads.length === 0 ? (
          <p className={styles.adsEmpty}>{t('ads.noAds')}</p>
        ) : (
          <ul className={styles.adsGrid}>
            {ads.map((ad) => (
              <li key={ad.id} className={`${styles.adCard} app-card app-card-hover`}>
                <Link to={adsPath(ad.id)} className={styles.adCardLink}>
                  <span className={styles.adCardImageWrap}>
                    <span className={ad.sellerIsStore ? styles.sellerBadgeStore : styles.sellerBadgePrivate}>
                      {ad.sellerIsStore ? 'Магазин' : 'Частный'}
                    </span>
                    <CardGallery
                      imageUrls={ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])}
                    />
                  </span>
                  <div className={styles.adCardBody}>
                    <p className={styles.adCardPrice}>
                      {formatPrice(ad.price, ad.currency)}
                      {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                    </p>
                    <button
                      type="button"
                      className={styles.favoriteBtn}
                      onClick={(e) => handleFavoriteClick(e, ad)}
                      aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
                    >
                      <HeartIcon filled={!!ad.favorite} className={`${styles.heartIcon} ${ad.favorite ? styles.heartFilled : styles.heartOutline}`} size={18} />
                    </button>
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
          <div className={styles.adsFooter}>
            {!adsLastPage && (
              <button
                type="button"
                className={styles.showMoreBtn}
                onClick={loadMoreAds}
                disabled={adsLoadingMore}
              >
                {adsLoadingMore ? t('common.loading') : t('common.showMore')}
              </button>
            )}
            <Link to={ROUTES.ADS_MY} className={styles.adsMoreLink}>
              {t('home.allAds')}
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
