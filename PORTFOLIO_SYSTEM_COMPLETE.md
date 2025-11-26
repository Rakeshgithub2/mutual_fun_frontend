# Portfolio System Documentation

## Overview

The portfolio system provides user-specific portfolio management that **starts at zero** and updates based on user transactions. All data is stored in MongoDB for a personalized experience.

## Key Features

✅ **Zero Initial State**: New users start with an empty portfolio (₹0 invested, 0 holdings)  
✅ **Transaction-Based**: Portfolio updates only through buy/sell transactions  
✅ **Real-Time Calculations**: Automatic NAV-based valuation  
✅ **Transaction History**: Complete audit trail of all transactions  
✅ **Portfolio Analytics**: Summary statistics, top performers, category allocation  
✅ **MongoDB Storage**: All data persisted in database  
✅ **User-Specific**: Each user has their own isolated portfolio

## Database Schema

### Portfolio Collection

```json
{
  "userId": "user_123",
  "holdings": [
    {
      "fundId": ObjectId("..."),
      "fundName": "HDFC Top 100 Fund",
      "fundHouse": "HDFC",
      "category": "Large Cap",
      "units": 150,
      "avgPrice": 542.50,
      "investedAmount": 81375.00,
      "currentPrice": 565.30,
      "currentValue": 84795.00,
      "gainLoss": 3420.00,
      "gainLossPercentage": 4.20,
      "addedAt": "2024-01-15T10:30:00Z",
      "lastUpdated": "2024-01-20T15:45:00Z"
    }
  ],
  "totalInvested": 81375.00,
  "currentValue": 84795.00,
  "totalGainLoss": 3420.00,
  "totalGainLossPercentage": 4.20,
  "transactions": [
    {
      "id": "txn_1234567890_abc",
      "type": "buy",
      "fundId": ObjectId("..."),
      "fundName": "HDFC Top 100 Fund",
      "fundHouse": "HDFC",
      "units": 100,
      "price": 540.00,
      "amount": 54000.00,
      "date": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}
```

## API Endpoints

### 1. Get User Portfolio

**GET** `/api/portfolio/:userId`

Returns user portfolio. Creates empty portfolio if doesn't exist.

**Response (Empty Portfolio):**

```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "holdings": [],
    "totalInvested": 0,
    "currentValue": 0,
    "totalGainLoss": 0,
    "totalGainLossPercentage": 0,
    "transactions": [],
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

### 2. Get Portfolio Summary

**GET** `/api/portfolio/:userId/summary`

Returns portfolio statistics and analytics.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalInvested": 150000,
    "currentValue": 165000,
    "totalGainLoss": 15000,
    "totalGainLossPercentage": 10.0,
    "totalHoldings": 3,
    "totalTransactions": 5,
    "lastUpdated": "2024-01-20T15:45:00Z",
    "categoryAllocation": {
      "Large Cap": {
        "invested": 80000,
        "currentValue": 88000,
        "count": 2
      },
      "Gold": {
        "invested": 70000,
        "currentValue": 77000,
        "count": 1
      }
    },
    "topPerformers": [
      {
        "fundName": "HDFC Gold ETF",
        "gainLossPercentage": 12.5,
        "currentValue": 77000
      }
    ],
    "bottomPerformers": [
      {
        "fundName": "SBI Large Cap Fund",
        "gainLossPercentage": 5.2,
        "currentValue": 42000
      }
    ]
  }
}
```

### 3. Get Transaction History

**GET** `/api/portfolio/:userId/transactions?limit=50`

Returns transaction history for the user.

**Query Parameters:**

