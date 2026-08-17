import { useCallback, useEffect, useState } from 'react'
import { PARAMS } from '../../../constants/routes'
import {
  buildAdsFilterDraftFromParams,
  draftToAdsListSearchParams,
  writeFiltersToSearchParams,
} from '../utils/adsListFilterDraft'

/**
 * Sidebar filter draft synced with applied URL filters.
 */
export default function useAdsListFilterDraft({
  searchParams,
  setSearchParams,
  filters,
  setCurrency,
}) {
  const category = filters.category
  const query = filters.query

  const appliedFiltersKey = [
    category,
    filters.region,
    filters.brandId,
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
    (filters.sellerType || []).join(','),
    (filters.itemCondition || []).join(','),
    searchParams.get(PARAMS.HAS_LICENSE),
    searchParams.get(PARAMS.WORKS_BY_CONTRACT),
    filters.priceFrom,
    filters.priceTo,
    filters.currency === 'FROM_AD' ? '' : filters.currency,
    filters.urgentBargain ? 'true' : null,
    filters.canDeliver ? 'true' : null,
    filters.giveAway ? 'true' : null,
    searchParams.get(PARAMS.HAND_MADE_ONLY),
    searchParams.get(PARAMS.CAN_RENT),
  ].join('|')

  const [filterDraft, setFilterDraft] = useState(() => buildAdsFilterDraftFromParams(searchParams))

  useEffect(() => {
    setFilterDraft(buildAdsFilterDraftFromParams(searchParams))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when applied URL filters change
  }, [appliedFiltersKey])

  const applyDisplayCurrency = useCallback((value) => {
    setFilterDraft((d) => ({ ...d, currency: value }))
    setCurrency(value)
  }, [setCurrency])

  const applyFilters = useCallback((nextFilters) => {
    setSearchParams(writeFiltersToSearchParams(searchParams, nextFilters), { replace: true })
  }, [searchParams, setSearchParams])

  const applyDraftFilters = useCallback(() => {
    applyFilters(draftToAdsListSearchParams(filterDraft, { category, query }))
  }, [applyFilters, filterDraft, category, query])

  const resetFilters = useCallback(() => {
    const next = new URLSearchParams()
    if (category) next.set(PARAMS.CATEGORY, category)
    if (query) next.set(PARAMS.QUERY, query)
    setSearchParams(next)
    setFilterDraft(buildAdsFilterDraftFromParams(next))
  }, [category, query, setSearchParams])

  return {
    filterDraft,
    setFilterDraft,
    applyDisplayCurrency,
    applyDraftFilters,
    resetFilters,
  }
}
