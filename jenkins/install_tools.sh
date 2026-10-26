#!/usr/bin/env bash
set -e

echo "==> Installing Python3, Docker CLI, and kubectl inside Jenkins container..."
apt-get update
apt-get install -y --no-install-recommends ca-certificates curl python3 python3-pip

# Install Docker CLI directly via official binary
echo "==> Installing Docker CLI..."
curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-27.3.1.tgz -o /tmp/docker.tgz
tar -xzf /tmp/docker.tgz -C /tmp/
mv /tmp/docker/docker /usr/local/bin/docker
chmod +x /usr/local/bin/docker
rm -rf /tmp/docker.tgz /tmp/docker

# Install kubectl directly via official binary
echo "==> Installing kubectl..."
K8S_VER=$(curl -L -s https://dl.k8s.io/release/stable.txt)
curl -fsSL "https://dl.k8s.io/release/${K8S_VER}/bin/linux/amd64/kubectl" -o /usr/local/bin/kubectl
chmod +x /usr/local/bin/kubectl

echo "==> Verifying tools:"
docker --version
python3 --version
kubectl version --client

echo "==> ALL_TOOLS_READY"
