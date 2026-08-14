import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { useAuth } from '../../../../context/AuthContext'
import { useAuthModal } from '../../../../hooks'
import { adsApi, referenceApi, chatApi, currencyApi } from '../../services/adApi'
import { useFavoriteClick } from '../../../../hooks'
import { filterPublicAds } from '../../utils/publicAds'
import { useAdsListFilters, filtersToListApiParams } from '../../hooks/useAdsListFilters'
import { PARAMS, ROUTES, isClothingTree, categoryPathWithParams, adsCategoryPathWithParams } from '../../../../constants/routes'
import { transportFieldFlags } from '../../../../constants/transport'
import { realEstateFieldFlags } from '../../../../constants/realEstate'
import { categoryFilterFlags } from '../../../../constants/categoryFilters'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import AdsFiltersSidebar from '../../components/AdsFiltersSidebar'
import AdsFilterBar from '../../components/AdsFilterBar'
import PopularBrands from '../../components/PopularBrands'
import AdsListAdRow from '../../components/AdsListAdRow/AdsListAdRow'
import AdsListRowSkeleton from '../../../../components/ui/AdsListRowSkeleton/AdsListRowSkeleton'
import ContentReveal from '../../../../components/ui/ContentReveal/ContentReveal'
import LoadMoreButton from '../../../../components/ui/LoadMoreButton/LoadMoreButton'
import HomeSellBanner from '../../../../components/HomeSellBanner/HomeSellBanner'
import styles from './AdsList.module.css'

const PAGE_SIZE = 12

