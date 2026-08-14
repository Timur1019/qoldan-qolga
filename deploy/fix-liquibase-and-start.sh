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

# Починить рассинхрон Liquibase: колонка есть, changeset не записан
psql -h 127.0.0.1 -p 5433 -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<'SQL'
INSERT INTO databasechangelog (
  id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, liquibase, deployment_id
)
SELECT
  '025-add-deleted-at-advertisements',
  'cursor',
  'db/changelog/changes/025-add-deleted-at-advertisements.xml',
  NOW(),
  COALESCE((SELECT MAX(orderexecuted) FROM databasechangelog), 0) + 1,
  'EXECUTED',
  '9:manual-fix',
  'addColumn tableName=advertisements',
  '4.27.0',
  'manual-fix'
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'advertisements' AND column_name = 'deleted_at'
)
AND NOT EXISTS (
  SELECT 1 FROM databasechangelog
  WHERE id = '025-add-deleted-at-advertisements'
    AND author = 'cursor'
    AND filename = 'db/changelog/changes/025-add-deleted-at-advertisements.xml'
);
SQL

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
    break
  fi
  sleep 3
done

# Обновить Caddy на backend :8082
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

curl -sf "http://127.0.0.1:8282/api/categories" | head -c 300 || { tail -30 "$APP_DIR/logs/backend.log"; exit 1; }
echo
ss -tln | grep -E '5433|8082|8282' || true
