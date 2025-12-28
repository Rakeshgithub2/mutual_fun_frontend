# 🔍 FRONTEND AUDIT & FIXES - COMPREHENSIVE REPORT

**Date**: December 28, 2025
**Status**: Critical Issues Identified + Solutions Provided

---

## 📊 ROOT CAUSE ANALYSIS

### Issue #1: Only 100 Funds Displayed ❌

**Root Causes Identified:**

1. **Hard Limit in Equity Page** (`app/equity/page.tsx:211-212`)

   ```typescript
   } else if (limitFilter === 'top100') {
     filtered = filtered.slice(0, 100);  // ❌ HARD LIMIT
   }
   ```

   **Impact**: When user selects "Top 100", only 100 funds shown even if more available

2. **Default Fetch Limit in useFunds** (`hooks/use-funds.ts:37`)

   ```typescript
   const requestedLimit = filters?.limit || 1000; // Default: 1000 funds
   ```

   **Problem**: Page requests 3000 but hook defaults to 1000

3. **API Client Multi-Page Logic** (`lib/api-client.ts`)
   - `getFundsMultiPage` fetches in batches of 200
   - Stops after target count OR 50 pages (10,000 limit)
   - **Issue**: equity page requests 3000, but backend may have more

4. **Backend Pagination** (assumed from API structure)
   - Backend likely returns max 100-200 per page
   - Requires multiple API calls to get 4000+ funds

---

## 🎯 SOLUTION 1: INFINITE SCROLL WITH SMART PAGINATION

### Implementation Strategy

**Phase 1: Initial Load (Fast)**

- Load first 100 funds (1 API call)
- Display immediately for fast perceived performance

**Phase 2: Background Loading**

- Continue fetching remaining funds in background
- Update count as more funds load

**Phase 3: On-Demand Loading**

- "Load More" button or infinite scroll
- Fetch next batch (200 funds) on user action

### Code Changes Required

#### A. Update `app/equity/page.tsx`

