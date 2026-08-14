#!/usr/bin/env bash
# Запуск без Docker — только от пользователя temur
set -euo pipefail

APP_DIR=/home/temur/qoldan-qolga
BACKEND_PORT=8082
cd "$APP_DIR"

mkdir -p run/pg logs data/uploads tools

# PostgreSQL: сокеты в home, не в /var/run/postgresql
if ! grep -q '^unix_socket_directories' data/pg/postgresql.conf 2>/dev/null; then
  echo "unix_socket_directories = '$APP_DIR/run/pg'" >> data/pg/postgresql.conf
else
  sed -i "s|^unix_socket_directories.*|unix_socket_directories = '$APP_DIR/run/pg'|" data/pg/postgresql.conf
fi

if ! grep -q '^log_directory' data/pg/postgresql.conf 2>/dev/null; then
  echo "log_directory = '$APP_DIR/logs'" >> data/pg/postgresql.conf
else
  sed -i "s|^log_directory.*|log_directory = '$APP_DIR/logs'|" data/pg/postgresql.conf
fi

if ! pg_ctl -D "$APP_DIR/data/pg" status >/dev/null 2>&1; then
  pg_ctl -D "$APP_DIR/data/pg" -l "$APP_DIR/logs/pg.log" start
  sleep 3
fi
pg_ctl -D "$APP_DIR/data/pg" status

createdb -h 127.0.0.1 -p 5433 -U qoldan qoldan_qolga 2>/dev/null || true

dropdb -h 127.0.0.1 -p 5433 -U qoldan qoldan_qolga 2>/dev/null || true
createdb -h 127.0.0.1 -p 5433 -U qoldan qoldan_qolga

pkill -f "$APP_DIR/app.jar" 2>/dev/null || true
set -a
source .env
set +a
export SPRING_PROFILES_ACTIVE=docker
export DB_HOST=127.0.0.1
export DB_PORT=5433
export SERVER_PORT=$BACKEND_PORT
export UPLOAD_DIR="$APP_DIR/data/uploads"
export DOCS_DIR="$APP_DIR/data/uploads/docs"
nohup java -jar "$APP_DIR/app.jar" > "$APP_DIR/logs/backend.log" 2>&1 &

echo "Waiting for backend..."
for i in $(seq 1 40); do
  if curl -sf "http://127.0.0.1:$BACKEND_PORT/api/categories" >/dev/null; then
    echo "BACKEND_OK"
    break
  fi
  sleep 3
done

if [ ! -x "$APP_DIR/tools/caddy" ]; then
  curl -L -o /tmp/caddy.tgz https://github.com/caddyserver/caddy/releases/download/v2.8.4/caddy_2.8.4_linux_amd64.tar.gz
  tar xzf /tmp/caddy.tgz -C "$APP_DIR/tools" caddy
  chmod +x "$APP_DIR/tools/caddy"
fi

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
sleep 3

curl -sf http://127.0.0.1:8282/api/categories | head -c 300 || true
echo
ss -tln | grep -E '5433|8082|8282' || true
echo "Fallback stack started. Domain requires root: cp deploy/nginx/qoldan-qolga.uz.conf /etc/nginx/conf.d/ && nginx -t && systemctl reload nginx"
