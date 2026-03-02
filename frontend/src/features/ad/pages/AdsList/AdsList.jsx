import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { useAuth } from '../../../../context/AuthContext'
import { useAuthModal } from '../../../../hooks'
import { adsApi, referenceApi, chatApi, imageUrl } from '../../services/adApi'
import { useFavoriteClick } from '../../../../hooks'
import { formatPrice, formatAdCardDate } from '../../../../utils/formatters'
import { PARAMS, ROUTES, CLOTHING_ROOT_CODE, adsPath, adsCategoryPath, categoryPathWithParams, adsCategoryPathWithParams, sellerPath } from '../../../../constants/routes'
import HeartIcon from '../../../../components/ui/HeartIcon'
import AdsFiltersSidebar from '../../components/AdsFiltersSidebar'
import CardGallery from '../../components/CardGallery'
import bannerImg from '../../../../img/baner/baner.png'
import styles from './AdsList.module.css'

const PAGE_SIZE = 40
const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

function RatingStars({ averageRating, totalReviews, t }) {
  const avg = averageRating ?? 0
  const count = totalReviews ?? 0
  const full = Math.floor(avg)
  const half = (avg - full) >= 0.5 ? 1 : 0
  const empty = Math.max(0, 5 - full - half)
  return (
    <div className={styles.ratingLine}>
      <span className={styles.stars} aria-hidden title={`${avg.toFixed(1)}`}>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
      </span>
      {count > 0 && (
        <span className={styles.ratingText}>
          {avg.toFixed(1)} · {count} {t('reviews.countPlural')}
        </span>
      )}
    </div>
  )
}

