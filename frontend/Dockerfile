# ==============================================================================
# Multi-Stage Production Dockerfile for Frontend (Angular 21 + Tailwind v4)
# DevSecOps Hardened: Minimal Alpine image, security headers, health check
# ==============================================================================

# Stage 1: Build Angular application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests first for optimal layer caching
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build -- --configuration production

# Stage 2: Lightweight Nginx Web Server
FROM nginx:1.27-alpine AS runner

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built application assets from builder
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom hardened nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
