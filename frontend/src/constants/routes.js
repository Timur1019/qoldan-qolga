/**
 * Маршруты и ключи query-параметров.
 * Один источник правды для навигации и открытия модалок.
 */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  REGIONS: '/regions',
  RULES: '/rules',
  /** Правила в кабинете (сайдбар профиля) */
  DASHBOARD_RULES: '/dashboard/rules',
  ADS: '/ads',
  ADS_CREATE: '/ads/create',
  /** Профиль: мои объявления (внутри dashboard с сайдбаром) */
  ADS_MY: '/dashboard/ads',
  CATEGORIES_OPEN: '/?open=categories',
  /** Профиль: избранное (внутри dashboard с сайдбаром) */
  FAVORITES: '/dashboard/favorites',
  /** Мои отзывы */
  REVIEWS_MY: '/dashboard/reviews',
  CHAT: '/dashboard/chat',
  /** Редактирование профиля */
  PROFILE_EDIT: '/dashboard/profile/edit',
  /** Callback после MyID WebSDK */
  VERIFICATION_CALLBACK: '/dashboard/verification/callback',
  /** Результат оплаты продвижения */
  PROMO_RESULT: '/dashboard/promo/result',
  DASHBOARD: '/dashboard',
  /** Qoldan Qolga для бизнеса — форма заявки на статус «Магазин» */
  BUSINESS: '/business',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
}

export const PARAMS = {
  AUTH: 'auth',
  AUTH_LOGIN: 'login',
  AUTH_REGISTER: 'register',
  /** URL для редиректа после логина */
  FROM: 'from',
  OPEN_CATEGORIES: 'open',
  OPEN_CATEGORIES_VALUE: 'categories',
  CATEGORY: 'category',
  REGION: 'region',
  PAGE: 'page',
  /** Поиск по объявлениям (заголовок, описание) */
  QUERY: 'q',
  SELLER_TYPE: 'sellerType',
  HAS_LICENSE: 'hasLicense',
  WORKS_BY_CONTRACT: 'worksByContract',
  PRICE_FROM: 'priceFrom',
  PRICE_TO: 'priceTo',
  CURRENCY: 'currency',
  URGENT_BARGAIN: 'urgentBargain',
  CAN_DELIVER: 'canDeliver',
  GIVE_AWAY: 'giveAway',
  BRAND: 'brandId',
  MODEL: 'modelId',
  YEAR_FROM: 'yearFrom',
  YEAR_TO: 'yearTo',
  MILEAGE_FROM: 'mileageFrom',
  MILEAGE_TO: 'mileageTo',
  BODY_TYPE: 'bodyType',
  TRANSMISSION: 'transmission',
  FUEL_TYPE: 'fuelType',
  DRIVE_TYPE: 'driveType',
  ENGINE_VOLUME_FROM: 'engineVolumeFrom',
  ENGINE_VOLUME_TO: 'engineVolumeTo',
  EXTERIOR_COLOR: 'exteriorColor',
  SEATS: 'seats',
  STEERING: 'steering',
  OWNERS_COUNT: 'ownersCount',
  /** Состояние: USED (Б/у) | NEW (Новое) | HANDMADE (Ручная работа) */
  ITEM_CONDITION: 'itemCondition',
  /** Ручная работа: true = только ручная работа, false = исключить */
  HAND_MADE_ONLY: 'handMadeOnly',
  /** Возможна аренда (для одежды/обуви) */
  CAN_RENT: 'canRent',
  /** Сортировка ленты: recommended | newest | priceAsc | priceDesc */
  SORT: 'sort',
  /** Вид ленты: list | grid | map */
  VIEW: 'view',
  DISTRICT: 'district',
  DEAL_TYPE: 'dealType',
  ROOMS: 'rooms',
  AREA_FROM: 'areaFrom',
  AREA_TO: 'areaTo',
  LAND_AREA_FROM: 'landAreaFrom',
  LAND_AREA_TO: 'landAreaTo',
  FLOOR_FROM: 'floorFrom',
  FLOOR_TO: 'floorTo',
  BUILDING_TYPE: 'buildingType',
  RENOVATION: 'renovation',
  FURNISHED: 'furnished',
  JOB_PROFESSION: 'jobProfession',
  JOB_INDUSTRY: 'jobIndustry',
  JOB_PRIORITY: 'jobPriority',
  JOB_EMPLOYMENT: 'jobEmployment',
  JOB_SCHEDULE: 'jobSchedule',
  JOB_WORK_FORMAT: 'jobWorkFormat',
  JOB_SALARY_PERIOD: 'jobSalaryPeriod',
  JOB_PAY_FREQUENCY: 'jobPayFrequency',
  JOB_EXPERIENCE: 'jobExperience',
  JOB_CITIZENSHIP: 'jobCitizenship',
  JOB_AGE_FROM: 'jobAgeFrom',
  JOB_AGE_TO: 'jobAgeTo',
  JOB_COMPANY_VERIFIED: 'jobCompanyVerified',
  JOB_LARGE_COMPANY: 'jobLargeCompany',
  JOB_BENEFITS: 'jobBenefits',
  JOB_FOR_CANDIDATES: 'jobForCandidates',
}

/** Код корневой категории «Одежда и обувь» — от него зависят фильтры (состояние, аренда). */
export const CLOTHING_ROOT_CODE = 'Odezhda_obuv'

/** Код ветки «Детская одежда и обувь» внутри «Для детей». */
export const KIDS_CLOTHING_CODE = 'Detskaya_odezhda_obuv'

const CLOTHING_TREE_CODES = [CLOTHING_ROOT_CODE, KIDS_CLOTHING_CODE]

export function isClothingTree(categoryCode, breadcrumb) {
  if (CLOTHING_TREE_CODES.includes(categoryCode)) return true
  return Array.isArray(breadcrumb) && breadcrumb.some((c) => CLOTHING_TREE_CODES.includes(c.code))
}

export function rulesDocPath(slug) {
  return `${ROUTES.RULES}/${encodeURIComponent(slug)}`
}

export function adsPath(id) {
  return `${ROUTES.ADS}/${id}`
}

export function adsEditPath(id) {
  return `${ROUTES.ADS}/${id}/edit`
}

export function adsCategoryPath(code) {
  if (!code) return ROUTES.HOME
  const params = new URLSearchParams()
  params.set(PARAMS.CATEGORY, code)
  return `${ROUTES.ADS}?${params}`
}

export function adsCategoryPathWithParams(categoryCode, searchParams) {
  const params = new URLSearchParams(searchParams || '')
  if (categoryCode) params.set(PARAMS.CATEGORY, categoryCode)
  else params.delete(PARAMS.CATEGORY)
  const qs = params.toString()
  if (!categoryCode) return qs ? `${ROUTES.HOME}?${qs}` : ROUTES.HOME
  return `${ROUTES.ADS}?${qs}`
}

export function categoryPath(code) {
  return `/categories/${encodeURIComponent(code)}`
}

/** Ссылка на категорию с текущими параметрами фильтров */
export function categoryPathWithParams(code, searchParams) {
  const path = `/categories/${encodeURIComponent(code)}`
  const qs = searchParams?.toString?.()
  return qs ? `${path}?${qs}` : path
}

export function sellerPath(userId) {
  return `/users/${encodeURIComponent(userId)}`
}
