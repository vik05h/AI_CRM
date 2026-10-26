#!/usr/bin/env bash
# ==============================================================================
# Script: setup_aws_postgres.sh
# Purpose: Installs Docker (if missing) and runs PostgreSQL 15 container on AWS EC2
# Compatible: Amazon Linux 2023, Amazon Linux 2, Ubuntu, Debian
# ==============================================================================

set -euo pipefail

echo "==> Updating package repositories..."
if command -v dnf &>/dev/null; then
    sudo dnf update -y || true
elif command -v yum &>/dev/null; then
    sudo yum update -y || true
elif command -v apt-get &>/dev/null; then
    sudo apt-get update -y || true
fi

echo "==> Checking if Docker is installed..."
if ! command -v docker &>/dev/null; then
    echo "==> Installing Docker on AWS EC2..."
    if command -v dnf &>/dev/null; then
        sudo dnf install -y docker
    elif command -v yum &>/dev/null; then
        sudo yum install -y docker
    else
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
    fi
    sudo usermod -aG docker "$USER" || true
    sudo systemctl enable docker || true
    sudo systemctl start docker || true
    echo "==> Docker installed and started successfully!"
else
    echo "==> Docker is already installed."
    sudo systemctl start docker || true
fi

# Set database variables
DB_NAME="aicrm"
DB_USER="aicrm"
DB_PASSWORD="aicrmpassword"
DB_PORT="5432"
CONTAINER_NAME="aicrm-postgres"

echo "==> Stopping any existing container named ${CONTAINER_NAME}..."
sudo docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true

echo "==> Launching PostgreSQL 15 container on port ${DB_PORT}..."
sudo docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart always \
    -p 0.0.0.0:${DB_PORT}:5432 \
    -e POSTGRES_USER="${DB_USER}" \
    -e POSTGRES_PASSWORD="${DB_PASSWORD}" \
    -e POSTGRES_DB="${DB_NAME}" \
    -v aicrm_postgres_data:/var/lib/postgresql/data \
    postgres:15-alpine

echo "==> Waiting for PostgreSQL to be ready..."
for i in {1..15}; do
    if sudo docker exec "${CONTAINER_NAME}" pg_isready -U "${DB_USER}" -d "${DB_NAME}" &>/dev/null; then
        echo "================================================================="
        echo "✅ SUCCESS: PostgreSQL 15 is active and ready on AWS EC2!"
        echo "   Database: ${DB_NAME}"
        echo "   User:     ${DB_USER}"
        echo "   Port:     ${DB_PORT}"
        echo "================================================================="
        exit 0
    fi
    sleep 1
done

echo "⚠️  PostgreSQL started. Check logs using: sudo docker logs ${CONTAINER_NAME}"
