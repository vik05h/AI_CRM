<#
.SYNOPSIS
    Starts the Jenkins GUI Server via Docker and retrieves the initial admin password.
#>

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[+] Launching Jenkins GUI Server for College Project Demo..." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan

docker compose -f "$PSScriptRoot\docker-compose.jenkins.yml" up -d

Write-Host "[*] Waiting for Jenkins to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "[*] Fetching Initial Admin Password from Jenkins Container..." -ForegroundColor Green
$adminPass = docker exec devops-jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword 2>$null

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "🚀 Jenkins GUI is accessible at: http://localhost:8080" -ForegroundColor Green
if ($adminPass) {
    Write-Host "🔑 Initial Admin Password: $adminPass" -ForegroundColor Yellow
} else {
    Write-Host "🔑 To get your password run: docker exec devops-jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword"
}
Write-Host "=================================================================" -ForegroundColor Cyan
