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
  CHAT: '/dashboard/chat',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
}

export const PARAMS = {
  AUTH: 'auth',
  AUTH_LOGIN: 'login',
  AUTH_REGISTER: 'register',
  OPEN_CATEGORIES: 'open',
  OPEN_CATEGORIES_VALUE: 'categories',
  CATEGORY: 'category',
  REGION: 'region',
}

export function adsPath(id) {
  return `${ROUTES.ADS}/${id}`
}

export function adsCategoryPath(code) {
  return `${ROUTES.ADS}?${PARAMS.CATEGORY}=${encodeURIComponent(code)}`
}

export function categoryPath(code) {
  return `/categories/${encodeURIComponent(code)}`
}
