# Next Steps Guide

## Immediate Actions Required

### 1. Fix pom.xml (Already Fixed)
✅ The `<n>` tag has been corrected to `<name>` in `backend/pom.xml`

### 2. Choose Your Deployment Method

You have three options to run the application:

#### Option A: Local Development (Recommended for Testing)
**Best for:** Development and testing

**Steps:**
1. **Install Prerequisites:**
   - Java 17+
   - Node.js 18+
   - MySQL 8.0
   - Maven 3.6+

2. **Setup MySQL:**
   ```sql
   CREATE DATABASE bloodbank;
   ```

3. **Update Database Config:**
   - Edit `backend/src/main/resources/application.properties`
   - Update MySQL username/password if different from `root/root`

4. **Start Backend:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

5. **Start Frontend (in new terminal):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

6. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

---

#### Option B: Docker Compose (Easiest)
**Best for:** Quick setup without installing dependencies

**Steps:**
1. **Ensure Docker Desktop is running**

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

5. **Stop services:**
   ```bash
   docker-compose down
   ```

---

#### Option C: Kubernetes Deployment
**Best for:** Production-like environment

**Prerequisites:**
- Kubernetes cluster (Minikube, Docker Desktop, or cloud)
- kubectl configured
- Docker images pushed to Docker Hub

**Steps:**
1. **Update Docker Hub username:**
   - Edit `k8s/backend-deployment.yaml` (line with image)
   - Edit `k8s/frontend-deployment.yaml` (line with image)
   - Replace `YOUR_DOCKERHUB_USERNAME` with your actual username

2. **Build and push images:**
   ```bash
   # Backend
   cd backend
   docker build -t YOUR_DOCKERHUB_USERNAME/blood-bank-backend:latest .
   docker push YOUR_DOCKERHUB_USERNAME/blood-bank-backend:latest
   
   # Frontend
   cd ../frontend
   docker build -t YOUR_DOCKERHUB_USERNAME/blood-bank-frontend:latest .
   docker push YOUR_DOCKERHUB_USERNAME/blood-bank-frontend:latest
   ```

3. **Deploy to Kubernetes:**
   ```bash
   kubectl apply -f k8s/mysql-secret.yaml
   kubectl apply -f k8s/mysql-deployment.yaml
   kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/frontend-deployment.yaml
   ```

4. **Access Application:**
   ```bash
   kubectl port-forward service/frontend-service 3000:80
   # Then open http://localhost:3000
   ```

---

### 3. Set Up GitHub Actions CI/CD (Optional)

**Steps:**
1. **Create Docker Hub account** (if you don't have one)
   - Go to https://hub.docker.com
   - Create account and repository

2. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add new secrets:
     - `DOCKER_HUB_USERNAME`: Your Docker Hub username
     - `DOCKER_HUB_TOKEN`: Your Docker Hub access token

3. **Update workflow file (if needed):**
   - Edit `.github/workflows/ci-cd.yml`
   - Update username if different from secret

4. **Push to trigger build:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

---

### 4. Test the Application

**After starting the application:**

1. **Create a test user:**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Register as a Donor or Patient

2. **Create Admin user (via API):**
   ```bash
   curl -X POST http://localhost:8080/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@bloodbank.com",
       "password": "admin123",
       "firstName": "Admin",
       "lastName": "User",
       "role": ["admin"]
     }'
   ```

3. **Test Features:**
   - Login with different roles
   - Donate blood (as Donor)
   - Request blood (as Patient/Donor)
   - Approve/reject requests (as Admin)
   - View dashboards

---

## Quick Start Checklist

- [ ] Choose deployment method (Local/Docker/K8s)
- [ ] Install prerequisites (if using local)
- [ ] Update database credentials (if needed)
- [ ] Start backend service
- [ ] Start frontend service
- [ ] Create test users
- [ ] Test application features
- [ ] (Optional) Set up GitHub Actions
- [ ] (Optional) Deploy to Kubernetes

---

## Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials
- Check port 8080 is available
- Review backend logs

### Frontend can't connect
- Verify backend is running on port 8080
- Check browser console for errors
- Verify CORS settings

### Docker issues
- Ensure Docker Desktop is running
- Check ports 3000, 8080, 3306 are free
- Review logs: `docker-compose logs`

### Database connection errors
- Verify MySQL is accessible
- Check database name matches
- Ensure user has proper permissions

---

## Recommended Next Steps

1. **Start with Docker Compose** (easiest)
2. **Test all features** locally
3. **Customize** as needed
4. **Set up CI/CD** for automated builds
5. **Deploy to Kubernetes** for production

---

## Need Help?

- Check `README.md` for detailed documentation
- Review `SETUP.md` for setup instructions
- Check `k8s/README.md` for Kubernetes deployment

