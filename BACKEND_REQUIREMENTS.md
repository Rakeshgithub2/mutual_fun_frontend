# Backend API Enhancement Requirements - Complete Specification

## Overview

This document outlines all required changes to the backend API to support displaying ~2500 funds across all categories with complete, accurate data, and real-time market indices including foreign markets.

---

## 1. CRITICAL: Increase API Limit Parameter

### Current Issue

- `/api/funds` endpoint only accepts `limit=100` maximum
- Any value above 100 returns: `400 Bad Request`
- Frontend cannot display all available funds (~2500 total)

### Required Changes

1. **Remove or increase the maximum limit restriction to 2500+**
2. Support requests like: `/api/funds?category=Equity&limit=2500`
3. If concerned about performance, implement proper pagination with cursor or offset-based pagination
4. Ensure `page` parameter works: `/api/funds?category=Equity&page=2&limit=500`

### Expected Behavior After Fix

```bash
# Should return ALL equity funds (not just 100)
GET /api/funds?category=Equity&limit=2500

# Should return ALL Large Cap funds
GET /api/funds?category=Equity&subCategory=Large Cap&limit=500

# All Funds - No category filter
GET /api/funds?limit=2500
```

**Response Format:**

```json
{
  "success": true,
  "message": "Funds fetched successfully",
  "data": [...array of 2500 funds...],
  "pagination": {
    "total": 2453,
    "page": 1,
    "limit": 2500,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

## 2. Complete Fund Categories & Subcategories

Ensure the database contains funds for ALL these categories and subcategories, and the API can filter by them.

### 2.1 EQUITY FUNDS (category: "Equity")

**Subcategories Required:**

1. **Large Cap** (subCategory: "Large Cap")

   - Companies with large market capitalization
   - Examples: HDFC Top 100, ICICI Bluechip, SBI Bluechip

2. **Mid Cap** (subCategory: "Mid Cap")

   - Medium-sized companies
   - Examples: Kotak Emerging Equity, DSP Midcap, Axis Midcap

3. **Small Cap** (subCategory: "Small Cap")

   - Smaller companies with high growth potential
   - Examples: Nippon Small Cap, SBI Small Cap, Axis Small Cap

4. **Multi Cap** (subCategory: "Multi Cap")

   - Mix of large, mid, and small cap stocks
   - Examples: HDFC Multi Cap, SBI Multi Cap

5. **Flexi Cap** (subCategory: "Flexi Cap")

   - Flexible allocation across market caps
   - Examples: Parag Parikh Flexi Cap, PGIM India Flexi Cap

6. **Index Funds** (subCategory: "Index Fund")
   - Tracks market indices like Nifty 50, Sensex
   - Examples: UTI Nifty Index, HDFC Index Sensex, ICICI Nifty Index

**API Endpoints:**

```bash
GET /api/funds?category=Equity&subCategory=Large Cap&limit=500
GET /api/funds?category=Equity&subCategory=Mid Cap&limit=500
GET /api/funds?category=Equity&subCategory=Small Cap&limit=500
GET /api/funds?category=Equity&subCategory=Multi Cap&limit=500
GET /api/funds?category=Equity&subCategory=Flexi Cap&limit=500
GET /api/funds?category=Equity&subCategory=Index Fund&limit=500
```

---

### 2.2 DEBT/BOND FUNDS (category: "Debt")

**Subcategories Required:**

1. **Liquid Funds** (subCategory: "Liquid Fund")

   - Very short-term debt instruments (1-91 days)
   - Highest liquidity, lowest risk
   - Examples: HDFC Liquid Fund, ICICI Liquid Fund

2. **Ultra Short Duration** (subCategory: "Ultra Short Duration Fund")

   - Macaulay duration: 3-6 months
   - Examples: HDFC Ultra Short Term, Axis Ultra Short Term

3. **Low Duration** (subCategory: "Low Duration Fund")

   - Macaulay duration: 6-12 months
   - Examples: ICICI Low Duration, SBI Magnum Low Duration

4. **Money Market** (subCategory: "Money Market Fund")

   - Invests in money market instruments up to 1 year
   - Examples: Aditya Birla Money Manager, UTI Money Market

5. **Short Duration** (subCategory: "Short Duration Fund")

   - Macaulay duration: 1-3 years
   - Examples: HDFC Short Term Debt, ICICI Short Term

6. **Medium Duration** (subCategory: "Medium Duration Fund")

   - Macaulay duration: 3-4 years
   - Examples: HDFC Medium Term, Kotak Medium Term

7. **Medium to Long Duration** (subCategory: "Medium to Long Duration Fund")

   - Macaulay duration: 4-7 years
   - Examples: ICICI Regular Savings, SBI Magnum Medium Duration

8. **Long Duration** (subCategory: "Long Duration Fund")

   - Macaulay duration: >7 years
   - Higher interest rate risk
   - Examples: HDFC Long Term Advantage, ICICI Long Term

9. **Dynamic Bond** (subCategory: "Dynamic Bond")

   - Flexible duration based on interest rate outlook
   - Examples: ICICI Dynamic Bond, HDFC Dynamic Debt

10. **Corporate Bond** (subCategory: "Corporate Bond Fund")

    - Minimum 80% in highest-rated corporate bonds (AA+ and above)
    - Examples: HDFC Corporate Bond, ICICI Corporate Bond

11. **Credit Risk** (subCategory: "Credit Risk Fund")

    - Invests in lower-rated bonds for higher returns
    - Examples: HDFC Credit Risk, ICICI Credit Risk

12. **Banking & PSU** (subCategory: "Banking and PSU Fund")

    - Minimum 80% in debt of banks, PSUs, and public financial institutions
    - Examples: HDFC Banking PSU, ICICI Banking PSU

13. **Gilt Funds** (subCategory: "Gilt Fund")

    - Invests only in government securities
    - Zero credit risk
    - Examples: SBI Magnum Gilt, HDFC Gilt

14. **Gilt Fund with 10 Year Constant Duration** (subCategory: "Gilt Fund with 10 year constant duration")

    - Government securities with 10-year duration
    - Examples: ICICI Gilt 10Y, HDFC Gilt Long Term

15. **Floater Fund** (subCategory: "Floater Fund")

    - Minimum 65% in floating rate instruments
    - Examples: HDFC Floating Rate, Nippon Floating Rate

16. **Overnight Fund** (subCategory: "Overnight Fund")
    - Invests in overnight securities (1-day maturity)
    - Examples: HDFC Overnight, ICICI Overnight

**API Endpoints:**

```bash
GET /api/funds?category=Debt&subCategory=Liquid Fund&limit=500
GET /api/funds?category=Debt&subCategory=Corporate Bond Fund&limit=500
GET /api/funds?category=Debt&subCategory=Gilt Fund&limit=500
GET /api/funds?category=Debt&subCategory=Dynamic Bond&limit=500
# ... and all other subcategories
```

---

### 2.3 COMMODITY FUNDS (category: "Commodity")

**Subcategories Required:**

1. **Gold Funds** (subCategory: "Gold Fund" OR "Gold")

   - Invests in gold ETFs or gold-related securities
   - Examples: HDFC Gold Fund, ICICI Gold Fund, Nippon Gold Savings

2. **Silver Funds** (subCategory: "Silver Fund" OR "Silver")

   - Invests in silver ETFs or silver-related securities
   - Examples: ICICI Silver ETF, Nippon Silver ETF

3. **Multi Commodity** (subCategory: "Multi Commodity Fund")
   - Diversified across multiple commodities (gold, silver, oil, metals)
   - Examples: Motilal Oswal Multi Commodity, ICICI Multi Commodity

**API Endpoints:**

```bash
GET /api/funds?category=Commodity&subCategory=Gold Fund&limit=500
GET /api/funds?category=Commodity&subCategory=Silver Fund&limit=500
GET /api/funds?category=Commodity&subCategory=Multi Commodity Fund&limit=500
```

---

## 3. Fund Data Completeness

Every fund object returned by the API MUST include complete and accurate data:

### Required Fields (No null or 0 values unless genuinely unavailable)

```typescript
interface Fund {
  // Basic Information
  id: string; // Unique database ID
  fundId: string; // Unique fund identifier (scheme code)
  name: string; // Full fund name
  schemeName?: string; // Alternative scheme name
  category: string; // "Equity" | "Debt" | "Commodity" | "Hybrid"
  subCategory: string; // Specific subcategory as listed above
  fundType: string; // "Open" | "Closed" | "Interval"
  fundHouse: string; // AMC name (e.g., "HDFC", "ICICI Prudential")

