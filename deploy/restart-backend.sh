#!/usr/bin/env bash
# Restart backend after new app.jar upload (temur fallback stack)
set -euo pipefail
APP_DIR=/home/temur/qoldan-qolga
BACKEND_PORT=8082
cd "$APP_DIR"
set -a
source .env
set +a

pkill -f "$APP_DIR/app.jar" 2>/dev/null || true
sleep 2

export SPRING_PROFILES_ACTIVE=docker
export DB_HOST=127.0.0.1
export DB_PORT=5433
export SERVER_PORT=$BACKEND_PORT
export UPLOAD_DIR="$APP_DIR/data/uploads"
export DOCS_DIR="$APP_DIR/data/uploads/docs"

# ensure PG is up
if ! pg_ctl -D "$APP_DIR/data/pg" status >/dev/null 2>&1; then
  mkdir -p "$APP_DIR/run/pg" "$APP_DIR/logs"
  pg_ctl -D "$APP_DIR/data/pg" -l "$APP_DIR/logs/pg.log" start
  sleep 3
fi

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
