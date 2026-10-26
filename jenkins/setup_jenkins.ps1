<#
.SYNOPSIS
    Starts the Jenkins GUI Server via Docker, provisions pipeline CLI tools, and retrieves the initial admin password.
#>

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[+] Launching Jenkins GUI Server for College Project Demo..." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan

docker compose -f "$PSScriptRoot\docker-compose.jenkins.yml" up -d

Write-Host "[*] Waiting for Jenkins to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Ensure Docker CLI, Python3, and kubectl are installed inside Jenkins
docker cp "$PSScriptRoot\install_tools.sh" devops-jenkins-server:/tmp/install_tools.sh 2>$null
docker exec devops-jenkins-server bash /tmp/install_tools.sh 2>$null

Write-Host "[*] Fetching Initial Admin Password from Jenkins Container..." -ForegroundColor Green
$adminPass = docker exec devops-jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword 2>$null

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[URL] Jenkins GUI: http://127.0.0.1:8080 (or http://localhost:8080)" -ForegroundColor Green
if ($adminPass) {
    Write-Host "[KEY] Initial Admin Password: $adminPass" -ForegroundColor Yellow
} else {
    Write-Host "[KEY] To get your password run: docker exec devops-jenkins-server cat /var/jenkins_home/secrets/initialAdminPassword"
}
Write-Host "=================================================================" -ForegroundColor Cyan
