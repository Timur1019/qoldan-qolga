# Qoldan Qolga

Доска объявлений: Spring Boot (REST API, JWT, PostgreSQL) + React (Vite).

## Backend

- Java 17, Spring Boot 4, Gradle
- PostgreSQL, JPA/Hibernate, Liquibase
- Spring Security + JWT
- MapStruct для маппинга

Запуск: `./gradlew bootRun`

## Frontend

- React, Vite
- Роутинг, AuthContext, защищённые маршруты

Запуск: `cd frontend && npm install && npm run dev`

## Админ-панель

- Роль `ADMIN` в таблице `users` (поле `role`). Первого админа задать вручную в БД:
  `UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';`
- Фронт: раздел «Админ» в меню и маршрут `/admin` только для админов.

## Требования

- PostgreSQL (БД `qoldan-qolga`)
- Настройки в `src/main/resources/application.properties`
