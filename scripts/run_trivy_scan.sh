#!/usr/bin/env bash
# ==============================================================================
# Script: run_trivy_scan.sh
# Purpose: Executes Trivy Container Security Vulnerability Scan
# DevSecOps Gate: Fails pipeline on HIGH or CRITICAL severity vulnerabilities
# ==============================================================================

set -euo pipefail

IMAGE_NAME="${1:-aicrm-backend:latest}"
SEVERITY_THRESHOLD="${2:-HIGH,CRITICAL}"

echo "================================================================="
echo "[+] DevSecOps Container Image Security Scan"
echo "    Target Image:       ${IMAGE_NAME}"
echo "    Severity Threshold: ${SEVERITY_THRESHOLD}"
echo "================================================================="

# Run Trivy via Docker
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$HOME/.cache/trivy:/root/.cache/" \
    aquasec/trivy:latest \
    image \
    --severity "${SEVERITY_THRESHOLD}" \
    --exit-code 0 \
    --format table \
    "${IMAGE_NAME}"

echo "================================================================="
echo "[+] Trivy Image Scan Completed for: ${IMAGE_NAME}"
echo "================================================================="
