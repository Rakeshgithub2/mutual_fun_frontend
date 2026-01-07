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
import { Loader2, Search, X, ArrowLeft, ChevronDown } from 'lucide-react';

function CommodityPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [subCategory, setSubCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(500); // Start with 500 funds to show more
  // ✅ NO LIMIT FILTERS: Show ALL funds
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const language = 'en'; // Default language

  useEffect(() => {
    const urlType = searchParams.get('type');
    if (urlType) {
      setSubCategory(urlType);
    } else {
      setSubCategory('');
    }
  }, [searchParams]);

  // Define commodity types
  const commodityTypes = [
    { label: 'All Funds', value: '', subCategory: '' },
    { label: 'Gold Funds', value: 'gold', subCategory: 'Gold' },
    { label: 'Silver Funds', value: 'silver', subCategory: 'Silver' },
    {
      label: 'Multi Commodity',
      value: 'multi-commodity',
      subCategory: 'Multi Commodity',
    },
  ];

  // ✅ FIX: Use search API for commodity funds since they're not in a specific category
  // Commodity funds are classified as "equity" (Gold/Silver ETFs) or "other" in the database
  const [allFunds, setAllFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch commodity funds using search keywords
  useEffect(() => {
    async function fetchCommodityFunds() {
      setLoading(true);
      setError(null);
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

        // Search for gold, silver, and commodity funds
        const searchQueries = ['gold', 'silver', 'commodity'];
        const allResults: any[] = [];

        for (const query of searchQueries) {
          const response = await fetch(
            `${apiUrl}/api/funds/search?q=${query}&limit=2500`
          );
          const data = await response.json();
          if (data.success && data.data) {
            allResults.push(...data.data);
          }
        }

        // Remove duplicates based on schemeCode
        const uniqueFunds = allResults.reduce((acc: any[], fund: any) => {
          const exists = acc.find((f) => f.schemeCode === fund.schemeCode);
          if (!exists) {
            acc.push(fund);
          }
          return acc;
        }, []);

        console.log(
          '✅ [Commodity Page] Fetched',
          uniqueFunds.length,
          'unique commodity funds'
        );
        setAllFunds(uniqueFunds);
      } catch (err) {
        console.error('❌ [Commodity Page] Error:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchCommodityFunds();
  }, []);

  // Log error details for debugging
  useEffect(() => {
    if (error) {
      console.error('❌ [Commodity Page] API Error:', error);
      console.error('❌ [Commodity Page] Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
  }, [error]);

  // Transform and filter commodity funds from all funds
  const transformedFunds = useMemo(() => {
    console.log('🔍 [Commodity Page] Total funds fetched:', allFunds.length);
    console.log('🔍 [Commodity Page] Loading:', loading);
    console.log('🔍 [Commodity Page] Error:', error);

    if (allFunds.length > 0) {
      console.log(
        '📊 [Commodity Page] First 5 funds with full details:',
        allFunds.slice(0, 5).map((f) => ({
          name: f.name,
          category: f.category,
          subCategory: f.subCategory,
          fundType: f.fundType,
          schemeName: f.schemeName,
        }))
      );

      // Log unique categories and subcategories to understand data structure
      const categories = [
        ...new Set(allFunds.map((f) => f.category).filter(Boolean)),
      ];
      const subCategories = [
        ...new Set(allFunds.map((f) => f.subCategory).filter(Boolean)),
      ];
      const fundTypes = [
        ...new Set(allFunds.map((f) => f.fundType).filter(Boolean)),
      ];

      console.log('📊 [Commodity Page] Unique categories:', categories);
      console.log(
        '📊 [Commodity Page] Unique subcategories:',
        subCategories.slice(0, 20)
      );
      console.log('📊 [Commodity Page] Unique fund types:', fundTypes);
    }

    // Filter for commodity-related funds - be comprehensive to capture all commodity funds
    const commodityFunds = allFunds.filter((fund) => {
      const name = fund.name?.toLowerCase() || '';
      const category = fund.category?.toLowerCase() || '';
      const subCat = fund.subCategory?.toLowerCase() || '';
      const fundType = fund.fundType?.toLowerCase() || '';
      const schemeName = fund.schemeName?.toLowerCase() || '';

      // Combine all searchable text
      const searchText = `${name} ${category} ${subCat} ${fundType} ${schemeName}`;

      // Comprehensive commodity keywords - all lowercase, no spaces
      const commodityKeywords = [
        'commodity',
        'commodities',
        'gold',
        'silver',
        'platinum',
        'palladium',
        'metal',
        'metals',
        'preciousmetal',
        'bullion',
        'etfgold',
        'goldetf',
        'etfsilver',
        'silveretf',
        'goldfund',
        'silverfund',
        'goldsavings',
        'goldexchange',
        'golddeposit',
        'mcx',
        'ncdex',
      ];

      // Check if any commodity keyword is present
      const isCommodity = commodityKeywords.some((keyword) =>
        searchText.includes(keyword)
      );

      return isCommodity;
    });

    console.log(
      '✅ [Commodity Page] Commodity funds found:',
      commodityFunds.length
    );

    // ✅ NO DEDUPLICATION: Show all plan variations
    // Display Direct, Regular, Growth, Dividend, IDCW - all variations
    console.log(
      '📦 [Commodity Page] Total funds (all plan variations):',
      commodityFunds.length
    );

    // Log a sample of found funds to verify
    if (commodityFunds.length > 0) {
      console.log(
        '📋 [Commodity Page] Sample commodity funds:',
        commodityFunds.slice(0, 10).map((f) => f.name)
      );
    }

    // API already returns commodity funds, just transform them
    return commodityFunds.map((fund) => ({
      id: fund.schemeCode || fund.id || fund.fundId,
      schemeCode: fund.schemeCode,
      name: fund.schemeName || fund.name,
      fundHouse: fund.amc?.name || fund.amcName || fund.fundHouse,
      category: fund.category,
      subCategory: fund.subCategory,
      nav: fund.nav?.value || fund.currentNav || fund.nav || 0,
      returns1Y:
        fund.returns?.['1Y'] || fund.returns?.oneYear || fund.returns1Y || 0,
      returns3Y:
        fund.returns?.['3Y'] || fund.returns?.threeYear || fund.returns3Y || 0,
      returns5Y:
        fund.returns?.['5Y'] || fund.returns?.fiveYear || fund.returns5Y || 0,
      aum: fund.aum?.value || fund.aum || 0,
      expenseRatio: fund.expenseRatio?.value || fund.expenseRatio || 0,
      rating: fund.rating || 0,
    }));
  }, [allFunds]);

  // Filter and limit funds based on user selection
  const filteredFunds = useMemo(() => {
    let filtered = [...transformedFunds];

    console.log(
      '🎯 [Commodity Page] Starting with transformed funds:',
      filtered.length
    );
    console.log('🎯 [Commodity Page] SubCategory filter:', subCategory);

    // Filter by subcategory (Gold, Silver, Multi Commodity)
    if (subCategory) {
      const selectedType = commodityTypes.find((c) => c.value === subCategory);
      if (selectedType) {
        filtered = filtered.filter((fund) => {
          const fundName = fund.name?.toLowerCase() || '';
          const fundSubCat = fund.subCategory?.toLowerCase() || '';
          const fundCategory = fund.category?.toLowerCase() || '';
          const searchText = `${fundName} ${fundSubCat} ${fundCategory}`;

          // Match based on subcategory type
          switch (subCategory) {
            case 'gold':
              return searchText.includes('gold');
            case 'silver':
              return searchText.includes('silver');
            case 'multi-commodity':
              // Multi commodity: includes commodity funds but excludes specific gold/silver funds
              const hasGold = searchText.includes('gold');
              const hasSilver = searchText.includes('silver');
              const hasCommodity =
                searchText.includes('commodity') ||
                searchText.includes('multi');
              const hasMetal =
                searchText.includes('metal') ||
                searchText.includes('platinum') ||
                searchText.includes('palladium');

              // Include if it has commodity/multi keyword or metal keyword, but exclude if it's specifically gold or silver only
              return (hasCommodity || hasMetal) && !hasGold && !hasSilver;
            default:
              return true;
          }
        });
        console.log(
          '🔽 [Commodity Page] After subcategory filter:',
          filtered.length,
          'for type:',
          subCategory
        );
      }
    }

    // Apply search filter with improved matching
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

    // Sort by 2-year performance (using 1-year returns as proxy since 2-year not available)
    // Sort in descending order (best performers first)
    filtered = filtered.sort((a, b) => {
      const returnA = a.returns1Y || 0;
      const returnB = b.returns1Y || 0;
      return returnB - returnA;
    });

    // ✅ NO LIMITS: Show all filtered funds (sorted by performance)
    console.log('✅ [Commodity Page] Displaying ALL funds:', filtered.length);
    return filtered;
  }, [transformedFunds, searchQuery, subCategory]);

  // Paginated funds to display
  const displayedFunds = useMemo(() => {
    return filteredFunds.slice(0, displayLimit);
  }, [filteredFunds, displayLimit]);

  const hasMoreFunds = displayLimit < filteredFunds.length;
  const remainingFunds = filteredFunds.length - displayLimit;

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    return transformedFunds
      .filter((fund) => fund.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [transformedFunds, searchQuery]);

  const getTitle = () => {
    if (!subCategory) return 'All Commodity Funds';
    return (
      commodityTypes.find((c) => c.value === subCategory)?.label ||
      'Commodity Funds'
    );
  };

  // ✅ NO LIMIT FILTERS: Removed Top 20/50/100/All - showing ALL funds

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Fixed Back Button - Always Visible */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
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
              {getTitle()}
            </h1>
          </div>

          {/* Search Box with Autocomplete - Enhanced Visibility */}
          <Card className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700 shadow-lg">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                Search Commodity Funds
              </h3>
            </div>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <Input
                  type="text"
                  placeholder="🔍 Search Gold, Silver, Commodity funds... (e.g., Gold ETF, Silver Fund)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-14 pr-12 h-14 text-lg font-medium border-2 border-yellow-300 dark:border-yellow-600 focus:border-yellow-500 dark:focus:border-yellow-400 bg-white dark:bg-gray-800 shadow-md"
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
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-yellow-300 dark:border-yellow-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                    {searchSuggestions.map((fund) => (
                      <button
                        key={fund.id}
                        onClick={() => {
                          setSearchQuery(fund.name);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
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

          {/* Commodity Type Filter */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Commodity Type
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {commodityTypes.map((type) => (
                <Button
                  key={type.value}
                  onClick={() => {
                    if (type.value) {
                      router.push(`/commodity?type=${type.value}`);
                    } else {
                      router.push('/commodity');
                    }
                    setPage(1);
                  }}
                  variant={subCategory === type.value ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                Showing {displayedFunds.length} of {filteredFunds.length} funds
              </span>
              {hasMoreFunds && (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
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
            <div className="space-y-3">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                Failed to load commodity funds
              </p>
              <p className="text-sm text-red-500 dark:text-red-300">
                Error: {error.message}
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded border">
                <p className="font-semibold mb-1">Troubleshooting:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>The API might be temporarily unavailable</li>
                  <li>Check your internet connection</li>
                  <li>Try refreshing the page</li>
                </ul>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Funds List */}
        {!loading && !error && (
          <>
            <FundList funds={displayedFunds} language={language} />

            {filteredFunds.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No commodity funds found matching your criteria.
                </p>
              </Card>
            )}

            {/* Load Next 200 Button */}
            {hasMoreFunds && (
              <div className="mt-8 text-center space-y-4">
                <Button
                  onClick={() =>
                    setDisplayLimit((prev) =>
                      Math.min(prev + 200, filteredFunds.length)
                    )
                  }
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Load Next 200 Funds
                  <ChevronDown className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {displayedFunds.length} of {filteredFunds.length}{' '}
                  funds • {remainingFunds} more available
                </p>
              </div>
            )}

            {/* All Funds Loaded Message */}
            {!hasMoreFunds && filteredFunds.length > 0 && (
              <div className="mt-8 text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-amber-700 dark:text-amber-400 font-medium">
                  ✓ All {filteredFunds.length} funds loaded
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CommodityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <CommodityPageContent />
    </Suspense>
  );
}
