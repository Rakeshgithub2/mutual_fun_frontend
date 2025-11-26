# 🔗 Frontend-Backend Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│                    (http://localhost:3000)                           │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ React Components
                                 │
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  📄 Pages (UI Components)                                            │
│  ├── app/search/page.tsx         → List & search funds              │
│  ├── app/compare/page.tsx        → Compare multiple funds           │
│  └── app/funds/[id]/page.tsx     → Fund details                     │
│                                                                       │
│  🎣 Custom Hooks (hooks/use-funds.ts)                                │
│  ├── useFunds()                  → Fetch fund list with filters     │
│  ├── useFundDetails()            → Fetch single fund details        │
│  └── useSuggestions()            → Fetch autocomplete suggestions   │
│                                                                       │
│  🔌 API Client (lib/api-client.ts)                                   │
│  ├── getFunds()                  → GET /api/funds                   │
│  ├── getFundById()               → GET /api/funds/:id               │
│  ├── getPriceHistory()           → GET /api/funds/:id/price-history │
│  ├── getSuggestions()            → GET /api/suggest                 │
│  ├── compareFunds()              → POST /api/compare                │
│  └── calculateOverlap()          → POST /api/overlap                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP Requests (fetch API)
                                 │ NEXT_PUBLIC_API_URL=http://localhost:3002
                                 │
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                             │
│                    (http://localhost:3002)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  🛣️ Routes (src/routes/)                                             │
│  ├── funds.ts                    → /api/funds routes                │
│  ├── suggest.ts                  → /api/suggest route               │
│  └── comparison.ts               → /api/compare, /api/overlap       │
│                                                                       │
│  🎮 Controllers                                                       │
│  ├── funds.simple.ts             → Fund CRUD operations             │
│  └── comparison.controller.ts    → Comparison algorithms            │
│                                                                       │
│  📦 Models                                                            │
│  ├── Fund.ts                     → Fund data schema & queries       │
│  ├── FundManager.ts              → Fund manager data                │
│  └── FundPrice.ts                → NAV price history                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ MongoDB Native Driver
                                 │
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                               │
│                    (mongodb://localhost:27017)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  📊 Collections:                                                      │
│  ├── funds          → Fund documents                                │
│  ├── fundManagers   → Fund manager documents                        │
│  ├── fundPrices     → NAV price history                             │
│  └── users          → User accounts (future)                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. Search Funds Flow

```
User types in search box
         │
         ▼
┌─────────────────────────┐
│  Search Page Component  │
│  (app/search/page.tsx)  │
└─────────────────────────┘
         │
         │ useFunds({ query: "HDFC", category: "equity" })
         ▼
┌─────────────────────────┐
│   useFunds Hook         │
│ (hooks/use-funds.ts)    │
└─────────────────────────┘
         │
         │ apiClient.getFunds()
         ▼
┌─────────────────────────┐
│   API Client            │
│ (lib/api-client.ts)     │
└─────────────────────────┘
         │
         │ GET http://localhost:3002/api/funds?query=HDFC&category=equity
         ▼
┌─────────────────────────┐
│   Express Route         │
│   (src/routes/funds.ts) │
└─────────────────────────┘
         │
         │ fundsController.getFunds()
         ▼
┌─────────────────────────┐
│   Controller            │
│ (funds.simple.ts)       │
└─────────────────────────┘
         │
         │ fundModel.find()
         ▼
┌─────────────────────────┐
│   MongoDB Model         │
│   (src/models/Fund.ts)  │
└─────────────────────────┘
         │
         │ db.collection('funds').find()
         ▼
┌─────────────────────────┐
│   MongoDB Database      │
└─────────────────────────┘
         │
         │ Returns matching funds
         ▼
        Response flows back up
         │
         ▼
UI displays funds with loading/error states
```

---

### 2. Compare Funds Flow

```
User selects funds to compare
         │
         ▼
┌─────────────────────────┐
│  Compare Page Component │
│  (app/compare/page.tsx) │
└─────────────────────────┘
         │
         │ For each fund ID: apiClient.getFundById(id)
         ▼
┌─────────────────────────┐
│   API Client            │
│ (lib/api-client.ts)     │
└─────────────────────────┘
         │
         │ GET http://localhost:3002/api/funds/:id (for each fund)
         ▼
┌─────────────────────────┐
│   Express Route         │
└─────────────────────────┘
         │
         │ fundsController.getFundById()
         ▼
┌─────────────────────────┐
│   Controller            │
└─────────────────────────┘
         │
         │ fundModel.findById()
         ▼
┌─────────────────────────┐
│   MongoDB Database      │
└─────────────────────────┘
         │
         │ Returns fund details
         ▼
UI renders comparison table with metrics
```

---

## API Response Structure

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Invalid fund ID",
    "code": "INVALID_ID"
  }
}
```

---

## Component Responsibilities

### Search Page (`app/search/page.tsx`)

- ✅ Display fund list
- ✅ Search by name/query
- ✅ Filter by category
- ✅ Client-side filters (expense ratio, rating, AUM)
- ✅ Pagination
- ✅ Loading states
- ✅ Error handling

### Compare Page (`app/compare/page.tsx`)

- ✅ Search & select funds
- ✅ Display up to 3 funds
- ✅ Side-by-side comparison table
- ✅ Highlight best/worst metrics
- ✅ AI-generated insights
- ✅ Export functionality

### Fund Detail Page (`app/funds/[id]/page.tsx`)

- ✅ Display complete fund information
- ✅ NAV price chart
- ✅ Holdings breakdown
- ✅ Performance metrics
- ✅ Add/remove from watchlist

---

## State Management

```
┌─────────────────────────────────────────┐
│         Component State                  │
├─────────────────────────────────────────┤
│  • Loading states (loading: boolean)    │
│  • Error states (error: Error | null)   │
│  • Data (funds: Fund[])                  │
│  • Pagination (page, limit, total)      │
│  • Filters (query, category, etc.)      │
└─────────────────────────────────────────┘
             │
             │ Managed by
             ▼