  // NAV Information
  currentNav: number; // Current Net Asset Value (NOT 0)
  previousNav?: number; // Previous day NAV
  navDate?: string; // Date of current NAV (ISO format)
  navChange?: number; // Absolute change in NAV
  navChangePercent?: number; // Percentage change

  // Returns (Annualized %)
  returns?: {
    oneMonth?: number; // 1-month return
    threeMonth?: number; // 3-month return
    sixMonth?: number; // 6-month return
    ytd?: number; // Year-to-date return
    oneYear?: number; // 1-year return
    threeYear?: number; // 3-year annualized return
    fiveYear?: number; // 5-year annualized return
    tenYear?: number; // 10-year annualized return
    sinceInception?: number; // Since inception annualized return
  };

  // Risk Metrics
  riskMetrics?: {
    sharpeRatio?: number; // Risk-adjusted return metric
    beta?: number; // Market volatility measure
    alpha?: number; // Excess return vs benchmark
    volatility?: number; // Standard deviation
    standardDeviation?: number; // Price volatility
  };

  // Key Metrics
  aum?: number; // Assets Under Management (in Crores)
  expenseRatio?: number; // Annual expense ratio (%)
  exitLoad?: number; // Exit load percentage
  minInvestment?: number; // Minimum lump sum investment
  sipMinAmount?: number; // Minimum SIP amount

