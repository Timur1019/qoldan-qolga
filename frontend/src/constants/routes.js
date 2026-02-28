/**
 * Маршруты и ключи query-параметров.
 * Один источник правды для навигации и открытия модалок.
 */

export const ROUTES = {
  HOME: '/',
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
  DASHBOARD: '/dashboard',
  /** Qoldan Qolga для бизнеса — форма заявки на статус «Магазин» */
  BUSINESS: '/business',
  ADMIN: '/admin',
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
}

export function adsPath(id) {
  return `${ROUTES.ADS}/${id}`
}

export function adsEditPath(id) {
  return `${ROUTES.ADS}/${id}/edit`
}

export function adsCategoryPath(code) {
  const params = new URLSearchParams()
  if (code) {
    params.set(PARAMS.CATEGORY, code)
  }
  const qs = params.toString()
  return qs ? `${ROUTES.ADS}?${qs}` : ROUTES.ADS
}

export function adsCategoryPathWithParams(categoryCode, searchParams) {
  const params = new URLSearchParams(searchParams || '')
  if (categoryCode) params.set(PARAMS.CATEGORY, categoryCode)
  else params.delete(PARAMS.CATEGORY)
  const qs = params.toString()
  return qs ? `${ROUTES.ADS}?${qs}` : ROUTES.ADS
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
