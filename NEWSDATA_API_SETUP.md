# 📰 NewsData.io API Setup

## ✅ Configuration Complete

The NewsData.io API has been successfully configured for fetching real-time stock market and financial news.

### API Details

- **Service**: NewsData.io
- **API Key**: `pub_5826238286fe4f11aa3c87c78798d52b`
- **Base URL**: `https://newsdata.io/api/1/latest`
- **Status**: ✅ Active and Working

### Test Results

```
✓ API Status: success
✓ Total Results Available: 19,523 articles
✓ Articles per Request: 10
✓ Sample Article Retrieved Successfully
```

### Configuration Files Updated

1. ✅ `mutual-funds-backend/.env` - Production/Development config
2. ✅ `mutual-funds-backend/.env.local` - Local development config

### How to Use

#### 1. Fetch News via API

The backend automatically uses this API key through the `NewsService` class.

**Example API Call:**

```bash
GET http://localhost:3002/api/admin/news/sync
```

#### 2. Manual Test

```powershell
# Test the API directly
Invoke-RestMethod -Uri "https://newsdata.io/api/1/latest?apikey=pub_5826238286fe4f11aa3c87c78798d52b&q=stock%20market&language=en"
```

#### 3. Categories Supported

- Stock Market News
- Mutual Funds
- Investment Updates
- Financial Markets
- Business News

### Search Keywords

The service automatically searches for:

- `mutual fund`
- `investment`
- `portfolio`
- `equity`
- `debt`
- `stock market` (new)

### API Endpoint Features

**NewsData.io API Parameters:**

```
?apikey=pub_5826238286fe4f11aa3c87c78798d52b
&q=stock%20market           # Search query
&language=en                # English language
&country=in                 # India (can be modified)
&category=business          # Business category
```

### Usage Limits

NewsData.io Free Tier:

- ✓ 200 API calls per day
- ✓ 10 results per request
- ✓ Access to last 48 hours of news
- ✓ Multiple language support
- ✓ Category filtering

### Integration Points

#### Backend Routes

```typescript
// Sync news from NewsData.io
POST /api/admin/news/sync

// Get latest news
GET /api/news

// Get news by category
GET /api/news?category=MARKET
```

#### Service Implementation

Located in: `mutual-funds-backend/src/services/newsService.ts`

**Key Methods:**

- `ingestNews()` - Fetch and store news articles
- `getRecentNews()` - Retrieve stored articles
- `processBatch()` - Process articles in batches
- `extractTags()` - Auto-tag articles with financial terms

### Auto-Tagging System

Articles are automatically tagged with relevant financial terms:

- mutual fund, sip, equity, debt
- nifty, sensex, nav
- portfolio, investment, dividend
- returns, risk, aum
- large cap, mid cap, small cap
- elss, liquid fund

### Database Storage

News articles are stored in MongoDB with the following schema:

```typescript
{
  title: string
  content: string
  source: string
  category: enum (MARKET, REGULATORY, GENERAL)
  tags: string[]
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### Frontend Integration

The frontend can fetch news using:

```typescript
// Fetch latest news
const response = await fetch("http://localhost:3002/api/news");
const news = await response.json();
```

### Testing the Integration

**Step 1: Start Backend Server**

```powershell
cd "c:\mutual fund\mutual-funds-backend"
npm run dev
```

**Step 2: Trigger News Sync (Admin Only)**

```powershell
# Using curl or Postman
POST http://localhost:3002/api/admin/news/sync
Authorization: Bearer <admin-token>
```

**Step 3: View Fetched News**

```powershell
GET http://localhost:3002/api/news
```

### Customization

#### Change Search Query

Edit in `newsService.ts`:

```typescript
async ingestNews(
  category: string = 'business',
  keywords: string[] = [
    'mutual fund',
    'investment',
    'stock market',  // Add your keywords
    'IPO',
    'cryptocurrency'
  ]
)
```

#### Change Country/Language

Modify the API URL in `newsService.ts`:

```typescript
const url = `${this.baseUrl}?apikey=${this.apiKey}&q=${keywordParam}&language=en&country=us`;
// Change country from 'in' to 'us', 'uk', etc.
```

### Monitoring

**Check API Status:**

```powershell
# View backend logs
cd "c:\mutual fund\mutual-funds-backend"
npm run dev

# Look for:
✓ NEWSDATA_API_KEY configured
✓ Fetched X news articles
✓ Processed news batch
```

### Troubleshooting

**Issue: "NEWSDATA_API_KEY is not configured"**

- Solution: Restart the backend server after updating `.env`

**Issue: "News API error: 401"**

- Solution: Check if API key is correct in `.env` file

**Issue: "No articles fetched"**

- Solution: Check search keywords match available content

### Alternative API Calls

**Fetch Different Categories:**

```bash
# Technology news
https://newsdata.io/api/1/latest?apikey=pub_5826238286fe4f11aa3c87c78798d52b&q=technology&category=technology

# Business news
https://newsdata.io/api/1/latest?apikey=pub_5826238286fe4f11aa3c87c78798d52b&q=business&category=business

# Mutual fund specific
https://newsdata.io/api/1/latest?apikey=pub_5826238286fe4f11aa3c87c78798d52b&q=mutual%20fund&country=in
```

### Security Notes

⚠️ **Important:**

- This API key is in `.env` files
- `.env` files are in `.gitignore`
- Never commit API keys to GitHub
- Rotate keys periodically

### Next Steps

1. ✅ API Key Configured
2. ✅ Backend Service Ready
3. ⏭️ Test News Sync via Admin Panel
4. ⏭️ Display News on Frontend
5. ⏭️ Setup Automated News Fetch (Cron Job)

### Resources

- **NewsData.io Dashboard**: https://newsdata.io/dashboard
- **API Documentation**: https://newsdata.io/documentation
- **Get More Credits**: Upgrade at https://newsdata.io/pricing

---

**Status**: ✅ Ready to fetch real-time financial news!
**Last Updated**: November 9, 2025