  // Ratings
  rating?: number; // Overall rating (1-5 stars)
  ratings?: {
    morningstar?: number; // Morningstar rating
    crisil?: number; // CRISIL rating
    valueResearch?: number; // Value Research rating
  };

  riskLevel?: string; // "Low" | "Moderately Low" | "Moderate" | "Moderately High" | "High"

  // Additional Information
  launchDate?: string; // Fund launch date (ISO format)
  fundManager?: string; // Fund manager name
  benchmarkName?: string; // Benchmark index name
  tags?: string[]; // Tags for search/filtering
}
```

### Fund Details (For /api/funds/:id endpoint)

Additional fields for detailed view:

```typescript
interface FundDetails extends Fund {
  // Portfolio Holdings
  topHoldings?: Array<{
    name: string; // Company/security name
    ticker?: string; // Stock ticker
    percentage: number; // % of portfolio
    sector: string; // Sector classification
    value?: number; // Value in Crores
  }>;

  // Sector Allocation
  sectorAllocation?: Array<{
    sector: string; // Sector name
    percentage: number; // % allocation
  }>;

  // Fund Manager Details
  managerDetails?: {
    id: string;
    name: string;
    experience: number; // Years of experience
    qualification: string; // Educational qualification
    fundsManaged: number; // Number of funds managed
    totalAum: number; // Total AUM managed (Crores)
    avgReturn: number; // Average return across funds
    bio?: string; // Manager biography
  };

