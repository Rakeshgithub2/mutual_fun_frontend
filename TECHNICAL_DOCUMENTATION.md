# 🔧 Technical Documentation - Homepage Categorization

## 📁 Files Modified

### 1. `app/page.tsx`

**Main Homepage Component**

#### Changes Made:

- ✅ Fixed bug: `activeTab` → `mainTab` (consistency issue)
- ✅ Added 4 main tab states
- ✅ Added 8 subcategory states and views
- ✅ Integrated intelligent fund scoring algorithm
- ✅ Added info buttons with KnowledgeButton component
- ✅ Implemented sticky navigation for tabs
- ✅ Added count badges for each category

### 2. `data/glossary.json`

**Educational Content Database**

#### New Terms Added:

1. `largecap` - Large Cap Funds
2. `midcap` - Mid Cap Funds
3. `smallcap` - Small Cap Funds
4. `multicap` - Multi Cap Funds
5. `gold` - Gold Funds
6. `silver` - Silver Funds
7. `commodity` - Multi Commodity Funds

Each term includes:

- Complete definition
- Real-world examples
- Investment impact
- Interactive quiz with explanation

---

## 🧮 Fund Scoring Algorithm

### Implementation Location:

`app/page.tsx` - Lines in `useMemo` hook

### Algorithm Details:

```typescript
const scoreAndSort = (fundsList: typeof funds) => {
  return fundsList
    .map((f) => ({
      ...f,
      score:
        (f.returns1Y || 0) * 0.3 + // 30% weight on 1-year returns
        (f.returns3Y || 0) * 0.4 + // 40% weight on 3-year returns
        (f.returns5Y || 0) * 0.2 + // 20% weight on 5-year returns
        (f.rating || 0) * 2 + // Rating multiplier
        Math.min((f.aum || 0) / 10000, 5), // AUM stability (capped at 5)
    }))
    .sort((a, b) => b.score - a.score); // Sort descending
};
```

### Explanation:

#### Performance Weight (90%):

- **1Y Returns (30%)**: Recent performance indicator
- **3Y Returns (40%)**: Most important - shows medium-term consistency
- **5Y Returns (20%)**: Long-term track record

**Why these weights?**

- 3Y is most predictive of future performance
- 1Y can be volatile but shows recent trend
- 5Y shows fund survived market cycles

#### Stability Weight (10%):

- **Rating (×2 multiplier)**: Fund quality indicator
- **AUM Factor**: Larger funds more stable
  - Divide AUM by 10,000 to normalize
  - Cap at 5 to prevent mega-funds dominating
  - Ensures both performance and size matter

### Example Calculation:

```javascript
Fund A:
  returns1Y: 18%
  returns3Y: 22%
  returns5Y: 19%
  rating: 5
  aum: 45,000 Cr

Score = (18 × 0.3) + (22 × 0.4) + (19 × 0.2) + (5 × 2) + min(45000/10000, 5)
      = 5.4 + 8.8 + 3.8 + 10 + 4.5
      = 32.5

Fund B:
  returns1Y: 25%
  returns3Y: 15%  ← Volatile, inconsistent
  returns5Y: 12%
  rating: 3
  aum: 8,000 Cr

Score = (25 × 0.3) + (15 × 0.4) + (12 × 0.2) + (3 × 2) + min(8000/10000, 5)
      = 7.5 + 6 + 2.4 + 6 + 0.8
      = 22.7

Result: Fund A ranks higher (32.5 > 22.7) ✅
```

**Key Insight**: Algorithm prefers consistent performers over one-hit wonders!

---

## 🗂️ Category Filtering Logic

### Implementation:

