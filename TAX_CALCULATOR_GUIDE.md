# 📊 Tax Calculator Guide - LTCG & STCG Calculator

## Overview

A comprehensive tax calculator for calculating Long Term Capital Gains (LTCG) and Short Term Capital Gains (STCG) tax on mutual fund investments in India.

## Features

### 1. **Dual Tax Calculation**

- **LTCG (Long Term Capital Gains)**: For investments held beyond threshold period
- **STCG (Short Term Capital Gains)**: For investments held below threshold period

### 2. **Fund Type Support**

- **Equity Funds**: >65% equity allocation
  - LTCG: ≥12 months, 12.5% tax above ₹1,25,000 exemption
  - STCG: <12 months, 20% flat rate
- **Debt Funds**: >65% debt allocation
  - LTCG: ≥36 months, 12.5% without indexation OR 20% with indexation
  - STCG: <36 months, As per income tax slab
- **Hybrid Funds**: Mixed allocation
  - Treated as equity if equity component >65%

### 3. **Complete Tax Breakdown**

- Capital Gains Tax (as per applicable rate)
- Surcharge (10% if total income > ₹50 lakhs)
- Health & Education Cess (4% on tax + surcharge)
- Total Tax Payable
- Net Proceeds After Tax
- Effective Tax Rate

### 4. **Advanced Features**

#### Indexation Benefit (Debt LTCG)

- Option to choose between:
  - 12.5% tax without indexation
  - 20% tax with indexation benefit
- Calculator assumes ~10% indexation benefit

#### Income Slab Selection (Debt STCG)

- Below ₹2.5 Lakh (0% tax)
- ₹2.5L - ₹5L (5% tax)
- ₹5L - ₹10L (20% tax)
- Above ₹10L (30% tax)

#### Quick Scenarios

- 50% Gain over 2 years
- 50% Gain over 3 years
- 100% Gain over 5 years
- 15% Gain over 6 months

## How to Use

### Step 1: Select Fund Type

Choose between Equity, Debt, or Hybrid fund based on your investment.

### Step 2: Enter Investment Details

- **Investment Amount**: Original amount invested (₹)
- **Redemption Amount**: Amount received on redemption (₹)
- **Holding Period**: Duration of investment in months

### Step 3: Configure Tax Settings

- **For Debt STCG**: Select your income tax slab
- **For Debt LTCG**: Choose indexation benefit option

### Step 4: View Results

The calculator automatically shows:

- Capital gains earned
- Tax breakdown by component
- Net proceeds after tax
- Effective tax rate

## Tax Rate Reference Table

| Fund Type | Holding Period | Tax Type | Tax Rate    | Special Notes           |
| --------- | -------------- | -------- | ----------- | ----------------------- |
| Equity    | < 12 months    | STCG     | 20%         | Flat rate + cess        |
| Equity    | ≥ 12 months    | LTCG     | 12.5%       | ₹1.25L exemption        |
| Debt      | < 36 months    | STCG     | Slab Rate   | As per income           |
| Debt      | ≥ 36 months    | LTCG     | 12.5% / 20% | With/without indexation |
| Hybrid    | Any            | Both     | As Equity   | If equity > 65%         |

## Important Tax Rules

### Central Government Taxes

1. **Capital Gains Tax**: Primary tax on profits
2. **Surcharge**: 10% on tax if total income > ₹50 lakhs
3. **Health & Education Cess**: 4% on (tax + surcharge)

### State Government Taxes

**Note**: State governments do NOT levy separate capital gains tax on mutual funds. All capital gains tax goes to the Central Government.

### Exemptions

- **Equity LTCG**: First ₹1,25,000 of gains per financial year are tax-free
- **Debt Funds**: No exemption limit

## Example Calculations

### Example 1: Equity Fund LTCG

- **Investment**: ₹1,00,000
- **Redemption**: ₹1,50,000
- **Holding**: 24 months (LTCG)
- **Gains**: ₹50,000

**Tax Calculation**:

- Taxable Gains: ₹50,000 - ₹0 (within exemption limit)
- Capital Gains Tax: ₹0
- Total Tax: ₹0
- **Net Proceeds**: ₹1,50,000

