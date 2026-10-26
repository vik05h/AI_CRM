<#
.SYNOPSIS
    Connects or tunnels to the AWS EC2 instance using the secured private key.
.DESCRIPTION
    Uses the private key located at .secrets/ec2_key.pem to establish an SSH shell
    or an encrypted port-forwarding tunnel for PostgreSQL (Port 5432).
.EXAMPLE
    .\scripts\connect_aws_ec2.ps1 -PublicIp "3.84.12.34" -Action "shell"
    .\scripts\connect_aws_ec2.ps1 -PublicIp "3.84.12.34" -Action "tunnel"
    .\scripts\connect_aws_ec2.ps1 -PublicIp "3.84.12.34" -Action "setup-db"
#>
param (
    [Parameter(Mandatory=$false)]
    [string]$PublicIp = "",

    [Parameter(Mandatory=$false)]
    [ValidateSet("shell", "tunnel", "setup-db")]
    [string]$Action = "shell",

    [Parameter(Mandatory=$false)]
    [string]$User = "ubuntu" # or ec2-user
)

$KeyPath = "$PSScriptRoot\..\.secrets\ec2_key.pem"

if (-not (Test-Path $KeyPath)) {
    Write-Error "Private key not found at $KeyPath. Please ensure the key exists."
    exit 1
}

if ([string]::IsNullOrWhiteSpace($PublicIp)) {
    $PublicIp = Read-Host "Enter your AWS EC2 Public IPv4 Address (e.g. 54.x.x.x)"
}

Write-Host "==> Target EC2 Host: $User@$PublicIp" -ForegroundColor Cyan

switch ($Action) {
    "shell" {
        Write-Host "==> Opening SSH session..." -ForegroundColor Green
        ssh -i "$KeyPath" -o StrictHostKeyChecking=no "$User@$PublicIp"
    }
    "tunnel" {
        Write-Host "==> Establishing encrypted SSH tunnel for PostgreSQL on local port 5432..." -ForegroundColor Green
        Write-Host "==> You can now point your local DATABASE_URL to 127.0.0.1:5432" -ForegroundColor Yellow
        Write-Host "==> Press Ctrl+C to close the tunnel." -ForegroundColor DarkGray
        ssh -i "$KeyPath" -N -L 5432:localhost:5432 -o StrictHostKeyChecking=no "$User@$PublicIp"
    }
    "setup-db" {
        Write-Host "==> Uploading and executing PostgreSQL setup on AWS EC2..." -ForegroundColor Green
        $remoteScript = Get-Content -Raw "$PSScriptRoot\setup_aws_postgres.sh"
        ssh -i "$KeyPath" -o StrictHostKeyChecking=no "$User@$PublicIp" "bash -s" <<< "$remoteScript"
    }
}