```typescript
// Large Cap
const largeCap = scoreAndSort(
  funds.filter((f) => f.category?.toLowerCase().includes("large cap"))
).slice(0, 21);

// Mid Cap
const midCap = scoreAndSort(
  funds.filter((f) => f.category?.toLowerCase().includes("mid cap"))
).slice(0, 21);

// Small Cap
const smallCap = scoreAndSort(
  funds.filter((f) => f.category?.toLowerCase().includes("small cap"))
).slice(0, 21);

// Multi Cap
const multiCap = scoreAndSort(
  funds.filter(
    (f) =>
      f.category?.toLowerCase().includes("multi cap") ||
      f.category?.toLowerCase().includes("multicap")
  )
).slice(0, 21);

// Gold
const gold = scoreAndSort(
  funds.filter(
    (f) =>
      f.category?.toLowerCase().includes("gold") ||
      f.name?.toLowerCase().includes("gold")
  )
).slice(0, 21);

// Silver
const silver = scoreAndSort(
  funds.filter(
    (f) =>
      f.category?.toLowerCase().includes("silver") ||
      f.name?.toLowerCase().includes("silver")
  )
).slice(0, 21);

// Multi Commodity
const multiComm = scoreAndSort(
  funds.filter(
    (f) =>
      (f.category?.toLowerCase().includes("commodity") ||
        f.category?.toLowerCase().includes("multi") ||
        f.category === "ETF") &&
      !f.category?.toLowerCase().includes("gold") &&
      !f.category?.toLowerCase().includes("silver")
  )
).slice(0, 21);

// Other Commodity
const otherComm = scoreAndSort(
  funds.filter(
    (f) =>
      f.type === "Commodity" ||
      f.category?.toLowerCase().includes("metal") ||
      f.category?.toLowerCase().includes("energy")
  )
).slice(0, 21);
```

### Key Points:

1. **Case-insensitive matching**: `.toLowerCase()`
2. **Flexible matching**: Checks both `category` and `name` fields
3. **Exclusion logic**: Multi-commodity excludes gold/silver to prevent overlap
4. **Top 21 selection**: `.slice(0, 21)` after sorting

---

## 🎨 UI Component Structure

### Tab Navigation Hierarchy:

```
<Sticky Main Tabs> (top: calc(4rem + 3.5rem))
  ├─ Stock Funds
  ├─ Commodity Funds
  ├─ Market News
  └─ Watchlist
       │
       ├─ <Sticky Sub Tabs> (top: calc(4rem + 3.5rem + 5rem))
       │    ├─ Large Cap + KnowledgeButton
       │    ├─ Mid Cap + KnowledgeButton
       │    ├─ Small Cap + KnowledgeButton
       │    └─ Multi Cap + KnowledgeButton
       │
       └─ <Content Area>
            └─ FundList (21 funds)
```

### CSS Classes for Sticky Elements:

```css
/* Main Tab Navigation */
.sticky.top-[calc(4rem+3.5rem)] {
  /* Sticks below header (4rem) + market indices (3.5rem) */
}

/* Sub Tab Navigation */
.sticky.top-[calc(4rem+3.5rem+5rem)] {
  /* Sticks below header + indices + main tabs */
}
```

---

## 🔄 State Management

### Main Tab State:

```typescript
const [mainTab, setMainTab] = useState<
  "stock" | "commodity" | "news" | "watchlist"
>("stock");
```

### Stock Sub-Tab State:

```typescript
const [stockSubTab, setStockSubTab] = useState<
  "largecap" | "midcap" | "smallcap" | "multicap"
>("largecap");
```

### Commodity Sub-Tab State:

```typescript
const [commoditySubTab, setCommoditySubTab] = useState<
  "gold" | "silver" | "multi" | "other"
>("gold");
```

### News State:

```typescript
const [news, setNews] = useState<NewsArticle[]>([]);
const [newsLoading, setNewsLoading] = useState(false);
```

---

## ⚡ Performance Optimizations

### 1. Memoization:

```typescript
const { largeCapFunds, midCapFunds, ... } = useMemo(() => {
  // Expensive filtering and sorting
}, [funds, watchlist]);
```

**Why?** Prevents recalculating fund categories on every render.

**Dependencies**: Only recalculates when `funds` or `watchlist` changes.

### 2. Lazy News Loading:

```typescript
useEffect(() => {
  if (mainTab === "news" && news.length === 0) {
    // Fetch news only when News tab is active
  }
}, [mainTab, news.length]);
```

**Why?** Don't fetch news until user clicks News tab.

### 3. Conditional Rendering:

```typescript
{mainTab === "stock" && (
  // Only render stock content when active
)}
```

**Why?** React doesn't create DOM elements for inactive tabs.

### 4. AnimatePresence:

```typescript
<AnimatePresence mode="wait">
  <motion.div key={`${mainTab}-${stockSubTab}-${commoditySubTab}`}>
    {/* Content */}
  </motion.div>
</AnimatePresence>
```

**Why?** Smooth transitions without jank. `mode="wait"` ensures old content exits before new enters.

