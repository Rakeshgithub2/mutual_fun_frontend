# MutualFunds.in - India's Mutual Funds & ETFs Portal

A beautiful, responsive, and user-friendly frontend portal for exploring, comparing, and managing mutual funds and ETFs in India.

## Features

✨ **Core Features**
- 📊 Browse Stock Mutual Funds, Commodity Funds & ETFs
- ⭐ Personal Watchlist with localStorage persistence
- 🔍 Global search and filtering capabilities
- 📈 5-year performance charts and analytics
- 🌙 Light/Dark mode with theme persistence
- 🌐 Multi-language support (English, Hindi, Kannada)
- 📱 Fully responsive design (mobile, tablet, desktop)
- ♿ Accessibility-first approach with ARIA attributes

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion (ready for integration)
- **Charts**: Recharts (ready for integration)
- **i18n**: Custom i18n system (EN/HI/KN)
- **State Management**: React Hooks + localStorage

## Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone <repo-url>
cd mutual-funds-portal

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
\`\`\`

### Project Structure

\`\`\`
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── globals.css          # Design system & Tailwind config
│   ├── page.tsx             # Homepage with 3-tab interface
│   └── funds/
│       └── [id]/
│           └── page.tsx     # Fund detail page
├── components/
│   ├── header.tsx           # Header with auth & theme toggle
│   ├── fund-card.tsx        # Individual fund card component
│   └── fund-list.tsx        # Fund list with filters & sorting
├── lib/
│   ├── i18n.ts              # i18n translations (EN/HI/KN)
│   └── hooks/
│       ├── use-language.ts  # Language preference hook
│       ├── use-theme.ts     # Dark/light mode hook
│       └── use-watchlist.ts # Watchlist management hook
├── data/
│   └── mock-funds.json      # Mock fund data (9+ funds)
└── README.md
\`\`\`

## Mock Data

The app includes 9+ mock funds with:
- 5-year historical returns
- Fund holdings and sector allocation
- Fund manager information
- NAV, AUM, expense ratio, and ratings

Located in `/data/mock-funds.json`

## Environment Variables (For Future API Integration)

Create a `.env.local` file with these placeholders:

\`\`\`env
# Market Data API (e.g., Yahoo Finance, AMFI)
NEXT_PUBLIC_MARKET_API_KEY=your_api_key_here
NEXT_PUBLIC_MARKET_API_URL=https://api.example.com

# News API (e.g., newsdata.io)
NEXT_PUBLIC_NEWS_API_KEY=your_api_key_here

# Email Service (e.g., Resend)
NEXT_PUBLIC_EMAIL_SERVICE_KEY=your_api_key_here

# Google OAuth (for Sign In with Google)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
\`\`\`

## How to Integrate Real APIs

### 1. Market Data (Fund Prices & Returns)

Replace mock data in `lib/hooks/use-watchlist.ts`:

\`\`\`typescript
// Before: Using mock data from /data/mock-funds.json
// After: Fetch from real API
const response = await fetch(`${process.env.NEXT_PUBLIC_MARKET_API_URL}/funds`, {
  headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MARKET_API_KEY}` }
})
const funds = await response.json()
\`\`\`

### 2. News & Updates

Create `lib/services/news-service.ts`:

\`\`\`typescript
export async function fetchFundNews(fundId: string) {
  const response = await fetch(
    `https://newsdata.io/api/1/news?q=${fundId}&apikey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
  )
  return response.json()
}
\`\`\`

### 3. Authentication (Google Sign-In)

Update `components/header.tsx`:

\`\`\`typescript
// Integrate with Google OAuth library
import { GoogleLogin } from '@react-oauth/google'

// Replace placeholder with real implementation
\`\`\`

### 4. Alerts & Notifications

Create `lib/services/alert-service.ts`:

\`\`\`typescript
export async function createPriceAlert(fundId: string, targetPrice: number) {
  const response = await fetch('/api/alerts', {
    method: 'POST',
    body: JSON.stringify({ fundId, targetPrice })
  })
  return response.json()
}
\`\`\`

## Design System

### Color Palette

**Light Mode:**
- Primary: Deep Indigo (#1e3a8a)
- Accent: Saffron Orange (#f97316)
- Success: Teal Green (#10b981)
- Danger: Red (#ef4444)
- Neutral: Greys & Whites

**Dark Mode:**
- Automatically inverted with proper contrast

### Typography

- **Headings**: Geist (sans-serif)
- **Body**: Geist (sans-serif)
- **Monospace**: Geist Mono

### Spacing & Sizing

- Uses Tailwind's standard spacing scale
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)
- Border radius: 0.5rem (8px)

## Features Roadmap

- [ ] Fund comparison tool (side-by-side metrics)
- [ ] Advanced search with filters
- [ ] Glossary with inline explainers
- [ ] Price alerts and notifications
- [ ] Portfolio tracking
- [ ] PDF export for fund details
- [ ] User authentication & profiles
- [ ] Personalized recommendations
- [ ] Mobile app (React Native)

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Screen reader friendly
- ✅ Color contrast compliant (WCAG AA)
- ✅ Semantic HTML structure

## Performance

- 📦 Optimized bundle size
- 🚀 Lazy loading for images
- 💾 localStorage caching
- 🎯 Responsive images
- ⚡ CSS-in-JS optimization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for Indian investors**
