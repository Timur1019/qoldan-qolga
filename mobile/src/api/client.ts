import { getStoredToken, setStoredToken } from '@/api/tokenStorage';
import {
  submitBusinessApplication,
  type BusinessApplicationPayload,
} from '@/api/submitBusinessApplication';
import { uploadAdImage } from '@/api/uploadAdImage';

/**
 * На вебе (frontend/.env.development) пусто = проксируется Vite-ем на localhost:8080.
 * На мобилке прокси нет — адрес бэкенда всегда должен быть указан явно:
 * iOS-симулятор: http://localhost:8080
 * Android-эмулятор: http://10.0.2.2:8080
 * Физическое устройство: http://<LAN-IP машины>:8080
 */
const API_ORIGIN = process.env.EXPO_PUBLIC_API_ORIGIN || 'http://localhost:8080';
const API_BASE = `${API_ORIGIN}/api`;

/** Базовый URL для WebSocket (см. src/hooks/useStompChat.ts — без SockJS, raw ws). */
export function getWsBaseUrl() {
  return `${API_ORIGIN.replace(/^http/, 'ws').replace(/\/$/, '')}/ws/websocket`;
}

async function getToken() {
  return getStoredToken();
}

export async function setToken(token: string | null) {
  await setStoredToken(token);
}

/** Собрать query-строку из объекта (пустые значения не попадают в URL). Массивы — как несколько значений одного параметра. */
export function buildQueryString(params?: Record<string, unknown>) {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.filter((item) => item != null && item !== '').forEach((item) => search.append(k, String(item)));
    } else if (v != null && v !== '') {
      search.set(k, String(v));
    }
  });
  const str = search.toString();
  return str ? `?${str}` : '';
}

/** Проверка: ошибка из-за отсутствия или невалидной авторизации. */
export function isAuthError(err: unknown) {
  const msg = err instanceof Error ? err.message : '';
  return (
    msg.includes('401') ||
    msg.includes('403') ||
    msg.includes('Ошибка запроса') ||
    msg.includes('авторизац') ||
    msg.includes('Forbidden')
  );
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | Record<string, unknown> | null;
}

export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers } as RequestInit);
  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  const data = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return {};
        }
      })()
    : {};
  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Ошибка запроса');
  }
  return data as T;
}

export const authApi = {
  sendPhoneCode: (phone: string) =>
    apiRequest('/auth/phone/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  verifyPhoneCode: (body: { phone: string; code: string; displayName?: string }) =>
    apiRequest('/auth/phone/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  me: () => apiRequest('/auth/me'),
  updateProfile: (body: Record<string, unknown>) =>
    apiRequest('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),
};

export const referenceApi = {
  getRegions: () => apiRequest('/regions'),
  getCategories: () => apiRequest('/categories'),
  getCategory: (code: string) => apiRequest(`/categories/${encodeURIComponent(code)}`),
  getCategoryBreadcrumb: (code: string) => apiRequest(`/categories/${encodeURIComponent(code)}/breadcrumb`),
  getCategoryChildren: (code: string) => apiRequest(`/categories/${encodeURIComponent(code)}/children`),
  getCategoriesForHome: () => apiRequest('/categories/home'),
  getBrands: () => apiRequest('/brands'),
  getBrandsByCategory: (code: string) => apiRequest(`/categories/${encodeURIComponent(code)}/brands`),
  getModelsByBrand: (brandId: string) => apiRequest(`/brands/${encodeURIComponent(brandId)}/models`),
  getHomePromoBanners: () => apiRequest('/home-promo-banners'),
  getSiteTopBanners: () => apiRequest('/site-top-banners'),
  getCurrencyRate: () => apiRequest('/currency/rate'),
};

export const adsApi = {
  list: (params?: Record<string, unknown>) => apiRequest(`/ads${buildQueryString(params)}`),
  getById: (id: string) => apiRequest(`/ads/${id}`),
  recordView: (id: string) => apiRequest(`/ads/${id}/view`, { method: 'POST' }),
  myAds: (params?: Record<string, unknown>) => apiRequest(`/ads/my${buildQueryString(params)}`),
  create: (body: Record<string, unknown>) =>
    apiRequest('/ads', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    apiRequest(`/ads/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => apiRequest(`/ads/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  archive: (id: string) =>
    apiRequest(`/ads/archive/${encodeURIComponent(id)}`, { method: 'POST' }),
  restore: (id: string) =>
    apiRequest(`/ads/restore/${encodeURIComponent(id)}`, { method: 'POST' }),
  report: (adId: string, body: { reason: string }) =>
    apiRequest(`/ads/${encodeURIComponent(adId)}/report`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  /** Multipart image upload → `{ url }` */
  upload: (localUri: string) => uploadAdImage(API_BASE, localUri),
  addFavorite: (adId: string) => apiRequest(`/ads/${adId}/favorite`, { method: 'POST' }),
  removeFavorite: (adId: string) => apiRequest(`/ads/${adId}/favorite`, { method: 'DELETE' }),
  toggleFavorite: async (adId: string) => {
    const result = await apiRequest<boolean>(`/ads/${adId}/favorite/toggle`, { method: 'POST' });
    return !!result;
  },
  getPromoServices: () => apiRequest('/ads/promo-services'),
  createPromoOrder: (adId: string, body: { serviceCode: string; provider: string }) =>
    apiRequest(`/ads/${encodeURIComponent(adId)}/promo/order`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getPromoOrder: (orderId: string) =>
    apiRequest(`/ads/promo/orders/${encodeURIComponent(orderId)}`),
  mockCompletePromoPayment: (orderId: string) =>
    apiRequest('/payments/mock/complete', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
};

export const favoritesApi = {
  list: (params: Record<string, unknown> = {}) => apiRequest(`/favorites${buildQueryString(params)}`),
};

/** Чат с продавцом/покупателем (WebSocket + REST) */
export const chatApi = {
  getConversations: () => apiRequest('/chat/conversations'),
  getOrCreateConversation: (adId: string) =>
    apiRequest('/chat/conversations', { method: 'POST', body: JSON.stringify({ adId }) }),
  getMessages: (conversationId: string) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`),
  sendMessage: (conversationId: string, text: string) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  markAsRead: (conversationId: string) =>
    apiRequest(`/chat/conversations/${encodeURIComponent(conversationId)}/read`, { method: 'POST' }),
};

export const usersApi = {
  getProfile: (id: string) => apiRequest(`/users/${id}`),
  getAds: (id: string, params?: Record<string, unknown>) => apiRequest(`/users/${id}/ads${buildQueryString(params)}`),
  getReviews: (id: string, params?: Record<string, unknown>) => apiRequest(`/users/${id}/reviews${buildQueryString(params)}`),
  subscribe: (id: string) => apiRequest(`/users/${id}/subscribe`, { method: 'POST' }),
  unsubscribe: (id: string) => apiRequest(`/users/${id}/subscribe`, { method: 'DELETE' }),
  toggleSubscribe: async (id: string) => {
    const result = await apiRequest<boolean>(`/users/${id}/subscribe/toggle`, { method: 'POST' });
    return !!result;
  },
  getMySubscriptions: () => apiRequest('/users/me/subscriptions'),
};

export const businessApplicationsApi = {
  submit: (payload: BusinessApplicationPayload) => submitBusinessApplication(API_BASE, payload),
};

/** Для отображения картинок: если url относительный (/uploads/...), подставляем origin бэкенда */
export function imageUrl(url?: string | null) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_ORIGIN.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}
