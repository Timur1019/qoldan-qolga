import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { referenceApi } from '../../services/adApi'
import { PARAMS, ROUTES, categoryPathWithParams, adsCategoryPathWithParams } from '../../../../constants/routes'
import AdsFiltersSidebar from '../../components/AdsFiltersSidebar'
import styles from './CategoryView.module.css'

const DEFAULT_FILTER_DRAFT = {
  sellerType: '',
  hasLicense: '',
  worksByContract: '',
  priceFrom: '',
  priceTo: '',
  currency: 'FROM_AD',
  urgentBargain: false,
  canDeliver: false,
  giveAway: false,
}

export default function CategoryView() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, lang } = useLang()
  const [category, setCategory] = useState(null)
  const [children, setChildren] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [filterDraft, setFilterDraft] = useState(DEFAULT_FILTER_DRAFT)

  const region = searchParams.get(PARAMS.REGION) || ''

  const name = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')

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

  useEffect(() => {
    if (!code) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setLoading(true)
    setNotFound(false)
    Promise.all([
      referenceApi.getCategory(code).catch(() => null),
      referenceApi.getCategoryChildren(code).catch(() => []),
    ]).then(([cat, list]) => {
      setCategory(cat || null)
      setChildren(Array.isArray(list) ? list : [])
      if (!cat) setNotFound(true)
      setLoading(false)
    })
  }, [code])

  useEffect(() => {
    referenceApi.getRegions().then(setRegions).catch(() => setRegions([]))
  }, [])

  useEffect(() => {
    if (loading || notFound) return
    if (!category) return
    if (children.length === 0) {
      navigate(adsCategoryPathWithParams(code, searchParams), { replace: true })
    }
  }, [loading, notFound, category, children.length, code, searchParams, navigate])

  const setRegion = (regionCode) => {
    const next = new URLSearchParams(searchParams)
    if (regionCode) next.set(PARAMS.REGION, regionCode)
    else next.delete(PARAMS.REGION)
    setSearchParams(next)
  }

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams)
    next.delete(PARAMS.PAGE)
    if (filterDraft.sellerType) next.set(PARAMS.SELLER_TYPE, filterDraft.sellerType)
    else next.delete(PARAMS.SELLER_TYPE)
    if (filterDraft.hasLicense) next.set(PARAMS.HAS_LICENSE, filterDraft.hasLicense)
    else next.delete(PARAMS.HAS_LICENSE)
    if (filterDraft.worksByContract) next.set(PARAMS.WORKS_BY_CONTRACT, filterDraft.worksByContract)
    else next.delete(PARAMS.WORKS_BY_CONTRACT)
    if (filterDraft.priceFrom) next.set(PARAMS.PRICE_FROM, filterDraft.priceFrom)
    else next.delete(PARAMS.PRICE_FROM)
    if (filterDraft.priceTo) next.set(PARAMS.PRICE_TO, filterDraft.priceTo)
    else next.delete(PARAMS.PRICE_TO)
    if (filterDraft.currency && filterDraft.currency !== 'FROM_AD') next.set(PARAMS.CURRENCY, filterDraft.currency)
    else next.delete(PARAMS.CURRENCY)
    if (filterDraft.urgentBargain) next.set(PARAMS.URGENT_BARGAIN, 'true')
    else next.delete(PARAMS.URGENT_BARGAIN)
    if (filterDraft.canDeliver) next.set(PARAMS.CAN_DELIVER, 'true')
    else next.delete(PARAMS.CAN_DELIVER)
    if (filterDraft.giveAway) next.set(PARAMS.GIVE_AWAY, 'true')
    else next.delete(PARAMS.GIVE_AWAY)
    setSearchParams(next)
  }

  const resetFilters = () => {
    setSearchParams({})
  }

  const buildCategoryLink = (catCode) => categoryPathWithParams(catCode, searchParams)
  const buildAdsLink = (catCode) => adsCategoryPathWithParams(catCode, searchParams)

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>{t('common.loading')}</p>
      </div>
    )
  }

  if (notFound || !category) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>{t('category.notFound')}</p>
        <Link to={ROUTES.HOME} className={styles.backLink}>{t('category.backHome')}</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to={ROUTES.HOME}>{t('nav.home')}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{name(category)}</span>
      </nav>
      <div className={styles.layoutWithSidebar}>
        <AdsFiltersSidebar
          regions={regions}
          sidebarCategories={children}
          filterDraft={filterDraft}
          setFilterDraft={setFilterDraft}
          region={region}
          setRegion={setRegion}
          onApply={applyFilters}
          onReset={resetFilters}
          buildCategoryLink={buildCategoryLink}
          buildAdsLink={buildAdsLink}
          t={t}
          lang={lang}
        />
        <main className={styles.mainContent}>
          <div className={styles.banner}>
            <p className={styles.bannerText}>{t('ads.sellAndEarn')}</p>
            <Link to="/ads/create" className={styles.bannerBtn}>{t('ads.postAd')}</Link>
          </div>
          <h1 className={styles.title}>{name(category)}</h1>
        </main>
      </div>
    </div>
  )
}