  lastUpdated?: string; // Last data update timestamp
}
```

---

## 4. Market Indices - Real-Time Data Integration

### Current Issue

- Market indices showing **0** as values
- Foreign indices (USA, Japan, China) not displaying real data
- No last updated timestamp

### Required Implementation

#### 4.1 Data Source Integration

Integrate with one or more of these APIs:

**For Indian Markets:**

- NSE API (National Stock Exchange)
- BSE API (Bombay Stock Exchange)
- Yahoo Finance API
- Alpha Vantage

**For Foreign Markets:**

- Yahoo Finance API (Global coverage)
- Alpha Vantage
- Twelve Data
- Financial Modeling Prep API

#### 4.2 Required Indian Indices

```javascript
[
  {
    code: 'NIFTY50',
    name: 'NIFTY 50',
    country: 'India',
    exchange: 'NSE',
    value: 21453.75, // Current index value
    change: 145.3, // Absolute change
    changePercent: 0.68, // Percentage change
    open: 21308.45,
    high: 21489.2,
    low: 21285.6,
    previousClose: 21308.45,
    lastUpdated: '2025-12-20T15:30:00Z',
  },
  {
    code: 'SENSEX',
    name: 'BSE SENSEX',
    country: 'India',
    exchange: 'BSE',
    // ... same structure
  },
  {
    code: 'NIFTYBANK',
    name: 'NIFTY Bank',
    country: 'India',
  },
  {
    code: 'NIFTYIT',
    name: 'NIFTY IT',
    country: 'India',
  },
  {
    code: 'NIFTYMIDCAP100',
    name: 'NIFTY Midcap 100',
    country: 'India',
  },
  {
    code: 'NIFTYSMALLCAP100',
    name: 'NIFTY Smallcap 100',
    country: 'India',
  },
  {
    code: 'NIFTYNEXT50',
    name: 'NIFTY Next 50',
    country: 'India',
  },
];
```

#### 4.3 Required Foreign/Global Indices

```javascript
[
  // United States
  {
    code: 'SPX',
    name: 'S&P 500',
    country: 'USA',
    exchange: 'US',
    value: 4783.45,
    change: -12.5,
    changePercent: -0.26,
    lastUpdated: '2025-12-20T21:00:00Z',
  },
  {
    code: 'DJI',
    name: 'Dow Jones Industrial Average',
    country: 'USA',
    exchange: 'US',
  },
  {
    code: 'IXIC',
    name: 'NASDAQ Composite',
    country: 'USA',
    exchange: 'NASDAQ',
  },

  // Japan
  {
    code: 'N225',
    name: 'Nikkei 225',
    country: 'Japan',
    exchange: 'TSE',
    value: 33486.89,
    change: 234.12,
    changePercent: 0.7,
    lastUpdated: '2025-12-20T06:00:00Z',
  },

  // China & Hong Kong
  {
    code: '000001',
    name: 'Shanghai Composite',
    country: 'China',
    exchange: 'SSE',
  },
  {
    code: 'HSI',
    name: 'Hang Seng Index',
    country: 'Hong Kong',
    exchange: 'HKEX',
  },

  // Europe
  {
    code: 'FTSE',
    name: 'FTSE 100',
    country: 'United Kingdom',
    exchange: 'LSE',
  },
  {
    code: 'GDAXI',
    name: 'DAX',
    country: 'Germany',
    exchange: 'XETRA',
  },
  {
    code: 'FCHI',
    name: 'CAC 40',
    country: 'France',
    exchange: 'Euronext',
  },
];
```

#### 4.4 API Endpoint

```bash
GET /api/market-indices
```

**Response Format:**

```json
{
  "success": true,
  "message": "Market indices fetched successfully",
  "data": {
    "indian": [
      {
        "code": "NIFTY50",
        "name": "NIFTY 50",
        "country": "India",
        "exchange": "NSE",
        "value": 21453.75,
        "change": 145.3,
        "changePercent": 0.68,
        "open": 21308.45,
        "high": 21489.2,
        "low": 21285.6,
        "previousClose": 21308.45,
        "lastUpdated": "2025-12-20T15:30:00Z",
        "marketStatus": "OPEN" // or "CLOSED"
      }
      // ... other Indian indices
    ],
    "global": [
      {
        "code": "SPX",
        "name": "S&P 500",
        "country": "USA",
        "exchange": "US",
        "value": 4783.45,
        "change": -12.5,
        "changePercent": -0.26,
        "open": 4795.95,
        "high": 4801.23,
        "low": 4776.12,
        "previousClose": 4795.95,
        "lastUpdated": "2025-12-20T21:00:00Z",
        "marketStatus": "OPEN"
      }
      // ... other global indices
    ]
  },
  "lastRefresh": "2025-12-20T15:30:00Z"
}
```

#### 4.5 Update Frequency

- **During Market Hours**: Update every 1-5 minutes
- **After Market Close**: Update once at market close
- **Weekends/Holidays**: Serve last available data with clear timestamp
- Implement caching with Redis/memory cache to avoid hitting rate limits

---

## 5. Database Requirements

### 5.1 Ensure Fund Count Targets

Your database should contain approximately:

- **Equity Funds**: ~1200-1500 funds

  - Large Cap: ~100-150 funds
  - Mid Cap: ~100-150 funds
  - Small Cap: ~80-120 funds
  - Multi Cap: ~80-100 funds
  - Flexi Cap: ~60-80 funds
  - Index Funds: ~80-120 funds

- **Debt Funds**: ~800-1000 funds

  - Liquid: ~50-80 funds
  - Corporate Bond: ~50-80 funds
  - Gilt: ~30-50 funds
  - Dynamic Bond: ~40-60 funds
  - (Other subcategories proportionately)

- **Commodity Funds**: ~30-50 funds
  - Gold: ~15-25 funds
  - Silver: ~5-10 funds
  - Multi Commodity: ~10-15 funds

**Total Target**: ~2000-2500 funds

### 5.2 Data Validation

Run these checks on your database:

```sql
-- Check total fund count
SELECT COUNT(*) as total FROM funds;

