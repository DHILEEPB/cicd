# Docker Quick Start Guide

## ✅ Services Status

All services are now running in Docker!

## 🌐 Access URLs

- **Frontend Application**: http://localhost:3001
- **Backend API**: http://localhost:8081
- **MySQL Database**: localhost:3307

## 📋 Service Details

| Service | Container Name | Port | Status |
|---------|---------------|------|--------|
| MySQL | bloodbank-mysql | 3307 | ✅ Running |
| Backend | bloodbank-backend | 8081 | ✅ Running |
| Frontend | bloodbank-frontend | 3001 | ✅ Running |

## 🚀 Next Steps

### 1. Access the Application
Open your browser and go to: **http://localhost:3001**

### 2. Create Your First User
- Click "Sign Up" on the homepage
- Choose role: **Donor** or **Patient**
- Fill in the registration form
- Login with your credentials

### 3. Create Admin User (Optional)
To create an admin user, use the API:

```bash
curl -X POST http://localhost:8081/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"email\":\"admin@bloodbank.com\",\"password\":\"admin123\",\"firstName\":\"Admin\",\"lastName\":\"User\",\"role\":[\"admin\"]}"
```

Or use PowerShell:
```powershell
Invoke-RestMethod -Uri http://localhost:8081/api/auth/signup -Method Post -ContentType "application/json" -Body '{"username":"admin","email":"admin@bloodbank.com","password":"admin123","firstName":"Admin","lastName":"User","role":["admin"]}'
```

## 🛠️ Useful Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Stop Services
```bash
docker-compose stop
```

### Start Services
```bash
docker-compose start
```

### Restart Services
```bash
docker-compose restart
```

### Stop and Remove Containers
```bash
docker-compose down
```

### Stop and Remove Everything (including volumes)
```bash
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## 🔍 Troubleshooting

### Check Service Status
```bash
docker-compose ps
```

### Check if Backend is Ready
```bash
docker-compose logs backend | findstr "Started"
```

### Check Database Connection
```bash
docker-compose logs backend | findstr "mysql"
```

### Restart a Specific Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 📝 Notes

- **Port Conflicts**: If ports 3001, 8081, or 3307 are already in use, you can change them in `docker-compose.yml`
- **Data Persistence**: MySQL data is stored in a Docker volume and persists even after stopping containers
- **Backend Startup**: The backend may take 30-60 seconds to fully start and connect to the database
- **CORS**: Frontend is configured to connect to backend on port 8081

## 🎯 Testing the Application

1. **Sign Up** as a Donor or Patient
2. **Login** with your credentials
3. **Explore** the dashboard based on your role:
   - **Donor**: Can donate blood and request blood
   - **Patient**: Can request blood
   - **Admin**: Can manage all users, approve/reject requests and donations

## 📚 Additional Resources

- See `README.md` for full documentation
- See `SETUP.md` for detailed setup instructions
- See `NEXT_STEPS.md` for more deployment options

