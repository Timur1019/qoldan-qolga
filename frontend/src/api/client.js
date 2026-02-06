const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || ''
const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api'

const TOKEN_KEY = 'token'
function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
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
  list: (params) => {
    const search = new URLSearchParams(params).toString()
    return apiRequest(`/ads${search ? `?${search}` : ''}`)
  },
  getById: (id) => apiRequest(`/ads/${id}`),
  myAds: (params) => {
    const search = new URLSearchParams(params).toString()
    return apiRequest(`/ads/my${search ? `?${search}` : ''}`)
  },
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
  list: (params = {}) => {
    const search = new URLSearchParams(params).toString()
    return apiRequest(`/favorites${search ? `?${search}` : ''}`)
  },
}

/** Для отображения картинок: если url относительный (/uploads/...), подставляем origin бэкенда */
export function imageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const origin = API_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '')
  return origin ? `${origin.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}` : url
}
