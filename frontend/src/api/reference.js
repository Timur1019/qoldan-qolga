import { apiRequest } from './clientCore'
import { cachedGet } from './ttlCache'

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
  getHomeSellBanners: () => cachedGet('home-sell-banners', () => apiRequest('/home-sell-banners'), 60 * 1000),
}
