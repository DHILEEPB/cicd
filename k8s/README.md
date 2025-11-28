# Kubernetes Deployment Guide

## Quick Start

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

## Quick Deployment

### Using PowerShell (Windows)
```powershell
cd k8s
.\deploy.ps1 -DockerHubUsername "YOUR_DOCKERHUB_USERNAME"
```

### Using Bash (Linux/Mac)
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh YOUR_DOCKERHUB_USERNAME
```

### Manual Deployment
```bash
# 1. Update Docker Hub username in backend-deployment.yaml and frontend-deployment.yaml

# 2. Create MySQL secret
kubectl apply -f mysql-secret.yaml

# 3. Deploy MySQL
kubectl apply -f mysql-deployment.yaml
kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s

# 4. Deploy Backend
kubectl apply -f backend-deployment.yaml

# 5. Deploy Frontend
kubectl apply -f frontend-deployment.yaml

# 6. Access application
kubectl port-forward service/frontend-service 3000:80
```

## Files

- `mysql-secret.yaml` - MySQL password secret
- `mysql-deployment.yaml` - MySQL database deployment
- `backend-deployment.yaml` - Spring Boot backend deployment
- `frontend-deployment.yaml` - React frontend deployment
- `deploy.sh` - Automated deployment script (Linux/Mac)
- `deploy.ps1` - Automated deployment script (Windows)
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide

## Prerequisites

1. Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
2. kubectl configured
3. Docker images pushed to Docker Hub
4. Docker Hub username updated in deployment files

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

