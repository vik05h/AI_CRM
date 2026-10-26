#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "================================================================="
echo "[+] Launching Prometheus & Grafana Monitoring Stack..."
echo "================================================================="

docker compose -f "${SCRIPT_DIR}/docker-compose.monitoring.yml" up -d

echo "================================================================="
echo "📊 Grafana GUI:    http://localhost:3000 (Pre-configured Dashboard)"
echo "📈 Prometheus GUI: http://localhost:9090"
echo "================================================================="