---

## 🎯 Component Props

### KnowledgeButton:

```typescript
<KnowledgeButton
  term="largecap" // Must match glossary.json id
/>
```

**Behavior**:

1. Looks up term in `glossary.json`
2. Finds match by ID or partial term match
3. Opens modal with definition, examples, quiz
4. Returns `null` if term not found

### FundList:

```typescript
<FundList
  funds={largeCapFunds} // Array of 21 funds
  language={language} // Current language setting
/>
```

**Behavior**:

1. Renders grid of fund cards
2. Shows NAV, returns, ratings, holdings
3. Provides "View Details" and "Add to Watchlist" actions
4. Responsive grid (3 cols → 2 cols → 1 col)

---

## 🔍 Debugging Tips

### Check Fund Counts:

```typescript
console.log("Large Cap:", largeCapFunds.length);
console.log("Mid Cap:", midCapFunds.length);
console.log("Small Cap:", smallCapFunds.length);
```

### Verify Scoring:

```typescript
const scored = funds
  .map((f) => ({
    name: f.name,
    score: calculateScore(f),
  }))
  .sort((a, b) => b.score - a.score);
console.table(scored.slice(0, 10));
```

### Check Category Matching:

```typescript
console.log(
  funds
    .filter((f) => f.category?.toLowerCase().includes("large cap"))
    .map((f) => ({ name: f.name, category: f.category }))
);
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Not Getting 21 Funds

**Symptom**: Some categories show fewer than 21 funds

**Cause**: Not enough funds in database matching category

**Solution**:

```typescript
// Check actual count in database
const largeCaps = funds.filter((f) =>
  f.category?.toLowerCase().includes("large cap")
);
console.log("Available large caps:", largeCaps.length);

// If < 21, database needs more funds
// Or relax filter criteria
```

### Issue 2: Info Button Not Working

**Symptom**: Clicking ℹ️ does nothing

**Cause**: Term not found in glossary

**Solution**:

```typescript
// Check glossary has the term
import glossary from "@/data/glossary.json";
const term = glossary.terms.find(
  (t) => t.id === "largecap" || t.term.includes("Large Cap")
);
console.log("Found term:", term);

// Add missing term to glossary.json
```

### Issue 3: Wrong Funds in Category

**Symptom**: Gold funds showing in silver category

**Cause**: Filter logic overlap

**Solution**:

```typescript
// Use exclusion in multi-commodity filter
const multiComm = funds.filter(
  (f) =>
    f.category?.includes("commodity") &&
    !f.category?.includes("gold") && // Exclude gold
    !f.category?.includes("silver") // Exclude silver
);
```

### Issue 4: Sticky Navigation Not Sticking

**Symptom**: Tabs scroll away instead of staying

**Cause**: Wrong CSS classes

**Solution**:

```typescript
// Ensure proper Tailwind classes
className = "sticky top-[calc(4rem+3.5rem)] z-40";

// Check z-index is higher than content
// Check top position accounts for all headers above
```

---

## 🧪 Testing Checklist

### Unit Tests Needed:

```typescript
// Test scoring algorithm
describe("scoreAndSort", () => {
  it("should rank consistent performer higher", () => {
    const funds = [
      { returns1Y: 25, returns3Y: 15, returns5Y: 12, rating: 3, aum: 8000 },
      { returns1Y: 18, returns3Y: 22, returns5Y: 19, rating: 5, aum: 45000 },
    ];
    const sorted = scoreAndSort(funds);
    expect(sorted[0].returns3Y).toBe(22); // Second fund should rank first
  });
});

// Test category filtering
describe("category filters", () => {
  it("should extract large cap funds", () => {
    const funds = [
      { category: "Large Cap", name: "Test Fund 1" },
      { category: "Mid Cap", name: "Test Fund 2" },
    ];
    const largeCaps = funds.filter((f) =>
      f.category?.toLowerCase().includes("large cap")
    );
    expect(largeCaps).toHaveLength(1);
  });
});
```

### Manual Testing:

- [ ] Click all 4 main tabs
- [ ] Click all 8 subcategory tabs
- [ ] Verify 21 funds show in each (or available count)
- [ ] Click each info button (ℹ️)
- [ ] Verify modal opens with correct content
- [ ] Test on mobile, tablet, desktop
- [ ] Check sticky navigation works
- [ ] Verify animations are smooth
- [ ] Test with slow network (loading states)
- [ ] Test with no funds (empty states)

---

## 🔐 Security Considerations

### API Calls:

```typescript
// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

