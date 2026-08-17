import { ApiError } from '../utils/apiError'
import { notifyToast } from '../utils/toastBus'

export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || ''
export const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api'

const TOKEN_KEY = 'token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

/** Базовый URL для WebSocket (SockJS) чата */
export function getWsBaseUrl() {
  const base = API_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '')
  return base ? `${base.replace(/\/$/, '')}/ws` : '/ws'
}

/** Собрать query-строку из объекта (пустые значения не попадают в URL). */
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

/** Для отображения картинок: если url относительный (/uploads/...), подставляем origin бэкенда */
export function imageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const origin = API_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : '')
  return origin ? `${origin.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}` : url
}
