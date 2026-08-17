import { ApiError } from '../utils/apiError'
import { notifyToast } from '../utils/toastBus'
import { API_ORIGIN, apiRequest, buildQueryString, getToken } from './clientCore'

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

export const favoritesApi = {
  list: (params = {}) => apiRequest(`/favorites${buildQueryString(params)}`),
}
