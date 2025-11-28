# Quick Test Guide - Blood Bank Management System

## ✅ System Status

**All services are running successfully!**

- ✅ MySQL Database: Running on port 3307
- ✅ Backend API: Running on port 8081  
- ✅ Frontend: Running on port 3001

## 🚀 Access Your Application

**Open your browser and go to:** http://localhost:3001

## 📝 Step-by-Step Testing Guide

### Step 1: Create Your First User

1. **Open** http://localhost:3001 in your browser
2. **Click** "Sign Up" button
3. **Choose** a role:
   - **Donor**: Can donate blood and request blood
   - **Patient**: Can request blood
4. **Fill in** the registration form:
   - Username (unique)
   - Email (unique)
   - Password (min 6 characters)
   - First Name, Last Name
   - Blood Group (select from dropdown)
   - Address
   - Mobile number
   - If Patient: Age, Disease, Doctor Name
5. **Click** "Sign Up"
6. You'll be redirected to login page

### Step 2: Login

1. **Enter** your username and password
2. **Click** "Login"
3. You'll be redirected to your dashboard based on your role

### Step 3: Test Features by Role

#### As a Donor:
- ✅ View dashboard with statistics
- ✅ Donate Blood (submit donation request)
- ✅ Request Blood (request blood for yourself/others)
- ✅ View donation history
- ✅ View request history

#### As a Patient:
- ✅ View dashboard with statistics
- ✅ Request Blood
- ✅ View your request history

#### As an Admin:
First, create an admin user using PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:8081/api/auth/signup -Method Post -ContentType "application/json" -Body '{"username":"admin","email":"admin@bloodbank.com","password":"admin123","firstName":"Admin","lastName":"User","role":["admin"]}'
```

Then login as admin to:
- ✅ View dashboard with all statistics
- ✅ Manage Blood Stock (update units for each blood group)
- ✅ View all Donors
- ✅ View all Patients
- ✅ Approve/Reject Blood Requests
- ✅ Approve/Reject Blood Donations

### Step 4: Test Complete Workflow

1. **As Donor**: Submit a blood donation request
2. **As Admin**: Login and approve the donation
3. **Check**: Blood stock should increase for that blood group
4. **As Patient**: Request blood
5. **As Admin**: Approve the request
6. **Check**: Blood stock should decrease

## 🔧 Troubleshooting

### Frontend not loading?
- Check: http://localhost:3001
- Verify: `docker-compose ps` shows frontend as "Up"

### Can't login?
- Verify backend is running: `docker-compose logs backend | Select-String "Started"`
- Check if user was created successfully
- Try creating a new user

### API errors?
- Check backend logs: `docker-compose logs backend -f`
- Verify database connection: `docker-compose logs mysql`

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

## 📊 API Endpoints (for testing with Postman/curl)

### Public Endpoints (No Auth Required):
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login

### Protected Endpoints (Require JWT Token):
- `GET /api/stock` - Get all blood stocks
- `GET /api/donors` - Get all donors (Admin only)
- `GET /api/patients` - Get all patients (Admin only)
- `POST /api/donations` - Create donation (Donor only)
- `POST /api/requests` - Create request (Donor/Patient)
- `PUT /api/requests/{id}/approve` - Approve request (Admin only)
- `PUT /api/donations/{id}/approve` - Approve donation (Admin only)

## 🎯 Quick Test Checklist

- [ ] Frontend loads at http://localhost:3001
- [ ] Can sign up as Donor
- [ ] Can sign up as Patient
- [ ] Can login with created user
- [ ] Dashboard displays correctly
- [ ] Can submit donation request (Donor)
- [ ] Can submit blood request (Patient/Donor)
- [ ] Can create admin user via API
- [ ] Admin can approve/reject requests
- [ ] Blood stock updates correctly

## 💡 Tips

1. **Use different browsers** or **incognito mode** to test multiple roles simultaneously
2. **Check browser console** (F12) for any frontend errors
3. **Monitor logs** in real-time: `docker-compose logs -f`
4. **Database persists** - Your data remains even after stopping containers

## 🎉 Success Indicators

✅ You'll know everything is working when:
- You can register and login
- Dashboards show statistics
- You can create requests/donations
- Admin can approve/reject them
- Blood stock updates in real-time

---

**Need help?** Check the logs:
```bash
docker-compose logs -f
```

