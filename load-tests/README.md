# Нагрузочные тесты Qoldan Qolga

Тесты написаны на [k6](https://k6.io/) — инструмент нагрузочного тестирования.

## Установка k6

**macOS (Homebrew):**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```powershell
choco install k6
```

Или скачать с [k6.io](https://k6.io/docs/getting-started/installation/).

## Подготовка

1. Запустите backend: `./gradlew bootRun` или `java -jar build/libs/*.jar`
2. Убедитесь, что есть тестовый пользователь (например, `test@test.com` / `123`) для авторизованных запросов.

## Запуск тестов

### Дымовой тест (30 сек, 5 пользователей)
```bash
k6 run load-tests/smoke-test.js
```

### Основной нагрузочный тест (≈3 мин)
Публичные endpoints + при наличии токена — авторизованные:
```bash
k6 run load-tests/load-test.js
```

С тестовым пользователем (добавляются запросы /auth/me, /chat/conversations, /favorites):
```bash
K6_TEST_EMAIL=test@test.com K6_TEST_PASSWORD=123 k6 run load-tests/load-test.js
```

### Стресс-тест (≈5 мин, до 150 пользователей)
```bash
k6 run load-tests/stress-test.js
```

### Тест на другой URL
```bash
BASE_URL=http://localhost:8080 k6 run load-tests/load-test.js
```

## Метрики

После прогона k6 выводит:
- **http_req_duration** — время ответа (p95, p99)
- **http_reqs** — число запросов в секунду (RPS)
- **http_req_failed** — доля неудачных запросов
- **iterations** — число итераций (полных прогонов сценария на одного пользователя)

## Пороги (thresholds)

- **load-test.js**: p95 < 3 сек, ошибок < 5%
- **smoke-test.js**: p95 < 2 сек, ошибок < 1%
- **stress-test.js**: p99 < 5 сек, ошибок < 10%

При превышении порогов k6 завершится с ненулевым кодом.
