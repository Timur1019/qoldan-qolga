# Qoldan Qolga — мобильное приложение (Expo / React Native)

Мобильная версия веб-фронта (`../frontend`), использующая тот же Spring Boot бэкенд. Портирован тот же API-контракт, авторизация и логика чата — см. `../.claude/plans` для полного плана.

## MVP-скоуп

Регистрация/вход, лента объявлений с категориями и поиском, карточка объявления, избранное, чат (REST + WebSocket в реальном времени), просмотр/правка профиля.

Вне скоупа (как на вебе): создание объявлений, админка, промо, заявки «для бизнеса», ID-верификация.

## Запуск

Бэкенд должен быть поднят на `:8080` (`../gradlew bootRun` из корня репозитория, база — PostgreSQL `qoldan-qolga`).

```bash
npm install
npx expo start
```

Адрес бэкенда задаётся через `EXPO_PUBLIC_API_ORIGIN` (см. `.env.example`) — на мобилке нет dev-прокси, как в Vite, поэтому адрес всегда явный:

- iOS-симулятор: `http://localhost:8080` (значение по умолчанию, если переменная не задана)
- Android-эмулятор: `http://10.0.2.2:8080`
- Физическое устройство: `http://<LAN-IP компьютера>:8080`

## Структура

```
src/
├── app/            # Expo Router: экраны и навигация
├── api/client.ts   # порт frontend/src/api/client.js (токен — expo-secure-store вместо localStorage)
├── context/        # AuthContext
├── hooks/          # useFavoriteClick, useStompChat (чат по WebSocket)
├── components/     # AdCard и др.
├── types/          # TS-типы под бэкенд DTO
└── utils/          # форматирование цены/даты
```

## Технические отличия от веба

- **Токен** — `expo-secure-store` вместо `localStorage`/`sessionStorage`.
- **Чат** — веб использует `sockjs-client` (зависит от DOM/XHR, не работает в RN). Мобилка подключается нативным `WebSocket` напрямую к `/ws/websocket` (raw-транспорт SockJS-эндпоинта) через `@stomp/stompjs` — backend не менялся.
- **CORS** бэкенда (`SecurityConfig`) ограничен `localhost:3000/5173` для браузера — нативные запросы с мобилки/эмулятора это не затрагивает.
