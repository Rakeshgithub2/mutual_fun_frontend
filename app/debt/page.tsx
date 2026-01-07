'use client';
export const dynamic = 'force-dynamic';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { useFunds } from '@/hooks/use-funds';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, X, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';

function DebtFundsPageContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(500); // Start with 500 funds to show more
  // ✅ NO LIMIT FILTERS: Show ALL funds
  const [showSuggestions, setShowSuggestions] = useState(false);
  const language = 'en'; // Default language

  // Get category from URL
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory('');
    }
  }, [searchParams]);

  // Define debt fund categories with expanded keywords
  const categories = [
    { label: 'All Funds', value: '', keywords: [] },
    {
      label: 'Liquid Funds',
      value: 'liquid',
      keywords: ['liquid', 'overnight', 'ultrashort', 'moneymarket', 'cash'],
    },
    {
      label: 'Short Duration',
      value: 'shortduration',
      keywords: [
        'shortduration',
        'short duration',
        'short term',
        'lowduration',
        'shortmaturity',
        'short',
      ],
    },
    {
      label: 'Corporate Bond',
      value: 'corporatebond',
      keywords: [
        'corporatebond',
        'corporate bond',
        'corporate debt',
        'corporate',
        'credit risk',
      ],
    },
    {
      label: 'Banking & PSU',
      value: 'bankingpsu',
      keywords: [
        'bankingpsu',
        'banking',
        'psu',
        'banking psu',
        'public sector',
        'bank',
      ],
    },
    {
      label: 'Dynamic Bond',
      value: 'dynamicbond',
      keywords: [
        'dynamicbond',
        'dynamic bond',
        'dynamic debt',
        'income',
        'dynamic',
        'long duration',
        'medium duration',
        'gilt',
      ],
    },
  ];

  // Fetch all debt funds with pagination to get 200+ per subcategory
  const {
    funds: allFunds,
    loading,
    error,
  } = useFunds({
    category: 'debt', // Filter by debt category on the backend
    limit: 5000, // Fetch all debt funds with multi-page strategy
  });

  // Log for debugging
  useEffect(() => {
    console.log('🔍 [Debt Page] Raw funds fetched:', allFunds.length);
    if (allFunds.length > 0) {
      console.log(
        '📊 [Debt Page] First 3 funds:',
        allFunds.slice(0, 3).map((f) => ({
          name: f.name,
          category: f.category,
          currentNav: f.currentNav,
        }))
      );
      console.log(
        '📈 [Debt Page] Categories distribution:',
        allFunds.reduce((acc: any, fund) => {
          const cat = fund.category || 'Unknown';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {})
      );
    }
    if (error) {
      console.error('❌ [Debt Page] Error:', error);
    }
  }, [allFunds, error]);

  // Transform funds to match FundList expected format - NO DEDUPLICATION
  const transformedFunds = useMemo(() => {
    const mapped = allFunds.map((fund) => ({
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

    // ✅ NO DEDUPLICATION: Show all plan variations
    // Display Direct, Regular, Growth, Dividend, IDCW - all variations
    console.log(
      '✅ [Debt Page] Total transformed funds (all plan variations):',
      mapped.length
    );

    return mapped;
  }, [allFunds]);

  // Filter and limit funds based on user selection
  const filteredFunds = useMemo(() => {
    // Step 1: Show ALL funds except pure equity - MAXIMUM INCLUSION
    let filtered = transformedFunds.filter((fund) => {
      const fundCategory = fund.category?.toLowerCase() || '';

      // Only exclude if category is exactly "Equity" (nothing else)
      const isPureEquity = fundCategory === 'equity';

      // Include everything else (Debt, Hybrid, Commodity, Solution Oriented, etc.)
      return !isPureEquity;
    });

    console.log('🔍 [Debt Page] All non-pure-equity funds:', filtered.length);

    // Step 2: Apply category filter based on keywords (VERY BROAD)
    if (category) {
      const selectedCategory = categories.find((c) => c.value === category);
      if (selectedCategory && selectedCategory.keywords.length > 0) {
        const categoryFiltered = filtered.filter((fund) => {
          const name = fund.name.toLowerCase();
          const fundCategory = fund.category?.toLowerCase() || '';
          const subCategory = fund.subCategory?.toLowerCase() || '';
          const searchText = `${name} ${fundCategory} ${subCategory}`;

          return selectedCategory.keywords.some((keyword) =>
            searchText.includes(keyword.toLowerCase())
          );
        });

        console.log(
          `🎯 [Debt Page] ${selectedCategory.label}:`,
          categoryFiltered.length
        );

        // Only apply if we get reasonable results (50+)
        if (categoryFiltered.length >= 50) {
          filtered = categoryFiltered;
        } else {
          console.log(
            '⚠️ [Debt Page] Category filter returned too few results, showing all'
          );
        }
      }
    }

    console.log('✅ [Debt Page] Total funds to display:', filtered.length);

    // Step 3: Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');
      const searchTerms = query.split(' ');

      filtered = filtered.filter((fund) => {
        const fundName = fund.name.toLowerCase();
        const searchText = fundName;

        return searchTerms.every((term) => searchText.includes(term));
      });
    }

    // ✅ NO LIMITS: Show all filtered funds
    console.log('✅ [Debt Page] Displaying ALL funds:', filtered.length);
    return filtered;
  }, [transformedFunds, category, searchQuery, categories]);

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

    // Filter debt funds only for suggestions
    const debtFunds = transformedFunds.filter((fund) => {
      const fundCategory = fund.category?.toLowerCase() || '';
      const fundSubCategory = fund.subCategory?.toLowerCase() || '';
      return (
        fundCategory === 'debt' ||
        fundCategory.includes('debt') ||
        fundCategory.includes('bond') ||
        fundSubCategory.includes('debt') ||
        fundSubCategory.includes('bond')
      );
    });

    return debtFunds
      .filter((fund) => fund.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [transformedFunds, searchQuery]);

  const getCategoryTitle = () => {
    if (!category) return 'All Debt Funds';
    return (
      category
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' Funds'
    );
  };

  // ✅ NO LIMIT FILTERS: Removed Top 20/50/100/All - showing ALL funds

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Fixed Back Button - Always Visible */}
      <Link
        href="/"
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-2xl shadow-lg">
              💰
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getCategoryTitle()}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stable returns with lower risk
              </p>
            </div>
          </div>

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
                      window.location.href = `/debt?category=${cat.value}`;
                    } else {
                      window.location.href = '/debt';
                    }
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

          {/* Search Box with Autocomplete - Enhanced Visibility */}
          <Card className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 shadow-lg">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-green-600 dark:text-green-400" />
                Search Debt Funds
              </h3>
            </div>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-600 dark:text-green-400" />
                <Input
                  type="text"
                  placeholder="🔍 Search debt funds by name, scheme, category..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-14 pr-12 h-14 text-lg font-medium border-2 border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800 shadow-md"
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
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-green-300 dark:border-green-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
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

          {/* Results Count */}
          {!loading && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                Showing {displayedFunds.length} of {filteredFunds.length} funds
              </span>
              {hasMoreFunds && (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  +{remainingFunds} more available
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">
              Failed to load debt funds: {error.message}
            </p>
          </Card>
        )}

        {/* Funds List */}
        {!loading && !error && (
          <>
            <FundList funds={displayedFunds} language={language} />

            {filteredFunds.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No debt funds found matching your criteria.
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
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
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
              <div className="mt-8 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-400 font-medium">
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

export default function DebtFundsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      }
    >
      <DebtFundsPageContent />
    </Suspense>
  );
}