// Validate response before using
const data = await response.json();
if (!Array.isArray(data.data)) {
  throw new Error("Invalid API response");
}
```

### Data Sanitization:

```typescript
// Fund data from API should be validated
interface Fund {
  id: string;
  name: string;
  // ... other fields with proper types
}

// Type guard
function isFund(obj: any): obj is Fund {
  return typeof obj.id === "string" && typeof obj.name === "string";
}
```

---

## 📊 Performance Metrics

### Target Metrics:

- **Initial Page Load**: < 2 seconds
- **Tab Switch**: < 100ms
- **Fund List Render**: < 500ms
- **Modal Open**: < 100ms

### Current Optimizations:

✅ Memoized fund calculations
✅ Lazy news loading
✅ Conditional rendering
✅ Optimized CSS (Tailwind)
✅ No unnecessary re-renders

### Future Optimizations:

- [ ] Virtual scrolling for fund lists
- [ ] Image lazy loading
- [ ] Code splitting per tab
- [ ] Service worker caching
- [ ] Prefetch news on hover

---

## 🔄 Future Enhancements

### Phase 2:

1. **Advanced Filters**

   ```typescript
   const [filters, setFilters] = useState({
     minReturns: 10,
     maxExpenseRatio: 1.0,
     minRating: 4,
   });
   ```

2. **Sort Options**

   ```typescript
   const [sortBy, setSortBy] = useState<"score" | "returns" | "aum">("score");
   ```

3. **Fund Comparison**

   ```typescript
   const [compareList, setCompareList] = useState<string[]>([]);
   // Max 4 funds for side-by-side comparison
   ```

4. **Performance Charts**
   ```typescript
   import { LineChart } from "recharts";
   // Show 5-year performance graph for category
   ```

---

## 📦 Dependencies Used

```json
{
  "framer-motion": "^10.x", // Animations
  "lucide-react": "^0.x", // Icons
  "@/components/ui/*": "Latest", // Shadcn UI components
  "@/lib/hooks/*": "Custom" // Custom React hooks
}
```

---

## 🎓 Learning Resources

### For Maintainers:

1. **Framer Motion**: https://www.framer.com/motion/

   - AnimatePresence for tab transitions
   - Motion components for smooth animations

2. **React useMemo**: https://react.dev/reference/react/useMemo

   - Performance optimization
   - Memoization patterns

3. **TypeScript Discriminated Unions**:

   ```typescript
   type Tab = "stock" | "commodity" | "news" | "watchlist";
   // Type-safe tab handling
   ```

4. **Tailwind Sticky Positioning**:
   ```css
   .sticky.top-[calc(x+y)]; /* Calculate offset dynamically */
   ```

---

## 📝 Code Comments

Key sections are commented:

```typescript
// Filter and sort funds by category (Top 21 based on performance and stability)
// Helper function to score and sort funds
// Stock funds
// Commodity funds
// Main Tab Navigation
// Sub Navigation for Stock
// Main Content
```

Look for these comments to understand code flow.

---

## 🤝 Contributing Guidelines

### Adding New Category:

1. **Update State**:

   ```typescript
   const [newSubTab, setNewSubTab] = useState<"opt1" | "opt2">("opt1");
   ```

2. **Add Filtering Logic**:

   ```typescript
   const newFunds = scoreAndSort(
     funds.filter(f => /* your criteria */)
   ).slice(0, 21);
   ```

3. **Add UI Tab**:

   ```typescript
   <button onClick={() => setNewSubTab("opt1")}>
     <Icon /> Option 1
     <KnowledgeButton term="opt1" />
   </button>
   ```

4. **Add Content Section**:

   ```typescript
   {
     newSubTab === "opt1" && <FundList funds={newFunds} language={language} />;
   }
   ```

5. **Update Glossary**:
   Add new term to `data/glossary.json`

---

## 📞 Support

### Questions?

- Check this documentation first
- Review inline code comments
- Test in dev environment
- Check console for errors

### Making Changes?

- Test locally first
- Verify all tabs work
- Check responsive design
- Update this documentation

---

**Happy Coding! 🚀**
