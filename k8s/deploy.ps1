# Kubernetes Deployment Script for Blood Bank Management System (PowerShell)
# Usage: .\deploy.ps1 -DockerHubUsername "YOUR_DOCKERHUB_USERNAME"

param(
    [Parameter(Mandatory=$true)]
    [string]$DockerHubUsername
)

Write-Host "🚀 Starting Kubernetes Deployment..." -ForegroundColor Green
Write-Host "📦 Docker Hub Username: $DockerHubUsername" -ForegroundColor Cyan

# Check if kubectl is installed
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ kubectl is not installed. Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Check if cluster is accessible
try {
    kubectl cluster-info | Out-Null
    Write-Host "✅ Kubernetes cluster is accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig." -ForegroundColor Red
    exit 1
}

# Update Docker Hub username in deployment files
Write-Host "📝 Updating Docker Hub username in deployment files..." -ForegroundColor Yellow

$backendFile = "backend-deployment.yaml"
$frontendFile = "frontend-deployment.yaml"

if (Test-Path $backendFile) {
    (Get-Content $backendFile) -replace 'YOUR_DOCKERHUB_USERNAME', $DockerHubUsername | Set-Content $backendFile
    Write-Host "✅ Updated $backendFile" -ForegroundColor Green
}

if (Test-Path $frontendFile) {
    (Get-Content $frontendFile) -replace 'YOUR_DOCKERHUB_USERNAME', $DockerHubUsername | Set-Content $frontendFile
    Write-Host "✅ Updated $frontendFile" -ForegroundColor Green
}

# Step 1: Create MySQL Secret
Write-Host "`n🔐 Creating MySQL secret..." -ForegroundColor Yellow
kubectl apply -f mysql-secret.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MySQL secret created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create MySQL secret" -ForegroundColor Red
    exit 1
}

# Step 2: Deploy MySQL
Write-Host "`n🗄️  Deploying MySQL..." -ForegroundColor Yellow
kubectl apply -f mysql-deployment.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MySQL deployment created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy MySQL" -ForegroundColor Red
    exit 1
}

# Wait for MySQL to be ready
Write-Host "`n⏳ Waiting for MySQL to be ready..." -ForegroundColor Yellow
$timeout = 300
$elapsed = 0
do {
    Start-Sleep -Seconds 5
    $elapsed += 5
    $mysqlPod = kubectl get pod -l app=mysql -o jsonpath='{.items[0].status.phase}' 2>$null
    if ($mysqlPod -eq "Running") {
        Write-Host "✅ MySQL is ready" -ForegroundColor Green
        break
    }
    Write-Host "   Still waiting... ($elapsed/$timeout seconds)" -ForegroundColor Gray
} while ($elapsed -lt $timeout)

if ($elapsed -ge $timeout) {
    Write-Host "❌ MySQL did not become ready in time" -ForegroundColor Red
    exit 1
}

# Step 3: Deploy Backend
Write-Host "`n🔧 Deploying Backend..." -ForegroundColor Yellow
kubectl apply -f backend-deployment.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend deployment created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy Backend" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy Frontend
Write-Host "`n🎨 Deploying Frontend..." -ForegroundColor Yellow
kubectl apply -f frontend-deployment.yaml
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend deployment created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy Frontend" -ForegroundColor Red
    exit 1
}

# Wait for deployments to be ready
Write-Host "`n⏳ Waiting for deployments to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Get service information
Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "`n📊 Deployment Status:" -ForegroundColor Cyan
kubectl get pods

Write-Host "`n🌐 Services:" -ForegroundColor Cyan
kubectl get services

Write-Host "`n🔗 Access Information:" -ForegroundColor Cyan
Write-Host "To access the application:" -ForegroundColor Yellow
Write-Host "  kubectl port-forward service/frontend-service 3000:80" -ForegroundColor White
Write-Host "  Then open http://localhost:3000 in your browser" -ForegroundColor White

