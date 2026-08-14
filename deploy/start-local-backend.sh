#!/usr/bin/env bash
# Local backend for mobile/iOS simulator (survives parent shell exit).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs"
PID_FILE="$LOG_DIR/backend-local.pid"
LOG_FILE="$LOG_DIR/backend-local.log"
JAR="$ROOT/build/libs/qoldan-qolga-0.0.1-SNAPSHOT.jar"
PORT="${SERVER_PORT:-8082}"
DB_PORT="${DB_PORT:-5433}"

mkdir -p "$LOG_DIR" "$ROOT/data/uploads/docs"

if ! docker info >/dev/null 2>&1; then
  open -a Docker || true
  for _ in $(seq 1 40); do
    docker info >/dev/null 2>&1 && break
    sleep 2
  done
fi

if ! docker ps --format '{{.Names}}' | grep -qx qoldan-pg-local; then
  docker start qoldan-pg-local >/dev/null 2>&1 || docker run -d --name qoldan-pg-local \
    -e POSTGRES_DB='qoldan-qolga' \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=1 \
    -p "${DB_PORT}:5432" \
    postgres:16-alpine >/dev/null
fi

for _ in $(seq 1 40); do
  docker exec qoldan-pg-local pg_isready -U postgres -d 'qoldan-qolga' >/dev/null 2>&1 && break
  sleep 1
done

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "already running pid=$(cat "$PID_FILE") port=$PORT"
  exit 0
fi

# Free port if a stale listener remains
if lsof -tiTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  lsof -tiTCP:"$PORT" -sTCP:LISTEN | xargs kill 2>/dev/null || true
  sleep 1
fi

if [[ ! -f "$JAR" ]]; then
  echo "missing jar: $JAR (run ./gradlew bootJar)" >&2
  exit 1
fi

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

nohup java -jar "$JAR" \
  --server.port="$PORT" \
  --spring.datasource.url="jdbc:postgresql://127.0.0.1:${DB_PORT}/qoldan-qolga" \
  --spring.datasource.username=postgres \
  --spring.datasource.password=1 \
  > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
disown || true

for i in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:${PORT}/api/categories" >/dev/null; then
    echo "backend ok http://127.0.0.1:${PORT} pid=$(cat "$PID_FILE")"
    exit 0
  fi
  if ! kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "backend died, see $LOG_FILE" >&2
    exit 1
  fi
  sleep 2
done

echo "backend timeout, see $LOG_FILE" >&2
exit 1
