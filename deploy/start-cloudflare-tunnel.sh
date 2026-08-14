#!/usr/bin/env bash
# Публичный доступ без root через Cloudflare quick tunnel
set -euo pipefail
APP_DIR=/home/temur/qoldan-qolga
cd "$APP_DIR"
mkdir -p tools logs

if [ ! -x tools/cloudflared ]; then
  curl -L -o tools/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x tools/cloudflared
fi

# убедиться что локальный стек жив
curl -sf http://127.0.0.1:8282/api/categories >/dev/null || {
  echo "Caddy/API не отвечает на :8282 — сначала: bash deploy/start-temur-fallback.sh"
  exit 1
}

pkill -f 'cloudflared tunnel --url' 2>/dev/null || true
nohup ./tools/cloudflared tunnel --url http://127.0.0.1:8282 > logs/cloudflared.log 2>&1 &
sleep 5
grep -Eo 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' logs/cloudflared.log | tail -1 || {
  echo "URL ещё не появился, смотри logs/cloudflared.log"
  tail -30 logs/cloudflared.log
}
