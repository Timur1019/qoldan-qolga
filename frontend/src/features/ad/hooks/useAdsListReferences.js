import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'
import { currencyApi } from '@/api/currency'
import { PARAMS } from '../../../constants/routes'

/**
 * Regions, category tree, brands and FX rate for AdsList.
 */
export default function useAdsListReferences({ category, brandId, setSearchParams }) {
  const hasCategory = Boolean(category)
  const [regions, setRegions] = useState([])
  const [sidebarCategories, setSidebarCategories] = useState([])
  const [currentCategoryInfo, setCurrentCategoryInfo] = useState(null)
  const [categoryBreadcrumb, setCategoryBreadcrumb] = useState([])
  const [brands, setBrands] = useState([])
  const [usdToUzs, setUsdToUzs] = useState(12800)

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

  useEffect(() => {
    if (!brandId || brands.length === 0) return
    if (brands.some((b) => String(b.id) === String(brandId))) return
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete(PARAMS.BRAND)
      return next
    }, { replace: true })
  }, [brandId, brands, setSearchParams])

  return {
    regions,
    sidebarCategories,
    currentCategoryInfo,
    categoryBreadcrumb,
    brands,
    usdToUzs,
  }
}
