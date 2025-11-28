# Setup Instructions

## Local Development Setup

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0
- Maven 3.6+
- Docker and Docker Compose (optional)

## Option 1: Local Development (Without Docker)

### 1. Database Setup

1. Install MySQL 8.0
2. Create a database:
   ```sql
   CREATE DATABASE bloodbank;
   ```
3. Update `backend/src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

### 2. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will be available at `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will be available at `http://localhost:3000`

## Option 2: Docker Compose (Recommended)

### Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`

## Option 3: Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- kubectl configured

### Steps

1. **Update Docker Hub username in Kubernetes manifests:**
   - Edit `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml`
   - Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username

2. **Build and push Docker images:**
   ```bash
   # Build backend
   cd backend
   docker build -t YOUR_DOCKERHUB_USERNAME/blood-bank-backend:latest .
   docker push YOUR_DOCKERHUB_USERNAME/blood-bank-backend:latest
   
   # Build frontend
   cd ../frontend
   docker build -t YOUR_DOCKERHUB_USERNAME/blood-bank-frontend:latest .
   docker push YOUR_DOCKERHUB_USERNAME/blood-bank-frontend:latest
   ```

3. **Deploy to Kubernetes:**
   ```bash
   # Create MySQL secret
   kubectl apply -f k8s/mysql-secret.yaml
   
   # Deploy MySQL
   kubectl apply -f k8s/mysql-deployment.yaml
   
   # Wait for MySQL to be ready
   kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s
   
   # Deploy backend
   kubectl apply -f k8s/backend-deployment.yaml
   
   # Deploy frontend
   kubectl apply -f k8s/frontend-deployment.yaml
   ```

4. **Access the application:**
   ```bash
   # Get frontend service
   kubectl get service frontend-service
   
   # Or use port forwarding
   kubectl port-forward service/frontend-service 3000:80
   ```

## Creating Admin User

To create an admin user, you can:

1. **Use the signup API with admin role:**
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

2. **Or manually insert into database:**
   ```sql
   -- First, ensure roles exist (they should be auto-created on startup)
   -- Then create user and assign admin role
   ```

## Testing the Application

1. **Access the frontend:** `http://localhost:3000`
2. **Sign up as a Donor or Patient**
3. **Login and explore the dashboards**
4. **For admin access, create an admin user using the API**

## Troubleshooting

### Backend won't start
- Check MySQL is running and accessible
- Verify database credentials in `application.properties`
- Check port 8080 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration in backend
- Verify proxy settings in `package.json`

### Database connection issues
- Ensure MySQL is running
- Check database name matches in configuration
- Verify user has proper permissions

### Docker issues
- Ensure Docker is running
- Check if ports 3000, 8080, 3306 are available
- Review logs: `docker-compose logs`

## Next Steps

1. Review the API documentation in `README.md`
2. Explore the codebase structure
3. Customize according to your needs
4. Set up CI/CD with GitHub Actions
5. Deploy to your preferred cloud provider

