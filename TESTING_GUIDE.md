# 🧪 Quick Test Script - Frontend Integration

## Test Commands

Run these commands in PowerShell to verify frontend is working:

```powershell
# 1. Test Backend Health
Invoke-RestMethod -Uri "http://localhost:3002/api/health" | ConvertTo-Json

# 2. Test Fund List (should return 50 funds)
$funds = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=5"
Write-Host "✅ Funds returned: $($funds.data.Count)"
Write-Host "✅ First fund: $($funds.data[0].name)"
Write-Host "✅ First fund manager: $($funds.data[0].fundManager)"

# 3. Test Market Indices
$market = Invoke-RestMethod -Uri "http://localhost:3002/api/market/summary"
Write-Host "✅ Market indices: $($market.data.Count)"
$market.data | ForEach-Object {
    Write-Host "   - $($_.name): $($_.value) ($($_.changePercent)%)"
}

# 4. Test Market Status
$status = Invoke-RestMethod -Uri "http://localhost:3002/api/market/status"
Write-Host "✅ Market status: $($status.data.message)"

# 5. Test Specific Fund
$fund = Invoke-RestMethod -Uri "http://localhost:3002/api/funds/FUND001"
Write-Host "✅ Fund details: $($fund.data.name)"
Write-Host "✅ Fund manager: $($fund.data.fundManager)"
Write-Host "✅ Holdings count: $($fund.data.holdings.Count)"
```

## Expected Output

```
✅ Funds returned: 5
✅ First fund: [Fund Name]
✅ First fund manager: [Manager Name]
✅ Market indices: 5
   - Nifty 50: 21500.50 (0.59%)
   - Sensex: 70500.30 (0.68%)
   - ...
✅ Market status: Market is currently open
✅ Fund details: [Full Fund Name]
✅ Fund manager: [Manager Name]
✅ Holdings count: 10+
```

## Frontend Test Steps

### 1. Start Development Server

```powershell
cd "c:\mutual fund"
npm run dev
```

### 2. Open Browser

Navigate to: http://localhost:5001

### 3. Test Checklist

#### Home Page

- [ ] Market indices visible with live values
- [ ] No "Loading..." stuck messages
- [ ] Change indicators (▲/▼) displaying correctly

#### Authentication

- [ ] Click "Sign In"
- [ ] Try "Sign in with Google"
- [ ] Should redirect to Google OAuth
- [ ] After auth, should redirect back to dashboard
- [ ] Check browser console for success message

#### Fund Listing

- [ ] Navigate to `/equity` or use top navigation
- [ ] Should see grid of fund cards
- [ ] Each card shows:
  - Fund name
  - Fund house
  - Fund manager name ✅
  - Current NAV
  - 1Y return
- [ ] Pagination buttons work
- [ ] "View Details" button on each card

#### Fund Details

- [ ] Click "View Details" on any fund
- [ ] URL should be `/equity/[fund-id]` or `/debt/[fund-id]`
- [ ] Page should load with:
  - Fund name at top
  - Fund manager name ✅
  - Overview section (NAV, AUM, Expense Ratio)
  - Returns section (1Y, 3Y, 5Y)
  - Holdings table
  - Sector allocation chart
- [ ] No "Invalid response format" error
- [ ] No console errors

#### Search

- [ ] Type in top search bar
- [ ] Should see autocomplete suggestions
- [ ] Click suggestion → navigates to fund detail

#### Compare Funds

- [ ] Navigate to `/compare`
- [ ] Add 2-3 funds using search
- [ ] Click "Compare Funds" button
- [ ] Should see side-by-side comparison table

#### Overlap Analysis

- [ ] Navigate to `/overlap`
- [ ] Add 2 funds
- [ ] Click "Check Overlap"
- [ ] Should see common holdings

### 4. Check Browser Console

Open Developer Tools (F12) and check Console tab:

#### Good Signs ✅

```
🌐 API Base URL configured: http://localhost:3002
🌐 API Request: http://localhost:3002/api/funds?page=1&limit=50
✅ Fund loaded successfully: [Fund Name]
📊 Fund data structure: { fundManager: "...", returns: {...}, ... }
```

#### Bad Signs ❌

```
❌ Invalid response format
❌ Route not found
❌ CORS policy error
❌ Failed to fetch
❌ response.data.data is undefined
```

## Debugging Tips

### If Google OAuth fails:

1. Check `.env.local` has correct `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. Verify backend is running on port 3002
3. Check browser console for specific error
4. Ensure `/api/auth/google` endpoint is being called (not `/auth/google`)

### If Fund Details don't load:

1. Check Network tab → Should see `GET /api/funds/[id]`
2. Check response structure → Should be `{success: true, data: {...}}`
3. Verify `data.data` is accessed correctly
4. Check if `fundManager` field exists in response

### If Market Indices stuck on "Loading":

1. Backend should be on port 3002
2. Endpoint should be `/api/market/summary`
3. Check Network tab for API call
4. Verify response format: `{success: true, data: [...]}`

### If Pagination doesn't work:

1. Check URL query params → Should have `?page=2&limit=50`
2. Backend should return `pagination` object in response
3. `hasNext` and `hasPrev` should be boolean

## Quick Fixes

### Fix 1: Backend Not Running

```powershell
cd e:\mutual-funds-backend
npm start
```

### Fix 2: Wrong API URL

Check `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

**NOT**:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api  ❌
NEXT_PUBLIC_API_URL=http://localhost:3000      ❌
```

### Fix 3: Clear Cache

```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run dev
```

### Fix 4: Clear Browser Data

- Press Ctrl+Shift+Delete
- Clear cache and cookies
- Reload page (Ctrl+F5)

## Success Criteria

When everything works:

- ✅ 4,459 funds accessible
- ✅ All funds show fund manager name
- ✅ Market indices update live
- ✅ Google OAuth login works
- ✅ Fund details load completely
- ✅ No console errors
- ✅ No "Invalid response" messages
- ✅ Search works with suggestions
- ✅ Comparison and overlap work

## Contact

If issues persist:

1. Share screenshot of browser console errors
2. Share Network tab showing failed API calls
3. Share backend server logs
4. Verify API endpoint URLs match this document

---

**Happy Testing! 🧪**
