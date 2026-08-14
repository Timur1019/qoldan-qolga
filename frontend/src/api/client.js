import { ApiError } from '../utils/apiError'
import { notifyToast } from '../utils/toastBus'
import { cachedGet } from './ttlCache'

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || ''
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api'

/** Базовый URL для WebSocket (SockJS) чата */
export function getWsBaseUrl() {
  const base = API_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '')
  return base ? `${base.replace(/\/$/, '')}/ws` : '/ws'
}

const TOKEN_KEY = 'token'
function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

/** Собрать query-строку из объекта (пустые значения не попадают в URL). Массивы передаются как несколько значений одного параметра. */
export function buildQueryString(params) {
  if (!params || typeof params !== 'object') return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.filter((item) => item != null && item !== '').forEach((item) => search.append(k, String(item)))
    } else if (v != null && v !== '') {
      search.set(k, String(v))
    }
  })
  const str = search.toString()
  return str ? `?${str}` : ''
}

/** Проверка: ошибка из-за отсутствия или невалидной авторизации. */
export function isAuthError(err) {
  const status = err?.status
  if (status === 401 || status === 403) return true
  const code = err?.code
  if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN' || code === 'INVALID_CREDENTIALS') return true
  const msg = err?.message || ''
  return (
    msg.includes('401') ||
    msg.includes('403') ||
    msg.includes('Ошибка запроса') ||
    msg.includes('авторизац') ||
    msg.includes('Forbidden')
  )
}

export async function apiRequest(path, options = {}) {
  const { silent = false, headers: extraHeaders, ...fetchOptions } = options
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(url, { ...fetchOptions, headers })
  if (res.status === 204) {
    return undefined
  }
  const text = await res.text()
  const data = text ? (() => { try { return JSON.parse(text) } catch { return {} } })() : {}
  if (!res.ok) {
    const err = ApiError.fromResponse(res.status, data)
    const method = (fetchOptions.method || 'GET').toUpperCase()
    const skipToast = silent || method === 'GET' || err.status === 401 || err.code === 'UNAUTHORIZED'
    if (!skipToast) {
      notifyToast('error', err)
    }
    throw err
  }
  return data
}

export const authApi = {
  login: (body) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
      silent: true,
    }),
  sendPhoneCode: (phone) =>
    apiRequest('/auth/phone/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
      silent: true,
    }),
  verifyPhoneCode: (body) =>
    apiRequest('/auth/phone/verify', {
      method: 'POST',
      body: JSON.stringify(body),
      silent: true,
    }),
  me: () => apiRequest('/auth/me'),
  updateProfile: (body) =>
    apiRequest('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),
  /** Отзывы, которые я оставил другим пользователям (приватная страница «Мои отзывы»). */
  getMyReviews: (params) => apiRequest(`/auth/me/reviews${buildQueryString(params)}`),
  startVerification: (body) =>
    apiRequest('/auth/verification/start', {
      method: 'POST',
      body: JSON.stringify(body),
      silent: true,
    }),
  completeVerification: (body) =>
    apiRequest('/auth/verification/complete', {
      method: 'POST',
      body: JSON.stringify(body),
      silent: true,
    }),
}

