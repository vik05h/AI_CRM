#!/usr/bin/env bash
# ==============================================================================
# Script: k8s_blue_green_switch.sh
# Purpose: Automated Zero-Downtime Blue-Green Deployment Strategy (Item 8)
# ==============================================================================

set -euo pipefail

NAMESPACE="crm-healthcare"
SERVICE_NAME="aicrm-backend-service"
TEST_SERVICE_NAME="aicrm-backend-test-service"

echo "================================================================="
echo "🔄 Automated Blue-Green Deployment Controller"
echo "   Namespace: ${NAMESPACE}"
echo "================================================================="

# 1. Detect currently active version
CURRENT_VERSION=$(kubectl get service "${SERVICE_NAME}" -n "${NAMESPACE}" -o jsonpath='{.spec.selector.version}' 2>/dev/null || echo "blue")
echo "[*] Currently Active Production Version: [${CURRENT_VERSION}]"

# 2. Determine target version
if [ "${CURRENT_VERSION}" = "blue" ]; then
    TARGET_VERSION="green"
else
    TARGET_VERSION="blue"
fi
echo "[*] Target Staging Version for Deployment: [${TARGET_VERSION}]"

# 3. Ensure target deployment is updated and rolled out
echo "[*] Rolling out deployment: aicrm-backend-${TARGET_VERSION}..."
kubectl rollout restart deployment "aicrm-backend-${TARGET_VERSION}" -n "${NAMESPACE}"
kubectl rollout status deployment "aicrm-backend-${TARGET_VERSION}" -n "${NAMESPACE}" --timeout=90s

# 4. Point test service to target version for verification
kubectl patch service "${TEST_SERVICE_NAME}" -n "${NAMESPACE}" \
    -p "{\"spec\":{\"selector\":{\"version\":\"${TARGET_VERSION}\"}}}"

echo "[*] Running health checks and smoke tests on target environment..."
# Smoke test verification
sleep 3
TEST_POD=$(kubectl get pods -n "${NAMESPACE}" -l "app=aicrm-backend,version=${TARGET_VERSION}" -o jsonpath='{.items[0].metadata.name}')
HEALTH_STATUS=$(kubectl exec -n "${NAMESPACE}" "${TEST_POD}" -- curl -s http://localhost:8000/health | grep -o '"status":"healthy"' || echo "")

if [ -z "${HEALTH_STATUS}" ]; then
    echo "❌ Smoke test FAILED on target environment [${TARGET_VERSION}]!"
    echo "   Aborting traffic cutover. Production remains safely on [${CURRENT_VERSION}]."
    exit 1
fi

echo "✅ Smoke test PASSED on target environment [${TARGET_VERSION}]!"

# 5. Zero-downtime traffic cutover
echo "[*] Performing instant zero-downtime traffic switch to [${TARGET_VERSION}]..."
kubectl patch service "${SERVICE_NAME}" -n "${NAMESPACE}" \
    -p "{\"spec\":{\"selector\":{\"version\":\"${TARGET_VERSION}\"}}}"

echo "================================================================="
echo "🎉 SUCCESS: Blue-Green Cutover Completed!"
echo "   New Active Version: [${TARGET_VERSION}]"
echo "   Previous Version:   [${CURRENT_VERSION}] (Kept warm for instant rollback)"
echo "================================================================="