export default function AdsList() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const openAuthModal = useAuthModal()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    filters,
    patchFilters,
    setSort,
    setCurrency,
    toggleFlag,
    clearFilterKeys,
  } = useAdsListFilters()
  const category = filters.category
  const region = filters.region
  const brandId = filters.brandId
  const query = filters.query
  const sellerTypes = filters.sellerType
  const hasLicense = searchParams.get(PARAMS.HAS_LICENSE)
  const worksByContract = searchParams.get(PARAMS.WORKS_BY_CONTRACT)
  const priceFrom = filters.priceFrom
  const priceTo = filters.priceTo
  const currency = filters.currency === 'FROM_AD' ? '' : filters.currency
  const urgentBargain = filters.urgentBargain ? 'true' : null
  const canDeliver = filters.canDeliver ? 'true' : null
  const giveAway = filters.giveAway ? 'true' : null
  const itemConditions = filters.itemCondition
  const handMadeOnlyParam = searchParams.get(PARAMS.HAND_MADE_ONLY)
  const handMadeOnly = handMadeOnlyParam === 'true' ? true : handMadeOnlyParam === 'false' ? false : null
  const canRentParam = searchParams.get(PARAMS.CAN_RENT)
  const [regions, setRegions] = useState([])
  const [sidebarCategories, setSidebarCategories] = useState([])
  const [currentCategoryInfo, setCurrentCategoryInfo] = useState(null)
  const [categoryBreadcrumb, setCategoryBreadcrumb] = useState([]) /* путь от корня до текущей категории */
  const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0, last: true })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadedPage, setLoadedPage] = useState(0)
  const [error, setError] = useState('')
  const [phoneRevealedIds, setPhoneRevealedIds] = useState(new Set())
  const buildFilterDraftFromParams = useCallback((params) => ({
    region: params.get(PARAMS.REGION) || '',
    sellerType: params.getAll(PARAMS.SELLER_TYPE) || [],
    hasLicense: params.get(PARAMS.HAS_LICENSE) === 'true' ? true : params.get(PARAMS.HAS_LICENSE) === 'false' ? false : '',
    worksByContract: params.get(PARAMS.WORKS_BY_CONTRACT) === 'true' ? true : params.get(PARAMS.WORKS_BY_CONTRACT) === 'false' ? false : '',
    priceFrom: params.get(PARAMS.PRICE_FROM) || '',
    priceTo: params.get(PARAMS.PRICE_TO) || '',
    currency: params.get(PARAMS.CURRENCY) || 'FROM_AD',
    urgentBargain: params.get(PARAMS.URGENT_BARGAIN) === 'true',
    canDeliver: params.get(PARAMS.CAN_DELIVER) === 'true',
    giveAway: params.get(PARAMS.GIVE_AWAY) === 'true',
    brandId: params.get(PARAMS.BRAND) || '',
    modelId: params.get(PARAMS.MODEL) || '',
    yearFrom: params.get(PARAMS.YEAR_FROM) || '',
    yearTo: params.get(PARAMS.YEAR_TO) || '',
    mileageFrom: params.get(PARAMS.MILEAGE_FROM) || '',
    mileageTo: params.get(PARAMS.MILEAGE_TO) || '',
    bodyType: params.getAll(PARAMS.BODY_TYPE) || [],
    transmission: params.getAll(PARAMS.TRANSMISSION) || [],
    fuelType: params.getAll(PARAMS.FUEL_TYPE) || [],
    driveType: params.getAll(PARAMS.DRIVE_TYPE) || [],
    engineVolumeFrom: params.get(PARAMS.ENGINE_VOLUME_FROM) || '',
    engineVolumeTo: params.get(PARAMS.ENGINE_VOLUME_TO) || '',
    exteriorColor: params.getAll(PARAMS.EXTERIOR_COLOR) || [],
    seats: params.getAll(PARAMS.SEATS) || [],
    steering: params.getAll(PARAMS.STEERING) || [],
    ownersCount: params.getAll(PARAMS.OWNERS_COUNT) || [],
    dealType: params.getAll(PARAMS.DEAL_TYPE) || [],
    rooms: params.getAll(PARAMS.ROOMS) || [],
    areaFrom: params.get(PARAMS.AREA_FROM) || '',
    areaTo: params.get(PARAMS.AREA_TO) || '',
    landAreaFrom: params.get(PARAMS.LAND_AREA_FROM) || '',
    landAreaTo: params.get(PARAMS.LAND_AREA_TO) || '',
    floorFrom: params.get(PARAMS.FLOOR_FROM) || '',
    floorTo: params.get(PARAMS.FLOOR_TO) || '',
    buildingType: params.getAll(PARAMS.BUILDING_TYPE) || [],
    renovation: params.getAll(PARAMS.RENOVATION) || [],
    furnished: params.get(PARAMS.FURNISHED) === 'true' ? true : params.get(PARAMS.FURNISHED) === 'false' ? false : null,
    itemCondition: params.getAll(PARAMS.ITEM_CONDITION) || [],
    handMadeOnly: params.get(PARAMS.HAND_MADE_ONLY) === 'true' ? true : params.get(PARAMS.HAND_MADE_ONLY) === 'false' ? false : '',
    canRent: params.get(PARAMS.CAN_RENT) === 'true' ? true : params.get(PARAMS.CAN_RENT) === 'false' ? false : '',
  }), [])

  const [filterDraft, setFilterDraft] = useState(() => buildFilterDraftFromParams(searchParams))
  const [brands, setBrands] = useState([])
  const [usdToUzs, setUsdToUzs] = useState(12800)
  const hasCategory = Boolean(category)
  const displayCurrency = filters.currency || 'FROM_AD'

  const applyDisplayCurrency = useCallback((value) => {
    setFilterDraft((d) => ({ ...d, currency: value }))
    setCurrency(value)
  }, [setCurrency])

  /** Синхронизация draft с URL только при смене категории / назад-вперёд — не сбрасывать чекбоксы при каждом клике. */
  const appliedFiltersKey = [
    category,
    region,
    brandId,
    filters.modelId,
    filters.yearFrom,
    filters.yearTo,
    filters.mileageFrom,
    filters.mileageTo,
    (filters.bodyType || []).join(','),
    (filters.transmission || []).join(','),
    (filters.fuelType || []).join(','),
    (filters.driveType || []).join(','),
    filters.engineVolumeFrom,
    filters.engineVolumeTo,
    (filters.exteriorColor || []).join(','),
    (filters.seats || []).join(','),
    (filters.steering || []).join(','),
    (filters.ownersCount || []).join(','),
    (filters.dealType || []).join(','),
    (filters.rooms || []).join(','),
    filters.areaFrom,
    filters.areaTo,
    filters.landAreaFrom,
    filters.landAreaTo,
    filters.floorFrom,
    filters.floorTo,
    (filters.buildingType || []).join(','),
    (filters.renovation || []).join(','),
    filters.furnished,
    sellerTypes.join(','),
    itemConditions.join(','),
    hasLicense,
    worksByContract,
    priceFrom,
    priceTo,
    currency,
    urgentBargain,
    canDeliver,
    giveAway,
    handMadeOnlyParam,
    canRentParam,
  ].join('|')

  useEffect(() => {
    setFilterDraft(buildFilterDraftFromParams(searchParams))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- только при смене применённых фильтров в URL
  }, [appliedFiltersKey, buildFilterDraftFromParams])

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
    const ratePromise = currencyApi.getRate().catch(() => null)
    const breadcrumbPromise = hasCategory && category
      ? referenceApi.getCategoryBreadcrumb(category).then((path) => (Array.isArray(path) ? path : [])).catch(() => [])
      : Promise.resolve([])
    const categoryPromise = hasCategory && category
      ? referenceApi.getCategory(category).catch(() => null)
      : Promise.resolve(null)
    const childrenPromise = hasCategory && category
      ? referenceApi.getCategoryChildren(category).then((list) => (Array.isArray(list) ? list : [])).catch(() => [])
      : Promise.resolve([])
    const brandsPromise = category
      ? referenceApi.getBrandsByCategory(category).then((list) => (Array.isArray(list) ? list : [])).catch(() => [])
      : Promise.resolve([])

    Promise.all([
      regionsPromise,
      ratePromise,
      breadcrumbPromise,
      categoryPromise,
      childrenPromise,
      brandsPromise,
    ]).then(([r, rate, path, info, children, brandList]) => {
      setRegions(r)
      const value = Number(rate?.usdToUzs)
      if (value > 0) setUsdToUzs(value)
      setCategoryBreadcrumb(path)
      setCurrentCategoryInfo(info || null)
      setSidebarCategories(children.length > 0 ? children : (info ? [info] : []))
      setBrands(brandList)
    })
  }, [hasCategory, category])

  /** Сброс невалидной марки без перезагрузки всех справочников. */
  useEffect(() => {
    if (!brandId || brands.length === 0) return
    if (brands.some((b) => String(b.id) === String(brandId))) return
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete(PARAMS.BRAND)
      return next
    }, { replace: true })
  }, [brandId, brands, setSearchParams])

  const listQueryKey = useMemo(
    () => JSON.stringify(filtersToListApiParams({ ...filters, page: 0 }, { pageSize: PAGE_SIZE })),
    [filters],
  )

  useEffect(() => {
    const params = filtersToListApiParams({ ...filters, page: 0 }, { pageSize: PAGE_SIZE })
    const ac = new AbortController()
    setLoading(true)
    setError('')
    adsApi
      .list(params, { signal: ac.signal })
      .then((res) => {
        if (ac.signal.aborted) return
        setData({
          ...res,
          content: filterPublicAds(res?.content),
        })
        setLoadedPage(0)
      })
      .catch((e) => {
        if (ac.signal.aborted || e?.name === 'AbortError') return
        setError(e.message)
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })
    return () => ac.abort()
    // listQueryKey отражает все поля filtersToListApiParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listQueryKey])

  const loadMoreAds = useCallback(() => {
    if (data.last || loading || loadingMore) return
    const nextPage = loadedPage + 1
    setLoadingMore(true)
    adsApi
      .list(filtersToListApiParams({ ...filters, page: nextPage }, { pageSize: PAGE_SIZE }))
      .then((res) => {
        setData((prev) => ({
          ...res,
          content: [...(prev.content || []), ...filterPublicAds(res?.content)],
        }))
        setLoadedPage(nextPage)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingMore(false))
  }, [data.last, loading, loadingMore, loadedPage, filters])

  if (error) {
    return (
      <div className="page-container app-page">
        <div className="alert alert-danger" role="alert"><i className="bi bi-exclamation-circle me-2" aria-hidden />{error}</div>
      </div>
    )
  }

  const ads = data.content || []

  const applyFilters = (filters) => {
    const next = new URLSearchParams(searchParams)
    next.delete(PARAMS.PAGE)
    Object.entries(filters).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        next.delete(k)
        v.filter((x) => x != null && x !== '').forEach((x) => next.append(k, String(x)))
      } else if (v != null && v !== '' && v !== false) {
        next.set(k, String(v))
      } else if (v === false) {
        next.set(k, 'false')
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
    setFilterDraft(buildFilterDraftFromParams(next))
  }

  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const currentCategory = currentCategoryInfo || sidebarCategories.find((c) => c.code === category)
  const isClothingCategory = isClothingTree(category, categoryBreadcrumb)
  const transportFlags = transportFieldFlags(category, categoryBreadcrumb)
  const realEstateFlags = realEstateFieldFlags(category, categoryBreadcrumb)
  const filterFlags = categoryFilterFlags(category, categoryBreadcrumb)

  const filterBarCategoryLabel = currentCategory ? categoryName(currentCategory) : ''

  return (
    <div className="page-container app-page">
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
                    <span className="d-inline-flex align-items-center gap-1">
                      <CategoryIcon code={crumb.code} parentCode={crumb.parentCode} />
                      {categoryName(crumb)}
                    </span>
                  ) : (
                    <Link to={adsCategoryPathWithParams(crumb.code, searchParams)} className="d-inline-flex align-items-center gap-1">
                      <CategoryIcon code={crumb.code} parentCode={crumb.parentCode} />
                      {categoryName(crumb)}
                    </Link>
                  )}
                </li>
              )
            })
          ) : (
            <li className="breadcrumb-item active" aria-current="page">
              {currentCategory ? (
                <span className="d-inline-flex align-items-center gap-1">
                  <CategoryIcon code={currentCategory.code} parentCode={currentCategory.parentCode} />
                  {categoryName(currentCategory)}
                </span>
              ) : t('common.loading')}
            </li>
          )}
        </ol>
      </nav>
      <div className={styles.layoutWithSidebar}>
        <AdsFiltersSidebar
            regions={regions}
            sidebarCategories={sidebarCategories}
            currentCategoryCode={category}
            sidebarTitle={currentCategory ? categoryName(currentCategory) : t('ads.adsInUzbekistan')}
            filterDraft={filterDraft}
            setFilterDraft={setFilterDraft}
            onCurrencyChange={applyDisplayCurrency}
            isClothingCategory={isClothingCategory}
            transportFlags={transportFlags}
            realEstateFlags={realEstateFlags}
            filterFlags={filterFlags}
            onApply={() => applyFilters({
              [PARAMS.CATEGORY]: category || undefined,
              [PARAMS.REGION]: filterDraft.region || undefined,
              [PARAMS.BRAND]: filterDraft.brandId || undefined,
              [PARAMS.MODEL]: filterDraft.modelId || undefined,
              [PARAMS.YEAR_FROM]: filterDraft.yearFrom || undefined,
              [PARAMS.YEAR_TO]: filterDraft.yearTo || undefined,
              [PARAMS.MILEAGE_FROM]: filterDraft.mileageFrom || undefined,
              [PARAMS.MILEAGE_TO]: filterDraft.mileageTo || undefined,
              [PARAMS.BODY_TYPE]: (filterDraft.bodyType || []).length ? filterDraft.bodyType : undefined,
              [PARAMS.TRANSMISSION]: (filterDraft.transmission || []).length ? filterDraft.transmission : undefined,
              [PARAMS.FUEL_TYPE]: (filterDraft.fuelType || []).length ? filterDraft.fuelType : undefined,
              [PARAMS.DRIVE_TYPE]: (filterDraft.driveType || []).length ? filterDraft.driveType : undefined,
              [PARAMS.ENGINE_VOLUME_FROM]: filterDraft.engineVolumeFrom || undefined,
              [PARAMS.ENGINE_VOLUME_TO]: filterDraft.engineVolumeTo || undefined,
              [PARAMS.EXTERIOR_COLOR]: (filterDraft.exteriorColor || []).length ? filterDraft.exteriorColor : undefined,
              [PARAMS.SEATS]: (filterDraft.seats || []).length ? filterDraft.seats : undefined,
              [PARAMS.STEERING]: (filterDraft.steering || []).length ? filterDraft.steering : undefined,
              [PARAMS.OWNERS_COUNT]: (filterDraft.ownersCount || []).length ? filterDraft.ownersCount : undefined,
              [PARAMS.DEAL_TYPE]: (filterDraft.dealType || []).length ? filterDraft.dealType : undefined,
              [PARAMS.ROOMS]: (filterDraft.rooms || []).length ? filterDraft.rooms : undefined,
              [PARAMS.AREA_FROM]: filterDraft.areaFrom || undefined,
              [PARAMS.AREA_TO]: filterDraft.areaTo || undefined,
              [PARAMS.LAND_AREA_FROM]: filterDraft.landAreaFrom || undefined,
              [PARAMS.LAND_AREA_TO]: filterDraft.landAreaTo || undefined,
              [PARAMS.FLOOR_FROM]: filterDraft.floorFrom || undefined,
              [PARAMS.FLOOR_TO]: filterDraft.floorTo || undefined,
              [PARAMS.BUILDING_TYPE]: (filterDraft.buildingType || []).length ? filterDraft.buildingType : undefined,
              [PARAMS.RENOVATION]: (filterDraft.renovation || []).length ? filterDraft.renovation : undefined,
              [PARAMS.FURNISHED]: filterDraft.furnished === true ? 'true' : filterDraft.furnished === false ? 'false' : undefined,
              [PARAMS.QUERY]: query || undefined,
              [PARAMS.SELLER_TYPE]: (Array.isArray(filterDraft.sellerType) && filterDraft.sellerType.length > 0) ? filterDraft.sellerType : undefined,
              [PARAMS.HAS_LICENSE]: filterDraft.hasLicense === true ? 'true' : filterDraft.hasLicense === false ? 'false' : undefined,
              [PARAMS.WORKS_BY_CONTRACT]: filterDraft.worksByContract === true ? 'true' : filterDraft.worksByContract === false ? 'false' : undefined,
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
        <main className={styles.mainContent}>
          <AdsFilterBar
            filters={filters}
            patchFilters={patchFilters}
            setCurrency={setCurrency}
            setSort={setSort}
            toggleFlag={toggleFlag}
            clearFilterKeys={clearFilterKeys}
            resetAllFilters={() => {
              const next = new URLSearchParams()
              if (category) next.set(PARAMS.CATEGORY, category)
              if (query) next.set(PARAMS.QUERY, query)
              setSearchParams(next)
              setFilterDraft(buildFilterDraftFromParams(next))
            }}
            categoryName={filterBarCategoryLabel}
            lang={lang}
            t={t}
            isClothingCategory={isClothingCategory}
            transportFlags={transportFlags}
            realEstateFlags={realEstateFlags}
            filterFlags={filterFlags}
            brands={brands}
          />
          {transportFlags.brand && brands.length > 0 && (
            <PopularBrands
              brands={brands}
              selectedBrandId={filters.brandId}
              onSelect={(brandId) => patchFilters({ brandId: brandId || '', modelId: '' })}
              lang={lang}
              t={t}
            />
          )}
          <HomeSellBanner t={t} compact />
          <h1 className="h2 mb-3 d-inline-flex align-items-center gap-2">
            {currentCategory ? <CategoryIcon code={currentCategory.code} parentCode={currentCategory.parentCode} /> : null}
            {currentCategory ? categoryName(currentCategory) : t('common.loading')}
          </h1>
          {loading && ads.length === 0 ? (
            <ul className={styles.adRowList} aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <AdsListRowSkeleton key={i} />
              ))}
            </ul>
          ) : ads.length === 0 ? (
            <p className={styles.noAds}>{t('ads.noAds')}</p>
          ) : (
            <ContentReveal>
              <div className={`${styles.listWrap} ${loading ? styles.listRefreshing : ''}`} aria-busy={loading || undefined}>
                <ul className={styles.adRowList}>
                  {ads.map((ad) => (
                    <AdsListAdRow
                      key={ad.id}
                      ad={ad}
                      lang={lang}
                      t={t}
                      userId={user?.id}
                      displayCurrency={displayCurrency}
                      usdToUzs={usdToUzs}
                      phoneRevealed={phoneRevealedIds.has(ad.id)}
                      isAuthenticated={isAuthenticated}
                      onFavoriteClick={handleFavoriteClick}
                      onWriteSeller={handleWriteSeller}
                      onShowPhone={handleShowPhone}
                    />
                  ))}
                  {loadingMore
                    ? Array.from({ length: 3 }, (_, i) => <AdsListRowSkeleton key={`more-${i}`} />)
                    : null}
                </ul>
              </div>
            </ContentReveal>
          )}
          {ads.length > 0 && !data.last && (
            <div className={styles.showMoreWrap}>
              <LoadMoreButton
                className={styles.showMoreBtn}
                loading={loadingMore}
                label={t('common.showMore')}
                onClick={loadMoreAds}
                disabled={loading}
                aria-label={t('common.showMore')}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
