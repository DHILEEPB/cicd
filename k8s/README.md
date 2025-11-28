# Kubernetes Deployment Guide

## Prerequisites
- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- kubectl configured
- Docker images pushed to Docker Hub

## Deployment Steps

1. **Update Docker Hub username in deployment files:**
   - Replace `YOUR_DOCKERHUB_USERNAME` in `backend-deployment.yaml` and `frontend-deployment.yaml` with your Docker Hub username

2. **Create MySQL secret:**
   ```bash
   kubectl apply -f mysql-secret.yaml
   ```

3. **Deploy MySQL:**
   ```bash
   kubectl apply -f mysql-deployment.yaml
   ```

4. **Wait for MySQL to be ready:**
   ```bash
   kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s
   ```

5. **Deploy Backend:**
   ```bash
   kubectl apply -f backend-deployment.yaml
   ```

6. **Deploy Frontend:**
   ```bash
   kubectl apply -f frontend-deployment.yaml
   ```

7. **Check deployment status:**
   ```bash
   kubectl get pods
   kubectl get services
   ```

8. **Access the application:**
   - Get the frontend service external IP:
     ```bash
     kubectl get service frontend-service
     ```
   - Access the application using the external IP or use port forwarding:
     ```bash
     kubectl port-forward service/frontend-service 3000:80
     ```

## Cleanup
```bash
kubectl delete -f frontend-deployment.yaml
kubectl delete -f backend-deployment.yaml
kubectl delete -f mysql-deployment.yaml
kubectl delete -f mysql-secret.yaml
```

