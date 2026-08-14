#!/usr/bin/env bash
set -euo pipefail
APP_DIR=/home/temur/qoldan-qolga
BACKEND_PORT=8082
cd "$APP_DIR"

set -a
source .env
set +a

# Чистая БД — убирает частично применённые миграции
dropdb -h 127.0.0.1 -p 5433 -U qoldan qoldan_qolga 2>/dev/null || true
createdb -h 127.0.0.1 -p 5433 -U qoldan qoldan_qolga

pkill -f "$APP_DIR/app.jar" 2>/dev/null || true
export SPRING_PROFILES_ACTIVE=docker
export DB_HOST=127.0.0.1
export DB_PORT=5433
export SERVER_PORT=$BACKEND_PORT
export UPLOAD_DIR="$APP_DIR/data/uploads"
export DOCS_DIR="$APP_DIR/data/uploads/docs"
nohup java -jar "$APP_DIR/app.jar" > "$APP_DIR/logs/backend.log" 2>&1 &

echo "Waiting for backend on :$BACKEND_PORT..."
for i in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:$BACKEND_PORT/api/categories" >/dev/null; then
    echo "BACKEND_OK"
    break
  fi
  sleep 3
done

cat > "$APP_DIR/run/Caddyfile" <<EOF
:8282 {
    root * $APP_DIR/frontend-dist
    encode gzip
    @api path /api/*
    reverse_proxy @api 127.0.0.1:$BACKEND_PORT
    @ws path /ws*
    reverse_proxy @ws 127.0.0.1:$BACKEND_PORT
    @uploads path /uploads/*
    reverse_proxy @uploads 127.0.0.1:$BACKEND_PORT
    @docs path /docs/*
    reverse_proxy @docs 127.0.0.1:$BACKEND_PORT
    try_files {path} /index.html
    file_server
}
EOF

pkill -f "caddy run --config $APP_DIR/run/Caddyfile" 2>/dev/null || true
nohup "$APP_DIR/tools/caddy" run --config "$APP_DIR/run/Caddyfile" > "$APP_DIR/logs/caddy.log" 2>&1 &
sleep 2

curl -sf "http://127.0.0.1:8282/api/categories" | head -c 300
echo
ss -tln | grep -E '5433|8082|8282' || true
