<#
.SYNOPSIS
    Runs Trivy Container Vulnerability Scan via Docker.
.PARAMETER ImageName
    Name or tag of the Docker image to scan (e.g. aicrm-backend:latest).
.PARAMETER Severity
    Severity levels to inspect (default: HIGH,CRITICAL).
#>
param (
    [string]$ImageName = "aicrm-backend:latest",
    [string]$Severity = "HIGH,CRITICAL"
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[+] DevSecOps Container Image Security Scan" -ForegroundColor Green
Write-Host "    Target Image:       $ImageName"
Write-Host "    Severity Threshold: $Severity"
Write-Host "=================================================================" -ForegroundColor Cyan

docker run --rm `
    -v /var/run/docker.sock:/var/run/docker.sock `
    -v "$env:USERPROFILE\.cache\trivy:/root/.cache/" `
    aquasec/trivy:latest `
    image `
    --severity "$Severity" `
    --exit-code 0 `
    --format table `
    "$ImageName"