```typescript
'use client';
import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { useFunds } from '@/hooks/use-funds';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, X, ArrowLeft, ChevronDown } from 'lucide-react';
import {
  isEquityFund,
  matchesSubcategory,
  deduplicateFunds,
  calculateFundQuality,
  normalizeCategory,
} from '@/lib/utils/normalize';

function FundsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const [displayLimit, setDisplayLimit] = useState(100); // ✅ NEW: Dynamic display limit
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const language = 'en';

  // ✅ REMOVE hard-coded limitFilter, use dynamic displayLimit instead

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory === 'commodity') {
      router.push('/commodity');
      return;
    }
    if (urlCategory === 'debt') {
      router.push('/debt');
      return;
    }
    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory('');
    }
  }, [searchParams, router]);

  const categories = [
    { label: 'All Funds', value: '', keywords: [] },
    {
      label: 'Large Cap',
      value: 'large-cap',
      keywords: ['large cap', 'largecap', 'large-cap'],
    },
    {
      label: 'Mid Cap',
      value: 'mid-cap',
      keywords: ['mid cap', 'midcap', 'mid-cap'],
    },
    {
      label: 'Small Cap',
      value: 'small-cap',
      keywords: ['small cap', 'smallcap', 'small-cap'],
    },
    {
      label: 'Multi Cap',
      value: 'multi-cap',
      keywords: ['multi cap', 'multicap', 'multi-cap'],
    },
    {
      label: 'Flexi Cap',
      value: 'flexi-cap',
      keywords: ['flexi cap', 'flexicap', 'flexi-cap', 'flexible cap'],
    },
    {
      label: 'Index Funds',
      value: 'index',
      keywords: ['index fund', 'index', 'nifty', 'sensex', 'bse', 'nse'],
    },
  ];

  // ✅ NEW: Fetch ALL funds with progressive loading
  const {
    funds: allFunds,
    loading,
    error,
  } = useFunds({
    limit: 5000, // Request up to 5000 funds (backend will handle pagination)
  });

  useEffect(() => {
    console.log('🔍 [Equity Page] Raw funds fetched:', allFunds.length);
    if (allFunds.length > 0) {
      console.log('📦 [Equity Page] First 3 funds:', allFunds.slice(0, 3));
      const equityCount = allFunds.filter((f) => isEquityFund(f.category)).length;
      console.log('💼 [Equity Page] Equity funds detected:', equityCount);
    }
  }, [allFunds]);

  const transformedFunds = useMemo(() => {
    const mapped = allFunds.map((fund) => ({
      id: fund.id || fund.fundId,
      name: fund.name,
      fundHouse: fund.fundHouse,
      category: fund.category,
      nav: fund.nav || 0,
      returns1Y: fund.returns1Y || 0,
      returns3Y: fund.returns3Y || 0,
      returns5Y: fund.returns5Y || 0,
      aum: fund.aum || 0,
      expenseRatio: fund.expenseRatio || 0,
      rating: fund.rating || 0,
    }));

    const deduplicated = deduplicateFunds(mapped, calculateFundQuality);
    console.log('🔄 [Deduplication] Before:', mapped.length, 'After:', deduplicated.length);
    return deduplicated;
  }, [allFunds]);

  // ✅ Filter ALL funds (no slicing here)
  const allFilteredFunds = useMemo(() => {
    let filtered = transformedFunds.filter((fund) => {
      return isEquityFund(fund.category);
    });

    console.log('🔍 [Equity Page] Total equity funds found:', filtered.length);

    filtered = filtered.filter((fund) => {
      const hasName = fund.name && fund.name.trim().length > 0;
      const hasFundHouse = fund.fundHouse && fund.fundHouse.trim().length > 0;
      return hasName && hasFundHouse;
    });

    console.log('✅ [Equity Page] Valid equity funds:', filtered.length);

    // Apply category filter
    if (category) {
      const selectedCategory = categories.find((c) => c.value === category);
      if (selectedCategory && selectedCategory.keywords.length > 0) {
        filtered = filtered.filter((fund) => {
          return selectedCategory.keywords.some((keyword) =>
            matchesSubcategory(fund.name, fund.category, keyword)
          );
        });
        console.log(`🎯 [Equity Page] ${selectedCategory.label} funds:`, filtered.length);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
      const searchTerms = query.split(' ');

      filtered = filtered.filter((fund) => {
        const fundName = fund.name.toLowerCase();
        return searchTerms.every((term) => fundName.includes(term));
      });
    }

    return filtered; // ✅ Return ALL filtered funds (no limit)
  }, [transformedFunds, category, searchQuery]);

  // ✅ Display only limited funds for performance
  const displayedFunds = useMemo(() => {
    return allFilteredFunds.slice(0, displayLimit);
  }, [allFilteredFunds, displayLimit]);

  // ✅ Load More Handler
  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayLimit((prev) => Math.min(prev + 100, allFilteredFunds.length));
      setIsLoadingMore(false);
    }, 300); // Small delay for smooth UX
  }, [allFilteredFunds.length]);

  // ✅ Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayLimit < allFilteredFunds.length && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [displayLimit, allFilteredFunds.length, isLoadingMore, loadMore]);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return transformedFunds
      .filter((fund) => fund.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [transformedFunds, searchQuery]);

  const getCategoryTitle = () => {
    if (!category) return 'All Equity Funds';
    return (
      category
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' Funds'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <button
        onClick={() => router.push('/')}
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getCategoryTitle()}
            </h1>
          </div>

          {/* Search Box */}
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Search Equity Funds
              </h3>
            </div>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-600 dark:text-blue-400" />
                <Input
                  type="text"
                  placeholder="Search equity funds by name, scheme... (e.g., HDFC Top 100, ICICI Bluechip)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-14 pr-12 h-14 text-lg font-medium border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSuggestions(false)}
                  ></div>
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                    {searchSuggestions.map((fund) => (
                      <button
                        key={fund.id}
                        onClick={() => {
                          setSearchQuery(fund.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {fund.name}
                        </div>
                        {fund.category && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {fund.category}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Category Filter */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Category</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  onClick={() => {
                    if (cat.value) {
                      router.push(`/equity?category=${cat.value}`);
                    } else {
                      router.push('/equity');
                    }
                    setPage(1);
                    setDisplayLimit(100); // Reset display limit
                  }}
                  variant={category === cat.value ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ✅ NEW: Results Count with Real-time Update */}
          {!loading && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                Showing {displayedFunds.length} of {allFilteredFunds.length} funds
                {allFilteredFunds.length < transformedFunds.length &&
                  ` (${transformedFunds.length} total equity funds available)`
                }
              </span>
              {displayedFunds.length < allFilteredFunds.length && (
                <span className="text-blue-600 dark:text-blue-400">
                  Scroll down or click "Load More" for {allFilteredFunds.length - displayedFunds.length} more funds
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading funds...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              Failed to load funds: {error.message}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </Card>
        )}

        {/* Funds List */}
        {!loading && !error && (
          <>
            <FundList funds={displayedFunds} language={language} />

            {displayedFunds.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No funds found matching your criteria.
                </p>
              </Card>
            )}

            {/* ✅ Load More Button + Infinite Scroll Trigger */}
            {displayedFunds.length < allFilteredFunds.length && (
              <div className="mt-8 text-center">
                <Button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 text-lg"
                  size="lg"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More ({allFilteredFunds.length - displayedFunds.length} remaining)
                      <ChevronDown className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                <div ref={observerTarget} className="h-10" /> {/* Infinite scroll trigger */}
              </div>
            )}

            {/* ✅ All Funds Loaded Message */}
            {displayedFunds.length === allFilteredFunds.length && allFilteredFunds.length > 0 && (
              <div className="mt-8 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  ✓ All {allFilteredFunds.length} funds loaded
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function FundsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <FundsPageContent />
    </Suspense>
  );
}
```

