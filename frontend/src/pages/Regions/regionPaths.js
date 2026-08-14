import { PARAMS, ROUTES, categoryPath } from '../../constants/routes'

export function regionHomePath(regionCode) {
  if (!regionCode) return ROUTES.HOME
  return `${ROUTES.HOME}?${PARAMS.REGION}=${encodeURIComponent(regionCode)}`
}

export function categoryInRegionPath(category, regionCode) {
  if (!category?.code) return regionHomePath(regionCode)
  if (category.hasChildren) {
    const params = new URLSearchParams()
    if (regionCode) params.set(PARAMS.REGION, regionCode)
    const qs = params.toString()
    return qs ? `${categoryPath(category.code)}?${qs}` : categoryPath(category.code)
  }
  const params = new URLSearchParams()
  params.set(PARAMS.CATEGORY, category.code)
  if (regionCode) params.set(PARAMS.REGION, regionCode)
  return `${ROUTES.ADS}?${params}`
}

export function allCategoriesInRegionPath(regionCode) {
  if (!regionCode) return ROUTES.CATEGORIES_OPEN
  return `${ROUTES.HOME}?${PARAMS.REGION}=${encodeURIComponent(regionCode)}&${PARAMS.OPEN_CATEGORIES}=${PARAMS.OPEN_CATEGORIES_VALUE}`
}
