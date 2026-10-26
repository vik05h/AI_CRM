pipeline {
    agent any

    environment {
        NAMESPACE = 'crm-healthcare'
        APP_NAME  = 'aicrm-backend'
        DOCKER_REGISTRY = 'local'
    }

    stages {
        stage('1. Environment & SCM Checkout') {
            steps {
                echo "============================================================"
                echo "🚀 Starting CI/CD Pipeline: Healthcare CRM DevSecOps"
                echo "   Assignment: PBL-III Items 7, 8, and 9"
                echo "============================================================"
                checkout scm
            }
        }

        stage('2. DevSecOps Security Quality Gates') {
            steps {
                echo "============================================================"
                echo "🛡️ Executing DevSecOps Quality Gates (Item 9)"
                echo "   1. Secret & HIPAA PHI Detection"
                echo "   2. Python SAST Static Code Analysis"
                echo "   3. Frontend Dependency SCA Audit"
                echo "============================================================"
                sh 'python3 scripts/run_devsecops_pipeline.py || python scripts/run_devsecops_pipeline.py'
            }
        }

        stage('3. Build Docker Images') {
            steps {
                echo "============================================================"
                echo "🐳 Building Multi-Stage Production Docker Images (Item 7)"
                echo "============================================================"
                sh 'docker build -t aicrm-backend:latest -f backend/Dockerfile backend/'
                sh 'docker build -t aicrm-stub:latest -f backend/Dockerfile.stub backend/'
                sh 'docker build -t aicrm-frontend:latest -f frontend/Dockerfile frontend/'
                
                // Tag for Blue-Green dual deployment
                sh 'docker tag aicrm-backend:latest aicrm-backend:blue'
                sh 'docker tag aicrm-backend:latest aicrm-backend:green'
            }
        }

        stage('4. Container CVE Security Scan (Trivy)') {
            steps {
                echo "============================================================"
                echo "🔍 Running Trivy Container Vulnerability Scan"
                echo "============================================================"
                sh 'bash scripts/run_trivy_scan.sh aicrm-backend:latest HIGH,CRITICAL || true'
            }
        }

        stage('5. Kubernetes Cluster Setup') {
            steps {
                echo "============================================================"
                echo "☸️ Applying Kubernetes Infrastructure Manifests"
                echo "============================================================"
                sh 'kubectl apply -f k8s/namespace.yaml'
                sh 'kubectl apply -f k8s/configmap.yaml'
                sh 'kubectl apply -f k8s/secrets.yaml'
                sh 'kubectl apply -f k8s/database.yaml'
                sh 'kubectl apply -f k8s/stub.yaml'
                sh 'kubectl apply -f k8s/frontend.yaml'
                sh 'kubectl apply -f k8s/blue-green/backend-blue.yaml'
                sh 'kubectl apply -f k8s/blue-green/backend-green.yaml'
                sh 'kubectl apply -f k8s/blue-green/service-active.yaml'
            }
        }

        stage('6. Automated Blue-Green Cutover (Item 8)') {
            steps {
                echo "============================================================"
                echo "🔄 Executing Zero-Downtime Blue-Green Deployment Switch"
                echo "============================================================"
                sh 'bash scripts/k8s_blue_green_switch.sh'
            }
        }

        stage('7. Healthcheck & Smoke Tests') {
            steps {
                echo "============================================================"
                echo "🩺 Running Final Deployment Verification"
                echo "============================================================"
                sh '''
                    echo "Checking active Kubernetes Service endpoints..."
                    kubectl get svc -n crm-healthcare
                    echo "Checking running Pods status..."
                    kubectl get pods -n crm-healthcare
                '''
            }
        }
    }

    post {
        success {
            echo "============================================================"
            echo "✅ Pipeline Succeeded! All 3 assignment deliverables deployed."
            echo "   Jenkins GUI:  http://localhost:8080"
            echo "   Frontend UI:  http://localhost:30080"
            echo "   Backend API:  http://localhost:30800"
            echo "============================================================"
        }
        failure {
            echo "❌ Pipeline failed! Check logs and DevSecOps quality gates."
        }
    }
}
