# Overlap Page - Quick Reference Guide

## 🚀 How to Use

### Step 1: Access the Page

Navigate to: **http://localhost:5001/overlap**

### Step 2: Select Funds (2-5 funds)

- Click on any fund from the available list
- Selected funds appear in the "Selected Funds" section
- Maximum 5 funds can be selected
- Minimum 2 funds required for analysis

### Step 3: Analyze Overlap

Click the **"Analyze Overlap (X Funds)"** button

- System fetches real data from backend API
- Calculates overlaps based on actual holdings
- Analysis takes 1-3 seconds

### Step 4: Review Results

The page displays:

#### 📊 Summary Cards

- **Funds Analyzed:** Number of funds in analysis
- **Avg Overlap:** Percentage of common holdings
- **Common Stocks:** Number of overlapping companies
- **Diversification:** Quality rating (Excellent/Good/Poor)
- **Unique Holdings:** Non-overlapping percentage

#### 📈 Common Holdings

- List of companies present in 2+ funds
- Company name, ticker, and sector
- Investment percentage per fund
- Average weight across funds
- Visual progress bars

Example:

```
Reliance Industries Ltd (RELIANCE - Energy)
├─ SBI Large Cap Fund: 8.50%
├─ HDFC Top 100 Fund: 7.20%
└─ Average: 7.85% across 2 funds
```

#### 🎯 Sector Overlap

- Sectors with investments across multiple funds
- Allocation percentage per fund
- Average sector exposure
- Visual representation

Example:

```
Financial Services
├─ Fund A: 32.5%
├─ Fund B: 28.3%
└─ Avg: 30.4%
```

#### 🔍 Fund Similarities

Three types of similarities that affect diversification:

1. **Same Fund Manager** (⚠️ Warning)

   - Funds managed by the same person
   - May have similar investment styles

2. **Similar Risk Levels** (⚠️ Warning)

   - Funds with same risk category
   - Affects portfolio risk concentration

3. **Same Fund Category** (ℹ️ Info)
   - Funds in same category (Large Cap, Mid Cap, etc.)
   - Tend to invest in similar stocks

#### 💼 Comprehensive Fund Details

For each selected fund:

- **Performance:** 1Y, 3Y, 5Y returns
- **Risk Metrics:** Volatility, Sharpe Ratio, Alpha, Beta
- **Investment Terms:** Expense ratio, min investment, exit load
- **Fund Info:** AUM, fund manager, rating
- **Suitability Assessment:** Investment recommendation

#### 🏆 Best in Class

Automatic identification of:

- Highest 5Y returns
- Lowest expense ratio
- Highest rating

#### 📋 Export Report

Click **"Copy Detailed Report"** to copy comprehensive analysis including:

- All fund names
- Overlap metrics
- Top common holdings
- Sector overlaps
- Similarities detected
- Recommendations

---

## 📖 Understanding the Metrics

### Overlap Percentage

**What it means:**

- % of holdings that are common across funds
- Calculated from actual fund holdings

**Interpretation:**

- **< 20%:** 🎯 Excellent diversification
- **20-35%:** ✅ Good diversification
- **35-50%:** ⚠️ Moderate overlap
- **> 50%:** 🚨 High concentration risk

### Diversification Score

**Range:** 0-100 (higher is better)

**Calculation:** 100 - Overlap Percentage

**Meaning:**

- **70-100:** Excellent portfolio diversity
- **50-69:** Good diversity
- **< 50:** Poor diversity, consider reducing funds

### Common Holdings Count

**What it shows:**
Number of stocks present in 2 or more funds

**Ideal Range:**

- For 2 funds: < 15 common stocks
- For 3 funds: < 20 common stocks
- For 4-5 funds: < 25 common stocks

---

## 💡 Investment Insights

### Low Overlap (< 20%)

✅ **What to do:**

- Continue with current selection
- Maintain regular rebalancing
- Monitor performance quarterly

### Moderate Overlap (20-40%)

⚠️ **What to consider:**

- Review unique holdings of each fund
- Check if all funds add value
- Consider consolidating to 2-3 funds

### High Overlap (> 40%)

