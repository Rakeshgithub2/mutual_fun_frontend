# Compare & Overlap Pages Fix

## Issue

The compare and overlap pages were not showing any funds as options because the `useFunds` hook from `lib/hooks/use-funds.ts` did not support the `query` parameter that was being passed by the compare page.

## Root Cause

- **Compare page** was calling: `useFunds({ query: searchQuery, limit: 100 })`
- **Overlap page** was calling: `useFunds({ limit: 100 })`
- But the hook only accepted: `{ type?, category?, subCategory?, limit? }`
- The `query` parameter was being ignored, so no search functionality worked

## Solution

Updated `lib/hooks/use-funds.ts` to support the `query` parameter:

### Changes Made

1. **Added `query` parameter to hook interface**:

   ```typescript
   export function useFunds(options?: {
     type?: string;
     category?: string;
     subCategory?: string;
     query?: string; // ✅ NEW
     limit?: number;
   }): UseFundsResult;
   ```

2. **Map `query` to API's `q` parameter**:

   ```typescript
   if (options?.query) params.append('q', options.query);
   ```

3. **Added query to debug logs**:
   ```typescript
   console.log('📋 Query params:', {
     category: options?.category,
     subCategory: options?.subCategory,
     query: options?.query, // ✅ NEW
   });
   ```

## How It Works Now

### Compare Page

- User types in search box → `searchQuery` state updates
- Hook called: `useFunds({ query: searchQuery, limit: 100 })`
- API receives: `GET /api/funds?q={searchQuery}&limit=100`
- Backend searches fund names, descriptions, and AMFI codes
- Returns matching funds for user to select and compare

### Overlap Page

- Loads all funds: `useFunds({ limit: 100 })`
- API receives: `GET /api/funds?limit=100`
- Backend returns first 100 active funds (no filters)
- User can search and filter on frontend

## Backend API Behavior

The `/api/funds` endpoint handles the `q` parameter:

```typescript
if (q) {
  query.$or = [
    { name: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } },
    { amfiCode: { $regex: q, $options: 'i' } },
  ];
}
```

This performs case-insensitive search across:

- Fund names
- Fund descriptions
- AMFI codes

## Benefits

✅ Compare page now shows funds as user types
✅ Search functionality works in compare page
✅ Overlap page loads all available funds
✅ Both equity and commodity funds are searchable
✅ Backend efficiently handles search with MongoDB regex

## Testing

To test the fix:

1. Navigate to `/compare` page
2. Type a fund name in the search box (e.g., "HDFC")
3. Verify funds appear in the dropdown
4. Select funds and compare
5. Navigate to `/overlap` page
6. Verify funds load in the selection area
7. Search for specific funds

## Files Modified

- `lib/hooks/use-funds.ts` - Added query parameter support

## Related Files

- `app/compare/page.tsx` - Uses the hook with query parameter
- `app/overlap/page.tsx` - Uses the hook without parameters
- `src/controllers/funds.ts` - Backend handles the `q` parameter
