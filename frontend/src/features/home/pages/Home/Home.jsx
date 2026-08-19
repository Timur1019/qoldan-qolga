import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '@/context/LangContext'
import { referenceApi } from '@/api/reference'
import { adsApi } from '@/api/ads'
import { useFavoriteClick } from '@/hooks'
import { PARAMS } from '@/constants/routes'
import { AdCard, AdCardGrid, filterPublicAds } from '@/features/ad'
import HomeCategoryGrid, { HomeCategoryGridSkeleton } from '../../components/HomeCategoryGrid'
import HomeBusinessPanel from '../../components/HomeBusinessPanel'
import HomeSellBanner from '@/components/HomeSellBanner/HomeSellBanner'
import HomePromoSection from '../../components/HomePromoSection'
import AdCardSkeletonGrid from '@/components/ui/AdCardSkeletonGrid/AdCardSkeletonGrid'
import ContentReveal from '@/components/ui/ContentReveal/ContentReveal'
import LoadMoreButton from '@/components/ui/LoadMoreButton/LoadMoreButton'
import styles from './Home.module.css'

const HOME_ADS_PAGE_SIZE = 10

export default function Home() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const region = searchParams.get(PARAMS.REGION) || ''
  const query = (searchParams.get(PARAMS.QUERY) || '').trim()
  const [categories, setCategories] = useState([])
  const [adsData, setAdsData] = useState({ content: [] })
  const [adsPage, setAdsPage] = useState(0)
  const [adsLastPage, setAdsLastPage] = useState(false)
  const [adsLoading, setAdsLoading] = useState(true)
  const [adsLoadingMore, setAdsLoadingMore] = useState(false)
  const [promoBanners, setPromoBanners] = useState([])

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
    const adsParams = { page: 0, size: HOME_ADS_PAGE_SIZE, sort: ['promoPriority,desc', 'boostedAt,desc', 'createdAt,desc'] }
    if (region) adsParams.region = region
    if (query) adsParams.q = query
    const adsPromise = adsApi.list(adsParams).then((data) => data || { content: [] }).catch(() => ({ content: [] }))
    const promoPromise = referenceApi.getHomePromoBanners().then((list) => (Array.isArray(list) ? list : [])).catch(() => [])

    setAdsLoading(true)
    setAdsPage(0)
    Promise.all([categoriesPromise, adsPromise, promoPromise])
      .then(([cats, ads, promo]) => {
        setCategories(cats)
        setAdsData({
          ...ads,
          content: filterPublicAds(ads.content),
        })
        const totalPages = typeof ads.totalPages === 'number' ? ads.totalPages : 1
        const isLast = typeof ads.last === 'boolean' ? ads.last : true
        setAdsLastPage(isLast || 1 >= totalPages)
        setPromoBanners(promo)
      })
      .finally(() => setAdsLoading(false))
  }, [region, query])

  const loadMoreAds = useCallback(() => {
    if (adsLastPage || adsLoadingMore) return
    const nextPage = adsPage + 1
    setAdsLoadingMore(true)
    const params = { page: nextPage, size: HOME_ADS_PAGE_SIZE, sort: ['promoPriority,desc', 'boostedAt,desc', 'createdAt,desc'] }
    if (region) params.region = region
    if (query) params.q = query
    adsApi
      .list(params)
      .then((res) => {
        const data = res || { content: [] }
        const newContent = data.content || []
        setAdsData((prev) => ({
          ...prev,
          content: [...(prev.content || []), ...filterPublicAds(newContent)],
        }))
        setAdsPage(nextPage)
        const totalPages = typeof data.totalPages === 'number' ? data.totalPages : nextPage + 1
        const isLast = typeof data.last === 'boolean' ? data.last : nextPage + 1 >= totalPages
        setAdsLastPage(isLast)
      })
      .catch(() => {})
      .finally(() => setAdsLoadingMore(false))
  }, [adsPage, adsLastPage, adsLoadingMore, region, query])

  const ads = adsData.content || []
  const categoriesLoading = adsLoading && categories.length === 0

  return (
    <div className={`page-container app-page ${styles.homePage}`}>
      <h1 className={styles.title}>{t('home.title')}</h1>

      <div className={styles.topRow}>
        <div className={styles.topMain}>
          {categoriesLoading ? (
            <HomeCategoryGridSkeleton />
          ) : (
            <HomeCategoryGrid categories={categories} lang={lang} t={t} />
          )}
          <HomeSellBanner t={t} className={styles.homeSellBanner} />
        </div>
        <div className={styles.topSide}>
          <HomeBusinessPanel t={t} />
        </div>
      </div>
      <HomePromoSection banners={promoBanners} t={t} />

      <section className={styles.adsSection}>
        <h2 className={styles.adsSectionTitle}>{t('ads.listTitle')}</h2>
        {adsLoading ? (
          <AdCardSkeletonGrid count={HOME_ADS_PAGE_SIZE} />
        ) : ads.length === 0 ? (
          <p className={styles.adsEmpty}>{t('ads.noAds')}</p>
        ) : (
          <ContentReveal>
            <AdCardGrid>
              {ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  t={t}
                  onFavoriteClick={handleFavoriteClick}
                  favorite={!!ad.favorite}
                />
              ))}
            </AdCardGrid>
            {adsLoadingMore ? (
              <AdCardSkeletonGrid count={4} className={styles.loadingMoreGrid} />
            ) : null}
          </ContentReveal>
        )}
        {!adsLoading && ads.length > 0 && !adsLastPage && (
          <div className={styles.adsFooter}>
            <LoadMoreButton
              className={styles.showMoreBtn}
              loading={adsLoadingMore}
              label={t('common.showMore')}
              onClick={loadMoreAds}
            />
          </div>
        )}
      </section>
    </div>
  )
}
