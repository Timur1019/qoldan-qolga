import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { useAuth } from '../../../../context/AuthContext'
import { useAuthModal } from '../../../../hooks'
import { adsApi, referenceApi, chatApi, imageUrl } from '../../services/adApi'
import { useFavoriteClick } from '../../../../hooks'
import { formatPrice, formatAdCardDate } from '../../../../utils/formatters'
import { PARAMS, ROUTES, adsPath, adsCategoryPath, categoryPathWithParams, adsCategoryPathWithParams, sellerPath } from '../../../../constants/routes'
import HeartIcon from '../../../../components/ui/HeartIcon'
import AdsFiltersSidebar from '../../components/AdsFiltersSidebar'
import CardGallery from '../../components/CardGallery'
import styles from './AdsList.module.css'

const PAGE_SIZE = 20
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
  const query = searchParams.get(PARAMS.QUERY) || ''
  const page = Math.max(0, parseInt(searchParams.get(PARAMS.PAGE) || '0', 10) || 0)
  const sellerType = searchParams.get(PARAMS.SELLER_TYPE) || ''
  const hasLicense = searchParams.get(PARAMS.HAS_LICENSE)
  const worksByContract = searchParams.get(PARAMS.WORKS_BY_CONTRACT)
  const priceFrom = searchParams.get(PARAMS.PRICE_FROM) || ''
  const priceTo = searchParams.get(PARAMS.PRICE_TO) || ''
  const currency = searchParams.get(PARAMS.CURRENCY) || ''
  const urgentBargain = searchParams.get(PARAMS.URGENT_BARGAIN)
  const canDeliver = searchParams.get(PARAMS.CAN_DELIVER)
  const giveAway = searchParams.get(PARAMS.GIVE_AWAY)
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
    sellerType: '',
    hasLicense: '',
    worksByContract: '',
    priceFrom: '',
    priceTo: '',
    currency: 'FROM_AD',
    urgentBargain: false,
    canDeliver: false,
    giveAway: false,
  })
  const hasCategory = Boolean(category)

  useEffect(() => {
    setFilterDraft({
      sellerType: searchParams.get(PARAMS.SELLER_TYPE) || '',
      hasLicense: searchParams.get(PARAMS.HAS_LICENSE) || '',
      worksByContract: searchParams.get(PARAMS.WORKS_BY_CONTRACT) || '',
      priceFrom: searchParams.get(PARAMS.PRICE_FROM) || '',
      priceTo: searchParams.get(PARAMS.PRICE_TO) || '',
      currency: searchParams.get(PARAMS.CURRENCY) || 'FROM_AD',
      urgentBargain: searchParams.get(PARAMS.URGENT_BARGAIN) === 'true',
      canDeliver: searchParams.get(PARAMS.CAN_DELIVER) === 'true',
      giveAway: searchParams.get(PARAMS.GIVE_AWAY) === 'true',
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
    referenceApi.getCategory(category).then(async (info) => {
      setCurrentCategoryInfo(info || null)
      if (!info) {
        setCategoryBreadcrumb([])
        setSidebarCategories([])
        return
      }
      const path = [{ code: info.code, nameRu: info.nameRu, nameUz: info.nameUz }]
      let parentCode = info.parentCode ?? info.parent?.code
      let parentId = info.parentId ?? info.parent?.id
      while (parentCode || parentId) {
        try {
          if (parentCode) {
            const parent = await referenceApi.getCategory(parentCode)
            if (!parent) break
            path.unshift({ code: parent.code, nameRu: parent.nameRu, nameUz: parent.nameUz })
            parentCode = parent.parentCode ?? parent.parent?.code
            parentId = parent.parentId ?? parent.parent?.id
          } else if (parentId != null) {
            const all = await referenceApi.getCategories().catch(() => [])
            const flatten = (list) => (Array.isArray(list) ? list.flatMap((c) => [c, ...flatten(c.children || [])]) : [])
            const flat = Array.isArray(all) ? (all.some((c) => (c.children || []).length > 0) ? flatten(all) : all) : []
            const parent = flat.find((c) => c.id === parentId || c.id === Number(parentId))
            if (!parent || !parent.code) break
            path.unshift({ code: parent.code, nameRu: parent.nameRu, nameUz: parent.nameUz })
            parentCode = parent.parentCode ?? parent.parent?.code
            parentId = parent.parentId ?? parent.parent?.id
          } else break
        } catch {
          break
        }
      }
      setCategoryBreadcrumb(path)
      /* В сайдбаре — подкатегории текущей категории (по клику переход) */
      referenceApi.getCategoryChildren(category).then((list) => {
        const listArr = Array.isArray(list) ? list : []
        setSidebarCategories(listArr.length > 0 ? listArr : [info])
      }).catch(() => setSidebarCategories([info]))
    }).catch(() => {
      setCurrentCategoryInfo(null)
      setCategoryBreadcrumb([])
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
    const params = { page, size: PAGE_SIZE }
    if (category) params.category = category
    if (region) params.region = region
    if (query.trim()) params.q = query.trim()
    if (sellerType) params.sellerType = sellerType
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
    setLoading(true)
    adsApi
      .list(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [category, region, query, page, sellerType, hasLicense, worksByContract, priceFrom, priceTo, currency, urgentBargain, canDeliver, giveAway])

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

  const setRegion = (code) => {
    const next = new URLSearchParams(searchParams)
    if (code) next.set(PARAMS.REGION, code)
    else next.delete(PARAMS.REGION)
    setSearchParams(next)
  }

  const applyFilters = (filters) => {
    const next = new URLSearchParams(searchParams)
    next.delete(PARAMS.PAGE)
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null && v !== '') next.set(k, String(v))
      else next.delete(k)
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
            filterDraft={filterDraft}
            setFilterDraft={setFilterDraft}
            region={region}
            setRegion={setRegion}
            onApply={() => applyFilters({
              [PARAMS.CATEGORY]: category || undefined,
              [PARAMS.REGION]: region || undefined,
              [PARAMS.QUERY]: query || undefined,
              [PARAMS.SELLER_TYPE]: filterDraft.sellerType || undefined,
              [PARAMS.HAS_LICENSE]: filterDraft.hasLicense || undefined,
              [PARAMS.WORKS_BY_CONTRACT]: filterDraft.worksByContract || undefined,
              [PARAMS.PRICE_FROM]: filterDraft.priceFrom || undefined,
              [PARAMS.PRICE_TO]: filterDraft.priceTo || undefined,
              [PARAMS.CURRENCY]: filterDraft.currency === 'FROM_AD' ? undefined : filterDraft.currency || undefined,
              [PARAMS.URGENT_BARGAIN]: filterDraft.urgentBargain ? 'true' : undefined,
              [PARAMS.CAN_DELIVER]: filterDraft.canDeliver ? 'true' : undefined,
              [PARAMS.GIVE_AWAY]: filterDraft.giveAway ? 'true' : undefined,
            })}
            onReset={resetFilters}
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
            <div className="app-card d-flex align-items-center justify-content-between gap-3 p-3 mb-3">
              <p className="mb-0 fw-semibold">{t('ads.sellAndEarn')}</p>
              <Link to="/ads/create" className="btn btn-primary">{t('ads.postAd')}</Link>
            </div>
          )}
          <h1 className="h2 mb-3">
            {hasCategory ? (currentCategory ? categoryName(currentCategory) : t('nav.services')) : t('ads.listTitle')}
          </h1>
          {loading && ads.length === 0 ? (
            <div className={styles.listLoading} aria-busy="true">
              <span className={styles.listLoadingSpinner} aria-hidden />
              <p>{t('common.loading')}</p>
            </div>
          ) : ads.length === 0 ? (
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
          {data.totalPages > 1 && (
            <nav className="mt-3" aria-label={t('ads.pagination')}>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item" style={{ minWidth: '2.5rem', textAlign: 'center' }}>
                  <span className="page-link border-0 bg-transparent small">
                    {page + 1} / {data.totalPages}
                    {data.totalElements != null && ` (${data.totalElements})`}
                  </span>
                </li>
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={data.first ?? page <= 0}
                    aria-label={t('ads.prevPage')}
                  >
                    <i className="bi bi-chevron-left" aria-hidden />
                  </button>
                </li>
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={data.last ?? page >= data.totalPages - 1}
                    aria-label={t('ads.nextPage')}
                  >
                    <i className="bi bi-chevron-right" aria-hidden />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </main>
      </div>
    </div>
  )
}