### Example 2: Equity Fund STCG

- **Investment**: ₹1,00,000
- **Redemption**: ₹1,50,000
- **Holding**: 6 months (STCG)
- **Gains**: ₹50,000

**Tax Calculation**:

- Capital Gains Tax: ₹50,000 × 20% = ₹10,000
- Cess: ₹10,000 × 4% = ₹400
- Total Tax: ₹10,400
- **Net Proceeds**: ₹1,39,600

### Example 3: Equity Fund LTCG (Above Exemption)

- **Investment**: ₹10,00,000
- **Redemption**: ₹15,00,000
- **Holding**: 24 months (LTCG)
- **Gains**: ₹5,00,000

**Tax Calculation**:

- Taxable Gains: ₹5,00,000 - ₹1,25,000 = ₹3,75,000
- Capital Gains Tax: ₹3,75,000 × 12.5% = ₹46,875
- Cess: ₹46,875 × 4% = ₹1,875
- Total Tax: ₹48,750
- **Net Proceeds**: ₹14,51,250

### Example 4: Debt Fund LTCG (Without Indexation)

- **Investment**: ₹5,00,000
- **Redemption**: ₹7,00,000
- **Holding**: 40 months (LTCG)
- **Gains**: ₹2,00,000
- **Indexation**: No

**Tax Calculation**:

- Capital Gains Tax: ₹2,00,000 × 12.5% = ₹25,000
- Cess: ₹25,000 × 4% = ₹1,000
- Total Tax: ₹26,000
- **Net Proceeds**: ₹6,74,000

### Example 5: Debt Fund LTCG (With Indexation)

- **Investment**: ₹5,00,000
- **Redemption**: ₹7,00,000
- **Holding**: 40 months (LTCG)
- **Gains**: ₹2,00,000
- **Indexation**: Yes (assume 10% benefit)
- **Indexed Gains**: ₹2,00,000 × 0.9 = ₹1,80,000

**Tax Calculation**:

- Capital Gains Tax: ₹1,80,000 × 20% = ₹36,000
- Cess: ₹36,000 × 4% = ₹1,440
- Total Tax: ₹37,440
- **Net Proceeds**: ₹6,62,560

### Example 6: Debt Fund STCG (20% Slab)

- **Investment**: ₹1,00,000
- **Redemption**: ₹1,30,000
- **Holding**: 18 months (STCG)
- **Gains**: ₹30,000
- **Income Slab**: ₹5L-₹10L (20%)

**Tax Calculation**:

- Capital Gains Tax: ₹30,000 × 20% = ₹6,000
- Cess: ₹6,000 × 4% = ₹240
- Total Tax: ₹6,240
- **Net Proceeds**: ₹1,23,760

## Key Insights

### When to Choose Indexation?

Compare:

- **Without Indexation**: 12.5% on actual gains
- **With Indexation**: 20% on indexed gains (reduced by ~10%)

**Rule of Thumb**: Choose indexation if inflation benefit > 37.5%

### Tax Optimization Strategies

1. **Hold Equity for >12 months**: Get 12.5% rate + ₹1.25L exemption
2. **Hold Debt for >36 months**: Qualify for LTCG rates
3. **Utilize ₹1.25L Exemption**: Plan equity redemptions annually
4. **Stagger Withdrawals**: Spread across financial years

### Common Mistakes to Avoid

❌ Selling equity before 12 months (20% STCG vs 12.5% LTCG)
❌ Not considering indexation benefit for debt LTCG
❌ Forgetting cess on top of tax
❌ Exceeding ₹1.25L equity LTCG in one year

## Access the Calculator

Navigate to `/calculators/tax` in the application to use the interactive calculator.

## Technical Notes

- All calculations comply with current Income Tax Act provisions
- Surcharge applicable only if total income > ₹50 lakhs
- Health & Education Cess is 4% (updated rate)
- State governments do not levy separate capital gains tax
- Tax rates subject to change per Union Budget

---

**Disclaimer**: This calculator is for informational purposes only. Consult a tax professional for personalized advice.
