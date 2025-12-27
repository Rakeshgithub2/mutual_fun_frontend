# 🚀 Quick Start Guide - Frontend Funds Display

## One-Command Start

```powershell
# Terminal 1 - Start Backend
cd backend; npm run dev:simple

# Terminal 2 - Start Frontend
npm run dev
```

Then visit: **http://localhost:5001/test-funds**

---

## ✅ Expected Result

You should see:

- 📊 **"Showing 20 of 4,459 funds"**
- 🎯 Fund cards with name, NAV, returns, AUM
- 🔍 Category filters (Equity, Debt, Hybrid, etc.)
- 📄 Pagination controls
- ✅ Debug Panel (bottom-right): "Backend: ✅ Online"

---

## ❌ If You See "No Funds"

### Quick Fix Steps

1. **Check backend is running:**

   ```powershell
   curl http://localhost:3002/health
   ```

   Expected: `{"status":"ok",...}`

2. **Check backend has data:**

   ```powershell
   curl "http://localhost:3002/api/funds?limit=5"
   ```

   Expected: `{"success":true,"data":[...],"pagination":{"total":4459,...}}`

3. **Check .env.local:**

   ```powershell
   Get-Content .env.local | Select-String "NEXT_PUBLIC_API_URL"
   ```

   Expected: `NEXT_PUBLIC_API_URL=http://localhost:3002`

4. **Restart both servers:**
   - Press Ctrl+C in both terminals
   - Start backend: `cd backend && npm run dev:simple`
   - Start frontend: `npm run dev`

5. **Clear browser cache:**
   - Press Ctrl+Shift+R (hard refresh)
   - Or clear cache in DevTools

---

## 🔍 Debug Checklist

Open Browser DevTools (F12):

### ✅ Console Tab

Should see:

```
🔍 [useFunds] Fetching with filters: {...}
🌐 [useFunds] API Base URL: http://localhost:3002
✅ [useFunds] Response received: 20 funds
```

Should NOT see:

```
❌ Backend server is not running
❌ Network Error
❌ CORS policy error
```

### ✅ Network Tab

1. Filter by "funds"
2. Click the request
3. Check:
   - **Request URL**: `http://localhost:3002/api/funds?...`
   - **Status Code**: 200 (green)
   - **Response Preview**: `success: true`, `data: Array(20)`, `pagination.total: 4459`

### ✅ Application Tab

Check Local Storage / Session Storage for any cached errors

---

## 🎯 Test URLs

### 1. Simple Test Page

```
http://localhost:5001/test-funds
```

**What it shows**: Basic fund list with filters

### 2. Full Demo Page

```
http://localhost:5001/funds-demo
```

**What it shows**: Full featured page with stats banner

### 3. Equity Page

```
http://localhost:5001/equity
```

**What it shows**: Equity-specific funds with subcategory filters

### 4. Debt Page

```
http://localhost:5001/debt
```

**What it shows**: Debt funds

---

## 🛠️ Common Issues & Fixes

| Issue                           | Fix                                                           |
| ------------------------------- | ------------------------------------------------------------- |
| "Backend server is not running" | Start backend: `cd backend && npm run dev:simple`             |
| "No funds found"                | Check category case (must be lowercase)                       |
| CORS error                      | Add `ALLOWED_ORIGINS=http://localhost:5001` to backend `.env` |
| Wrong port error                | Verify backend is on 3002, frontend on 5001                   |
| Cache issues                    | Hard refresh: Ctrl+Shift+R                                    |
| Type errors                     | Run `npm install` to update dependencies                      |

---

## 📊 Backend API Quick Reference

### Health Check

```powershell
curl http://localhost:3002/health
```

### Get Funds (All)

```powershell
curl "http://localhost:3002/api/funds?limit=20"
```

### Get Funds (Equity)

```powershell
curl "http://localhost:3002/api/funds?category=equity&limit=20"
```

### Get Funds (Large Cap)

```powershell
curl "http://localhost:3002/api/funds?category=equity&subCategory=Large%20Cap&limit=20"
```

---

## 🔑 Key Configuration

### Environment Variable

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Category Format

```typescript
// ✅ Correct
category: 'equity';
subCategory: 'Large Cap';

// ❌ Wrong
category: 'EQUITY';
subCategory: 'LARGE_CAP';
```

### API Response Structure

```typescript
{
  success: true,
  data: Fund[],
  pagination: {
    total: 4459,
    page: 1,
    limit: 20,
    totalPages: 223,
    hasNext: true,
    hasPrev: false
  }
}
```

---

## 📱 Component Usage

### Basic Usage

```tsx
import { EnhancedFundList } from '@/components/EnhancedFundList';

<EnhancedFundList showFilters={true} />;
```

### With Initial Filters

```tsx
<EnhancedFundList initialFilters={{ category: 'equity' }} showFilters={true} />
```

---

## 🎓 Important Notes

1. **Backend Port**: Must be **3002** (not 3001, 5001, or others)
2. **Frontend Port**: Should be **5001** (configured in package.json)
3. **Categories**: Must be **lowercase** ('equity', not 'EQUITY')
4. **SubCategories**: Must be **Title Case** ('Large Cap', not 'LARGE_CAP')
5. **No trailing /api**: Use `http://localhost:3002` not `http://localhost:3002/api`

---

## 📞 Need Help?

1. Check [FRONTEND_FIX_SUMMARY.md](./FRONTEND_FIX_SUMMARY.md)
2. Check [FRONTEND_IMPLEMENTATION_COMPLETE.md](./FRONTEND_IMPLEMENTATION_COMPLETE.md)
3. Run validation: `.\test-funds-display.ps1`
4. Check browser console for errors
5. Check backend logs for errors

---

**Backend Status**: ✅ 4,459 funds verified  
**Frontend Status**: ✅ Ready to display  
**Last Updated**: December 28, 2025
