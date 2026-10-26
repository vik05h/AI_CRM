#!/usr/bin/env bash
# ==============================================================================
# Script: setup_aws_postgres.sh
# Purpose: Installs Docker (if missing) and runs PostgreSQL 15 container on AWS EC2
# For: College PBL-III DevOps Project - AWS Cloud Database
# ==============================================================================

set -euo pipefail

echo "==> Updating package repositories..."
sudo apt-get update -y || sudo yum update -y

echo "==> Checking if Docker is installed..."
if ! command -v docker &>/dev/null; then
    echo "==> Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker "$USER"
    sudo systemctl enable docker
    sudo systemctl start docker
    echo "==> Docker installed successfully!"
else
    echo "==> Docker is already installed."
fi

# Ensure docker service is running
sudo systemctl start docker

# Set database variables
DB_NAME="aicrm"
DB_USER="aicrm"
DB_PASSWORD="aicrmsecurepassword123!"
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
until sudo docker exec "${CONTAINER_NAME}" pg_isready -U "${DB_USER}" -d "${DB_NAME}"; do
    sleep 2
done

echo ""
echo "============================================================"
echo "✅ PostgreSQL 15 is LIVE and READY on your AWS EC2 instance!"
echo "   Database Name: ${DB_NAME}"
echo "   Username:      ${DB_USER}"
echo "   Port:          ${DB_PORT}"
echo "============================================================"
echo "Connection string for your backend (.env):"
echo "DATABASE_URL=postgresql+asyncpg://${DB_USER}:${DB_PASSWORD}@<YOUR_EC2_PUBLIC_IP>:${DB_PORT}/${DB_NAME}"
echo "============================================================"
