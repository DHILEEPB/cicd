# Blood Bank Management System

A full-stack blood bank management system built with React (frontend), Spring Boot (backend), and MySQL (database). The system manages donor registrations, tracks blood inventory, and facilitates blood requests during emergencies.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Role-Based Access**: Three user roles - Admin, Donor, and Patient
- **Donor Management**: Donors can register, donate blood, and request blood
- **Patient Management**: Patients can register and request blood
- **Blood Inventory**: Real-time tracking of blood stock for all blood groups
- **Request Management**: Blood request approval/rejection workflow
- **Donation Management**: Blood donation approval/rejection workflow
- **CRUD Operations**: Full CRUD operations for all entities
- **Docker Support**: Containerized application with Docker
- **CI/CD**: GitHub Actions workflow for automated builds and deployments
- **Kubernetes**: Full Kubernetes deployment manifests

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Modern CSS

### Backend
- Spring Boot 3.2.0
- Spring Security
- JWT Authentication
- Spring Data JPA
- MySQL 8.0

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Kubernetes

## Project Structure

```
.
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bloodbank/
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── repository/     # Data access layer
│   │   │   │   ├── model/          # Entity models
│   │   │   │   ├── security/       # Security configuration
│   │   │   │   └── dto/            # Data transfer objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── App.js
│   └── package.json
├── k8s/                    # Kubernetes manifests
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── mysql-secret.yaml
├── .github/workflows/      # GitHub Actions
│   └── ci-cd.yml
└── README.md
```

## Local Development Setup

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0
- Maven 3.6+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Update database configuration in `src/main/resources/application.properties`:**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bloodbank?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

3. **Build and run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

## Docker Setup

### Build Images

**Backend:**
```bash
cd backend
docker build -t blood-bank-backend:latest .
```

**Frontend:**
```bash
cd frontend
docker build -t blood-bank-frontend:latest .
```

### Run with Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: bloodbank
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/bloodbank?createDatabaseIfNotExist=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql-data:
```

Run:
```bash
docker-compose up -d
```

## CI/CD Setup

### GitHub Actions

1. **Add Docker Hub secrets to GitHub:**
   - Go to Repository Settings → Secrets and variables → Actions
   - Add `DOCKER_HUB_USERNAME`
   - Add `DOCKER_HUB_TOKEN`

2. **Update workflow file:**
   - Update `YOUR_DOCKERHUB_USERNAME` in `.github/workflows/ci-cd.yml` if needed

3. **Push to main/master branch:**
   - The workflow will automatically build and push Docker images

## Kubernetes Deployment

See `k8s/README.md` for detailed Kubernetes deployment instructions.

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register

### Stock Management
- `GET /api/stock` - Get all blood stocks
- `GET /api/stock/{bloodGroup}` - Get stock by blood group
- `PUT /api/stock/{bloodGroup}` - Update stock (Admin only)

### Donors
- `GET /api/donors` - Get all donors (Admin only)
- `GET /api/donors/{id}` - Get donor by ID
- `PUT /api/donors/{id}` - Update donor
- `DELETE /api/donors/{id}` - Delete donor (Admin only)

### Patients
- `GET /api/patients` - Get all patients (Admin only)
- `GET /api/patients/{id}` - Get patient by ID
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient (Admin only)

### Blood Requests
- `GET /api/requests` - Get all requests (Admin only)
- `GET /api/requests/pending` - Get pending requests (Admin only)
- `POST /api/requests` - Create request (Donor/Patient)
- `PUT /api/requests/{id}/approve` - Approve request (Admin only)
- `PUT /api/requests/{id}/reject` - Reject request (Admin only)

### Blood Donations
- `GET /api/donations` - Get all donations (Admin only)
- `POST /api/donations` - Create donation (Donor only)
- `PUT /api/donations/{id}/approve` - Approve donation (Admin only)
- `PUT /api/donations/{id}/reject` - Reject donation (Admin only)

## Default Roles

- **ROLE_ADMIN**: Full system access
- **ROLE_DONOR**: Can donate and request blood
- **ROLE_PATIENT**: Can request blood

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
