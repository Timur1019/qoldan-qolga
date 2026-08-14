#!/usr/bin/env bash
# Запускать ОДИН РАЗ от root на сервере 5.182.26.233
set -euo pipefail
APP_DIR=/home/temur/qoldan-qolga
NGINX_CONF=$APP_DIR/deploy/nginx/qoldan-qolga.uz.conf
usermod -aG docker temur
mkdir -p "$APP_DIR/data/postgres" "$APP_DIR/data/uploads"
chown -R temur:temur "$APP_DIR"
cd "$APP_DIR"
docker compose --env-file .env up -d --build
cp "$NGINX_CONF" /etc/nginx/conf.d/qoldan-qolga.uz.conf
nginx -t && systemctl reload nginx
curl -sf http://127.0.0.1:8282/api/categories && echo OK