-- Check category distribution
SELECT category, COUNT(*) as count
FROM funds
GROUP BY category;

-- Check subcategory distribution for Equity
SELECT subCategory, COUNT(*) as count
FROM funds
WHERE category = 'Equity'
GROUP BY subCategory;

-- Check for funds with 0 or null NAV (should be 0)
SELECT COUNT(*)
FROM funds
WHERE currentNav IS NULL OR currentNav = 0;

-- Check for funds missing returns data
SELECT COUNT(*)
FROM funds
WHERE returns IS NULL OR returns = '{}';
```

---

## 6. API Testing Checklist

After implementing all changes, verify these scenarios work:

### 6.1 Limit Parameter Tests

```bash
# Should work without 400 error
✅ GET /api/funds?limit=2500
✅ GET /api/funds?category=Equity&limit=2000
✅ GET /api/funds?category=Debt&limit=1000
✅ GET /api/funds?category=Commodity&limit=50

# Should return correct count
✅ Response pagination.total should match database count
```

### 6.2 Category/Subcategory Tests

```bash
# Equity
✅ GET /api/funds?category=Equity&subCategory=Large Cap
✅ GET /api/funds?category=Equity&subCategory=Mid Cap
✅ GET /api/funds?category=Equity&subCategory=Small Cap
✅ GET /api/funds?category=Equity&subCategory=Multi Cap
✅ GET /api/funds?category=Equity&subCategory=Flexi Cap
✅ GET /api/funds?category=Equity&subCategory=Index Fund

# Debt
✅ GET /api/funds?category=Debt&subCategory=Liquid Fund
✅ GET /api/funds?category=Debt&subCategory=Corporate Bond Fund
✅ GET /api/funds?category=Debt&subCategory=Gilt Fund
✅ GET /api/funds?category=Debt&subCategory=Dynamic Bond

# Commodity
✅ GET /api/funds?category=Commodity&subCategory=Gold Fund
✅ GET /api/funds?category=Commodity&subCategory=Silver Fund
✅ GET /api/funds?category=Commodity&subCategory=Multi Commodity Fund

