#!/bin/bash

# Kubernetes Deployment Script for Blood Bank Management System
# Usage: ./deploy.sh [DOCKER_HUB_USERNAME]

set -e

DOCKER_HUB_USERNAME=${1:-"YOUR_DOCKERHUB_USERNAME"}

echo "🚀 Starting Kubernetes Deployment..."
echo "📦 Docker Hub Username: $DOCKER_HUB_USERNAME"

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Update Docker Hub username in deployment files
echo "📝 Updating Docker Hub username in deployment files..."
sed -i.bak "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_HUB_USERNAME/g" backend-deployment.yaml
sed -i.bak "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_HUB_USERNAME/g" frontend-deployment.yaml

# Step 1: Create MySQL Secret
echo "🔐 Creating MySQL secret..."
kubectl apply -f mysql-secret.yaml

# Step 2: Deploy MySQL
echo "🗄️  Deploying MySQL..."
kubectl apply -f mysql-deployment.yaml

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s

# Step 3: Deploy Backend
echo "🔧 Deploying Backend..."
kubectl apply -f backend-deployment.yaml

# Step 4: Deploy Frontend
echo "🎨 Deploying Frontend..."
kubectl apply -f frontend-deployment.yaml

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/backend --timeout=300s
kubectl wait --for=condition=available deployment/frontend --timeout=300s

# Get service information
echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Deployment Status:"
kubectl get pods
echo ""
echo "🌐 Services:"
kubectl get services
echo ""
echo "🔗 Access Information:"
echo "Frontend Service:"
kubectl get service frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Use port-forward: kubectl port-forward service/frontend-service 3000:80"
echo ""
echo "To access the application:"
echo "  kubectl port-forward service/frontend-service 3000:80"
echo "  Then open http://localhost:3000 in your browser"

