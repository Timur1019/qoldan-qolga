/**
 * URL ↔ фильтры списка объявлений.
 * Не раздувает Home / AdsList.
 */
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PARAMS } from '../../../constants/routes'

export const SORT_VALUES = {
  RECOMMENDED: 'recommended',
  NEWEST: 'newest',
  PRICE_ASC: 'priceAsc',
  PRICE_DESC: 'priceDesc',
}

/** Spring Pageable: sort=field,dir (несколько sort — массив) */
export function sortToApiParams(sortKey) {
  switch (sortKey) {
    case SORT_VALUES.PRICE_ASC:
      return { sort: 'price,asc' }
    case SORT_VALUES.PRICE_DESC:
      return { sort: 'price,desc' }
    case SORT_VALUES.RECOMMENDED:
      return { sort: ['promoPriority,desc', 'boostedAt,desc', 'createdAt,desc'] }
    case SORT_VALUES.NEWEST:
    default:
      return { sort: 'createdAt,desc' }
  }
}

function parseBoolParam(v) {
  if (v === 'true') return true
  if (v === 'false') return false
  return null
}

export function readFiltersFromSearchParams(params) {
  const handMade = parseBoolParam(params.get(PARAMS.HAND_MADE_ONLY))
  const canRent = parseBoolParam(params.get(PARAMS.CAN_RENT))
  const furnished = parseBoolParam(params.get(PARAMS.FURNISHED))
  return {
    category: params.get(PARAMS.CATEGORY) || '',
    region: params.get(PARAMS.REGION) || '',
    district: params.get(PARAMS.DISTRICT) || '',
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
    furnished: furnished,
    query: params.get(PARAMS.QUERY) || '',
    sellerType: params.getAll(PARAMS.SELLER_TYPE) || [],
    hasLicense: parseBoolParam(params.get(PARAMS.HAS_LICENSE)),
    worksByContract: parseBoolParam(params.get(PARAMS.WORKS_BY_CONTRACT)),
    priceFrom: params.get(PARAMS.PRICE_FROM) || '',
    priceTo: params.get(PARAMS.PRICE_TO) || '',
    currency: params.get(PARAMS.CURRENCY) || 'FROM_AD',
    urgentBargain: params.get(PARAMS.URGENT_BARGAIN) === 'true',
    canDeliver: params.get(PARAMS.CAN_DELIVER) === 'true',
    giveAway: params.get(PARAMS.GIVE_AWAY) === 'true',
    itemCondition: params.getAll(PARAMS.ITEM_CONDITION) || [],
    handMadeOnly: handMade,
    canRent: canRent === true ? true : canRent === false ? false : '',
    jobProfession: params.getAll(PARAMS.JOB_PROFESSION) || [],
    jobIndustry: params.getAll(PARAMS.JOB_INDUSTRY) || [],
    jobPriority: params.get(PARAMS.JOB_PRIORITY) || '',
    jobEmployment: params.getAll(PARAMS.JOB_EMPLOYMENT) || [],
    jobSchedule: params.getAll(PARAMS.JOB_SCHEDULE) || [],
    jobWorkFormat: params.get(PARAMS.JOB_WORK_FORMAT) || '',
    jobSalaryPeriod: params.get(PARAMS.JOB_SALARY_PERIOD) || '',
    jobPayFrequency: params.getAll(PARAMS.JOB_PAY_FREQUENCY) || [],
    jobExperience: params.get(PARAMS.JOB_EXPERIENCE) || '',
    jobCitizenship: params.get(PARAMS.JOB_CITIZENSHIP) || '',
    jobAgeFrom: params.get(PARAMS.JOB_AGE_FROM) || '',
    jobAgeTo: params.get(PARAMS.JOB_AGE_TO) || '',
    jobCompanyVerified: params.get(PARAMS.JOB_COMPANY_VERIFIED) === 'true',
    jobLargeCompany: params.get(PARAMS.JOB_LARGE_COMPANY) === 'true',
    jobBenefits: params.getAll(PARAMS.JOB_BENEFITS) || [],
    jobForCandidates: params.getAll(PARAMS.JOB_FOR_CANDIDATES) || [],
    sort: params.get(PARAMS.SORT) || SORT_VALUES.NEWEST,
    page: Math.max(0, parseInt(params.get(PARAMS.PAGE) || '0', 10) || 0),
  }
}

