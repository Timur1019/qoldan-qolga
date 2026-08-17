import { apiRequest, buildQueryString } from './clientCore'

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