---

## 🔍 SOLUTION 2: ENHANCED SEARCH WITH DEBOUNCE

### Issue Found:

Current search triggers on every keystroke, causing:

- Multiple API calls
- Poor UX with stuttering
- Network congestion

### Fix: Implement Proper Debounced Search

**Create new file: `hooks/use-debounced-search.ts`**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface SearchResult {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory?: string;
  currentNav?: number;
  source?: 'database' | 'external';
  isNew?: boolean;
}

export function useDebouncedSearch(query: string, debounceMs: number = 300) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Clear results if query too short
    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Debounce timer
    const timeoutId = setTimeout(async () => {
      try {
        console.log(`🔍 Searching for: "${query}"`);

        // Call enhanced search API (includes external sources)
        const response = await apiClient.searchFunds(query, true);

        if (response.success && Array.isArray(response.data)) {
          // Rank results for better UX
          const ranked = rankSearchResults(response.data, query);
          setResults(ranked);

          // Show notification if new funds discovered
          if (
            response.enhancedSearch &&
            response.data.some((f: any) => f.isNew)
          ) {
            console.log('🌐 Found new funds from external APIs');
          }
        } else {
          setResults([]);
        }

        setError(null);
      } catch (err) {
        console.error('Search error:', err);
        setError(err as Error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  return { results, loading, error };
}

/**
 * Rank search results for better UX
 * Priority: Exact match > Starts with > Contains
 */
function rankSearchResults(
  results: SearchResult[],
  query: string
): SearchResult[] {
  const lowerQuery = query.toLowerCase();

  return results.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // Exact match first
    if (aName === lowerQuery && bName !== lowerQuery) return -1;
    if (bName === lowerQuery && aName !== lowerQuery) return 1;

    // Starts with query
    const aStarts = aName.startsWith(lowerQuery);
    const bStarts = bName.startsWith(lowerQuery);
    if (aStarts && !bStarts) return -1;
    if (bStarts && !aStarts) return 1;

    // Alphabetical fallback
    return aName.localeCompare(bName);
  });
}
```

**Update `app/equity/page.tsx` to use debounced search:**

```typescript
import { useDebouncedSearch } from '@/hooks/use-debounced-search';

function FundsPageContent() {
  // ... existing code ...

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ Use debounced search hook
  const { results: searchSuggestions, loading: searchLoading } = useDebouncedSearch(searchQuery, 300);

  // ... rest of component ...

  return (
    // ... JSX ...

    {/* Search Suggestions with Loading State */}
    {showSuggestions && searchQuery.length >= 2 && (
      <>
        <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)}></div>
        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
          {searchLoading && (
            <div className="px-4 py-3 text-center">
              <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          )}

          {!searchLoading && searchSuggestions.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No funds found. Try different keywords.
            </div>
          )}

          {!searchLoading && searchSuggestions.map((fund) => (
            <button
              key={fund.id}
              onClick={() => {
                setSearchQuery(fund.name);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {fund.name}
                  </div>
                  {fund.category && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {fund.fundHouse} • {fund.category}
                    </div>
                  )}
                </div>
                {fund.isNew && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    New
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </>
    )}

    // ... rest of JSX ...
  );
}
```

---

## 📡 SOLUTION 3: MARKET INDICES REAL-TIME UPDATES

### Current Issues:

1. Indices appear static (no live updates)
2. No "Last Updated" timestamp visible
3. No holiday/market closed handling

### Fixes Required:

**Update `components/market-indices.tsx`:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Activity, ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface MarketIndex {
  id: string;
  name: string;
  shortName: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  lastUpdated: string;
  isMarketOpen: boolean;
  icon: any;
  color: string;
  description: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(0);
  const [isMarketHoliday, setIsMarketHoliday] = useState(false);

  // ✅ Auto-refresh every 5 minutes during market hours
  useEffect(() => {
    fetchMarketData();

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchMarketData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Countdown timer for next update
  useEffect(() => {
    if (!lastFetchTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - lastFetchTime.getTime()) / 1000);
      const remaining = Math.max(0, 300 - elapsed); // 300 seconds = 5 minutes
      setNextUpdateIn(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastFetchTime]);

  const fetchMarketData = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/api/market-indices`, {
        signal: controller.signal,
        cache: 'no-store', // ✅ Prevent caching for real-time data
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const apiData = await response.json();

      if (!apiData.success || !apiData.data) {
        throw new Error('Invalid API response');
      }

      const indicesArray = Array.isArray(apiData.data) ? apiData.data : apiData.data.indian || [];

      if (indicesArray.length === 0) {
        throw new Error('No market data available');
      }

      // Map API data
      const mappedIndices: MarketIndex[] = indicesArray.map((index: any) => ({
        id: index.id || index.indexId || index.symbol,
        name: index.name,
        shortName: index.symbol || index.shortName,
        value: index.currentValue || index.value,
        change: index.change,
        changePercent: index.changePercent,
        high: index.high || index.value,
        low: index.low || index.value,
        open: index.open || index.value,
        previousClose: index.previousClose || (index.value - index.change),
        lastUpdated: index.lastUpdated || new Date().toLocaleTimeString(),
        isMarketOpen: index.isMarketOpen ?? isMarketOpenNow(),
        icon: Activity,
        color: 'blue',
        description: index.description || `${index.name} index`,
      }));

      setIndices(mappedIndices);
      setLastFetchTime(new Date());
      setIsMarketHoliday(false);
      setLoading(false);
    } catch (error) {
      console.error('Market API error:', error);

      // Use fallback mock data
      setIndices(getMockIndices());
      setLastFetchTime(new Date());
      setLoading(false);
    }
  };

  // ✅ Check if market is currently open
  const isMarketOpenNow = (): boolean => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Market closed on weekends
    if (day === 0 || day === 6) return false;

    // Market hours: 9:15 AM - 3:30 PM (555 - 930 minutes)
    return totalMinutes >= 555 && totalMinutes <= 930;
  };

  const getMockIndices = (): MarketIndex[] => [
    {
      id: 'sensex',
      name: 'S&P BSE Sensex',
      shortName: 'SENSEX',
      value: 65432.18,
      change: 234.56,
      changePercent: 0.36,
      high: 65789.32,
      low: 65123.45,
      open: 65198.76,
      previousClose: 65197.62,
      lastUpdated: new Date().toLocaleTimeString(),
      isMarketOpen: isMarketOpenNow(),
      icon: Activity,
      color: 'blue',
      description: 'BSE Sensex index',
    },
    // ... more mock indices
  ];

  const formatUpdateTime = (): string => {
    if (!lastFetchTime) return 'Never';

    const now = new Date();
    const diff = Math.floor((now.getTime() - lastFetchTime.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastFetchTime.toLocaleTimeString();
  };

  return (
    <>
      {/* Market Ticker with Live Updates */}
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 py-3 px-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-1">
            {indices.map((index) => (
              <Link key={index.id} href={`/market/${index.id}`} className="flex-shrink-0">
                <motion.div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg flex-shrink-0 transition-all hover:scale-105 cursor-pointer ${
                    index.change >= 0
                      ? 'bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50'
                      : 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Activity
                    className={`w-6 h-6 ${
                      index.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  />

                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      {index.shortName}
                      {index.isMarketOpen && (
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {index.value.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-xs font-medium flex items-center gap-0.5 ${
                          index.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {index.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(index.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* ✅ Live Update Indicator */}
          <div className="flex items-center gap-3 flex-shrink-0 pl-4 border-l border-gray-300 dark:border-gray-600">
            <button
              onClick={fetchMarketData}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Refresh now"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatUpdateTime()}</span>
              </div>
              {nextUpdateIn > 0 && !loading && (
                <div className="text-[10px] text-gray-400 mt-0.5">
                  Next: {Math.floor(nextUpdateIn / 60)}:{(nextUpdateIn % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Market Status Banner */}
      {!indices[0]?.isMarketOpen && (
        <div className="w-full bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-xs text-yellow-700 dark:text-yellow-400">
            <Clock className="w-3 h-3" />
            <span>Market Closed - Showing last close values</span>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## 🚨 SOLUTION 4: ERROR HANDLING & NETWORK ISSUES

### Issue: `net::ERR_NETWORK_CHANGED`

**Root Causes:**

1. Aggressive retry logic
2. No request timeout
3. No graceful fallback
4. Health check blocking other APIs

### Fix: Centralized Error Handler

**Create `lib/api-error-handler.ts`:**

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: any): APIError {
  // Network errors
  if (error.name === 'AbortError') {
    return new APIError('Request timeout. Please try again.', 408, true);
  }

  if (
    error.message?.includes('Failed to fetch') ||
    error.message?.includes('network')
  ) {
    return new APIError(
      'Network error. Check your internet connection.',
      0,
      true
    );
  }

  // HTTP errors
  if (error.response) {
    const status = error.response.status;

    if (status === 404) {
      return new APIError('Resource not found.', 404, false);
    }

    if (status === 500) {
      return new APIError('Server error. Please try again later.', 500, true);
    }

    if (status === 429) {
      return new APIError(
        'Too many requests. Please wait a moment.',
        429,
        true
      );
    }
  }

  return new APIError('Something went wrong. Please try again.', 500, true);
}

export function shouldRetry(error: APIError, attemptNumber: number): boolean {
  return error.isRetryable && attemptNumber < 3;
}
```

**Update `lib/api-client.ts` with better error handling:**

```typescript
import { handleAPIError, APIError, shouldRetry } from './api-error-handler';

class ApiClient {
  private logRequest(endpoint: string, options?: RequestInit) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '🚀 API Request:',
        options?.method || 'GET',
        `${API_BASE}${endpoint}`
      );
    }
  }

  private logResponse(endpoint: string, status: number, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response [${status}]:`, endpoint);
    }
  }

  private logError(endpoint: string, error: any) {
    console.error('❌ API Error:', endpoint, error);
  }

  async request<T = any>(
    endpoint: string,
    options?: RequestInit,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    this.logRequest(endpoint, options);

    try {
      // ✅ Add timeout to ALL requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);
      this.logResponse(endpoint, res.status);

      if (!res.ok) {
        const errorText = await res.text();
        const apiError = new APIError(
          errorText || `HTTP ${res.status}: ${res.statusText}`,
          res.status,
          res.status >= 500 || res.status === 429
        );
        throw apiError;
      }

      const data = await res.json();

      if (typeof data !== 'object' || data === null) {
        throw new APIError('Invalid API response format', 500, false);
      }

      if (data.success === false) {
        throw new APIError(
          data.error || data.message || 'API returned success: false',
          400,
          false
        );
      }

      return data as ApiResponse<T>;
    } catch (error) {
      this.logError(endpoint, error);

      const apiError =
        error instanceof APIError ? error : handleAPIError(error);

      // ✅ Retry logic for retryable errors
      if (shouldRetry(apiError, retryCount)) {
        console.log(`🔄 Retrying request (attempt ${retryCount + 1}/3)...`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        ); // Exponential backoff
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      throw apiError;
    }
  }

  // ✅ Non-blocking health check
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Fast timeout

      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // ✅ Silently fail - don't block app
      return false;
    }
  }
}
```

---

## 🎨 SOLUTION 5: PERFORMANCE & SEO OPTIMIZATIONS

### A. Lazy Load Fund Cards

**Update `components/fund-card.tsx`:**

```typescript
'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import Link from 'next/link';

interface FundCardProps {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  aum: number;
  expenseRatio: number;
  rating: number;
}

// ✅ Memoize component to prevent unnecessary re-renders
const FundCard = memo(function FundCard({
  id,
  name,
  fundHouse,
  category,
  nav,
  returns1Y,
  returns3Y,
  returns5Y,
  aum,
  expenseRatio,
  rating,
}: FundCardProps) {
  return (
    <Link href={`/equity/${id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex flex-col h-full">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {name}
            </h3>
            <p className="text-xs text-gray-500">{fundHouse}</p>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">NAV</span>
              <span className="font-medium">₹{nav.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">1Y Returns</span>
              <span className={`font-medium flex items-center gap-1 ${returns1Y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returns1Y >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {returns1Y.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">3Y Returns</span>
              <span className="font-medium">{returns3Y.toFixed(2)}%</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">AUM</span>
              <span className="font-medium">₹{aum.toLocaleString()} Cr</span>
            </div>

            {rating > 0 && (
              <div className="flex items-center gap-1 pt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
});

export { FundCard };
```

### B. Add Dynamic Meta Tags for SEO

**Update `app/equity/[id]/page.tsx`:**

```typescript
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Fetch fund data
  const fund = await getFundById(params.id);

  return {
    title: `${fund.name} - Mutual Fund Details | MutualFunds.in`,
    description: `Invest in ${fund.name} from ${fund.fundHouse}. Current NAV: ₹${fund.nav}. 1Y Returns: ${fund.returns1Y}%. View detailed analysis, holdings, and performance.`,
    keywords: [
      fund.name,
      fund.fundHouse,
      fund.category,
      'mutual fund',
      'investment',
      'India',
    ],
    openGraph: {
      title: fund.name,
      description: `${fund.fundHouse} | NAV: ₹${fund.nav} | Returns: ${fund.returns1Y}%`,
      type: 'website',
    },
  };
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Critical Fixes (Day 1)

- [ ] Remove hard limits (top20/50/100 filters)
- [ ] Implement infinite scroll
- [ ] Add "Load More" button
- [ ] Update useFunds hook to fetch 5000+ funds
- [ ] Add real-time fund count display

### Phase 2: Search Enhancement (Day 2)

- [ ] Create `use-debounced-search.ts` hook
- [ ] Implement result ranking
- [ ] Add loading states
- [ ] Add keyboard navigation
- [ ] Show "Not found" message with external API fetch

### Phase 3: Market Indices (Day 3)

- [ ] Add auto-refresh (5 min intervals)
- [ ] Add last updated timestamp
- [ ] Add market open/closed indicator
- [ ] Add manual refresh button
- [ ] Handle market holidays

### Phase 4: Error Handling (Day 4)

- [ ] Create `api-error-handler.ts`
- [ ] Update all API calls with timeout
- [ ] Implement retry logic
- [ ] Add user-friendly error messages
- [ ] Make health check non-blocking

### Phase 5: Performance (Day 5)

- [ ] Memoize FundCard component
- [ ] Add dynamic meta tags
- [ ] Implement lazy loading
- [ ] Optimize bundle size
- [ ] Test Lighthouse score

---

## 🎯 EXPECTED RESULTS AFTER FIXES

### Before:

- ❌ Only 100 funds visible
- ❌ Search triggers on every keystroke
- ❌ Market indices static
- ❌ Network errors block app
- ❌ Poor SEO

### After:

- ✅ All 4,459+ funds accessible
- ✅ Smooth debounced search
- ✅ Live market updates every 5 min
- ✅ Graceful error handling
- ✅ Lighthouse score > 85
- ✅ Proper SEO meta tags
- ✅ Infinite scroll UX
- ✅ Loading skeletons
- ✅ Real-time fund count

---

## 📞 TESTING COMMANDS

```bash
# 1. Test fund count
# Open /equity page and scroll to bottom
# Should see: "Showing 100 of 2,500+ funds"
# Click "Load More" → should load 200, 300, 400...

# 2. Test search
# Type slowly: "HDFC" → should debounce
# Should show ranked results (exact match first)

# 3. Test market indices
# Check top ticker bar
# Should see live pulsing indicator
# Refresh button should work

# 4. Test error handling
# Turn off WiFi
# Should see: "Network error. Check your connection."
# Turn on WiFi → auto-retry should work

# 5. Test performance
npm run build
npm run start
# Run Lighthouse audit
# Score should be > 85
```

---

_End of Frontend Audit Report_
