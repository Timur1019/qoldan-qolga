#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
if [[ ! -f .env ]]; then
  echo "Missing .env — copy from .env.example and fill secrets."
  exit 1
fi
mkdir -p data/postgres data/uploads
docker compose --env-file .env up -d --build
for i in $(seq 1 60); do
  if curl -sf http://127.0.0.1:8282/api/categories >/dev/null 2>&1; then
    echo "OK: http://127.0.0.1:8282"
    exit 0
  fi
  sleep 5
done
echo "Check logs: docker compose logs -f backend"
exit 1
