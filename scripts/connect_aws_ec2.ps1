<#
.SYNOPSIS
    Connects or tunnels to the AWS EC2 instance using the secured private key.
.DESCRIPTION
    Uses the private key located at .secrets/ec2_key.pem to establish an SSH shell
    or an encrypted port-forwarding tunnel for PostgreSQL (Port 5432).
    Automatically detects whether the instance uses 'ec2-user' (Amazon Linux) or 'ubuntu'.
.EXAMPLE
    .\scripts\connect_aws_ec2.ps1 -PublicIp "98.81.196.145" -Action "setup-db"
    .\scripts\connect_aws_ec2.ps1 -PublicIp "98.81.196.145" -Action "tunnel"
    .\scripts\connect_aws_ec2.ps1 -PublicIp "98.81.196.145" -Action "shell"
#>
param (
    [Parameter(Mandatory=$false)]
    [string]$PublicIp = "",

    [Parameter(Mandatory=$false)]
    [ValidateSet("shell", "tunnel", "setup-db")]
    [string]$Action = "setup-db",

    [Parameter(Mandatory=$false)]
    [string]$User = ""
)

$KeyPath = "$PSScriptRoot\..\.secrets\ec2_key.pem"

if (-not (Test-Path $KeyPath)) {
    Write-Error "Private key not found at $KeyPath. Please ensure the key exists."
    exit 1
}

if ([string]::IsNullOrWhiteSpace($PublicIp)) {
    $PublicIp = Read-Host "Enter your AWS EC2 Public IPv4 Address (e.g. 54.x.x.x)"
}

# Auto-detect user if not explicitly specified
if ([string]::IsNullOrWhiteSpace($User)) {
    Write-Host "[*] Probing SSH user for $PublicIp (ec2-user vs ubuntu)..." -ForegroundColor DarkGray
    $ec2Check = ssh -i "$KeyPath" -o StrictHostKeyChecking=no -o ConnectTimeout=3 -o BatchMode=yes "ec2-user@$PublicIp" "echo ok" 2>$null
    if ($LASTEXITCODE -eq 0 -or $ec2Check -eq "ok") {
        $User = "ec2-user"
    } else {
        $User = "ubuntu"
    }
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "[+] Target AWS Host: $User@$PublicIp" -ForegroundColor Green
Write-Host "   Key: $KeyPath"
Write-Host "   Action: $Action"
Write-Host "=================================================================" -ForegroundColor Cyan

switch ($Action) {
    "shell" {
        Write-Host "[*] Opening interactive SSH session..." -ForegroundColor Green
        ssh -i "$KeyPath" -o StrictHostKeyChecking=no "$User@$PublicIp"
    }
    "tunnel" {
        Write-Host "[*] Establishing encrypted SSH tunnel for PostgreSQL on local port 5432..." -ForegroundColor Green
        Write-Host "[*] Encrypted connection active: 127.0.0.1:5432 -> AWS EC2:5432" -ForegroundColor Yellow
        Write-Host "[*] Press Ctrl+C at any time to close the tunnel." -ForegroundColor DarkGray
        ssh -i "$KeyPath" -N -L 5432:localhost:5432 -o StrictHostKeyChecking=no "$User@$PublicIp"
    }
    "setup-db" {
        Write-Host "[*] Uploading and deploying PostgreSQL on AWS EC2..." -ForegroundColor Green
        $remoteScript = Get-Content -Raw "$PSScriptRoot\setup_aws_postgres.sh"
        $remoteScript | ssh -i "$KeyPath" -o StrictHostKeyChecking=no "$User@$PublicIp" "bash -s"
    }
}