# All funds (no filter)
✅ GET /api/funds?limit=2500
```

### 6.3 Data Quality Tests

```bash
# Every fund should have:
✅ currentNav > 0 (not 0 or null)
✅ fundHouse is present
✅ category and subCategory are correctly assigned
✅ At least oneYear return is present (if fund is > 1 year old)
✅ AUM value is present and > 0
```

### 6.4 Market Indices Tests

```bash
✅ GET /api/market-indices
✅ All Indian indices have value > 0
✅ All foreign indices (USA, Japan, China) have value > 0
✅ lastUpdated timestamp is recent (within last 24 hours)
✅ changePercent is calculated correctly
```

---

## 7. Implementation Priority

### Phase 1 (CRITICAL - Must Fix Immediately)

1. ✅ Remove/increase limit parameter restriction to 2500
2. ✅ Test all equity subcategories work correctly
3. ✅ Ensure at least 1000+ equity funds are in database

### Phase 2 (HIGH - Required for Launch)

1. ✅ Implement all debt subcategories (16 subcategories)
2. ✅ Add commodity funds with subcategories
3. ✅ Fix market indices to show real values
4. ✅ Add foreign indices (USA, Japan, China)

### Phase 3 (MEDIUM - Enhancement)

1. ✅ Complete fund data with all fields populated
2. ✅ Implement caching for market indices
3. ✅ Add pagination support if needed

---

## 8. Example API Responses

### 8.1 Funds List Response

```json
GET /api/funds?category=Equity&subCategory=Large Cap&limit=500

{
  "success": true,
  "message": "Funds fetched successfully",
  "data": [
    {
      "id": "67890",
      "fundId": "INF123456789",
      "name": "HDFC Top 100 Fund - Direct Plan - Growth",
      "schemeName": "HDFC Top 100 Fund",
      "category": "Equity",
      "subCategory": "Large Cap",
      "fundType": "Open",
      "fundHouse": "HDFC Mutual Fund",
      "currentNav": 845.32,
      "previousNav": 842.15,
      "navDate": "2025-12-20",
      "navChange": 3.17,
      "navChangePercent": 0.38,
      "returns": {
        "oneMonth": 2.45,
        "threeMonth": 8.32,
        "sixMonth": 12.68,
        "ytd": 18.45,
        "oneYear": 22.34,
        "threeYear": 18.76,
        "fiveYear": 16.89,
        "tenYear": 15.23,
        "sinceInception": 14.87
      },
      "riskMetrics": {
        "sharpeRatio": 1.45,
        "beta": 0.98,
        "alpha": 2.34,
        "volatility": 12.45,
        "standardDeviation": 11.89
      },
      "aum": 45678.50,
      "expenseRatio": 0.65,
      "exitLoad": 1.0,
      "minInvestment": 5000,
      "sipMinAmount": 500,
      "rating": 5,
      "ratings": {
        "morningstar": 5,
        "crisil": 5,
        "valueResearch": 5
      },
      "riskLevel": "Moderately High",
      "launchDate": "2000-01-15",
      "fundManager": "Rahul Singh",
      "benchmarkName": "NIFTY 100 TRI",
      "tags": ["large-cap", "equity", "growth", "long-term"]
    }
    // ... 499 more funds
  ],
  "pagination": {
    "total": 127,
    "page": 1,
    "limit": 500,
    "totalPages": 1,
    "hasMore": false
  }
}
```

### 8.2 Market Indices Response

```json
GET /api/market-indices

