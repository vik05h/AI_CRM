<#
.SYNOPSIS
    Starts Prometheus and Grafana GUI for project observability.
#>

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[+] Launching Prometheus & Grafana Monitoring Stack..." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan

docker compose -f "$PSScriptRoot\docker-compose.monitoring.yml" up -d

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "📊 Grafana GUI:    http://localhost:3000 (Pre-configured Dashboard)" -ForegroundColor Green
Write-Host "📈 Prometheus GUI: http://localhost:9090" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