- `limit` (optional): Number of transactions to return (default: 50)

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_1234567890_abc",
        "type": "buy",
        "fundId": "507f1f77bcf86cd799439011",
        "fundName": "HDFC Top 100 Fund",
        "fundHouse": "HDFC",
        "units": 100,
        "price": 540.0,
        "amount": 54000.0,
        "date": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalTransactions": 5
  }
}
```

### 4. Add Transaction

**POST** `/api/portfolio/:userId/transaction`

Add a buy or sell transaction to the portfolio.

**Request Body:**

```json
{
  "type": "buy",
  "fundId": "507f1f77bcf86cd799439011",
  "units": 100,
  "price": 540.0,
  "date": "2024-01-15T10:30:00Z"
}
```

**Fields:**

- `type` (required): "buy" or "sell"
- `fundId` (required): MongoDB ObjectId of the fund
- `units` (required): Number of units to buy/sell
- `price` (required): Price per unit
- `date` (optional): Transaction date (defaults to current date)

**Response:**

```json
{
  "success": true,
  "message": "Purchase completed successfully",
  "data": {
    "transaction": {
      "id": "txn_1234567890_abc",
      "type": "buy",
      "fundId": "507f1f77bcf86cd799439011",
      "fundName": "HDFC Top 100 Fund",
      "units": 100,
      "price": 540.00,
      "amount": 54000.00,
      "date": "2024-01-15T10:30:00Z"
    },
    "portfolio": {
      "userId": "user_123",
      "holdings": [...],
      "totalInvested": 54000,
      "currentValue": 56530,
      "totalGainLoss": 2530,
      "totalGainLossPercentage": 4.68
    }
  }
}
```

### 5. Update Portfolio Values

**PUT** `/api/portfolio/:userId/update`

Updates all holdings with latest NAVs from the funds collection.

**Response:**

```json
{
  "success": true,
  "message": "Portfolio values updated successfully",
  "data": {
    "userId": "user_123",
    "holdings": [...],
    "totalInvested": 150000,
    "currentValue": 165000,
    "totalGainLoss": 15000,
    "totalGainLossPercentage": 10.0,
    "updatedAt": "2024-01-20T16:00:00Z"
  }
}
```

## How It Works

### 1. Initial State (Zero Portfolio)

When a user first accesses their portfolio:

- System checks MongoDB for existing portfolio
- If not found, creates empty portfolio with:
  - holdings: []
  - totalInvested: 0
  - currentValue: 0
  - totalGainLoss: 0

### 2. Buy Transaction

When user buys units:

1. Validates fund exists in database
2. Checks if user already holds this fund:
   - **If YES**: Updates existing holding (averages price)
   - **If NO**: Adds new holding
3. Calculates current value using latest NAV
4. Updates portfolio totals
5. Adds transaction to history
6. Saves to MongoDB

**Example: Buy 100 units @ ₹540**

```
Investment: 100 × 540 = ₹54,000
Current NAV: ₹565
Current Value: 100 × 565 = ₹56,500
Gain: ₹56,500 - ₹54,000 = ₹2,500 (4.63%)
```

### 3. Sell Transaction

When user sells units:

1. Validates user holds the fund
2. Checks sufficient units available
3. Calculates proportional invested amount
4. Reduces or removes holding:
   - **If units remain**: Updates holding
   - **If all sold**: Removes holding completely
5. Updates portfolio totals
6. Adds transaction to history
7. Saves to MongoDB

**Example: Sell 30 units @ ₹580 from 100 units**

```
Remaining Units: 100 - 30 = 70
Invested Amount Reduced: (30/100) × 54,000 = ₹16,200
Remaining Invested: ₹54,000 - ₹16,200 = ₹37,800
Sale Amount: 30 × 580 = ₹17,400
Profit on Sale: ₹17,400 - ₹16,200 = ₹1,200
```

### 4. Average Price Calculation

When buying more units of an existing holding:

```
New Avg Price = (Existing Invested + New Investment) / (Existing Units + New Units)
```

**Example:**

```
Existing: 100 units @ ₹540 (₹54,000 invested)
New Purchase: 50 units @ ₹570 (₹28,500 investment)

