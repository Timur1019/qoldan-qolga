# Qoldan Qolga

Доска объявлений: Spring Boot (REST API, JWT, PostgreSQL) + React (Vite).

## Backend

- Java 17, Spring Boot 4, Gradle
- PostgreSQL, JPA/Hibernate, Liquibase
- Spring Security + JWT
- MapStruct для маппинга

Запуск: `./gradlew bootRun` (порт 8080)

## Frontend

- React, Vite
- Роутинг, AuthContext, защищённые маршруты

**Локальная разработка:** сначала запустите бэкенд на 8080, затем фронт. Vite проксирует запросы с `/api` и `/ws` на `http://127.0.0.1:8080`. Если бэкенд не запущен — запросы к API дадут 502.

Запуск: `cd frontend && npm install && npm run dev` (порт 3000)

## Админ-панель

- Роль `ADMIN` в таблице `users` (поле `role`). Первого админа задать вручную в БД:
  `UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';`
- Фронт: раздел «Админ» в меню и маршрут `/admin` только для админов.

## Требования

- PostgreSQL (БД `qoldan-qolga`)
- Настройки в `src/main/resources/application.properties`
