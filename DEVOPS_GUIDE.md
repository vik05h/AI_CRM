# 🚀 DevOps, Blue-Green Deployment & DevSecOps Demonstration Guide

> **Course Assignment:** PBL-III Evaluation  
> **System:** AI-Native Healthcare Patient CRM  
> **Items Implemented:** 7 (CI/CD on Kubernetes), 8 (Automated Blue-Green Deployment), 9 (DevSecOps in Healthcare System)

---

## 🏛️ System Architecture

```
                       +----------------------------------------+
                       |              GitHub Repo               |
                       +----------------------------------------+
                                           |
                                           v
                       +----------------------------------------+
                       |           Jenkins CI/CD GUI            |
                       |         (http://localhost:8080)        |
                       +----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    |                      |                      |
                    v                      v                      v
        [ DevSecOps Quality Gate ]  [ Multi-Stage Docker ] [ Container Scan ]
        - HIPAA PHI Scanner         - aicrm-backend:latest - Trivy CVE Scan
        - Bandit Python SAST        - aicrm-stub:latest
        - npm audit SCA             - aicrm-frontend:latest
                    |
                    v
       +------------------------------------------------------------------+
       |               Kubernetes Cluster (Namespace: crm-healthcare)      |
       |                                                                  |
       |  +--------------------+             +-------------------------+  |
       |  |  aicrm-frontend    |             |       aicrm-stub        |  |
       |  | (Port 80 -> 30080) |             |       (Port 8001)       |  |
       |  +--------------------+             +-------------------------+  |
       |                                                                  |
       |                 Active Production Service (Port 30800)           |
       |                 selector: { app: aicrm-backend, version: blue }  |
       |                                      |                           |
       |                   +------------------+------------------+        |
       |                   | (Active Traffic)                    | (Warm) |
       |                   v                                     v        |
       |         [ Deployment: Blue ]                  [ Deployment: Green ]
       |         2 Replicas (v1.0.0)                   2 Replicas (v1.1.0)|
       +------------------------------------------------------------------+
                                           |
                                           v
                       +----------------------------------------+
                       |        AWS Cloud PostgreSQL            |
                       |      (Hosted on AWS EC2 / RDS)         |
                       +----------------------------------------+
                                           |
                                           v
                       +----------------------------------------+
                       |       Grafana & Prometheus GUI         |
                       |         (http://localhost:3000)        |
                       +----------------------------------------+
```

---

## 🖥️ Live Demonstration Quickstart

### 1. Launch Jenkins GUI (Item 7 & 8 Controller)
```powershell
.\jenkins\setup_jenkins.ps1
```
- Open browser: `http://localhost:8080`
- Initial Admin Password will be automatically printed to your console.
- Pipeline definition: `Jenkinsfile` is pre-configured with all 7 automated stages!

### 2. Launch Prometheus & Grafana GUI (Observability & Monitoring)
```powershell
.\monitoring\start_monitoring.ps1
```
- Open browser: `http://localhost:3000`
- Pre-configured Dashboard: **"Healthcare Patient CRM - DevOps Observability Dashboard"**
- View real-time service latency, scrape durations, and Blue vs Green traffic metrics.

### 3. Run DevSecOps Security Quality Gates (Item 9)
```powershell
python scripts/run_devsecops_pipeline.py
```
- **Gate 1:** HIPAA Protected Health Information (PHI) & Secret Scanner (Scans for unmasked patient data, SSNs, and cloud tokens).
- **Gate 2:** Backend Static Application Security Testing (SAST with Bandit).
- **Gate 3:** Frontend Software Composition Analysis (SCA with `npm audit`).
- **Gate 4:** Container Image Security Scan with Trivy (`scripts/run_trivy_scan.ps1`).

### 4. Demonstrate Automated Blue-Green Cutover (Item 8)
```powershell
.\scripts\k8s_blue_green_switch.ps1
```
- Dynamically discovers active version (`blue` or `green`).
- Rolls out updated build to staging target.
- Performs automated smoke test on `/health`.
- Switches production traffic instantly with zero downtime.

---

## ☁️ AWS Cloud Database Setup

To use the AWS EC2 instance from your AWS Learner Lab:
1. Connect / launch Dockerized PostgreSQL on your EC2 instance:
```powershell
.\scripts\connect_aws_ec2.ps1 -PublicIp "<YOUR_EC2_PUBLIC_IP>" -Action "setup-db"
```
2. Or open an encrypted SSH tunnel:
```powershell
.\scripts\connect_aws_ec2.ps1 -PublicIp "<YOUR_EC2_PUBLIC_IP>" -Action "tunnel"
```
3. Update `.env` or `k8s/secrets.yaml` with your connection URL:
```
DATABASE_URL=postgresql+asyncpg://aicrm:aicrmsecurepassword123!@<YOUR_EC2_PUBLIC_IP>:5432/aicrm
```

---

## 📋 Evaluation Checklist for Professor

| Item | Requirement | Demo Step | Status |
| :--- | :--- | :--- | :---: |
| **Item 7** | CI/CD Pipeline on Kubernetes using Jenkins | Show Jenkins GUI (`http://localhost:8080`) executing `Jenkinsfile` and deploying pods in `kubectl get pods -n crm-healthcare`. | ✅ Complete |
| **Item 8** | Automated Blue-Green Deployment | Run `scripts/k8s_blue_green_switch.ps1` to show zero-downtime service selector switch between `blue` and `green`. | ✅ Complete |
| **Item 9** | Secure DevOps in Healthcare System | Run `python scripts/run_devsecops_pipeline.py` to show HIPAA PHI scanning, Bandit SAST, Trivy container scanning, and `/api/healthcare/compliance`. | ✅ Complete |
| **GUI** | Jenkins GUI & Grafana GUI | Show Jenkins (`http://localhost:8080`) and Grafana (`http://localhost:3000`). | ✅ Complete |
| **AWS** | AWS Database Integration | Show remote PostgreSQL connection to AWS EC2. | ✅ Complete |
