#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "================================================================="
echo "[+] Launching Jenkins GUI Server for College Project Demo..."
echo "================================================================="

docker compose -f "${SCRIPT_DIR}/docker-compose.jenkins.yml" up -d

echo "[*] Waiting for Jenkins to initialize (15 seconds)..."
sleep 15

echo "================================================================="
echo "🚀 Jenkins GUI is accessible at: http://localhost:8080"
echo "🔑 Initial Admin Password:"
docker exec devops-jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword || true
echo "================================================================="
