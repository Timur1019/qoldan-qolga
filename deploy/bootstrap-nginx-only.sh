#!/usr/bin/env bash
# Только nginx vhost — запускать от root в Cockpit
set -euo pipefail
APP_DIR=/home/temur/qoldan-qolga
NGINX_CONF=$APP_DIR/deploy/nginx/qoldan-qolga.uz.conf
cp "$NGINX_CONF" /etc/nginx/conf.d/qoldan-qolga.uz.conf
nginx -t
systemctl reload nginx
curl -sf http://127.0.0.1:8282/api/categories | head -c 200 && echo
curl -sf http://qoldan-qolga.uz/api/categories | head -c 200 && echo
echo NGINX_OK
