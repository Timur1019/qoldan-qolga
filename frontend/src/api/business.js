import { API_BASE, getToken } from './clientCore'

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
