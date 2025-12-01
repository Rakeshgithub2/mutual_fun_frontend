# Backend Requirements: Fund SubCategory Implementation

## Problem Statement

The frontend currently has category filters for **Large Cap (30 funds)**, **Mid Cap (25 funds)**, **Small Cap (15 funds)**, etc., but the backend API only returns funds with basic categories: `"equity"` and `"commodity"`. When filtering by subcategories like `LARGE_CAP`, the API returns 0 results.

**Current API Response:**

```bash
curl "https://mutualfun-backend.vercel.app/api/funds?category=LARGE_CAP&limit=5"
# Returns: {"data": [], "pagination": {"total": 0}}
```

**Expected Behavior:**
Filtering by `LARGE_CAP` should return 30 funds, `MID_CAP` should return 25 funds, etc.

---

## Required Implementation

### 1. Database Schema Update

Add a new `subCategory` field to the Fund model/schema:

```javascript
// MongoDB/Mongoose Example
const fundSchema = new Schema({
  // ... existing fields
  category: {
    type: String,
    enum: ['equity', 'commodity', 'debt', 'hybrid'],
    required: true,
  },
  subCategory: {
    type: String,
    enum: [
      'LARGE_CAP',
      'MID_CAP',
      'SMALL_CAP',
      'MULTI_CAP',
      'FLEXI_CAP',
      'ELSS',
      'SECTORAL',
      'THEMATIC',
      'GOLD_ETF',
      'SILVER_ETF',
      'DEBT_FUND',
      'LIQUID_FUND',
      'BALANCED_HYBRID',
      'AGGRESSIVE_HYBRID',
    ],
    required: false, // Make it optional initially for backward compatibility
  },
  // ... other fields
});
```

### 2. Data Migration Script

Populate `subCategory` for existing funds based on fund names:

```javascript
// Example migration logic
const subCategoryMapping = {
  'large cap': 'LARGE_CAP',
  'mid cap': 'MID_CAP',
  'small cap': 'SMALL_CAP',
  'multi cap': 'MULTI_CAP',
  'flexi cap': 'FLEXI_CAP',
  elss: 'ELSS',
  'tax saver': 'ELSS',
  gold: 'GOLD_ETF',
  silver: 'SILVER_ETF',
  sectoral: 'SECTORAL',
  thematic: 'THEMATIC',
  debt: 'DEBT_FUND',
  liquid: 'LIQUID_FUND',
  balanced: 'BALANCED_HYBRID',
  aggressive: 'AGGRESSIVE_HYBRID',
};

async function migrateSubCategories() {
  const funds = await Fund.find({});

  for (const fund of funds) {
    const fundNameLower = fund.name.toLowerCase();

    // Check fund name against mapping
    for (const [keyword, subCat] of Object.entries(subCategoryMapping)) {
      if (fundNameLower.includes(keyword)) {
        fund.subCategory = subCat;
        await fund.save();
        console.log(`Updated ${fund.name} → ${subCat}`);
        break;
      }
    }
  }
}
```

### 3. API Endpoint Updates

Update the `/api/funds` GET endpoint to support filtering by `subCategory`:

```javascript
// GET /api/funds
router.get('/funds', async (req, res) => {
  try {
    const {
      category, // equity, commodity, debt, hybrid
      subCategory, // LARGE_CAP, MID_CAP, SMALL_CAP, etc.
      search,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query filter
    const filter = {};

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (subCategory) {
      filter.subCategory = subCategory.toUpperCase();
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { fundCode: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const funds = await Fund.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await Fund.countDocuments(filter);

    res.status(200).json({
      statusCode: 200,
      message: 'Funds retrieved successfully',
      data: funds,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Error retrieving funds',
      error: error.message,
    });
  }
});
```

### 4. Response Format

Ensure the API returns `subCategory` in the fund object:

```json
{
  "statusCode": 200,
  "message": "Funds retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Union Mid Cap Fund",
      "fundCode": "120503",
      "category": "equity",
      "subCategory": "MID_CAP",
      "nav": 185.50,
      "aum": 5000,
      "expenseRatio": 1.2,
      "topHoldings": [...],
      "sectorAllocation": [...],
      "managerDetails": {...}
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

---

## Frontend Usage Examples

Once implemented, the frontend will call:

```javascript
// Filter by subcategory
GET /api/funds?subCategory=LARGE_CAP&limit=30
// Expected: Returns 30 Large Cap funds

GET /api/funds?subCategory=MID_CAP&limit=25
// Expected: Returns 25 Mid Cap funds

GET /api/funds?subCategory=SMALL_CAP&limit=15
// Expected: Returns 15 Small Cap funds

// Combined filters
GET /api/funds?category=equity&subCategory=ELSS&limit=10
// Expected: Returns equity ELSS funds

// Search within subcategory
GET /api/funds?subCategory=LARGE_CAP&search=axis
// Expected: Returns Large Cap funds with "axis" in name
```

---

## Validation Checklist

- [ ] Database schema includes `subCategory` field with enum values
- [ ] Migration script successfully populates `subCategory` for all existing funds
- [ ] API accepts `subCategory` query parameter
- [ ] API returns funds filtered by `subCategory` correctly
- [ ] API response includes `subCategory` in fund objects
- [ ] Query works with both `category` and `subCategory` simultaneously
- [ ] Empty results return proper response: `{"data": [], "pagination": {"total": 0}}`
- [ ] Invalid `subCategory` values are handled gracefully

---

## Expected Fund Counts (Frontend Reference)

Based on frontend expectations:

- **Large Cap**: ~30 funds
- **Mid Cap**: ~25 funds
- **Small Cap**: ~15 funds
- **Multi Cap**: ~20 funds
- **Flexi Cap**: ~18 funds
- **ELSS**: ~25 funds
- **Sectoral/Thematic**: ~40 funds
- **Gold ETF**: ~10 funds

Total: Approximately 183 equity funds + commodity funds

---

## Priority

**HIGH** - This is blocking the frontend search/filter functionality. Users currently see 0 results when filtering by fund type.

## Testing Commands

After implementation, verify with:

```bash
# Test Large Cap filter
curl "https://mutualfun-backend.vercel.app/api/funds?subCategory=LARGE_CAP&limit=5"

# Test Mid Cap filter
curl "https://mutualfun-backend.vercel.app/api/funds?subCategory=MID_CAP&limit=5"

# Test combined filter
curl "https://mutualfun-backend.vercel.app/api/funds?category=equity&subCategory=ELSS&limit=5"

# Verify all funds have subCategory
curl "https://mutualfun-backend.vercel.app/api/funds?limit=100" | jq '.data[] | {name, category, subCategory}'
```

---

## Questions?

Contact the frontend team if you need clarification on:

- Expected subcategory names/values
- Fund count expectations per subcategory
- Additional filter requirements
- Response format details
