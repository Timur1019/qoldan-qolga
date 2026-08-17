import { apiRequest, buildQueryString } from './clientCore'

export const usersApi = {
  getProfile: (id) => apiRequest(`/users/${id}`),
  getAds: (id, params) => apiRequest(`/users/${id}/ads${buildQueryString(params)}`),
  getReviews: (id, params) => apiRequest(`/users/${id}/reviews${buildQueryString(params)}`),
  createReview: (id, body) =>
    apiRequest(`/users/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getMySubscriptions: () => apiRequest('/users/me/subscriptions'),
  subscribe: (id) => apiRequest(`/users/${id}/subscribe`, { method: 'POST' }),
  unsubscribe: (id) => apiRequest(`/users/${id}/subscribe`, { method: 'DELETE' }),
  toggleSubscribe: async (id) => {
    const result = await apiRequest(`/users/${id}/subscribe/toggle`, { method: 'POST' })
    return result === true || result === false ? result : !!result
  },
}
