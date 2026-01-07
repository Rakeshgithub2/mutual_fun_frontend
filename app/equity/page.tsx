'use client';
export const dynamic = 'force-dynamic';
import {
  Suspense,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
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
import { apiClient } from '@/lib/api-client';

function FundsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const [displayLimit, setDisplayLimit] = useState(500); // Start with 500 funds to show more initially
  const language = 'en';

  useEffect(() => {
    const urlCategory = searchParams.get('category');

    // Redirect commodity to its own page
    if (urlCategory && urlCategory.toLowerCase() === 'commodity') {
      router.push('/commodity');
      return;
    }

    // Redirect debt to its own page
    if (urlCategory && urlCategory.toLowerCase() === 'debt') {
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
      value: 'largecap',
      keywords: ['large cap', 'largecap', 'large-cap'],
    },
    {
      label: 'Mid Cap',
      value: 'midcap',
      keywords: ['mid cap', 'midcap', 'mid-cap'],
    },
    {
      label: 'Small Cap',
      value: 'smallcap',
      keywords: ['small cap', 'smallcap', 'small-cap'],
    },
    {
      label: 'Multi Cap',
      value: 'multicap',
      keywords: ['multi cap', 'multicap', 'multi-cap'],
    },
    {
      label: 'Flexi Cap',
      value: 'flexicap',
      keywords: ['flexi cap', 'flexicap', 'flexi-cap', 'flexible cap'],
    },
    {
      label: 'Index Funds',
      value: 'indexfund',
      keywords: [
        'index fund',
        'index',
        'nifty',
        'sensex',
        'bse',
        'nse',
        'indexfund',
      ],
    },
  ];

  // ✅ FIX: Use search API when subcategory is selected, otherwise fetch all equity
  const [allFunds, setAllFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFunds() {
      setLoading(true);
      setError(null);
      try {
        // Fetch ALL equity funds with pagination to bypass 2500 limit
        console.log('🔍 [Equity Page] Fetching all equity funds...');
        let allEquityFunds: any[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await apiClient.getFunds(
            page,
            2500, // backend max per page
            { category: 'equity' }
          );

          if (response.success && response.data && response.data.length > 0) {
            allEquityFunds = [...allEquityFunds, ...response.data];
            console.log(
              `✅ [Equity Page] Page ${page}: Fetched ${response.data.length} funds (Total: ${allEquityFunds.length})`
            );

            // Check pagination flags to see if there are more pages
            if (
              response.pagination &&
              (response.pagination.hasMore ||
                response.pagination.hasNext ||
                response.pagination.hasNextPage)
            ) {
              page++;
            } else {
              // No more pages available
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        }

        console.log(
          `✅ [Equity Page] Total equity funds fetched: ${allEquityFunds.length}`
        );
        setAllFunds(allEquityFunds);
      } catch (err) {
        console.error('❌ [Equity Page] Error:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchFunds();
  }, []); // Fetch once on mount, not when category changes
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
      const equityCount = allFunds.filter((f) =>
        isEquityFund(f.category)
      ).length;
      console.log('💼 [Equity Page] Equity funds detected:', equityCount);
    }
  }, [allFunds]);

  // Transform funds to match FundList expected format
  const transformedFunds = useMemo(() => {
    console.log('🔄 [Equity Page] Transforming funds...', allFunds.length);

    const mapped = allFunds.map((fund) => ({
      id: fund.schemeCode || fund.id || fund.fundId,
      schemeCode: fund.schemeCode,
      name: fund.schemeName || fund.name,
      fundHouse: fund.amc?.name || fund.amcName || fund.fundHouse,
      category: fund.category,
      subCategory: fund.subCategory,
      nav: fund.nav?.value || fund.nav || 0,
      returns1Y: fund.returns?.['1Y'] || fund.returns1Y || 0,
      returns3Y: fund.returns?.['3Y'] || fund.returns3Y || 0,
      returns5Y: fund.returns?.['5Y'] || fund.returns5Y || 0,
      aum: fund.aum?.value || fund.aum || 0,
      expenseRatio: fund.expenseRatio?.value || fund.expenseRatio || 0,
      rating: fund.rating || 0,
    }));

    console.log('📦 [Equity Page] Mapped funds:', mapped.length);
    if (mapped.length > 0) {
      console.log('📋 [Equity Page] Sample mapped fund:', {
        name: mapped[0].name,
        fundHouse: mapped[0].fundHouse,
        category: mapped[0].category,
        nav: mapped[0].nav,
        returns1Y: mapped[0].returns1Y,
      });
    }

    // ✅ NO DEDUPLICATION: Show all plans to users
    // Users can choose between Direct/Regular, Growth/Dividend plans
    console.log('📦 [Equity Page] Total funds (all plans):', mapped.length);

    return mapped;
  }, [allFunds]);

  // Filter and limit funds based on user selection - Returns ALL filtered funds
  const allFilteredFunds = useMemo(() => {
    console.log('🎯 [Equity Page] Starting filter...', {
      totalFunds: transformedFunds.length,
      hasSearchQuery: !!searchQuery.trim(),
      selectedCategory: category,
    });

    // Quality check - RELAXED to show more funds
    let filtered = transformedFunds.filter((fund) => {
      const hasName = fund.name && fund.name.trim().length > 0;
      // Only require name, not fundHouse, to show more funds
      return hasName;
    });

    console.log(
      '✅ [Equity Page] Valid funds after quality check:',
      filtered.length
    );

    // If user is searching, show ALL matching funds regardless of subcategory
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
      const searchTerms = query.split(' ');

      filtered = filtered.filter((fund) => {
        const fundName = fund.name.toLowerCase();
        return searchTerms.every((term) => fundName.includes(term));
      });

      console.log(
        `🔍 [Equity Page] Search results for "${searchQuery}": ${filtered.length} funds`
      );
    } else if (category) {
      // Filter by subCategory field from database
      console.log(`🔎 [Equity Page] Filtering for subCategory: ${category}`);
      const beforeFilter = filtered.length;

      filtered = filtered.filter((fund) => {
        const fundSubCategory = (fund.subCategory || '').toLowerCase().trim();
        const matches = fundSubCategory === category.toLowerCase();

        if (matches) {
          console.log(
            `✓ Match: ${fund.name} (subCategory: ${fundSubCategory})`
          );
        }
        return matches;
      });

      console.log(
        `🎯 [Equity Page] Found ${filtered.length} funds with subCategory=${category} (from ${beforeFilter} total)`
      );
    } else {
      console.log('📊 [Equity Page] Showing all equity funds');
    }

    console.log('📊 [Equity Page] Final filtered funds:', filtered.length);
    return filtered;
  }, [transformedFunds, searchQuery, category]);

  // Paginated funds to display
  const displayedFunds = useMemo(() => {
    return allFilteredFunds.slice(0, displayLimit);
  }, [allFilteredFunds, displayLimit]);

  const hasMoreFunds = displayLimit < allFilteredFunds.length;
  const remainingFunds = allFilteredFunds.length - displayLimit;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Fixed Back Button - Always Visible - Positioned Lower */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-24 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
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

          {/* Results Count with Pagination Info */}
          {!loading && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4 flex-wrap gap-2">
              <span className="font-medium">
                Displaying {displayedFunds.length} of {allFilteredFunds.length}{' '}
                funds
                {allFilteredFunds.length < transformedFunds.length &&
                  ` (filtered from ${transformedFunds.length} total equity funds)`}
              </span>
              {hasMoreFunds && (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  +{remainingFunds} more available
                </span>
              )}
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
            <FundList funds={displayedFunds} language={language} />

            {allFilteredFunds.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No funds found matching your criteria.
                </p>
              </Card>
            )}

            {/* Load Next 200 Button */}
            {hasMoreFunds && (
              <div className="mt-8 text-center space-y-4">
                <Button
                  onClick={() =>
                    setDisplayLimit((prev) =>
                      Math.min(prev + 200, allFilteredFunds.length)
                    )
                  }
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Load Next 200 Funds
                  <ChevronDown className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {displayedFunds.length} of {allFilteredFunds.length}{' '}
                  funds • {remainingFunds} more available
                </p>
              </div>
            )}

            {/* All Funds Loaded Message */}
            {!hasMoreFunds && allFilteredFunds.length > 0 && (
              <div className="mt-8 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
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
