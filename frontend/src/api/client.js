/**
 * HTTP helpers only. Domain APIs live in sibling modules:
 * @/api/ads @/api/auth @/api/admin @/api/chat @/api/users @/api/reference @/api/business @/api/currency
 */
export {
  API_ORIGIN,
  API_BASE,
  getToken,
  getWsBaseUrl,
  buildQueryString,
  isAuthError,
  apiRequest,
  imageUrl,
} from './clientCore'
