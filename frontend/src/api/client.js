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

/** Собрать query-строку из объекта (пустые значения не попадают в URL). */
export function buildQueryString(params) {
  if (!params || typeof params !== 'object') return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') search.set(k, String(v))
  })
  const str = search.toString()
  return str ? `?${str}` : ''
}

/** Проверка: ошибка из-за отсутствия или невалидной авторизации. */
export function isAuthError(err) {
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
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(url, { ...options, headers })
  if (res.status === 204) {
    return undefined
  }
  const text = await res.text()
  const data = text ? (() => { try { return JSON.parse(text) } catch { return {} } })() : {}
  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Ошибка запроса')
  }
  return data
}

export const authApi = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (body) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  me: () => apiRequest('/auth/me'),
}

export const adminApi = {
  dashboard: () => apiRequest('/admin/dashboard'),
}

/** Регионы, категории — с бэкенда (редактируемые справочники) */
export const referenceApi = {
  getRegions: () => apiRequest('/regions'),
  getCategories: () => apiRequest('/categories'),
  getCategory: (code) => apiRequest(`/categories/${encodeURIComponent(code)}`),
  getCategoryChildren: (code) => apiRequest(`/categories/${encodeURIComponent(code)}/children`),
  getCategoriesForHome: () => apiRequest('/categories/home'),
}

export const adsApi = {
  list: (params) => apiRequest(`/ads${buildQueryString(params)}`),
  getById: (id) => apiRequest(`/ads/${id}`),
  myAds: (params) => apiRequest(`/ads/my${buildQueryString(params)}`),
  create: (body) =>
    apiRequest('/ads', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  addFavorite: (adId) =>
    apiRequest(`/ads/${adId}/favorite`, { method: 'POST' }),
  removeFavorite: (adId) =>
    apiRequest(`/ads/${adId}/favorite`, { method: 'DELETE' }),
  toggleFavorite: async (adId) => {
    const result = await apiRequest(`/ads/${adId}/favorite/toggle`, { method: 'POST' })
    return result === true || result === false ? result : !!result
  },
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
    if (!res.ok) throw new Error(data.message || res.statusText || 'Upload failed')
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
}

/** Для отображения картинок: если url относительный (/uploads/...), подставляем origin бэкенда */
export function imageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const origin = API_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '')
  return origin ? `${origin.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}` : url
}
