import { useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { useAuth } from '../../../../context/AuthContext'
import { useAuthModal, useIsMobile, useFavoriteClick } from '../../../../hooks'
import { chatApi } from '@/api/chat'
import { useAdsListFilters } from '../../hooks/useAdsListFilters'
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
  const query = filters.query
  const displayCurrency = filters.currency || 'FROM_AD'
  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const currentCategory = currentCategoryInfo || sidebarCategories.find((c) => c.code === category)
  const isClothingCategory = isClothingTree(category, categoryBreadcrumb)
  const transportFlags = transportFieldFlags(category, categoryBreadcrumb)
  const realEstateFlags = realEstateFieldFlags(category, categoryBreadcrumb)
  const filterFlags = categoryFilterFlags(category, categoryBreadcrumb)

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
        )}
        <main className={styles.mainContent}>
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
          {!isMobile && <HomeSellBanner t={t} compact />}
          {!isMobile && (
            <h1 className="h2 mb-3 d-inline-flex align-items-center gap-2">
              {currentCategory ? <CategoryIcon code={currentCategory.code} parentCode={currentCategory.parentCode} /> : null}
              {currentCategory ? categoryName(currentCategory) : t('common.loading')}
            </h1>
          )}
          <AdsListResults
            ads={ads}
            data={data}
            loading={loading}
            loadingMore={loadingMore}
            displayCurrency={displayCurrency}
            usdToUzs={usdToUzs}
            phoneRevealedIds={phoneRevealedIds}
            isAuthenticated={isAuthenticated}
            userId={user?.id}
            lang={lang}
            t={t}
            onFavoriteClick={handleFavoriteClick}
            onWriteSeller={handleWriteSeller}
            onShowPhone={handleShowPhone}
            onLoadMore={loadMoreAds}
          />
        </main>
      </div>
    </div>
  )
}
