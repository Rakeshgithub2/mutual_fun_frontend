# 🚀 Quick Start Guide

## Start Your Mutual Fund Platform in 3 Simple Steps

---

## ✅ Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js installed (v18 or higher)
- ✅ MongoDB installed and accessible
- ✅ All dependencies installed (`npm install` in both directories)

---

## 🎯 3-Step Startup Process

### Step 1: Start MongoDB 🗄️

**Option A - Windows Service:**

```powershell
net start MongoDB
```

**Option B - Direct Start:**

```powershell
mongod
```

**Option C - Specific Data Directory:**

```powershell
mongod --dbpath "C:\data\db"
```

---

### Step 2: Start Backend Server ⚙️

```powershell
cd "c:\mutual fund\mutual-funds-backend"
npm run dev
```

**Expected Output:**

```
✅ MongoDB connected successfully
✅ Server is running on http://localhost:3002
```

**Leave this terminal running!**

---

### Step 3: Start Frontend Server 🎨

**Open a NEW terminal:**

```powershell
cd "c:\mutual fund"
npm run dev
```

**Expected Output:**

```
▲ Next.js 16.0.0
- Local: http://localhost:5001
✓ Ready in 2.5s
```

**Leave this terminal running too!**

---

## 🧪 Verify Everything is Working

**Run the quick check script:**

```powershell
cd "c:\mutual fund"
.\simple-check.ps1
```

**Expected Output:**

```
=== QUICK SYSTEM CHECK ===

1. Checking Backend... OK
2. Checking Frontend... OK
3. Testing API... OK
4. Testing Funds API... OK - 10 funds
5. Testing Autocomplete... OK
6. Testing Market Data... OK
7. Testing Search... OK
8. Testing Categories... OK

=== SYSTEM STATUS ===
Frontend: http://localhost:5001
Backend:  http://localhost:3002
```

---

## 🌐 Access Your Application

Open your browser and navigate to:

### **http://localhost:5001**

---

## 📱 What You'll See

### 1. **Home Page**

- Live market indices (SENSEX, NIFTY)
- Featured mutual funds
- Top performing funds
- Quick navigation

### 2. **Search & Explore**

- Search bar with autocomplete
- Filter by category, type
- Real-time suggestions

### 3. **Fund Details**

- NAV and performance charts
- Holdings breakdown
- Manager information
- Investment options

### 4. **Tools**

- SIP Calculator
- Lumpsum Calculator
- Fund Comparison
- Portfolio Overlap Analysis

---

## 🛠️ Troubleshooting

### Issue: Backend won't start

**Check if port 3002 is already in use:**

```powershell
netstat -ano | findstr :3002
```

**Kill the process if needed:**

```powershell
# Use the PID from above command
taskkill /PID <PID> /F
```

---

### Issue: Frontend won't start

**Check if port 5001 is already in use:**

```powershell
netstat -ano | findstr :5001
```

**Kill the process if needed:**

```powershell
taskkill /PID <PID> /F
```

---

### Issue: MongoDB not connecting

**Check if MongoDB is running:**

```powershell
Get-Service -Name MongoDB
```

**Start MongoDB service:**

```powershell
net start MongoDB
```

**Or start manually:**

```powershell
mongod --dbpath "C:\data\db"
```

---

### Issue: "Module not found" errors

**Reinstall dependencies:**

**Backend:**

```powershell
cd "c:\mutual fund\mutual-funds-backend"
Remove-Item node_modules -Recurse -Force
npm install
```

**Frontend:**

```powershell
cd "c:\mutual fund"
Remove-Item node_modules -Recurse -Force
npm install
```

---

## 📊 Port Reference

| Service  | Port  | URL                       |
| -------- | ----- | ------------------------- |
| Frontend | 5001  | http://localhost:5001     |
| Backend  | 3002  | http://localhost:3002     |
| MongoDB  | 27017 | mongodb://localhost:27017 |

---

## 🔍 Testing APIs Directly

### Test Backend Health

```powershell
curl http://localhost:3002/health
```

### Test Funds API

```powershell
curl http://localhost:3002/api/funds?limit=5
```

### Test Autocomplete

```powershell
curl "http://localhost:3002/api/suggest/funds?q=hdfc&limit=5"
```

### Test Market Data

```powershell
curl http://localhost:3002/api/market-indices/latest
```

---

## 📝 Available Scripts

### Backend Scripts

```powershell
cd mutual-funds-backend

npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:seed      # Seed database with sample data
```

### Frontend Scripts

```powershell
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
```

---

## 🎯 Quick Test Checklist

After starting all services, verify:

- [ ] Backend responds at http://localhost:3002/health
- [ ] Frontend loads at http://localhost:5001
- [ ] Market indices show on homepage
- [ ] Search/autocomplete works
- [ ] Can view fund details
- [ ] Calculators work
- [ ] Can compare funds

---

## 🚨 Common Mistakes to Avoid

1. ❌ Starting frontend before backend
   ✅ Always start backend first

2. ❌ Forgetting to start MongoDB
   ✅ MongoDB must be running before backend

3. ❌ Wrong directory when running npm commands
   ✅ Backend commands in `mutual-funds-backend` folder
   ✅ Frontend commands in root folder

4. ❌ Using same terminal for multiple services
   ✅ Use separate terminals for each service

---

## 💡 Pro Tips

### Use Multiple Terminals

- **Terminal 1**: MongoDB
- **Terminal 2**: Backend
- **Terminal 3**: Frontend
- **Terminal 4**: Testing/Commands

### Watch for Errors

Monitor all terminals for error messages. Most issues show up immediately in the logs.

### Auto-Restart on Changes

Both frontend and backend have hot-reload enabled. Your changes will reflect automatically!

### Database Management

Use MongoDB Compass to view and manage your database:

```
mongodb://localhost:27017/mutual_funds_db
```

---

## 🎉 You're All Set!

Your Mutual Fund Platform is now running!

**Frontend**: http://localhost:5001  
**Backend API**: http://localhost:3002  
**API Docs**: See `API_DOCUMENTATION.md`

---

## 📚 Additional Resources

- **API Documentation**: `API_DOCUMENTATION.md`
- **Integration Report**: `SYSTEM_INTEGRATION_REPORT.md`
- **Testing Guide**: `API_TESTING_GUIDE.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE_SEPARATE_REPOS.md`

---

## ❓ Need Help?

If something isn't working:

1. Run `.\simple-check.ps1` to diagnose issues
2. Check terminal logs for error messages
3. Verify all ports are available
4. Ensure MongoDB is running
5. Check `.env` files for correct configuration

---

**Happy Developing! 🚀**