Total Units: 100 + 50 = 150
Total Invested: ₹54,000 + ₹28,500 = ₹82,500
New Avg Price: ₹82,500 / 150 = ₹550
```

### 5. Real-Time Valuation

Portfolio uses latest NAVs from funds collection:

- `currentPrice`: Latest NAV from funds.currentNAV
- `currentValue`: units × currentPrice
- `gainLoss`: currentValue - investedAmount
- `gainLossPercentage`: (gainLoss / investedAmount) × 100

## Testing

Run the test suite to verify portfolio functionality:

```bash
node test-portfolio-system.js
```

The test suite will:

1. ✅ Get empty portfolio (verify zero state)
2. ✅ Buy multiple funds
3. ✅ Test average price calculation
4. ✅ Get portfolio with holdings
5. ✅ Get portfolio summary and analytics
6. ✅ Get transaction history
7. ✅ Update portfolio values with latest NAVs
8. ✅ Sell units (partial and full)

## Frontend Integration

### Display Empty Portfolio

```jsx
// When portfolio.totalInvested === 0
<EmptyPortfolio>
  <h2>Start Your Investment Journey</h2>
  <p>Your portfolio is currently empty</p>
  <Button onClick={navigateToFunds}>Explore Funds</Button>
</EmptyPortfolio>
```

### Display Active Portfolio

```jsx
// When portfolio.holdings.length > 0
<Portfolio>
  <Summary>
    <Card>
      <h3>Total Invested</h3>
      <h2>₹{portfolio.totalInvested.toLocaleString()}</h2>
    </Card>
    <Card>
      <h3>Current Value</h3>
      <h2>₹{portfolio.currentValue.toLocaleString()}</h2>
    </Card>
    <Card>
      <h3>Gain/Loss</h3>
      <h2 className={portfolio.totalGainLoss >= 0 ? 'gain' : 'loss'}>
        ₹{portfolio.totalGainLoss.toLocaleString()}({portfolio.totalGainLossPercentage.toFixed(
          2
        )}%)
      </h2>
    </Card>
  </Summary>

  <Holdings>
    {portfolio.holdings.map((holding) => (
      <HoldingCard key={holding.fundId}>
        <h3>{holding.fundName}</h3>
        <p>Units: {holding.units}</p>
        <p>Invested: ₹{holding.investedAmount.toLocaleString()}</p>
        <p>Current: ₹{holding.currentValue.toLocaleString()}</p>
        <p className={holding.gainLoss >= 0 ? 'gain' : 'loss'}>
          {holding.gainLossPercentage.toFixed(2)}%
        </p>
      </HoldingCard>
    ))}
  </Holdings>
</Portfolio>
```

### Add Transaction

```jsx
const handleBuyFund = async (fundId, units, price) => {
  const response = await fetch(`/api/portfolio/${userId}/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'buy',
      fundId,
      units,
      price,
      date: new Date(),
    }),
  });

  const result = await response.json();

  if (result.success) {
    // Update portfolio state
    setPortfolio(result.data.portfolio);
    toast.success('Purchase successful!');
  }
};
```

## News System Configuration

The news system now supports dual configuration:

### Testing Mode (8 Articles)

- Used for: Manual refresh, initial testing
- Endpoint: `POST /api/news/refresh`
- Count: 8 articles

### Production Mode (20 Articles)

- Used for: Scheduled daily fetches (6 AM IST)
- Cron job: Daily at 6:00 AM IST
- Count: 20 articles

## Next Steps

1. **Frontend Integration**

   - Build portfolio UI components
   - Add buy/sell transaction forms
   - Show empty state for new users

2. **Real-Time Updates**

   - Set up cron job to update portfolio values daily
   - Integrate with live NAV updates

3. **Advanced Features**

   - Portfolio performance charts
   - Asset allocation visualization
   - SIP (Systematic Investment Plan) support
   - Goal-based investing

4. **Notifications**
   - Email alerts for significant gains/losses
   - Transaction confirmations
   - Portfolio milestone notifications

## Support

For issues or questions:

- Check MongoDB for portfolio data
- Review transaction history for audit trail
- Test with `test-portfolio-system.js`
- Ensure backend is running on port 3002
