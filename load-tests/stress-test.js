/**
 * Стресс-тест — поиск предела производительности
 * Запуск: k6 run load-tests/stress-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const API = `${BASE_URL}/api`;

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 150 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<5000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const res = http.batch([
    ['GET', `${API}/health`],
    ['GET', `${API}/regions`],
    ['GET', `${API}/categories`],
    ['GET', `${API}/ads?page=0&size=20`],
  ]);

  res.forEach((r, i) => check(r, { [`req ${i} ok`]: (x) => x.status === 200 }));
  sleep(0.2 + Math.random() * 0.5);
}
