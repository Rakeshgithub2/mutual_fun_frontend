# 🤖 AI Chatbot Setup Guide

## Dynamic AI System

Your chatbot now supports **TWO modes**:

### 1. 🚀 **Google Gemini AI** (Recommended - FREE)

- Handles ANY question dynamically
- Understands context and conversation history
- Provides detailed, personalized responses
- Covers technical analysis, portfolio strategies, tax questions, etc.

### 2. 📚 **Enhanced Rule-Based System** (Fallback)

- Works without API key
- Covers 20+ topics including:
  - Large/Mid/Small Cap funds
  - SIP, Lumpsum strategies
  - Sharpe Ratio, Alpha, Beta, Standard Deviation
  - NAV, AUM, Exit Load, Expense Ratio
  - ELSS, Tax saving
  - Direct vs Regular plans
  - Portfolio diversification
  - Index funds
  - And more!

---

## 🎯 Quick Setup (Enable Dynamic AI)

### Step 1: Get FREE Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the API key

### Step 2: Add to Environment

Create/Edit file: `c:\mutual fund\mutual-funds-backend\.env.local`

```env
GEMINI_API_KEY=your-actual-api-key-here
```

### Step 3: Restart Backend Server

```powershell
cd "c:\mutual fund\mutual-funds-backend"
npm run dev
```

You'll see: ✅ Google Gemini AI initialized

---

## 🧪 Testing

### Test Dynamic AI (With API Key):

```powershell
Invoke-RestMethod -Uri "http://localhost:3002/api/ai/chat" -Method POST -ContentType "application/json" -Body '{"query":"Explain P/E ratio in mutual funds"}' | Select-Object -ExpandProperty data | Select-Object -ExpandProperty answer
```

### Test Fallback System (Without API Key):

```powershell
Invoke-RestMethod -Uri "http://localhost:3002/api/ai/chat" -Method POST -ContentType "application/json" -Body '{"query":"what is sharpe ratio"}' | Select-Object -ExpandProperty data | Select-Object -ExpandProperty answer
```

---

## 📊 Supported Topics (Rule-Based Fallback)

Even without Gemini AI, the system handles:

**Fund Categories:**

- Large Cap, Mid Cap, Small Cap
- Equity, Debt, Hybrid
- Index Funds, ELSS

**Performance Metrics:**

- Sharpe Ratio
- Alpha & Beta
- Standard Deviation
- NAV, AUM

**Investment Strategies:**

- SIP vs Lumpsum
- Portfolio Diversification
- Rebalancing
- Asset Allocation

**Financial Concepts:**

- Expense Ratio
- Exit Load
- Direct vs Regular Plans
- Tax implications (LTCG, STCG, 80C)

**Comparison & Analysis:**

- Fund comparison criteria
- Risk assessment
- Return analysis

---

## ✨ Features

### Spelling Correction

Handles typos automatically:

- "expese ratio" → "expense ratio" ✅
- "larg cap" → "large cap" ✅
- "equty fund" → "equity fund" ✅

### Conversation Context

Gemini AI remembers last 4 messages for contextual responses

### Follow-up Questions

Automatically suggests relevant next questions

---

## 🎓 Example Questions That Work

**Basic:**

- What is SIP?
- Explain large cap funds
- What is expense ratio?

**Technical:**

- How to calculate Sharpe ratio?
- What is alpha and beta in mutual funds?
- Explain standard deviation

**Comparative:**

- SIP vs Lumpsum - which is better?
- Direct vs Regular plans difference
- Compare large cap and mid cap funds

**Strategic:**

- How to diversify my portfolio?
- When should I rebalance?
- What is the ideal asset allocation for age 30?

**Tax & Legal:**

- How are LTCG taxed?
- What is ELSS tax benefit?
- Explain Section 80C

---

## 💡 Pro Tips

1. **Use Gemini AI for best results** - It can answer ANY question
2. **Fallback system is comprehensive** - Covers most common topics
3. **Ask follow-up questions** - AI maintains conversation context
4. **Be specific** - Better questions = better answers
5. **Technical questions work** - Ask about Sharpe ratio, P/E, etc.

---

## 🔧 Troubleshooting

**"Using enhanced rule-based system" in logs:**

- No API key configured (that's okay!)
- Or API key invalid
- Fallback system will handle most questions

**Empty responses:**

- Check frontend console (F12) for errors
- Verify backend is running on port 3002
- Check network tab for API call

**API Key not working:**

- Verify key is correct
- Check Google Cloud console for quota
- Restart backend server after adding key

---

## 🚀 Next Steps

1. Get Gemini API key (FREE) for unlimited dynamic responses
2. Test with technical questions
3. Try conversation mode (ask follow-ups)
4. Share feedback for improvements!

---

**Note:** Both systems work great! Gemini AI gives you unlimited flexibility, while the rule-based system ensures the chatbot always works even without API keys.