export const adminApi = {
  dashboard: () => apiRequest('/admin/dashboard'),
  getCategories: () => apiRequest('/admin/categories'),
  createCategory: (body) =>
    apiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getUsers: (params) => apiRequest(`/admin/users${buildQueryString(params)}`),
  updateUser: (userId, body) =>
    apiRequest(`/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  getReports: (params) => apiRequest(`/admin/reports${buildQueryString(params)}`),
  notifySeller: (reportId) =>
    apiRequest(`/admin/reports/${encodeURIComponent(reportId)}/notify-seller`, {
      method: 'POST',
    }),
  getHomePromoBanners: () => apiRequest('/admin/home-promo-banners'),
  createHomePromoBanner: (body) =>
    apiRequest('/admin/home-promo-banners', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateHomePromoBanner: (id, body) =>
    apiRequest(`/admin/home-promo-banners/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteHomePromoBanner: (id) =>
    apiRequest(`/admin/home-promo-banners/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  getSiteTopBanners: () => apiRequest('/admin/site-top-banners'),
  createSiteTopBanner: (body) =>
    apiRequest('/admin/site-top-banners', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateSiteTopBanner: (id, body) =>
    apiRequest(`/admin/site-top-banners/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteSiteTopBanner: (id) =>
    apiRequest(`/admin/site-top-banners/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  getBusinessApplications: (params) =>
    apiRequest(`/admin/business-applications${buildQueryString(params)}`),
  getBusinessApplication: (id) =>
    apiRequest(`/admin/business-applications/${encodeURIComponent(id)}`),
  approveBusinessApplication: (id) =>
    apiRequest(`/admin/business-applications/${encodeURIComponent(id)}/approve`, {
      method: 'POST',
    }),
  rejectBusinessApplication: (id) =>
    apiRequest(`/admin/business-applications/${encodeURIComponent(id)}/reject`, {
      method: 'POST',
    }),
}

/** Регионы, категории, бренды, баннеры главной — с бэкенда */
export const referenceApi = {
  getRegions: () => cachedGet('regions', () => apiRequest('/regions'), 30 * 60 * 1000),
  getCategories: () => cachedGet('categories', () => apiRequest('/categories'), 10 * 60 * 1000),
  getCategory: (code) => cachedGet(`category:${code}`, () => apiRequest(`/categories/${encodeURIComponent(code)}`), 10 * 60 * 1000),
  getCategoryBreadcrumb: (code) => cachedGet(`breadcrumb:${code}`, () => apiRequest(`/categories/${encodeURIComponent(code)}/breadcrumb`), 10 * 60 * 1000),
  getCategoryChildren: (code) => cachedGet(`children:${code}`, () => apiRequest(`/categories/${encodeURIComponent(code)}/children`), 10 * 60 * 1000),
  getCategoriesForHome: () => cachedGet('categories-home', () => apiRequest('/categories/home'), 10 * 60 * 1000),
  getBrands: () => cachedGet('brands', () => apiRequest('/brands'), 10 * 60 * 1000),
  getBrandsByCategory: (code) => cachedGet(`brands:${code}`, () => apiRequest(`/categories/${encodeURIComponent(code)}/brands`), 10 * 60 * 1000),
  getModelsByBrand: (brandId) => cachedGet(`models:${brandId}`, () => apiRequest(`/brands/${encodeURIComponent(brandId)}/models`), 10 * 60 * 1000),
  getVehicleSpecOptions: () => cachedGet('vehicle-spec-options', () => apiRequest('/vehicle-spec-options'), 30 * 60 * 1000),
  getHomePromoBanners: () => cachedGet('promo-banners', () => apiRequest('/home-promo-banners'), 5 * 60 * 1000),
  getSiteTopBanners: () => cachedGet('site-top-banners', () => apiRequest('/site-top-banners'), 60 * 1000),
}

/** Заявки «Qoldan Qolga для бизнеса» (можно без авторизации) */
export const businessApplicationsApi = {
  submit: async (formData) => {
    const url = `${API_BASE}/business-applications`
    const token = getToken()
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(url, { method: 'POST', body: formData, headers })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || res.statusText || 'Ошибка отправки заявки')
    return data
  },
}

const AD_VIEWED_KEY = 'ad-viewed'

export const adsApi = {
  list: (params, options) => apiRequest(`/ads${buildQueryString(params)}`, options),
  getById: (id) => apiRequest(`/ads/${id}`),
  recordView: (id) => apiRequest(`/ads/${id}/view`, { method: 'POST' }),
  wasAdViewedInSession: (id) => {
    try {
      const raw = sessionStorage.getItem(AD_VIEWED_KEY)
      const set = raw ? new Set(JSON.parse(raw)) : new Set()
      return set.has(String(id))
    } catch {
      return false
    }
  },
  markAdViewedInSession: (id) => {
    try {
      const raw = sessionStorage.getItem(AD_VIEWED_KEY)
      const set = raw ? new Set(JSON.parse(raw)) : new Set()
      set.add(String(id))
      sessionStorage.setItem(AD_VIEWED_KEY, JSON.stringify([...set]))
    } catch {
      // ignore
    }
  },
  myAds: (params) => apiRequest(`/ads/my${buildQueryString(params)}`),
  create: (body) =>
    apiRequest('/ads', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiRequest(`/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: (id) =>
    apiRequest(`/ads/${id}`, { method: 'DELETE' }),
  archive: (id) =>
    apiRequest(`/ads/archive/${id}`, { method: 'POST' }),
  restore: (id) =>
    apiRequest(`/ads/restore/${id}`, { method: 'POST' }),
  addFavorite: (adId) =>
    apiRequest(`/ads/${adId}/favorite`, { method: 'POST' }),
  removeFavorite: (adId) =>
    apiRequest(`/ads/${adId}/favorite`, { method: 'DELETE' }),
  toggleFavorite: async (adId) => {
    const result = await apiRequest(`/ads/${adId}/favorite/toggle`, { method: 'POST' })
    return result === true || result === false ? result : !!result
  },
  report: (adId, body) =>
    apiRequest(`/ads/${adId}/report`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getPromoServices: () => apiRequest('/ads/promo-services'),
  createPromoOrder: (adId, body) =>
    apiRequest(`/ads/${adId}/promo/order`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getPromoOrder: (orderId) => apiRequest(`/ads/promo/orders/${encodeURIComponent(orderId)}`),
  mockCompletePromoPayment: (orderId) =>
    apiRequest('/payments/mock/complete', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
  upload: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const token = getToken()
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const fullUrl = API_ORIGIN ? `${API_ORIGIN}/api/ads/upload` : '/api/ads/upload'
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = ApiError.fromResponse(res.status, data)
      notifyToast('error', err)
      throw err
    }
    return data
  },
  uploadBatch: async (files) => {
    if (!files?.length) return { urls: [] }
    const formData = new FormData()
    for (const file of files) {
      if (file?.type?.startsWith('image/')) formData.append('files', file)
    }
    const token = getToken()
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    const fullUrl = API_ORIGIN ? `${API_ORIGIN}/api/ads/upload/batch` : '/api/ads/upload/batch'
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = ApiError.fromResponse(res.status, data)
      notifyToast('error', err)
      throw err
    }
    return data
  },
}

/** Избранное (требуется авторизация) */
export const favoritesApi = {
  list: (params = {}) => apiRequest(`/favorites${buildQueryString(params)}`),
}

/** Чат с продавцом/покупателем (WebSocket + REST) */
export const chatApi = {
  getConversations: () => apiRequest('/chat/conversations'),
  getOrCreateConversation: (adId) =>
    apiRequest('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ adId }),
    }),
  getMessages: (conversationId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`),
  sendMessage: (conversationId, text) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  markAsRead: (conversationId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/read`, { method: 'POST' }),
  updateMessage: (conversationId, messageId, text) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    }),
  deleteMessage: (conversationId, messageId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages/${messageId}`, { method: 'DELETE' }),
  deleteConversation: (conversationId) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}`, { method: 'DELETE' }),
}

/** Профиль продавца и подписки */
export const usersApi = {
  getProfile: (id) => apiRequest(`/users/${id}`),
  getAds: (id, params) => apiRequest(`/users/${id}/ads${buildQueryString(params)}`),
  getReviews: (id, params) => apiRequest(`/users/${id}/reviews${buildQueryString(params)}`),
  createReview: (id, body) =>
    apiRequest(`/users/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  /** Список профилей, на которые подписан текущий пользователь (для «Избранное → Профили») */
  getMySubscriptions: () => apiRequest('/users/me/subscriptions'),
  subscribe: (id) => apiRequest(`/users/${id}/subscribe`, { method: 'POST' }),
  unsubscribe: (id) => apiRequest(`/users/${id}/subscribe`, { method: 'DELETE' }),
  toggleSubscribe: async (id) => {
    const result = await apiRequest(`/users/${id}/subscribe/toggle`, { method: 'POST' })
    return result === true || result === false ? result : !!result
  },
}

/** Для отображения картинок: если url относительный (/uploads/...), подставляем origin бэкенда */
export function imageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const origin = API_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '')
  return origin ? `${origin.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}` : url
}
