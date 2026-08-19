import { useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { useAuth } from '../../../../context/AuthContext'
import { useAuthModal, useIsMobile, useFavoriteClick } from '../../../../hooks'
import { chatApi } from '@/api/chat'
import { useAdsListFilters } from '../../hooks/useAdsListFilters'
import { ADS_VIEW, useAdsListView } from '../../hooks/useAdsListView'
import useAdsListFilterDraft from '../../hooks/useAdsListFilterDraft'
import useAdsListReferences from '../../hooks/useAdsListReferences'
import useAdsListData from '../../hooks/useAdsListData'
import { ROUTES, isClothingTree, categoryPathWithParams, adsCategoryPathWithParams } from '../../../../constants/routes'
import { transportFieldFlags } from '../../../../constants/transport'
import { realEstateFieldFlags } from '../../../../constants/realEstate'
import { categoryFilterFlags } from '../../../../constants/categoryFilters'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import AdsFiltersSidebar from '../../components/AdsFiltersSidebar'
import AdsFilterBar from '../../components/AdsFilterBar'
import PopularBrands from '../../components/PopularBrands'
import AdsListBreadcrumb from '../../components/AdsListBreadcrumb'
import AdsListResults from '../../components/AdsListResults'
import AdsViewModeSwitch from '../../components/AdsViewModeSwitch'
import AdsShowOnMapButton from '../../components/AdsShowOnMapButton'
import AdsMapBanner from '../../components/AdsMapBanner'
import AdsListMapView from '../../components/AdsListMapView'
import HomeSellBanner from '../../../../components/HomeSellBanner/HomeSellBanner'
import styles from './AdsList.module.css'

export default function AdsList() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const isMobile = useIsMobile()
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
  const { view, isMap, setView, openMap, closeMap } = useAdsListView()

  const {
    filterDraft,
    setFilterDraft,
    applyDisplayCurrency,
    applyDraftFilters,
    resetFilters,
  } = useAdsListFilterDraft({
    searchParams,
    setSearchParams,
    filters,
    setCurrency,
  })

  const {
    regions,
    sidebarCategories,
    currentCategoryInfo,
    categoryBreadcrumb,
    brands,
    usdToUzs,
  } = useAdsListReferences({
    category: filters.category,
    brandId: filters.brandId,
    setSearchParams,
  })

  const {
    data,
    loading,
    loadingMore,
    error,
    loadMoreAds,
    updateAdFavorite,
  } = useAdsListData(filters)

  const [phoneRevealedIds, setPhoneRevealedIds] = useState(new Set())
  const [hoveredAdId, setHoveredAdId] = useState(null)
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

  if (error) {
    return (
      <div className="page-container app-page">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-circle me-2" aria-hidden />{error}
        </div>
      </div>
    )
  }

  const ads = data.content || []
  const category = filters.category
  const displayCurrency = filters.currency || 'FROM_AD'
  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const currentCategory = currentCategoryInfo || sidebarCategories.find((c) => c.code === category)
  const isClothingCategory = isClothingTree(category, categoryBreadcrumb)
  const transportFlags = transportFieldFlags(category, categoryBreadcrumb)
  const realEstateFlags = realEstateFieldFlags(category, categoryBreadcrumb)
  const filterFlags = categoryFilterFlags(category, categoryBreadcrumb)
  const pageTitle = currentCategory ? categoryName(currentCategory) : t('ads.listTitle')

  const renderFilterBar = (compact = false) => (
    <AdsFilterBar
      filters={filters}
      patchFilters={patchFilters}
      setCurrency={setCurrency}
      setSort={setSort}
      toggleFlag={toggleFlag}
      clearFilterKeys={clearFilterKeys}
      resetAllFilters={resetFilters}
      categoryName={currentCategory ? categoryName(currentCategory) : ''}
      lang={lang}
      t={t}
      isClothingCategory={isClothingCategory}
      transportFlags={transportFlags}
      realEstateFlags={realEstateFlags}
      filterFlags={filterFlags}
      brands={brands}
      compact={compact}
      endSlot={(
        <>
          {!compact && <AdsShowOnMapButton onClick={openMap} t={t} />}
          <AdsViewModeSwitch view={view} onChange={setView} t={t} />
        </>
      )}
    />
  )

  const resultsProps = {
    ads,
    data,
    loading,
    loadingMore,
    displayCurrency,
    usdToUzs,
    phoneRevealedIds,
    isAuthenticated,
    userId: user?.id,
    lang,
    t,
    onFavoriteClick: handleFavoriteClick,
    onWriteSeller: handleWriteSeller,
    onShowPhone: handleShowPhone,
    onLoadMore: loadMoreAds,
  }

  if (isMap) {
    return (
      <AdsListMapView
        {...resultsProps}
        regionCode={filters.region}
        title={currentCategory ? pageTitle : t('ads.listTitle')}
        filterBar={renderFilterBar(true)}
        onClose={closeMap}
      />
    )
  }

  return (
    <div className="page-container app-page">
      {!isMobile && (
        <AdsListBreadcrumb
          categoryBreadcrumb={categoryBreadcrumb}
          currentCategory={currentCategory}
          categoryName={categoryName}
          searchParams={searchParams}
          t={t}
        />
      )}
      <div className={styles.layoutWithSidebar}>
        {!isMobile && (
          <div className={styles.sidebarCol}>
            <AdsMapBanner
              ads={ads}
              regionCode={filters.region}
              t={t}
              onOpen={openMap}
              activeId={hoveredAdId}
            />
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
              onApply={applyDraftFilters}
              onReset={resetFilters}
              brands={brands}
              buildCategoryLink={(c) => categoryPathWithParams(c, searchParams)}
              buildAdsLink={(c) => adsCategoryPathWithParams(c, searchParams)}
              t={t}
              lang={lang}
            />
          </div>
        )}
        <main className={styles.mainContent}>
          {isMobile && (
            <div className={styles.mobileMap}>
              <AdsMapBanner
                ads={ads}
                regionCode={filters.region}
                t={t}
                onOpen={openMap}
                activeId={hoveredAdId}
              />
            </div>
          )}
          {renderFilterBar()}
          {transportFlags.brand && brands.length > 0 && (
            <PopularBrands
              brands={brands}
              selectedBrandId={filters.brandId}
              onSelect={(brandId) => patchFilters({ brandId: brandId || '', modelId: '' })}
              lang={lang}
              t={t}
            />
          )}
          {!isMobile && <HomeSellBanner t={t} compact />}
          {!isMobile && (
            <h1 className="h2 mb-3 d-inline-flex align-items-center gap-2">
              {currentCategory ? <CategoryIcon code={currentCategory.code} parentCode={currentCategory.parentCode} /> : null}
              {pageTitle}
            </h1>
          )}
          <AdsListResults
            {...resultsProps}
            layout={view === ADS_VIEW.GRID ? ADS_VIEW.GRID : ADS_VIEW.LIST}
            activeAdId={hoveredAdId}
            onAdHover={setHoveredAdId}
          />
        </main>
      </div>
    </div>
  )
}
