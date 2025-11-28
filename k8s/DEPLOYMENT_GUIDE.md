# Kubernetes Deployment Guide - Blood Bank Management System

Complete guide for deploying the full-stack Blood Bank Management System to Kubernetes.

## 📋 Prerequisites

1. **Kubernetes Cluster** - One of the following:
   - Minikube (local development)
   - Docker Desktop with Kubernetes enabled
   - Cloud provider (AWS EKS, GKE, AKS)
   - Kind (Kubernetes in Docker)

2. **kubectl** - Kubernetes command-line tool
   ```bash
   # Install kubectl
   # Windows: choco install kubernetes-cli
   # Mac: brew install kubectl
   # Linux: See https://kubernetes.io/docs/tasks/tools/
   ```

3. **Docker Hub Account** - For pushing images
   - Create account at https://hub.docker.com
   - Create repositories:
     - `blood-bank-backend`
     - `blood-bank-frontend`

4. **Docker Images** - Build and push to Docker Hub

## 🚀 Step-by-Step Deployment

### Step 1: Build and Push Docker Images

#### Option A: Using GitHub Actions (Recommended)

1. **Set up GitHub Secrets:**
   - Go to your repository: https://github.com/DHILEEPB/cicd
   - Settings → Secrets and variables → Actions
   - Add secrets:
     - `DOCKER_HUB_USERNAME`: Your Docker Hub username
     - `DOCKER_HUB_TOKEN`: Your Docker Hub access token

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

3. **Wait for CI/CD to complete:**
   - Go to Actions tab in GitHub
   - Wait for builds to complete
   - Images will be pushed to Docker Hub automatically

#### Option B: Manual Build and Push

```bash
# Login to Docker Hub
docker login

# Build and push backend
cd backend
docker build -t YOUR_DOCKERHUB_USERNAME/blood-bank-backend:latest .
docker push YOUR_DOCKERHUB_USERNAME/blood-bank-backend:latest

# Build and push frontend
cd ../frontend
docker build -t YOUR_DOCKERHUB_USERNAME/blood-bank-frontend:latest .
docker push YOUR_DOCKERHUB_USERNAME/blood-bank-frontend:latest
```

### Step 2: Update Kubernetes Manifests

Update Docker Hub username in deployment files:

```bash
# Replace YOUR_DOCKERHUB_USERNAME with your actual username
# In k8s/backend-deployment.yaml (line 17)
# In k8s/frontend-deployment.yaml (line 17)
```

Or use the provided script:
```bash
cd k8s
./deploy.sh YOUR_DOCKERHUB_USERNAME
```

### Step 3: Verify Kubernetes Cluster

```bash
# Check cluster connection
kubectl cluster-info

# Check nodes
kubectl get nodes
```

### Step 4: Deploy to Kubernetes

#### Quick Deployment (Using Script)

```bash
cd k8s
chmod +x deploy.sh
./deploy.sh YOUR_DOCKERHUB_USERNAME
```

#### Manual Deployment

```bash
cd k8s

# 1. Create MySQL Secret
kubectl apply -f mysql-secret.yaml

# 2. Deploy MySQL
kubectl apply -f mysql-deployment.yaml

# 3. Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s

# 4. Deploy Backend
kubectl apply -f backend-deployment.yaml

# 5. Deploy Frontend
kubectl apply -f frontend-deployment.yaml

# 6. Wait for deployments
kubectl wait --for=condition=available deployment/backend --timeout=300s
kubectl wait --for=condition=available deployment/frontend --timeout=300s
```

### Step 5: Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check deployments
kubectl get deployments

# View logs
kubectl logs -l app=backend
kubectl logs -l app=frontend
kubectl logs -l app=mysql
```

### Step 6: Access the Application

#### Option A: Port Forwarding (Recommended for Testing)

```bash
# Forward frontend service
kubectl port-forward service/frontend-service 3000:80

# In another terminal, forward backend (optional, for direct API access)
kubectl port-forward service/backend-service 8080:8080
```

Then access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

#### Option B: LoadBalancer (Cloud Providers)

If using a cloud provider with LoadBalancer support:

```bash
# Get external IP
kubectl get service frontend-service