/** Собрать параметры для adsApi.list (без currency — только отображение). */
export function filtersToListApiParams(filters, { pageSize = 40 } = {}) {
  const params = {
    page: filters.page || 0,
    size: pageSize,
    ...sortToApiParams(filters.sort),
  }
  if (filters.category) params.category = filters.category
  if (filters.region) params.region = filters.region
  if (filters.brandId) params.brandId = filters.brandId
  if (filters.modelId) params.modelId = filters.modelId
  if (filters.yearFrom) params.yearFrom = filters.yearFrom
  if (filters.yearTo) params.yearTo = filters.yearTo
  if (filters.mileageFrom) params.mileageFrom = filters.mileageFrom
  if (filters.mileageTo) params.mileageTo = filters.mileageTo
  if (filters.bodyType?.length) params.bodyType = filters.bodyType
  if (filters.transmission?.length) params.transmission = filters.transmission
  if (filters.fuelType?.length) params.fuelType = filters.fuelType
  if (filters.driveType?.length) params.driveType = filters.driveType
  if (filters.engineVolumeFrom) params.engineVolumeFrom = filters.engineVolumeFrom
  if (filters.engineVolumeTo) params.engineVolumeTo = filters.engineVolumeTo
  if (filters.exteriorColor?.length) params.exteriorColor = filters.exteriorColor
  if (filters.seats?.length) params.seats = filters.seats
  if (filters.steering?.length) params.steering = filters.steering
  if (filters.ownersCount?.length) params.ownersCount = filters.ownersCount
  if (filters.district) params.district = filters.district
  if (filters.dealType?.length) params.dealType = filters.dealType
  if (filters.rooms?.length) params.rooms = filters.rooms
  if (filters.areaFrom) params.areaFrom = filters.areaFrom
  if (filters.areaTo) params.areaTo = filters.areaTo
  if (filters.landAreaFrom) params.landAreaFrom = filters.landAreaFrom
  if (filters.landAreaTo) params.landAreaTo = filters.landAreaTo
  if (filters.floorFrom) params.floorFrom = filters.floorFrom
  if (filters.floorTo) params.floorTo = filters.floorTo
  if (filters.buildingType?.length) params.buildingType = filters.buildingType
  if (filters.renovation?.length) params.renovation = filters.renovation
  if (filters.furnished === true) params.furnished = true
  if (filters.furnished === false) params.furnished = false
  if (filters.query?.trim()) params.q = filters.query.trim()
  if (filters.sellerType?.length) params.sellerType = filters.sellerType
  if (filters.hasLicense === true) params.hasLicense = true
  if (filters.hasLicense === false) params.hasLicense = false
  if (filters.worksByContract === true) params.worksByContract = true
  if (filters.worksByContract === false) params.worksByContract = false
  if (filters.priceFrom?.trim()) params.priceFrom = filters.priceFrom.trim()
  if (filters.priceTo?.trim()) params.priceTo = filters.priceTo.trim()
  if (filters.urgentBargain) params.urgentBargain = true
  if (filters.canDeliver) params.canDeliver = true
  if (filters.giveAway) params.giveAway = true
  if (filters.itemCondition?.length) params.itemCondition = filters.itemCondition
  if (filters.handMadeOnly === true) params.handMadeOnly = true
  if (filters.handMadeOnly === false) params.handMadeOnly = false
  if (filters.canRent === true) params.canRent = true
  if (filters.canRent === false) params.canRent = false
  if (filters.jobProfession?.length) params.jobProfession = filters.jobProfession
  if (filters.jobIndustry?.length) params.jobIndustry = filters.jobIndustry
  if (filters.jobPriority) params.jobPriority = filters.jobPriority
  if (filters.jobEmployment?.length) params.jobEmployment = filters.jobEmployment
  if (filters.jobSchedule?.length) params.jobSchedule = filters.jobSchedule
  if (filters.jobWorkFormat) params.jobWorkFormat = filters.jobWorkFormat
  if (filters.jobSalaryPeriod) params.jobSalaryPeriod = filters.jobSalaryPeriod
  if (filters.jobPayFrequency?.length) params.jobPayFrequency = filters.jobPayFrequency
  if (filters.jobExperience) params.jobExperience = filters.jobExperience
  if (filters.jobCitizenship) params.jobCitizenship = filters.jobCitizenship
  if (filters.jobAgeFrom) params.jobAgeFrom = filters.jobAgeFrom
  if (filters.jobAgeTo) params.jobAgeTo = filters.jobAgeTo
  if (filters.jobCompanyVerified) params.jobCompanyVerified = true
  if (filters.jobLargeCompany) params.jobLargeCompany = true
  if (filters.jobBenefits?.length) params.jobBenefits = filters.jobBenefits
  if (filters.jobForCandidates?.length) params.jobForCandidates = filters.jobForCandidates
  return params
}

