# 🚀 Quick Start Guide - Frontend Integration

## Prerequisites

- ✅ Backend running on port 3002
- ✅ MongoDB running and seeded with data
- ✅ Node.js 18+ installed

---

## 🏃 Quick Start (5 minutes)

### 1. Configure Environment

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local if needed (default: http://localhost:3002)
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Backend (in separate terminal)

```bash
cd mutual-funds-backend
npm install
npm start
```

Backend will run on `http://localhost:3002`

### 4. Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 5. Test Integration

```bash
.\test-ui-integration.ps1
```

---

## 📱 Pages to Test

| Page        | URL                              | Features                           |
| ----------- | -------------------------------- | ---------------------------------- |
| Search      | http://localhost:3000/search     | Search, filter, paginate funds     |
| Compare     | http://localhost:3000/compare    | Compare up to 3 funds side-by-side |
| Fund Detail | http://localhost:3000/funds/[id] | View detailed fund information     |

---

## 🔧 Key Files

### Frontend

- `lib/api-client.ts` - API communication layer
- `hooks/use-funds.ts` - React hooks for data fetching
- `app/search/page.tsx` - Search and filter page
- `app/compare/page.tsx` - Fund comparison page

### Backend

- `src/controllers/funds.simple.ts` - Fund APIs
- `src/controllers/comparison.controller.ts` - Comparison APIs
- `src/routes/` - API route definitions

---

## ⚡ Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Test API integration
.\test-ui-integration.ps1

# Check for errors
npm run type-check
```

---

## 🐛 Quick Troubleshooting

### Backend not connecting?

```bash
# Check if backend is running
curl http://localhost:3002/api/health

# Expected response:
# { "status": "ok", "message": "Backend is running" }
```

### No data showing?

```bash
# Seed the database
cd mutual-funds-backend
npm run seed
```

### Port conflicts?

```bash
# Change frontend port
npm run dev -- -p 3001

# Change backend port
# Edit mutual-funds-backend/src/server.ts
```

---

## 📚 Documentation

- **Full Integration Guide:** `UI_INTEGRATION_COMPLETE.md`
- **API Reference:** `PUBLIC_API_DOCUMENTATION.md`
- **Field Mappings:** `FRONTEND_BACKEND_INTEGRATION_SUMMARY.md`

---

## ✅ Success Checklist

After setup, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:3002
- [ ] Search page shows funds
- [ ] Compare page allows adding funds
- [ ] No console errors in browser
- [ ] Test script passes (.\test-ui-integration.ps1)

---

## 🎉 You're Ready!

If all tests pass, your frontend is fully integrated with the backend. Start building features!

**Need help?** Check `FRONTEND_BACKEND_INTEGRATION_SUMMARY.md` for detailed information.