export default function AdsList() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const openAuthModal = useAuthModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get(PARAMS.CATEGORY) || ''
  const region = searchParams.get(PARAMS.REGION) || ''
  const brandId = searchParams.get(PARAMS.BRAND) || ''
  const query = searchParams.get(PARAMS.QUERY) || ''
  const page = Math.max(0, parseInt(searchParams.get(PARAMS.PAGE) || '0', 10) || 0)
  const sellerTypes = searchParams.getAll(PARAMS.SELLER_TYPE) || []
  const hasLicense = searchParams.get(PARAMS.HAS_LICENSE)
  const worksByContract = searchParams.get(PARAMS.WORKS_BY_CONTRACT)
  const priceFrom = searchParams.get(PARAMS.PRICE_FROM) || ''
  const priceTo = searchParams.get(PARAMS.PRICE_TO) || ''
  const currency = searchParams.get(PARAMS.CURRENCY) || ''
  const urgentBargain = searchParams.get(PARAMS.URGENT_BARGAIN)
  const canDeliver = searchParams.get(PARAMS.CAN_DELIVER)
  const giveAway = searchParams.get(PARAMS.GIVE_AWAY)
  const itemConditions = searchParams.getAll(PARAMS.ITEM_CONDITION) || []
  const handMadeOnlyParam = searchParams.get(PARAMS.HAND_MADE_ONLY)
  const handMadeOnly = handMadeOnlyParam === 'true' ? true : handMadeOnlyParam === 'false' ? false : null
  const canRentParam = searchParams.get(PARAMS.CAN_RENT)
  const canRent = canRentParam === 'true'
  const [regions, setRegions] = useState([])
  const [categories, setCategories] = useState([])
  const [sidebarCategories, setSidebarCategories] = useState([])
  const [currentCategoryInfo, setCurrentCategoryInfo] = useState(null)
  const [categoryBreadcrumb, setCategoryBreadcrumb] = useState([]) /* путь от корня до текущей категории */
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [phoneRevealedIds, setPhoneRevealedIds] = useState(new Set())
  const [filterDraft, setFilterDraft] = useState({
    sellerType: [],
    hasLicense: '',
    worksByContract: '',
    priceFrom: '',
    priceTo: '',
    currency: 'FROM_AD',
    urgentBargain: false,
    canDeliver: false,
    giveAway: false,
    brandId: '',
    itemCondition: [],
    handMadeOnly: '',
    canRent: '',
  })
  const [brands, setBrands] = useState([])
  const hasCategory = Boolean(category)

  useEffect(() => {
    setFilterDraft({
      sellerType: searchParams.getAll(PARAMS.SELLER_TYPE) || [],
      hasLicense: searchParams.get(PARAMS.HAS_LICENSE) || '',
      worksByContract: searchParams.get(PARAMS.WORKS_BY_CONTRACT) || '',
      priceFrom: searchParams.get(PARAMS.PRICE_FROM) || '',
      priceTo: searchParams.get(PARAMS.PRICE_TO) || '',
      currency: searchParams.get(PARAMS.CURRENCY) || 'FROM_AD',
      urgentBargain: searchParams.get(PARAMS.URGENT_BARGAIN) === 'true',
      canDeliver: searchParams.get(PARAMS.CAN_DELIVER) === 'true',
      giveAway: searchParams.get(PARAMS.GIVE_AWAY) === 'true',
      brandId: searchParams.get(PARAMS.BRAND) || '',
      itemCondition: searchParams.getAll(PARAMS.ITEM_CONDITION) || [],
      handMadeOnly: searchParams.get(PARAMS.HAND_MADE_ONLY) === 'true' ? true : searchParams.get(PARAMS.HAND_MADE_ONLY) === 'false' ? false : '',
      canRent: searchParams.get(PARAMS.CAN_RENT) === 'true' ? true : searchParams.get(PARAMS.CAN_RENT) === 'false' ? false : '',
    })
  }, [searchParams])

  const updateAdFavorite = useCallback((adId, favorite) => {
    setData((prev) => ({
      ...prev,
      content: prev.content.map((a) => (a.id === adId ? { ...a, favorite } : a)),
    }))
  }, [])
  const handleFavoriteClick = useFavoriteClick(updateAdFavorite)

  const handleWriteSeller = useCallback((ad) => {
    if (!isAuthenticated) return openAuthModal()
    if (ad.userId === user?.id) return
    chatApi.getOrCreateConversation(ad.id).then((conv) => {
      navigate(`${ROUTES.CHAT}?conversation=${encodeURIComponent(conv.id)}`)
    }).catch(() => {})
  }, [isAuthenticated, user?.id, openAuthModal, navigate])

  const handleShowPhone = useCallback((adId) => {
    if (!isAuthenticated) return openAuthModal()
    setPhoneRevealedIds((prev) => new Set([...prev, adId]))
  }, [isAuthenticated, openAuthModal])

  useEffect(() => {
    const regionsPromise = referenceApi.getRegions().then((r) => r || []).catch(() => [])
    const categoriesPromise = hasCategory
      ? referenceApi.getCategories().then((list) => (Array.isArray(list) ? list : [])).catch(() => [])
      : Promise.resolve([])
    Promise.all([regionsPromise, categoriesPromise]).then(([r, list]) => {
      setRegions(r)
      setCategories(list)
    })
  }, [hasCategory])

  /* Подкатегории для сайдбара (дети родителя, чтобы текущая была в списке) и хлебные крошки */
  useEffect(() => {
    if (!hasCategory || !category) {
      setSidebarCategories([])
      setCurrentCategoryInfo(null)
      setCategoryBreadcrumb([])
      return
    }
    referenceApi.getCategoryBreadcrumb(category).then((path) => {
      setCategoryBreadcrumb(Array.isArray(path) ? path : [])
    }).catch(() => setCategoryBreadcrumb([]))

    referenceApi.getCategory(category).then((info) => {
      setCurrentCategoryInfo(info || null)
      if (!info) {
        setSidebarCategories([])
        return
      }
      referenceApi.getCategoryChildren(category).then((list) => {
        const listArr = Array.isArray(list) ? list : []
        setSidebarCategories(listArr.length > 0 ? listArr : [info])
      }).catch(() => setSidebarCategories([info]))
    }).catch(() => {
      setCurrentCategoryInfo(null)
      referenceApi.getCategory(category).then((info) => {
        setCurrentCategoryInfo(info || null)
        referenceApi.getCategoryChildren(category).then((list) => {
          const listArr = Array.isArray(list) ? list : []
          setSidebarCategories(listArr.length > 0 ? listArr : (info ? [info] : []))
        }).catch(() => setSidebarCategories(info ? [info] : []))
      }).catch(() => setSidebarCategories([]))
    })
  }, [hasCategory, category])

  useEffect(() => {
    if (!category) {
      setBrands([])
      return
    }
    referenceApi.getBrandsByCategory(category).then((list) => {
      const arr = Array.isArray(list) ? list : []
      setBrands(arr)
      // Сброс бренда в URL, если выбранный бренд не входит в список по новой категории
      const currentBrandId = searchParams.get(PARAMS.BRAND)
      if (currentBrandId && arr.length > 0 && !arr.some((b) => b.id === currentBrandId)) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          next.delete(PARAMS.BRAND)
          return next
        }, { replace: true })
      }
    }).catch(() => setBrands([]))
  }, [category])

  // Сериализуем массивы из URL, чтобы не подставлять новые ссылки на каждый рендер (иначе эффект крутится бесконечно)
  const sellerTypesKey = (searchParams.getAll(PARAMS.SELLER_TYPE) || []).join(',')
  const itemConditionsKey = (searchParams.getAll(PARAMS.ITEM_CONDITION) || []).join(',')

  useEffect(() => {
    const st = searchParams.getAll(PARAMS.SELLER_TYPE) || []
    const ic = searchParams.getAll(PARAMS.ITEM_CONDITION) || []
    const params = { page, size: PAGE_SIZE }
    if (category) params.category = category
    if (region) params.region = region
    if (brandId) params.brandId = brandId
    if (query.trim()) params.q = query.trim()
    if (st.length > 0) params.sellerType = st
    if (hasLicense === 'true') params.hasLicense = true
    if (hasLicense === 'false') params.hasLicense = false
    if (worksByContract === 'true') params.worksByContract = true
    if (worksByContract === 'false') params.worksByContract = false
    if (priceFrom.trim()) params.priceFrom = priceFrom.trim()
    if (priceTo.trim()) params.priceTo = priceTo.trim()
    if (currency) params.currency = currency
    if (urgentBargain === 'true') params.urgentBargain = true
    if (canDeliver === 'true') params.canDeliver = true
    if (giveAway === 'true') params.giveAway = true
    if (ic.length > 0) params.itemCondition = ic
    if (handMadeOnly === true) params.handMadeOnly = true
    if (handMadeOnly === false) params.handMadeOnly = false
    if (canRentParam === 'true') params.canRent = true
    if (canRentParam === 'false') params.canRent = false
    setLoading(true)
    adsApi
      .list(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [category, region, brandId, query, page, sellerTypesKey, hasLicense, worksByContract, priceFrom, priceTo, currency, urgentBargain, canDeliver, giveAway, itemConditionsKey, handMadeOnly, canRentParam])

  const setPage = (newPage) => {
    const next = new URLSearchParams(searchParams)
    if (newPage <= 0) next.delete(PARAMS.PAGE)
    else next.set(PARAMS.PAGE, String(newPage))
    setSearchParams(next)
  }

  if (error) {
    return (
      <div className="page-container app-page">
        <div className="alert alert-danger" role="alert"><i className="bi bi-exclamation-circle me-2" aria-hidden />{error}</div>
      </div>
    )
  }

  const ads = data.content || []

  if (loading && ads.length === 0) {
    return (
      <div className={styles.globalLoading} aria-busy="true">
        <span className={styles.globalLoadingSpinner} aria-hidden />
        <p className={styles.globalLoadingText}>{t('common.loading')}</p>
      </div>
    )
  }

  const setRegion = (code) => {
    const next = new URLSearchParams(searchParams)
    if (code) next.set(PARAMS.REGION, code)
    else next.delete(PARAMS.REGION)
    next.delete(PARAMS.PAGE)
    setSearchParams(next)
  }

  const setBrandId = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id) next.set(PARAMS.BRAND, id)
    else next.delete(PARAMS.BRAND)
    next.delete(PARAMS.PAGE)
    setSearchParams(next)
  }

  const applyFilters = (filters) => {
    const next = new URLSearchParams(searchParams)
    next.delete(PARAMS.PAGE)
    Object.entries(filters).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        next.delete(k)
        v.filter((x) => x != null && x !== '').forEach((x) => next.append(k, String(x)))
      } else if (v != null && v !== '') {
        next.set(k, String(v))
      } else {
        next.delete(k)
      }
    })
    setSearchParams(next, { replace: true })
  }

  const resetFilters = () => {
    const next = new URLSearchParams()
    if (category) next.set(PARAMS.CATEGORY, category)
    if (query) next.set(PARAMS.QUERY, query)
    setSearchParams(next)
  }

  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const currentCategory = currentCategoryInfo || [...categories, ...sidebarCategories].find((c) => c.code === category)
  const isClothingCategory = Boolean(
    category === CLOTHING_ROOT_CODE ||
    (Array.isArray(categoryBreadcrumb) && categoryBreadcrumb.some((c) => c.code === CLOTHING_ROOT_CODE))
  )

  const formatPhone = (phone) => {
    if (!phone) return ''
    const digits = String(phone).replace(/\D/g, '')
    if (digits.length >= 10) return `+${digits}`
    return phone
  }

  const AdRow = ({ ad }) => {
    const urls = ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])
    const sellerName = ad.userDisplayName || t('ads.seller')
    const isAvatarPhoto = ad.userAvatar && (ad.userAvatar.startsWith('/') || ad.userAvatar.startsWith('http'))
    const avatarEmoji = ad.userAvatar && AVATAR_EMOJI[ad.userAvatar] ? AVATAR_EMOJI[ad.userAvatar] : null
    const phoneRevealed = phoneRevealedIds.has(ad.id)
    const desc = (ad.description || '').trim()
    const dateLabels = { today: t('chat.today'), yesterday: t('chat.yesterday') }
    return (
      <li className={styles.adRow}>
        <Link to={adsPath(ad.id)} className={styles.adRowLink}>
          <span className={styles.adRowImageWrap}>
            <span className={`badge position-absolute top-0 start-0 m-2 ${ad.sellerIsStore ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
              {ad.sellerIsStore ? 'Магазин' : 'Частный'}
            </span>
            <CardGallery
              imageUrls={urls}
              className={styles.adRowGalleryWrap}
              imageWrapClassName={styles.adRowGallery}
            />
          </span>
          <div className={styles.adRowBody}>
            <button
              type="button"
              className={styles.adRowFavorite}
              onClick={(e) => handleFavoriteClick(e, ad)}
              aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
            >
              <HeartIcon
                filled={!!ad.favorite}
                className={`${styles.heartIcon} ${ad.favorite ? styles.heartFilled : styles.heartOutline}`}
                size={16}
              />
            </button>
            <h2 className={styles.adRowTitle}>{ad.title}</h2>
            <p className={styles.adRowPrice}>
              {formatPrice(ad.price, ad.currency)}
              {ad.isNegotiable && ` (${t('ads.negotiable')})`}
            </p>
            {(ad.region || ad.category) && (
              <p className={styles.adRowMeta}>
                {ad.region || ad.category}
              </p>
            )}
            {desc && (
              <p className={styles.adRowDesc}>{desc.length > 80 ? `${desc.slice(0, 80)}…` : desc}</p>
            )}
            {ad.createdAt && (
              <p className={styles.adRowDate}>{formatAdCardDate(ad.createdAt, dateLabels)}</p>
            )}
          </div>
        </Link>
        <div className={styles.adRowSeller}>
          <div className={styles.adRowSellerTop}>
            <div className={styles.adRowAvatarWrap}>
              {isAvatarPhoto ? (
                <img src={imageUrl(ad.userAvatar)} alt="" className={styles.adRowAvatar} />
              ) : avatarEmoji ? (
                <span className={styles.adRowAvatarEmoji} aria-hidden>{avatarEmoji}</span>
              ) : (
                <span className={styles.adRowAvatarInitial} aria-hidden>
                  {sellerName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <Link to={sellerPath(ad.userId)} className={styles.adRowSellerName} onClick={(e) => e.stopPropagation()}>
              {sellerName}
            </Link>
          </div>
          {(ad.totalReviews ?? 0) > 0 && (
            <RatingStars averageRating={ad.averageRating} totalReviews={ad.totalReviews} t={t} />
          )}
          <div className={styles.adRowActions}>
            {ad.phone && (
              phoneRevealed ? (
                <a
                  href={`tel:${(ad.phone || '').replace(/\D/g, '')}`}
                  className={styles.adRowPhoneLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatPhone(ad.phone)}
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleShowPhone(ad.id) }}
                  title={!isAuthenticated ? t('ads.phoneLoginRequired') : undefined}
                >
                  {t('ads.showPhone')}
                </button>
              )
            )}
            {ad.userId && String(ad.userId) !== String(user?.id) && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWriteSeller(ad) }}
              >
                <i className="bi bi-chat-dots me-1" aria-hidden /> {t('ads.chatWith')}
              </button>
            )}
          </div>
        </div>
      </li>
    )
  }

  const AdCard = ({ ad }) => (
    <li key={ad.id} className={`${styles.card} app-card app-card-hover`}>
      <Link to={adsPath(ad.id)} className={styles.cardLink}>
        <span className={styles.cardImageWrap}>
          <span className={`badge position-absolute top-0 start-0 m-2 ${ad.sellerIsStore ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
            {ad.sellerIsStore ? 'Магазин' : 'Частный'}
          </span>
          <CardGallery
            imageUrls={ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])}
          />
        </span>
        <div className={styles.cardBody}>
          <div className={styles.cardPriceRow}>
            <p className={styles.cardPrice}>
              {formatPrice(ad.price, ad.currency)}
              {ad.isNegotiable && ` (${t('ads.negotiable')})`}
            </p>
            <button
              type="button"
              className={styles.favoriteBtn}
              onClick={(e) => handleFavoriteClick(e, ad)}
              aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
            >
              <HeartIcon
                filled={!!ad.favorite}
                className={`${styles.heartIcon} ${ad.favorite ? styles.heartFilled : styles.heartOutline}`}
                size={18}
              />
            </button>
          </div>
          <h2 className={styles.cardTitle}>{ad.title}</h2>
          {(ad.region || ad.category) && (
            <p className={styles.cardMeta}>
              {ad.category}
              {ad.region && ` · ${ad.region}`}
            </p>
          )}
          {ad.userId && String(ad.userId) !== String(user?.id) && (
            <button
              type="button"
              className="btn btn-primary btn-sm mt-1"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWriteSeller(ad) }}
            >
              <i className="bi bi-chat-dots me-1" aria-hidden /> {t('ads.chatWith')}
            </button>
          )}
        </div>
      </Link>
    </li>
  )

  return (
    <div className="page-container app-page">
      {hasCategory && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-2 mb-md-3">
            <li className="breadcrumb-item">
              <Link to={ROUTES.HOME}>{t('nav.home')}</Link>
            </li>
            {categoryBreadcrumb.length > 0 ? (
              categoryBreadcrumb.map((crumb, i) => {
                const isLast = i === categoryBreadcrumb.length - 1
                return (
                  <li key={crumb.code} className={`breadcrumb-item ${isLast ? 'active' : ''}`} aria-current={isLast ? 'page' : undefined}>
                    {isLast ? (
                      categoryName(crumb)
                    ) : (
                      <Link to={adsCategoryPathWithParams(crumb.code, searchParams)}>{categoryName(crumb)}</Link>
                    )}
                  </li>
                )
              })
            ) : (
              <li className="breadcrumb-item active" aria-current="page">{currentCategory ? categoryName(currentCategory) : t('nav.services')}</li>
            )}
          </ol>
        </nav>
      )}
      <div className={hasCategory ? styles.layoutWithSidebar : styles.layoutSimple}>
        {hasCategory && (
          <AdsFiltersSidebar
            regions={regions}
            sidebarCategories={sidebarCategories}
            currentCategoryCode={category}
            sidebarTitle={currentCategory ? categoryName(currentCategory) : t('ads.adsInUzbekistan')}
            filterDraft={filterDraft}
            setFilterDraft={setFilterDraft}
            region={region}
            setRegion={setRegion}
            brandId={brandId}
            setBrandId={setBrandId}
            isClothingCategory={isClothingCategory}
            onApply={() => applyFilters({
              [PARAMS.CATEGORY]: category || undefined,
              [PARAMS.REGION]: region || undefined,
              [PARAMS.BRAND]: filterDraft.brandId || undefined,
              [PARAMS.QUERY]: query || undefined,
              [PARAMS.SELLER_TYPE]: (Array.isArray(filterDraft.sellerType) && filterDraft.sellerType.length > 0) ? filterDraft.sellerType : undefined,
              [PARAMS.HAS_LICENSE]: filterDraft.hasLicense === true || filterDraft.hasLicense === 'true' ? 'true' : filterDraft.hasLicense === false || filterDraft.hasLicense === 'false' ? 'false' : undefined,
              [PARAMS.WORKS_BY_CONTRACT]: filterDraft.worksByContract === true || filterDraft.worksByContract === 'true' ? 'true' : filterDraft.worksByContract === false || filterDraft.worksByContract === 'false' ? 'false' : undefined,
              [PARAMS.PRICE_FROM]: filterDraft.priceFrom || undefined,
              [PARAMS.PRICE_TO]: filterDraft.priceTo || undefined,
              [PARAMS.CURRENCY]: filterDraft.currency === 'FROM_AD' ? undefined : filterDraft.currency || undefined,
              [PARAMS.URGENT_BARGAIN]: filterDraft.urgentBargain ? 'true' : undefined,
              [PARAMS.CAN_DELIVER]: filterDraft.canDeliver ? 'true' : undefined,
              [PARAMS.GIVE_AWAY]: filterDraft.giveAway ? 'true' : undefined,
              [PARAMS.ITEM_CONDITION]: (Array.isArray(filterDraft.itemCondition) && filterDraft.itemCondition.length > 0) ? filterDraft.itemCondition : undefined,
              [PARAMS.HAND_MADE_ONLY]: filterDraft.handMadeOnly === true ? 'true' : filterDraft.handMadeOnly === false ? 'false' : undefined,
              [PARAMS.CAN_RENT]: filterDraft.canRent === true ? 'true' : filterDraft.canRent === false ? 'false' : undefined,
            })}
            onReset={resetFilters}
            brands={brands}
            buildCategoryLink={(c) => categoryPathWithParams(c, searchParams)}
            buildAdsLink={(c) => adsCategoryPathWithParams(c, searchParams)}
            t={t}
            lang={lang}
          />
        )}
        <main className={hasCategory ? styles.mainContent : ''}>
          {!hasCategory && (
            <div className="mb-3">
              <label className="form-label small">{t('ads.region')}</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="form-select form-select-sm"
                style={{ maxWidth: '200px' }}
              >
                <option value="">— {t('ads.allRegions')}</option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {lang === 'ru' ? r.nameRu : r.nameUz}
                  </option>
                ))}
              </select>
            </div>
          )}
          {hasCategory && (
            <div className={`${styles.sellBanner} app-card`}>
              <div className={styles.sellBannerText}>
                <p className={styles.sellBannerTitle}>{t('ads.sellAndEarn')}</p>
                <p className={styles.sellBannerSubtitle}>{t('profile.ctaReviewsHint')}</p>
              </div>
              <div className={styles.sellBannerImgWrap}>
                <img src={bannerImg} alt="" className={styles.sellBannerImg} />
              </div>
              <div className={styles.sellBannerActions}>
                <Link to={ROUTES.ADS_CREATE} className="btn btn-primary btn-lg text-white">
                  {t('ads.postAd')}
                </Link>
              </div>
            </div>
          )}
          <h1 className="h2 mb-3">
            {hasCategory ? (currentCategory ? categoryName(currentCategory) : t('nav.services')) : t('ads.listTitle')}
          </h1>
          {ads.length === 0 ? (
            <p className={styles.noAds}>{t('ads.noAds')}</p>
          ) : (
            <div className={styles.listWrap}>
              {hasCategory ? (
                <ul className={styles.adRowList}>
                  {ads.map((ad) => (
                    <AdRow key={ad.id} ad={ad} />
                  ))}
                </ul>
              ) : (
                <ul className={styles.grid}>
                  {ads.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </ul>
              )}
              {loading && (
                <div className={styles.listLoadingOverlay} aria-busy="true">
                  <span className={styles.listLoadingSpinner} aria-hidden />
                  <span className={styles.listLoadingOverlayText}>{t('common.loading')}</span>
                </div>
              )}
            </div>
          )}
          {ads.length > 0 && !data.last && (
            <div className={styles.showMoreWrap}>
              <button
                type="button"
                className={styles.showMoreBtn}
                onClick={() => setPage(page + 1)}
                disabled={loading}
                aria-label={t('common.showMore')}
              >
                {loading ? t('common.loading') : t('common.showMore')}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
