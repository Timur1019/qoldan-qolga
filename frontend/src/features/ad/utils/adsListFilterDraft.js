import { PARAMS } from '../../../constants/routes'

/** Parse URL search params into sidebar filter draft. */
export function buildAdsFilterDraftFromParams(params) {
  return {
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
    jobProfession: params.getAll(PARAMS.JOB_PROFESSION) || [],
    jobIndustry: params.getAll(PARAMS.JOB_INDUSTRY) || [],
    jobPriority: params.get(PARAMS.JOB_PRIORITY) || 'ANY',
    jobEmployment: params.getAll(PARAMS.JOB_EMPLOYMENT) || [],
    jobSchedule: params.getAll(PARAMS.JOB_SCHEDULE) || [],
    jobWorkFormat: params.get(PARAMS.JOB_WORK_FORMAT) || 'ANY',
    jobSalaryPeriod: params.get(PARAMS.JOB_SALARY_PERIOD) || 'ANY',
    jobPayFrequency: params.getAll(PARAMS.JOB_PAY_FREQUENCY) || [],
    jobExperience: params.get(PARAMS.JOB_EXPERIENCE) || '',
    jobCitizenship: params.get(PARAMS.JOB_CITIZENSHIP) || '',
    jobAgeFrom: params.get(PARAMS.JOB_AGE_FROM) || '',
    jobAgeTo: params.get(PARAMS.JOB_AGE_TO) || '',
    jobCompanyVerified: params.get(PARAMS.JOB_COMPANY_VERIFIED) === 'true',
    jobLargeCompany: params.get(PARAMS.JOB_LARGE_COMPANY) === 'true',
    jobBenefits: params.getAll(PARAMS.JOB_BENEFITS) || [],
    jobForCandidates: params.getAll(PARAMS.JOB_FOR_CANDIDATES) || [],
    query: params.get(PARAMS.QUERY) || '',
  }
}

/** Map sidebar draft → URL params object for applyFilters. */
export function draftToAdsListSearchParams(filterDraft, { category, query }) {
  return {
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
    [PARAMS.JOB_PROFESSION]: (filterDraft.jobProfession || []).length ? filterDraft.jobProfession : undefined,
    [PARAMS.JOB_INDUSTRY]: (filterDraft.jobIndustry || []).length ? filterDraft.jobIndustry : undefined,
    [PARAMS.JOB_PRIORITY]: filterDraft.jobPriority && filterDraft.jobPriority !== 'ANY' ? filterDraft.jobPriority : undefined,
    [PARAMS.JOB_EMPLOYMENT]: (filterDraft.jobEmployment || []).length ? filterDraft.jobEmployment : undefined,
    [PARAMS.JOB_SCHEDULE]: (filterDraft.jobSchedule || []).length ? filterDraft.jobSchedule : undefined,
    [PARAMS.JOB_WORK_FORMAT]: filterDraft.jobWorkFormat && filterDraft.jobWorkFormat !== 'ANY' ? filterDraft.jobWorkFormat : undefined,
    [PARAMS.JOB_SALARY_PERIOD]: filterDraft.jobSalaryPeriod && filterDraft.jobSalaryPeriod !== 'ANY' ? filterDraft.jobSalaryPeriod : undefined,
    [PARAMS.JOB_PAY_FREQUENCY]: (filterDraft.jobPayFrequency || []).length ? filterDraft.jobPayFrequency : undefined,
    [PARAMS.JOB_EXPERIENCE]: filterDraft.jobExperience || undefined,
    [PARAMS.JOB_CITIZENSHIP]: filterDraft.jobCitizenship || undefined,
    [PARAMS.JOB_AGE_FROM]: filterDraft.jobAgeFrom || undefined,
    [PARAMS.JOB_AGE_TO]: filterDraft.jobAgeTo || undefined,
    [PARAMS.JOB_COMPANY_VERIFIED]: filterDraft.jobCompanyVerified ? 'true' : undefined,
    [PARAMS.JOB_LARGE_COMPANY]: filterDraft.jobLargeCompany ? 'true' : undefined,
    [PARAMS.JOB_BENEFITS]: (filterDraft.jobBenefits || []).length ? filterDraft.jobBenefits : undefined,
    [PARAMS.JOB_FOR_CANDIDATES]: (filterDraft.jobForCandidates || []).length ? filterDraft.jobForCandidates : undefined,
    [PARAMS.QUERY]: filterDraft.query || query || undefined,
  }
}

export function writeFiltersToSearchParams(searchParams, filters) {
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
  return next
}
