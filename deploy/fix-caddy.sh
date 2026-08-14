#!/usr/bin/env bash
set -euo pipefail
APP_DIR=/home/temur/qoldan-qolga
BACKEND_PORT=8082

echo "Backend direct:"
curl -sf "http://127.0.0.1:$BACKEND_PORT/api/categories" | head -c 200
echo

cat > "$APP_DIR/run/Caddyfile" <<EOF
:8282 {
    root * $APP_DIR/frontend-dist
    encode gzip
    handle /api/* {
        reverse_proxy 127.0.0.1:$BACKEND_PORT
    }
    handle /ws* {
        reverse_proxy 127.0.0.1:$BACKEND_PORT
    }
    handle /uploads/* {
        reverse_proxy 127.0.0.1:$BACKEND_PORT
    }
    handle /docs/* {
        reverse_proxy 127.0.0.1:$BACKEND_PORT
    }
    handle {
        try_files {path} /index.html
        file_server
    }
}
EOF

pkill -f "caddy run --config $APP_DIR/run/Caddyfile" 2>/dev/null || true
pkill -f "$APP_DIR/tools/caddy" 2>/dev/null || true
sleep 1
nohup "$APP_DIR/tools/caddy" run --config "$APP_DIR/run/Caddyfile" > "$APP_DIR/logs/caddy.log" 2>&1 &
sleep 2

echo "Via Caddy:"
curl -sf "http://127.0.0.1:8282/api/categories" | head -c 200
echo
ss -tln | grep -E '8082|8282' || true
