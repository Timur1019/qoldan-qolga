/**
 * Дымовой (быстрый) тест — проверка доступности API
 * Запуск: k6 run load-tests/smoke-test.js
 */

import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const API = `${BASE_URL}/api`;

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${API}/health`);
  check(res, { 'status 200': (r) => r.status === 200 });
}
