const API_BASE = import.meta.env.VITE_API_ORIGIN
  ? `${import.meta.env.VITE_API_ORIGIN}/api`
  : '/api'

function getToken() {
  return localStorage.getItem('token')
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
  const data = await res.json().catch(() => ({}))
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
