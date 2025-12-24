# Design System Guide - Mutual Fund Analyzer

## Color Palette

### Primary Gradient

**Blue → Purple → Pink**

```css
bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600
```

- Used in: Hero sections, CTAs, highlights
- Represents: Innovation, Trust, Premium

### Background Gradients

**Light Mode:**

```css
bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
```

**Dark Mode:**

```css
dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
```

### Accent Colors

- **Yellow**: `text-yellow-300` - Highlights, badges, special features
- **Orange**: `via-orange-300` - Gradient accents
- **Pink**: `to-pink-300` - Gradient endings
- **Green**: `text-green-500` - Positive returns
- **Red**: `text-red-500` - Negative returns

### Chart Colors

```javascript
const SECTOR_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
];
```

## Typography

### Headings

- **Hero (H1)**: `text-5xl sm:text-6xl lg:text-7xl font-extrabold`
- **Section Title (H2)**: `text-3xl sm:text-4xl font-bold`
- **Card Title (H3)**: `text-xl font-semibold`

### Body Text

- **Primary**: `text-base text-gray-700 dark:text-gray-300`
- **Secondary**: `text-sm text-gray-600 dark:text-gray-400`
- **Muted**: `text-muted-foreground`

## Icons System

### Primary Icons (Lucide React)

- **Calculator**: Investment calculators, computation
- **TrendingUp**: Positive performance, growth
- **TrendingDown**: Negative performance, decline
- **Sparkles**: AI features, premium features
- **BarChart3**: Analytics, statistics
- **PieChart**: Diversification, allocation
- **Shield**: Safety, risk assessment
- **Target**: Goals, objectives
- **Briefcase**: Portfolio, investments
- **ArrowUpRight/ArrowDownRight**: Performance indicators

### Icon Sizes

- Small: `w-4 h-4`
- Medium: `w-5 h-5` or `w-6 h-6`
- Large: `w-8 h-8`

## Component Styling

### Cards

```tsx
<Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
  <CardHeader>
    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Buttons

**Primary CTA:**

```tsx
<Button
  size="lg"
  className="gap-3 shadow-2xl hover:shadow-3xl transition-all text-lg px-10 py-7 bg-white text-purple-600 hover:bg-gray-50 hover:scale-105 transform"
>
  <Icon className="w-6 h-6" />
  <span className="font-bold">Button Text</span>
  <ArrowRight className="w-5 h-5" />
</Button>
```

**Secondary:**

```tsx
<Button
  variant="outline"
  className="gap-3 shadow-xl transition-all text-lg px-10 py-7 bg-white/10 text-white border-2 border-white/40 hover:bg-white/20 backdrop-blur-md hover:scale-105 transform"
>
  <Icon className="w-6 h-6" />
  <span className="font-semibold">Button Text</span>
</Button>
```

### Badges

```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
  <Sparkles className="w-4 h-4 text-yellow-300" />
  <span className="text-sm font-semibold text-white">Badge Text</span>
</div>
```

## Animations

### Custom Animations

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes market-flow {
  0% {
    transform: translateX(-100px) translateY(0px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100vw) translateY(-50px);
    opacity: 0;
  }
}
```

### Usage

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  ...
</motion.div>
```

## Page Layouts

### Standard Page Structure

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <Header />

  {/* Sticky Market Indices */}
  <div className="sticky top-16 z-50">
    <MarketIndices />
  </div>

  {/* Hero Section */}
  <section className="relative overflow-hidden py-20 px-4">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
    <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>
    <div className="mx-auto max-w-7xl relative z-10">...</div>
  </section>

  {/* Content Sections */}
  <main className="mx-auto max-w-7xl px-4 py-12">...</main>

  <Footer />
</div>
```

## Glassmorphism Effects

### Backdrop Blur

```css
backdrop-blur-md /* Medium blur */
backdrop-blur-lg /* Large blur */
```

### Semi-transparent Backgrounds

```css
bg-white/10  /* 10% opacity white */
bg-white/20  /* 20% opacity white */
bg-black/50  /* 50% opacity black */
```

### Borders

```css
border border-white/30
border-2 border-white/40
```

## Responsive Design

### Breakpoints

- **Mobile**: Default
- **Tablet**: `sm:` (640px)
- **Desktop**: `md:` (768px), `lg:` (1024px)
- **Large Desktop**: `xl:` (1280px), `2xl:` (1536px)

### Common Patterns

```tsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl">...</h1>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">...</div>
<div className="flex flex-col md:flex-row gap-4">...</div>
```

## State Indicators

### Positive/Growth

```tsx
<div className="text-green-500 flex items-center gap-1">
  <TrendingUp className="w-4 h-4" />
  <span>+12.5%</span>
</div>
```

### Negative/Decline

```tsx
<div className="text-red-500 flex items-center gap-1">
  <TrendingDown className="w-4 h-4" />
  <span>-5.2%</span>
</div>
```

### Neutral/Info

```tsx
<div className="text-blue-500 flex items-center gap-1">
  <Info className="w-4 h-4" />
  <span>Information</span>
</div>
```

## Best Practices

1. **Consistency**: Always use the same gradient direction (br = bottom-right)
2. **Contrast**: Ensure text is readable on all backgrounds
3. **Hover States**: Add `hover:scale-105 transform transition-all` for interactive elements
4. **Loading States**: Use spinner with primary gradient colors
5. **Error States**: Red color scheme with AlertTriangle icon
6. **Success States**: Green color scheme with CheckCircle icon
7. **Shadows**: Use `shadow-lg` for cards, `shadow-2xl` for CTAs
8. **Spacing**: Use consistent padding/margin (4, 6, 8, 12, 16, 20)

## Files Using This Design System

### Homepage & Navigation

- `app/page.tsx` ✅
- `components/header.tsx` ✅
- `components/market-indices.tsx` ✅

### Fund Pages

- `app/funds/[id]/page.tsx` ✅
- `app/search/page.tsx` ✅
- `components/fund-list.tsx` ✅

### Tools

- `app/compare/page.tsx` ✅
- `app/overlap/page.tsx` ✅
- `app/portfolio/page.tsx` ✅
- `app/calculators/page.tsx` ✅

### Other Pages

- `app/chat/page.tsx` ✅
- `app/news/page.tsx` ✅
- `app/goal-planning/page.tsx` ✅
- `app/alerts/page.tsx` ✅

---

**Last Updated**: December 19, 2025
**Status**: ✅ UNIFORMLY APPLIED ACROSS ALL PAGES