🚨 **Action required:**

- Reduce to 2-3 funds maximum
- Choose funds with different strategies
- Diversify across categories
- Consider index funds + sector funds

---

## 🎯 Best Practices

### Fund Selection

1. **Mix Categories**

   - Large Cap + Mid Cap + Small Cap
   - Or Large Cap + Debt + International

2. **Different Fund Houses**

   - Reduces manager overlap
   - Different research teams

3. **Varied Investment Styles**
   - Growth + Value
   - Active + Passive

### Portfolio Size

- **2 funds:** Ideal for beginners
- **3 funds:** Good balance
- **4-5 funds:** Maximum recommended
- **> 5 funds:** Usually redundant

### Regular Review

- Check overlap **annually**
- Monitor after fund manager changes
- Review if strategy changes

---

## 🔧 Troubleshooting

### "Failed to analyze fund overlap"

**Cause:** Backend server not running or fund data missing

**Solution:**

1. Check backend is running: http://localhost:3002/api/health
2. Verify fund has holdings data
3. Try refreshing the page

### "No common holdings found"

**Cause:** Funds are well-diversified OR data not loaded

**Solution:**

- If funds are from different categories, this is good!
- If unexpected, check backend data

### Analysis takes too long

**Cause:** Large number of funds or slow API

**Solution:**

- Wait a few more seconds
- Reduce number of funds
- Check network connection

### Holdings show 0%

**Cause:** Backend data incomplete

**Solution:**

- Ensure backend has populated holdings with percentages
- Check API response format

---

## 📚 Examples

### Example 1: Excellent Diversification

```
Funds Selected:
1. SBI Large Cap Fund (Large Cap)
2. HDFC Mid Cap Opportunities (Mid Cap)
3. ICICI Prudential Debt Fund (Debt)

Results:
- Overlap: 12%
- Common Holdings: 8 stocks
- Diversification Score: 88/100
- Rating: Excellent ✅

Recommendation: Continue with this selection
```

### Example 2: High Overlap Warning

```
Funds Selected:
1. SBI Large Cap Fund (Large Cap)
2. HDFC Top 100 Fund (Large Cap)
3. ICICI Bluechip Fund (Large Cap)

Results:
- Overlap: 62%
- Common Holdings: 43 stocks
- Diversification Score: 38/100
- Rating: Poor 🚨

Recommendation: Reduce to 1-2 large cap funds
```

---

## 🌟 Pro Tips

1. **Start with 2 funds**

   - Easy to analyze
   - Good starting point
   - Add more only if needed

2. **Use overlap tool before investing**

   - Check before adding new fund
   - Ensure it adds value

3. **Compare with benchmark**

   - Check if overlap is with Nifty 50
   - Consider index fund if too much overlap

4. **Document your decisions**

   - Use "Copy Report" feature
   - Keep for annual review
   - Track changes over time

5. **Focus on quality over quantity**
   - 2-3 quality funds > 5-6 overlapping funds
   - Lower expenses
   - Easier to manage

---

## 📞 Need Help?

### Common Questions

**Q: How many funds should I select?**
A: Start with 2-3 funds. More than 5 is usually redundant.

**Q: Is 30% overlap too much?**
A: 30% is moderate. Check if unique holdings justify having all funds.

**Q: What if I have same fund manager?**
A: Not necessarily bad, but be aware they may have similar stock picks.

**Q: Should I avoid all overlap?**
A: No. Some overlap is normal. Focus on keeping it below 35%.

---

## 🎓 Learn More

### Understanding Holdings

- **Top Holdings:** Usually top 10-15 stocks
- **Weight:** % of fund's portfolio
- **Sector:** Industry classification

### Portfolio Construction

- **Diversification:** Spreading risk
- **Concentration:** Focus on few investments
- **Rebalancing:** Adjusting allocation

### Fund Categories

- **Large Cap:** Top 100 companies
- **Mid Cap:** 101-250 companies
- **Small Cap:** Below 250
- **Multi Cap:** Mix of all
- **Sectoral:** Specific sector

---

_Last Updated: ${new Date().toLocaleString()}_
_Page: http://localhost:5001/overlap_