function setOrDelete(next, key, value) {
  if (value == null || value === '' || value === false) next.delete(key)
  else next.set(key, String(value))
}

function setArray(next, key, arr) {
  next.delete(key)
  ;(arr || []).filter(Boolean).forEach((v) => next.append(key, String(v)))
}

export function useAdsListFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => readFiltersFromSearchParams(searchParams), [searchParams])

  const patchFilters = useCallback((patch, { replace = true, resetPage = true } = {}) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      const merged = { ...readFiltersFromSearchParams(prev), ...patch }

      setOrDelete(next, PARAMS.CATEGORY, merged.category || undefined)
      setOrDelete(next, PARAMS.REGION, merged.region || undefined)
      setOrDelete(next, PARAMS.BRAND, merged.brandId || undefined)
      setOrDelete(next, PARAMS.MODEL, merged.modelId || undefined)
      setOrDelete(next, PARAMS.YEAR_FROM, merged.yearFrom || undefined)
      setOrDelete(next, PARAMS.YEAR_TO, merged.yearTo || undefined)
      setOrDelete(next, PARAMS.MILEAGE_FROM, merged.mileageFrom || undefined)
      setOrDelete(next, PARAMS.MILEAGE_TO, merged.mileageTo || undefined)
      setArray(next, PARAMS.BODY_TYPE, merged.bodyType)
      setArray(next, PARAMS.TRANSMISSION, merged.transmission)
      setArray(next, PARAMS.FUEL_TYPE, merged.fuelType)
      setArray(next, PARAMS.DRIVE_TYPE, merged.driveType)
      setOrDelete(next, PARAMS.ENGINE_VOLUME_FROM, merged.engineVolumeFrom || undefined)
      setOrDelete(next, PARAMS.ENGINE_VOLUME_TO, merged.engineVolumeTo || undefined)
      setArray(next, PARAMS.EXTERIOR_COLOR, merged.exteriorColor)
      setArray(next, PARAMS.SEATS, merged.seats)
      setArray(next, PARAMS.STEERING, merged.steering)
      setArray(next, PARAMS.OWNERS_COUNT, merged.ownersCount)
      setOrDelete(next, PARAMS.DISTRICT, merged.district || undefined)
      setArray(next, PARAMS.DEAL_TYPE, merged.dealType)
      setArray(next, PARAMS.ROOMS, merged.rooms)
      setOrDelete(next, PARAMS.AREA_FROM, merged.areaFrom || undefined)
      setOrDelete(next, PARAMS.AREA_TO, merged.areaTo || undefined)
      setOrDelete(next, PARAMS.LAND_AREA_FROM, merged.landAreaFrom || undefined)
      setOrDelete(next, PARAMS.LAND_AREA_TO, merged.landAreaTo || undefined)
      setOrDelete(next, PARAMS.FLOOR_FROM, merged.floorFrom || undefined)
      setOrDelete(next, PARAMS.FLOOR_TO, merged.floorTo || undefined)
      setArray(next, PARAMS.BUILDING_TYPE, merged.buildingType)
      setArray(next, PARAMS.RENOVATION, merged.renovation)
      if (merged.furnished === true) next.set(PARAMS.FURNISHED, 'true')
      else if (merged.furnished === false) next.set(PARAMS.FURNISHED, 'false')
      else next.delete(PARAMS.FURNISHED)
      setOrDelete(next, PARAMS.QUERY, merged.query?.trim() || undefined)
      setArray(next, PARAMS.SELLER_TYPE, merged.sellerType)
      if (merged.hasLicense === true) next.set(PARAMS.HAS_LICENSE, 'true')
      else if (merged.hasLicense === false) next.set(PARAMS.HAS_LICENSE, 'false')
      else next.delete(PARAMS.HAS_LICENSE)
      if (merged.worksByContract === true) next.set(PARAMS.WORKS_BY_CONTRACT, 'true')
      else if (merged.worksByContract === false) next.set(PARAMS.WORKS_BY_CONTRACT, 'false')
      else next.delete(PARAMS.WORKS_BY_CONTRACT)
      setOrDelete(next, PARAMS.PRICE_FROM, merged.priceFrom || undefined)
      setOrDelete(next, PARAMS.PRICE_TO, merged.priceTo || undefined)
      if (!merged.currency || merged.currency === 'FROM_AD') next.delete(PARAMS.CURRENCY)
      else next.set(PARAMS.CURRENCY, merged.currency)
      setOrDelete(next, PARAMS.URGENT_BARGAIN, merged.urgentBargain ? 'true' : undefined)
      setOrDelete(next, PARAMS.CAN_DELIVER, merged.canDeliver ? 'true' : undefined)
      setOrDelete(next, PARAMS.GIVE_AWAY, merged.giveAway ? 'true' : undefined)
      setArray(next, PARAMS.ITEM_CONDITION, merged.itemCondition)
      if (merged.handMadeOnly === true) next.set(PARAMS.HAND_MADE_ONLY, 'true')
      else if (merged.handMadeOnly === false) next.set(PARAMS.HAND_MADE_ONLY, 'false')
      else next.delete(PARAMS.HAND_MADE_ONLY)
      if (merged.canRent === true) next.set(PARAMS.CAN_RENT, 'true')
      else if (merged.canRent === false) next.set(PARAMS.CAN_RENT, 'false')
      else next.delete(PARAMS.CAN_RENT)
      setArray(next, PARAMS.JOB_PROFESSION, merged.jobProfession)
      setArray(next, PARAMS.JOB_INDUSTRY, merged.jobIndustry)
      setOrDelete(next, PARAMS.JOB_PRIORITY, merged.jobPriority || undefined)
      setArray(next, PARAMS.JOB_EMPLOYMENT, merged.jobEmployment)
      setArray(next, PARAMS.JOB_SCHEDULE, merged.jobSchedule)
      setOrDelete(next, PARAMS.JOB_WORK_FORMAT, merged.jobWorkFormat || undefined)
      setOrDelete(next, PARAMS.JOB_SALARY_PERIOD, merged.jobSalaryPeriod || undefined)
      setArray(next, PARAMS.JOB_PAY_FREQUENCY, merged.jobPayFrequency)
      setOrDelete(next, PARAMS.JOB_EXPERIENCE, merged.jobExperience || undefined)
      setOrDelete(next, PARAMS.JOB_CITIZENSHIP, merged.jobCitizenship || undefined)
      setOrDelete(next, PARAMS.JOB_AGE_FROM, merged.jobAgeFrom || undefined)
      setOrDelete(next, PARAMS.JOB_AGE_TO, merged.jobAgeTo || undefined)
      setOrDelete(next, PARAMS.JOB_COMPANY_VERIFIED, merged.jobCompanyVerified ? 'true' : undefined)
      setOrDelete(next, PARAMS.JOB_LARGE_COMPANY, merged.jobLargeCompany ? 'true' : undefined)
      setArray(next, PARAMS.JOB_BENEFITS, merged.jobBenefits)
      setArray(next, PARAMS.JOB_FOR_CANDIDATES, merged.jobForCandidates)
      if (!merged.sort || merged.sort === SORT_VALUES.NEWEST) next.delete(PARAMS.SORT)
      else next.set(PARAMS.SORT, merged.sort)

      if (resetPage) next.delete(PARAMS.PAGE)
      return next
    }, { replace })
  }, [setSearchParams])

  const setSort = useCallback((sort) => {
    patchFilters({ sort })
  }, [patchFilters])

  const setCurrency = useCallback((currency) => {
    patchFilters({ currency }, { resetPage: false })
  }, [patchFilters])

  const toggleFlag = useCallback((key) => {
    patchFilters({ [key]: !filters[key] })
  }, [filters, patchFilters])

  const clearFilterKeys = useCallback((keys) => {
    const patch = {}
    keys.forEach((k) => {
      if (
        k === 'sellerType' || k === 'itemCondition' || k === 'bodyType' || k === 'transmission'
        || k === 'fuelType' || k === 'driveType' || k === 'dealType' || k === 'rooms'
        || k === 'buildingType' || k === 'renovation'
        || k === 'exteriorColor' || k === 'seats' || k === 'steering' || k === 'ownersCount'
      ) patch[k] = []
      else if (k === 'currency') patch[k] = 'FROM_AD'
      else if (k === 'urgentBargain' || k === 'canDeliver' || k === 'giveAway') patch[k] = false
      else if (k === 'hasLicense' || k === 'worksByContract' || k === 'handMadeOnly' || k === 'furnished') patch[k] = null
      else if (k === 'canRent') patch[k] = ''
      else patch[k] = ''
    })
    patchFilters(patch)
  }, [patchFilters])

  const resetAllFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams()
      const q = prev.get(PARAMS.QUERY)
      if (q) next.set(PARAMS.QUERY, q)
      return next
    }, { replace: true })
  }, [setSearchParams])

  return {
    filters,
    searchParams,
    setSearchParams,
    patchFilters,
    setSort,
    setCurrency,
    toggleFlag,
    clearFilterKeys,
    resetAllFilters,
  }
}
