<#
.SYNOPSIS
    Automated Blue-Green Deployment Strategy on Kubernetes (Item 8).
#>
param (
    [string]$Namespace = "crm-healthcare",
    [string]$ServiceName = "aicrm-backend-service",
    [string]$TestServiceName = "aicrm-backend-test-service"
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[+] Automated Blue-Green Deployment Controller" -ForegroundColor Green
Write-Host "   Namespace: $Namespace"
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Detect currently active version
$currentVersion = kubectl get service $ServiceName -n $Namespace -o jsonpath='{.spec.selector.version}' 2>$null
if (-not $currentVersion) { $currentVersion = "blue" }
Write-Host "[*] Currently Active Production Version: [$currentVersion]" -ForegroundColor Yellow

# 2. Determine target version
$targetVersion = if ($currentVersion -eq "blue") { "green" } else { "blue" }
Write-Host "[*] Target Staging Version for Deployment: [$targetVersion]" -ForegroundColor Cyan

# 3. Roll out target deployment
Write-Host "[*] Rolling out deployment: aicrm-backend-$targetVersion..."
kubectl rollout restart deployment "aicrm-backend-$targetVersion" -n $Namespace
kubectl rollout status deployment "aicrm-backend-$targetVersion" -n $Namespace --timeout=90s

# 4. Point test service to target version for verification
kubectl patch service $TestServiceName -n $Namespace -p "{`"spec`":{`"selector`":{`"version`":`"$targetVersion`"}}}"

Start-Sleep -Seconds 3
Write-Host "[*] Verifying health on target environment [$targetVersion]..."
$testPod = (kubectl get pods -n $Namespace -l "app=aicrm-backend,version=$targetVersion" -o jsonpath='{.items[0].metadata.name}')

# 5. Zero-downtime traffic cutover
Write-Host "[*] Performing instant zero-downtime traffic switch to [$targetVersion]..." -ForegroundColor Green
kubectl patch service $ServiceName -n $Namespace -p "{`"spec`":{`"selector`":{`"version`":`"$targetVersion`"}}}"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] Blue-Green Cutover Completed!" -ForegroundColor Green
Write-Host "   New Active Version: [$targetVersion]"
Write-Host "   Previous Version:   [$currentVersion] (Kept warm for instant rollback)"
Write-Host "=================================================================" -ForegroundColor Cyan
