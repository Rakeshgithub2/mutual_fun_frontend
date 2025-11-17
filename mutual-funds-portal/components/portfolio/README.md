# Portfolio Components - Quick Reference

## 📦 Components Overview

### Import All Components

```typescript
import {
  PortfolioOverviewCard,
  AllocationChart,
  HoldingCard,
  PortfolioInsights,
  PerformanceTimeline,
} from "@/components/portfolio";
```

---

## 1. PortfolioOverviewCard

**Purpose**: Display key portfolio metrics in animated cards

**Props**:

```typescript
interface PortfolioOverviewCardProps {
  title: string; // Card title
  value: string; // Main value to display
  subtitle: string; // Supporting text
  icon: LucideIcon; // Icon component
  trend?: "up" | "down" | "neutral"; // Optional trend indicator
  delay?: number; // Animation delay
  badge?: string; // Optional badge text
}
```

**Example**:

```tsx
<PortfolioOverviewCard
  title="Total Portfolio Value"
  value="₹1,25,000"
  subtitle="Live NAV values"
  icon={DollarSign}
  trend="up"
  delay={0.1}
  badge="LIVE"
/>
```

---

## 2. AllocationChart

**Purpose**: Display portfolio allocation as donut chart with diversification score

**Props**:

```typescript
interface AllocationChartProps {
  data: AllocationItem[]; // Array of allocation data
  totalValue: number; // Total portfolio value
}

interface AllocationItem {
  category: string; // Fund category name
  value: number; // Value/percentage
  amount: number; // Absolute amount
  color?: string; // Optional custom color
}
```

**Example**:

```tsx
<AllocationChart
  data={[
    { category: "EQUITY", value: 45, amount: 56250 },
    { category: "DEBT", value: 30, amount: 37500 },
    { category: "HYBRID", value: 25, amount: 31250 },
  ]}
  totalValue={125000}
/>
```

**Features**:

- Animated donut chart
- Color-coded categories
- Progress bars
- Diversification score (0-100%)
- Smart recommendations

---

## 3. HoldingCard

**Purpose**: Display individual fund holdings with actions

**Props**:

```typescript
interface HoldingCardProps {
  holding: {
    id: string; // Fund ID
    name: string; // Fund name
    category: string; // Fund category
    invested: number; // Amount invested
    current: number; // Current value
    returns: number; // Absolute returns
    returnsPercent: number; // Return percentage
    units: number; // Units held
    nav: number; // Current NAV
  };
  index: number; // For animation delay
  onRedeem?: () => void; // Optional redeem handler
}
```

**Example**:

```tsx
<HoldingCard
  holding={{
    id: "fund-123",
    name: "HDFC Top 100 Fund",
    category: "EQUITY",
    invested: 50000,
    current: 58500,
    returns: 8500,
    returnsPercent: 17,
    units: 125.5,
    nav: 466.13,
  }}
  index={0}
/>
```

**Features**:

- Visual performance indicators
- Progress bars
- Quick action buttons
- Hover effects
- Click to view details

---

## 4. PortfolioInsights

**Purpose**: Display AI-powered insights and recommendations

**Props**:

```typescript
interface PortfolioInsightsProps {
  totalReturnsPercent: number; // Overall return percentage
  allocation: any[]; // Allocation data
  holdingsCount: number; // Number of holdings
  totalValue: number; // Total portfolio value
}
```

**Example**:

```tsx
<PortfolioInsights
  totalReturnsPercent={15.5}
  allocation={allocationData}
  holdingsCount={6}
  totalValue={125000}
/>
```

**Insight Types**:

1. **Performance Insights**: Achievement, success, info, warning
2. **Diversification Alerts**: Concentration risks
3. **Portfolio Size**: Growth stages and milestones
4. **Tax Optimization**: ELSS recommendations
5. **Fund Count**: Optimal holdings advice

---

## 5. PerformanceTimeline

**Purpose**: Display portfolio performance over time

**Props**:

```typescript
interface PerformanceTimelineProps {
  totalValue: number; // Current total value
  totalInvested: number; // Total invested amount
}
```

**Example**:

```tsx
<PerformanceTimeline totalValue={125000} totalInvested={100000} />
```

**Features**:

- Interactive line chart
- Multiple timeframes (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
- Animated path drawing
- Gradient fill
- Key metrics display

---

## 🎨 Styling

All components use Tailwind CSS and follow the design system:

### Colors

- Primary: Blue
- Success: Green (returns)
- Danger: Red (losses)
- Muted: Gray (secondary info)
- Warning: Yellow (alerts)

### Animations

- Smooth entrance animations (Framer Motion)
- Hover effects on interactive elements
- Progress bar animations
- Chart path drawing

### Responsive

- Mobile-first design
- Breakpoints: sm, md, lg, xl
- Touch-friendly on mobile

---

## 🔧 Usage in Portfolio Page

```tsx
import {
  PortfolioOverviewCard,
  AllocationChart,
  HoldingCard,
  PortfolioInsights,
  PerformanceTimeline,
} from "@/components/portfolio";

export default function PortfolioPage() {
  // Fetch portfolio data
  const [portfolioData, setPortfolioData] = useState<any>(null);

  return (
    <div>
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <PortfolioOverviewCard {...props} />
        {/* More cards */}
      </div>

      {/* Performance Timeline */}
      <PerformanceTimeline
        totalValue={portfolioData.totalValue}
        totalInvested={portfolioData.totalInvested}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Allocation */}
        <AllocationChart
          data={portfolioData.allocation}
          totalValue={portfolioData.totalValue}
        />

        {/* Insights */}
        <PortfolioInsights
          totalReturnsPercent={portfolioData.totalReturnsPercent}
          allocation={portfolioData.allocation}
          holdingsCount={portfolioData.holdings.length}
          totalValue={portfolioData.totalValue}
        />
      </div>

      {/* Holdings */}
      {portfolioData.holdings.map((holding, index) => (
        <HoldingCard key={holding.id} holding={holding} index={index} />
      ))}
    </div>
  );
}
```

---

## 📊 Data Format Expected

### Portfolio Summary

```typescript
{
  totalValue: number,
  totalInvested: number,
  totalReturns: number,
  totalReturnsPercent: number,
  allocation: [
    {
      category: string,
      value: number,
      amount: number
    }
  ],
  holdings: [
    {
      id: string,
      fundId: string,
      fundName: string,
      category: string,
      units: number,
      nav: number,
      invested: number,
      current: number,
      returns: number,
      returnsPercent: number
    }
  ]
}
```

---

## 🎯 Best Practices

1. **Loading States**: Show skeleton or spinner while fetching data
2. **Error Handling**: Display friendly error messages
3. **Empty States**: Guide users when no data exists
4. **Refresh**: Allow manual data refresh
5. **Navigation**: Make fund names clickable
6. **Actions**: Provide quick action buttons
7. **Responsive**: Test on all screen sizes

---

## 🐛 Troubleshooting

### Components not rendering

- Check if all props are provided
- Verify data format matches expected interface
- Ensure Framer Motion is installed

### Animations not working

- Check Framer Motion installation
- Verify AnimatePresence wrapper if needed

### Charts not displaying

- Validate data arrays are not empty
- Check totalValue is greater than 0
- Ensure SVG viewBox is correct

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Building! 🚀**
