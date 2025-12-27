'use client';
export const dynamic = 'force-dynamic';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { useFunds } from '@/hooks/use-funds';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, X, ArrowLeft } from 'lucide-react';
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
  const [limitFilter, setLimitFilter] = useState<
    'top20' | 'top50' | 'top100' | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const language = 'en'; // Default language

  useEffect(() => {
    const urlCategory = searchParams.get('category');

    // Redirect commodity to its own page
    if (urlCategory === 'commodity') {
      router.push('/commodity');
      return;
    }

    // Redirect debt to its own page
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

  // Define categories before using them - Essential equity categories only
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

  // Fetch all funds without strict category filter (backend doesn't accept category=Equity)
  // We'll filter on the client side like the commodity page
  // ✅ PRODUCTION-SAFE: Using multi-page fetch strategy for 3000 funds (30 pages × 100)
  // After basic filtering, this should give us 2000+ equity funds with real data
  const {
    funds: allFunds,
    loading,
    error,
  } = useFunds({
    limit: 3000, // Fetch 3000 funds to ensure 2000+ equity funds after filtering
  });

  // Debug logging
  useEffect(() => {
    console.log('🔍 [Equity Page] Raw funds fetched:', allFunds.length);
    if (allFunds.length > 0) {
      console.log('📦 [Equity Page] First 3 funds:', allFunds.slice(0, 3));
      console.log(
        '📊 [Equity Page] Categories distribution:',
        allFunds.reduce((acc: any, fund) => {
          const cat = fund.category || 'Unknown';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {})
      );

      // Count equity funds using normalization
      const equityCount = allFunds.filter((f) => isEquityFund(f.category)).length;
      console.log('💼 [Equity Page] Equity funds detected:', equityCount);
    }
  }, [allFunds]);

  // Transform funds to match FundList expected format
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

    // ✅ DEDUPLICATE: Remove duplicate funds using utility
    const deduplicated = deduplicateFunds(mapped, calculateFundQuality);

    console.log(
      '🔄 [Deduplication] Before:',
      mapped.length,
      'After:',
      deduplicated.length
    );

    return deduplicated;
  }, [allFunds]);

  // Filter and limit funds based on user selection
  const filteredFunds = useMemo(() => {
    // Step 1: Filter for equity funds only - using normalization
    let filtered = transformedFunds.filter((fund) => {
      return isEquityFund(fund.category);
    });

    console.log('🔍 [Equity Page] Total equity funds found:', filtered.length);

    // Step 1.5: Basic quality filter - minimal filtering to show more funds
    filtered = filtered.filter((fund) => {
      // Only require name and fundHouse - very minimal filter
      const hasName = fund.name && fund.name.trim().length > 0;
      const hasFundHouse = fund.fundHouse && fund.fundHouse.trim().length > 0;

      return hasName && hasFundHouse;
    });

    console.log(
      '✅ [Equity Page] Valid equity funds (with some data):',
      filtered.length
    );

    // Step 2: Apply category filter using normalization
    if (category) {
      const selectedCategory = categories.find((c) => c.value === category);
      if (selectedCategory && selectedCategory.keywords.length > 0) {
        filtered = filtered.filter((fund) => {
          return selectedCategory.keywords.some((keyword) =>
            matchesSubcategory(fund.name, fund.category, keyword)
          );
        });

        console.log(
          `🎯 [Equity Page] ${selectedCategory.label} funds:`,
          filtered.length
        );
      }
    }

    // Step 3: Apply search filter with improved matching
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
      const searchTerms = query.split(' ');

      filtered = filtered.filter((fund) => {
        const fundName = fund.name.toLowerCase();
        const searchText = fundName;

        // Match if all search terms are found in the fund name
        return searchTerms.every((term) => searchText.includes(term));
      });
    }

    // Apply limit filter
    if (limitFilter === 'top20') {
      filtered = filtered.slice(0, 20);
    } else if (limitFilter === 'top50') {
      filtered = filtered.slice(0, 50);
    } else if (limitFilter === 'top100') {
      filtered = filtered.slice(0, 100);
    }
    // 'all' means no limit, return everything

    return filtered;
  }, [transformedFunds, category, searchQuery, limitFilter]);

  // Search suggestions - use original allFunds for raw data
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

  const limitFilters = [
    { label: 'Top 20', value: 'top20' as const },
    { label: 'Top 50', value: 'top50' as const },
    { label: 'Top 100', value: 'top100' as const },
    { label: 'All Funds', value: 'all' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Fixed Back Button - Always Visible */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getCategoryTitle()}
            </h1>
          </div>

          {/* Search Box with Autocomplete - Enhanced Visibility */}
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Category
            </p>
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

          {/* Top 20/50/100/All Filter */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Show
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {limitFilters.map((filter) => (
                <Button
                  key={filter.value}
                  onClick={() => {
                    setLimitFilter(filter.value);
                    setPage(1);
                  }}
                  variant={limitFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredFunds.length} of {transformedFunds.length} funds
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              Failed to load funds: {error.message}
            </p>
          </Card>
        )}

        {/* Funds List */}
        {!loading && !error && (
          <>
            <FundList funds={filteredFunds} language={language} />

            {filteredFunds.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No funds found matching your criteria.
                </p>
              </Card>
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