# Access using the external IP
```

#### Option C: Ingress (Production)

For production, set up an Ingress controller:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: bloodbank-ingress
spec:
  rules:
  - host: bloodbank.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
```

## 🔧 Configuration Details

### MySQL Configuration
- **Storage**: 5Gi PersistentVolumeClaim
- **Database**: bloodbank
- **Password**: Stored in Kubernetes Secret
- **Port**: 3306 (internal)

### Backend Configuration
- **Replicas**: 2
- **Port**: 8080
- **Resources**: 
  - Requests: 512Mi memory, 250m CPU
  - Limits: 1Gi memory, 500m CPU
- **Environment Variables**:
  - Database connection to mysql-service
  - CORS configured for frontend-service

### Frontend Configuration
- **Replicas**: 2
- **Port**: 80
- **Resources**:
  - Requests: 128Mi memory, 100m CPU
  - Limits: 256Mi memory, 200m CPU
- **Service Type**: LoadBalancer

## 📊 Monitoring and Management

### View Logs
```bash
# All backend logs
kubectl logs -l app=backend -f

# All frontend logs
kubectl logs -l app=frontend -f

# Specific pod logs
kubectl logs <pod-name>
```

### Scale Deployments
```bash
# Scale backend to 3 replicas
kubectl scale deployment backend --replicas=3

# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3
```

### Update Deployment
```bash
# Update image
kubectl set image deployment/backend backend=YOUR_DOCKERHUB_USERNAME/blood-bank-backend:v2.0

# Rollout status
kubectl rollout status deployment/backend
```

### Restart Pods
```bash
# Restart all backend pods
kubectl rollout restart deployment/backend

# Restart all frontend pods
kubectl rollout restart deployment/frontend
```

## 🐛 Troubleshooting

### Pods Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

### Database Connection Issues
```bash
# Check MySQL pod
kubectl logs -l app=mysql

# Test connection from backend pod
kubectl exec -it <backend-pod-name> -- sh
# Inside pod: ping mysql-service
```

### Image Pull Errors
```bash
# Check if image exists
docker pull YOUR_DOCKERHUB_USERNAME/blood-bank-backend:latest

# Verify image name in deployment
kubectl describe deployment backend
```

### CORS Issues
- Verify CORS_ALLOWED_ORIGINS in backend deployment
- Should match frontend service URL

## 🧹 Cleanup

To remove all resources:

```bash
kubectl delete -f frontend-deployment.yaml
kubectl delete -f backend-deployment.yaml
kubectl delete -f mysql-deployment.yaml
kubectl delete -f mysql-secret.yaml
```

Or delete everything in the namespace:
```bash
kubectl delete all --all
kubectl delete pvc mysql-pvc
kubectl delete secret mysql-secret
```

## 📝 Production Considerations

1. **Use Secrets Management**: Store sensitive data in Kubernetes Secrets
2. **Configure Resource Limits**: Adjust based on actual usage
3. **Set up Monitoring**: Use Prometheus and Grafana
4. **Enable Logging**: Set up centralized logging (ELK stack)
5. **Use Ingress**: For proper domain routing
6. **Enable TLS/SSL**: For secure connections
7. **Backup Database**: Set up regular MySQL backups
8. **Health Checks**: Add liveness and readiness probes
9. **Auto-scaling**: Configure HPA (Horizontal Pod Autoscaler)
10. **Network Policies**: Restrict pod-to-pod communication

## 🎯 Next Steps

1. ✅ Build and push Docker images
2. ✅ Update Docker Hub username in manifests
3. ✅ Deploy to Kubernetes
4. ✅ Verify all services are running
5. ✅ Access application via port-forward or LoadBalancer
6. ✅ Test all features
7. ✅ Set up monitoring and logging
8. ✅ Configure production settings

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Docker Hub](https://hub.docker.com/)

---

**Need Help?** Check the logs and describe commands above for troubleshooting.

