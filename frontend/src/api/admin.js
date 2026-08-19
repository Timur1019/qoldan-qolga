import { apiRequest, buildQueryString } from './clientCore'

export const adminApi = {
  dashboard: () => apiRequest('/admin/dashboard'),
  getCategories: () => apiRequest('/admin/categories'),
  createCategory: (body) =>
    apiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getUsers: (params) => apiRequest(`/admin/users${buildQueryString(params)}`),
  createUser: (body) =>
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getStatsUsers: (params) => apiRequest(`/admin/stats/users${buildQueryString(params)}`),
  getStatsAds: (params) => apiRequest(`/admin/stats/ads${buildQueryString(params)}`),
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
  getHomeSellBanners: () => apiRequest('/admin/home-sell-banners'),
  createHomeSellBanner: (body) =>
    apiRequest('/admin/home-sell-banners', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateHomeSellBanner: (id, body) =>
    apiRequest(`/admin/home-sell-banners/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteHomeSellBanner: (id) =>
    apiRequest(`/admin/home-sell-banners/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  getAdSidebarBanners: () => apiRequest('/admin/ad-sidebar-banners'),
  createAdSidebarBanner: (body) =>
    apiRequest('/admin/ad-sidebar-banners', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateAdSidebarBanner: (id, body) =>
    apiRequest(`/admin/ad-sidebar-banners/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteAdSidebarBanner: (id) =>
    apiRequest(`/admin/ad-sidebar-banners/${encodeURIComponent(id)}`, {
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
