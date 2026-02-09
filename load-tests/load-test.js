/**
 * Нагрузочные тесты Qoldan Qolga API
 * Запуск: k6 run load-tests/load-test.js
 * С тестовым пользователем: K6_TEST_EMAIL=test@test.com K6_TEST_PASSWORD=123 k6 run load-tests/load-test.js
 *
 * Установка k6: https://k6.io/docs/getting-started/installation/
 * macOS: brew install k6
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const API = `${BASE_URL}/api`;

// Сценарий: плавное нарастание нагрузки
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // разогрев: до 10 пользователей
    { duration: '1m', target: 30 },    // средняя нагрузка: 30 пользователей
    { duration: '30s', target: 50 },   // пик: 50 пользователей
    { duration: '30s', target: 0 },    // спад
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% запросов быстрее 3 сек
    http_req_failed: ['rate<0.05'],    // менее 5% ошибок
  },
};

// Получить JWT для авторизованных запросов (опционально)
function getToken() {
  const email = __ENV.K6_TEST_EMAIL;
  const password = __ENV.K6_TEST_PASSWORD;
  if (!email || !password) return null;

  const res = http.post(`${API}/auth/login`, JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.status !== 200) return null;
  const body = JSON.parse(res.body);
  return body.token || null;
}

export function setup() {
  const token = getToken();
  return { token };
}

export default function (data) {
  const headers = { 'Content-Type': 'application/json' };
  if (data.token) headers['Authorization'] = `Bearer ${data.token}`;

  // 1. Публичные endpoints — доступны без авторизации
  const healthRes = http.get(`${API}/health`);
  check(healthRes, { 'health ok': (r) => r.status === 200 });

  const regionsRes = http.get(`${API}/regions`);
  check(regionsRes, { 'regions ok': (r) => r.status === 200 });

  const categoriesRes = http.get(`${API}/categories`);
  check(categoriesRes, { 'categories ok': (r) => r.status === 200 });

  const adsRes = http.get(`${API}/ads?page=0&size=20`);
  check(adsRes, { 'ads list ok': (r) => r.status === 200 });

  // 2. Список объявлений с пагинацией
  const adsPage2 = http.get(`${API}/ads?page=1&size=10`);
  check(adsPage2, { 'ads page 2 ok': (r) => r.status === 200 });

  // 3. Если есть токен — авторизованные запросы
  if (data.token) {
    const meRes = http.get(`${API}/auth/me`, { headers });
    check(meRes, { 'auth/me ok': (r) => r.status === 200 });

    const convRes = http.get(`${API}/chat/conversations`, { headers });
    check(convRes, { 'chat conversations ok': (r) => r.status === 200 });

    const favoritesRes = http.get(`${API}/favorites?page=0&size=10`, { headers });
    check(favoritesRes, { 'favorites ok': (r) => r.status === 200 });
  }

  sleep(0.5 + Math.random() * 1); // 0.5–1.5 сек пауза между итерациями
}