┌─────────────────────────────────────────┐
│         Custom Hooks                     │
├─────────────────────────────────────────┤
│  • useFunds()                            │
│  • useFundDetails()                      │
│  • useSuggestions()                      │
└─────────────────────────────────────────┘
             │
             │ Fetch data via
             ▼
┌─────────────────────────────────────────┐
│         API Client                       │
├─────────────────────────────────────────┤
│  • Handles HTTP requests                 │
│  • Parses responses                      │
│  • Error transformation                  │
└─────────────────────────────────────────┘
```

---

## Environment Configuration

```
┌──────────────────────────────────────┐
│       .env.local (Frontend)          │
├──────────────────────────────────────┤
│  NEXT_PUBLIC_API_URL=                │
│    http://localhost:3002             │
└──────────────────────────────────────┘
              │
              │ Used by
              ▼
┌──────────────────────────────────────┐
│       API Client                     │
│    (lib/api-client.ts)               │
├──────────────────────────────────────┤
│  const API_URL =                     │
│    process.env.NEXT_PUBLIC_API_URL   │
│    || 'http://localhost:3002'        │
└──────────────────────────────────────┘
```

---

## Type Safety Flow

```
┌─────────────────────────────────────────┐
│      TypeScript Interfaces              │
│     (lib/api-client.ts)                 │
├─────────────────────────────────────────┤
│  export interface Fund {                │
│    id: string;                          │
│    name: string;                        │
│    category: string;                    │
│    returns: {                           │
│      '1y': number;                      │
│      '3y': number;                      │
│      '5y': number;                      │
│    };                                   │
│    ratings: {                           │
│      morningstar: number;               │
│    };                                   │
│    ...                                  │
│  }                                      │
└─────────────────────────────────────────┘
             │
             │ Used by
             ▼
┌─────────────────────────────────────────┐
│      React Components                    │
├─────────────────────────────────────────┤
│  const { funds } = useFunds();          │
│  // funds: Fund[]                       │
│  // TypeScript knows structure!         │
└─────────────────────────────────────────┘
```

---

## Error Handling

```
API Error
    │
    ▼
┌─────────────────────────┐
│   API Client catches    │
│   and transforms        │
└─────────────────────────┘
    │
    │ Returns error object
    ▼
┌─────────────────────────┐
│   Custom Hook           │
│   sets error state      │
└─────────────────────────┘
    │
    │ error: Error | null
    ▼
┌─────────────────────────┐
│   Component displays    │
│   error message to user │
└─────────────────────────┘
```

---

## Performance Optimization

### 1. Pagination

- ✅ Load 20 funds at a time (configurable)
- ✅ Reduce data transfer
- ✅ Faster page loads

### 2. Debouncing

- ✅ Search suggestions debounced by 300ms
- ✅ Reduces API calls while typing

### 3. Loading States

- ✅ Skeleton loaders for better UX
- ✅ Prevents layout shift

### 4. Error Boundaries

- ✅ Graceful error handling
- ✅ Prevents full page crashes

---

## Security Considerations

### Environment Variables

```
✅ NEXT_PUBLIC_API_URL - Exposed to browser (safe)
❌ API_SECRET_KEY - Never expose in NEXT_PUBLIC_*
```

### API Communication

```
✅ CORS configured in backend
✅ Input validation (Zod schemas)
❌ No authentication yet (add JWT/OAuth later)
```

---

## Testing Strategy

### 1. Unit Tests

```bash
npm test
```

- Test custom hooks in isolation
- Test API client functions
- Test utility functions

### 2. Integration Tests

```bash
.\test-ui-integration.ps1
```

- Test API endpoints
- Test data flow
- Test error scenarios

### 3. Manual Testing

- Open pages in browser
- Verify UI behavior
- Check console for errors

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Production Setup                 │
├─────────────────────────────────────────┤
│                                          │
│  Frontend (Vercel/Netlify)              │
│  └── Next.js Static Export              │
│      └── Connected to API via URL       │
│                                          │
│  Backend (AWS/Azure/Heroku)             │
│  └── Express.js Server                  │
│      └── Connected to MongoDB Atlas     │
│                                          │
│  Database (MongoDB Atlas)               │
│  └── Cloud-hosted MongoDB               │
│                                          │
└─────────────────────────────────────────┘
```

---

## Summary

### ✅ Integration Complete

- All UI components connected to backend
- Mock data removed
- Real-time API calls
- Loading & error states
- Pagination support
- Type safety maintained

### 📦 Key Components

- **API Client:** Single source of truth for API calls
- **Custom Hooks:** Reusable data fetching logic
- **UI Components:** Clean separation of concerns

### 🚀 Ready for Production

- Environment configuration
- Error handling
- Performance optimization
- Documentation complete

**Status:** Fully Integrated ✅
