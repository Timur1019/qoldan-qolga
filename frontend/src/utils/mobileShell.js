import { ROUTES } from '../constants/routes'

/** Высота нижней tab bar — должна совпадать с MobileTabBar.module.css */
export const MOBILE_TAB_BAR_HEIGHT = 'calc(52px + max(env(safe-area-inset-bottom, 0px), 10px))'

export function getMobileTab(pathname) {
  if (pathname === ROUTES.HOME || pathname === ROUTES.ADS || pathname.startsWith('/categories/')) return 'search'
  if (pathname === ROUTES.FAVORITES || pathname.startsWith(`${ROUTES.FAVORITES}/`)) return 'favorites'
  if (pathname === ROUTES.ADS_MY || pathname.startsWith(`${ROUTES.ADS_MY}/`)) return 'sell'
  if (pathname === ROUTES.CHAT || pathname.startsWith(`${ROUTES.CHAT}/`)) return 'chat'
  if (pathname.startsWith('/dashboard/profile') || pathname === ROUTES.REVIEWS_MY || pathname === ROUTES.DASHBOARD_RULES) return 'profile'
  return null
}

export function isMobileStackPath(pathname) {
  if (pathname === ROUTES.ADS_CREATE) return true
  if (/^\/ads\/[^/]+/.test(pathname)) return true
  if (pathname.startsWith('/users/')) return true
  if (pathname.startsWith(ROUTES.BUSINESS)) return true
  if (pathname.startsWith(ROUTES.ABOUT)) return true
  if (pathname.startsWith(ROUTES.REGIONS)) return true
  if (pathname.startsWith(ROUTES.RULES)) return true
  if (pathname.startsWith(ROUTES.VERIFICATION_CALLBACK)) return true
  if (pathname.startsWith(ROUTES.PROMO_RESULT)) return true
  return false
}

export function showMobileSearch(pathname) {
  return pathname === ROUTES.HOME || pathname === ROUTES.ADS || pathname.startsWith('/categories/')
}

export function getMobileTitle(pathname, t) {
  if (pathname === ROUTES.REVIEWS_MY) return t('profile.myReviews')
  if (pathname === ROUTES.DASHBOARD_RULES) return t('profile.rules')
  const tab = getMobileTab(pathname)
  if (tab === 'favorites') return t('nav.favorites')
  if (tab === 'sell') return t('nav.myAds')
  if (tab === 'chat') return t('profile.chat')
  if (tab === 'profile') return t('nav.profile')
  if (pathname === ROUTES.ADS_CREATE) return t('nav.addAd')
  return ''
}
