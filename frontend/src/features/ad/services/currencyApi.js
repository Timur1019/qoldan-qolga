import { apiRequest } from '../../../api/client'
import { cachedGet } from '../../../api/ttlCache'

/** Курс USD → UZS для пересчёта цен в фильтрах. */
export const currencyApi = {
  getRate: () => cachedGet('currency-rate', () => apiRequest('/currency/rate'), 30 * 60 * 1000),
}