{
  "success": true,
  "message": "Market indices fetched successfully",
  "data": {
    "indian": [
      {
        "code": "NIFTY50",
        "name": "NIFTY 50",
        "country": "India",
        "exchange": "NSE",
        "value": 21453.75,
        "change": 145.30,
        "changePercent": 0.68,
        "open": 21308.45,
        "high": 21489.20,
        "low": 21285.60,
        "previousClose": 21308.45,
        "lastUpdated": "2025-12-20T15:30:00Z",
        "marketStatus": "OPEN"
      },
      {
        "code": "SENSEX",
        "name": "BSE SENSEX",
        "country": "India",
        "exchange": "BSE",
        "value": 71243.56,
        "change": 234.89,
        "changePercent": 0.33,
        "lastUpdated": "2025-12-20T15:30:00Z",
        "marketStatus": "OPEN"
      }
    ],
    "global": [
      {
        "code": "SPX",
        "name": "S&P 500",
        "country": "USA",
        "exchange": "US",
        "value": 4783.45,
        "change": -12.50,
        "changePercent": -0.26,
        "lastUpdated": "2025-12-20T21:00:00Z",
        "marketStatus": "OPEN"
      },
      {
        "code": "N225",
        "name": "Nikkei 225",
        "country": "Japan",
        "exchange": "TSE",
        "value": 33486.89,
        "change": 234.12,
        "changePercent": 0.70,
        "lastUpdated": "2025-12-20T06:00:00Z",
        "marketStatus": "CLOSED"
      },
      {
        "code": "000001",
        "name": "Shanghai Composite",
        "country": "China",
        "exchange": "SSE",
        "value": 3124.56,
        "change": -8.34,
        "changePercent": -0.27,
        "lastUpdated": "2025-12-20T07:00:00Z",
        "marketStatus": "CLOSED"
      }
    ]
  },
  "lastRefresh": "2025-12-20T15:30:00Z"
}
```

---

## 9. Common SubCategory Naming Conventions

Ensure exact match with these names (case-sensitive):

### Equity

- `"Large Cap"`
- `"Mid Cap"`
- `"Small Cap"`
- `"Multi Cap"`
- `"Flexi Cap"`
- `"Index Fund"`

### Debt

- `"Liquid Fund"`
- `"Ultra Short Duration Fund"`
- `"Low Duration Fund"`
- `"Money Market Fund"`
- `"Short Duration Fund"`
- `"Medium Duration Fund"`
- `"Medium to Long Duration Fund"`
- `"Long Duration Fund"`
- `"Dynamic Bond"`
- `"Corporate Bond Fund"`
- `"Credit Risk Fund"`
- `"Banking and PSU Fund"`
- `"Gilt Fund"`
- `"Gilt Fund with 10 year constant duration"`
- `"Floater Fund"`
- `"Overnight Fund"`

### Commodity

- `"Gold Fund"` or `"Gold"`
- `"Silver Fund"` or `"Silver"`
- `"Multi Commodity Fund"`

---

## 10. Performance Considerations

### Database Indexing

Add indexes on:

```sql
CREATE INDEX idx_category ON funds(category);
CREATE INDEX idx_subcategory ON funds(subCategory);
CREATE INDEX idx_category_subcategory ON funds(category, subCategory);
CREATE INDEX idx_fundhouse ON funds(fundHouse);
CREATE INDEX idx_name_search ON funds(name); -- For text search
```

### Caching Strategy

- Cache fund lists by category/subcategory for 5-15 minutes
- Cache market indices for 1-5 minutes during market hours
- Use Redis or in-memory cache (Node-cache)

### Response Optimization

- Implement gzip compression
- Use pagination if returning >1000 funds affects performance
- Consider adding `?fields=basic` parameter for lightweight responses

---

## Completion Checklist

Once implemented, confirm:

- [ ] `GET /api/funds?limit=2500` works without errors
- [ ] All 6 equity subcategories return funds
- [ ] All 16 debt subcategories return funds
- [ ] All 3 commodity subcategories return funds
- [ ] No fund has `currentNav: 0` or `null`
- [ ] Market indices endpoint returns real values (not 0)
- [ ] Foreign indices (USA, Japan, China) show correct values
- [ ] Database contains 2000+ funds
- [ ] API response time < 2 seconds for 2500 funds
- [ ] Documentation updated with new limits and endpoints

---

## Questions or Issues?

If you need clarification on:

- Exact subcategory names to use
- Market data API integration
- Performance optimization for large responses
- Pagination implementation

Please provide:

1. Current fund count in database
2. Current API framework (Express, Fastify, etc.)
3. Database type (MongoDB, PostgreSQL, MySQL)
4. Current maximum limit restriction location in code

---

**Document Version**: 1.0  
**Last Updated**: December 20, 2025  
**Priority**: CRITICAL - Required for Production Launch
