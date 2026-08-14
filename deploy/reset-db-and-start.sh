#!/usr/bin/env bash
set -euo pipefail
APP_DIR=/home/temur/qoldan-qolga
BACKEND_PORT=8082
cd "$APP_DIR"
set -a
source .env
set +a
export PGPASSWORD="$DB_PASSWORD"

pkill -f "$APP_DIR/app.jar" 2>/dev/null || true
sleep 2

psql -h 127.0.0.1 -p 5433 -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 <<SQL
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();
SQL

dropdb -h 127.0.0.1 -p 5433 -U "$DB_USER" "$DB_NAME" 2>/dev/null || true
createdb -h 127.0.0.1 -p 5433 -U "$DB_USER" "$DB_NAME"

export SPRING_PROFILES_ACTIVE=docker
export DB_HOST=127.0.0.1
export DB_PORT=5433
export SERVER_PORT=$BACKEND_PORT
export UPLOAD_DIR="$APP_DIR/data/uploads"
export DOCS_DIR="$APP_DIR/data/uploads/docs"
nohup java -jar "$APP_DIR/app.jar" > "$APP_DIR/logs/backend.log" 2>&1 &

for i in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:$BACKEND_PORT/api/categories" >/dev/null; then
    echo BACKEND_OK
    exit 0
  fi
  sleep 3
done

echo BACKEND_FAILED
tail -40 "$APP_DIR/logs/backend.log"
exit 1
