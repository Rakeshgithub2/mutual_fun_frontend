'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { useCompare } from '@/lib/hooks/use-compare';
import { useLanguage } from '@/lib/hooks/use-language';
import { getTranslation } from '@/lib/i18n';
import { useFunds } from '@/lib/hooks/use-funds';
import { apiClient, type Fund } from '@/lib/api-client';

// Helper function to generate dynamic suggestions based on selected funds
function generateDynamicSuggestions(funds: any[]) {
  if (funds.length === 0) return [];

  const suggestions: Array<{
    title: string;
    description: string;
    icon: string;
    type: 'info' | 'warning' | 'success' | 'tip';
  }> = [];

  // Calculate averages and statistics
  const avgReturns1Y =
    funds.reduce((sum, f) => sum + f.returns1Y, 0) / funds.length;
  const avgReturns3Y =
    funds.reduce((sum, f) => sum + f.returns3Y, 0) / funds.length;
  const avgReturns5Y =
    funds.reduce((sum, f) => sum + f.returns5Y, 0) / funds.length;
  const avgExpenseRatio =
    funds.reduce((sum, f) => sum + f.expenseRatio, 0) / funds.length;
  const avgRating = funds.reduce((sum, f) => sum + f.rating, 0) / funds.length;
  const categories = [...new Set(funds.map((f) => f.category))];
  const bestPerformer = funds.reduce(
    (best, f) => (f.returns5Y > best.returns5Y ? f : best),
    funds[0]
  );
  const lowestExpense = funds.reduce(
    (low, f) => (f.expenseRatio < low.expenseRatio ? f : low),
    funds[0]
  );

  // Suggestion 1: Performance Analysis
  if (avgReturns5Y > 15) {
    suggestions.push({
      title: 'Strong Long-term Performance',
      description: `Your selected funds have an average 5-year return of ${avgReturns5Y.toFixed(
        1
      )}%, which is above the market average. ${
        bestPerformer.name
      } leads with ${bestPerformer.returns5Y.toFixed(
        1
      )}% returns, making it an excellent anchor for long-term wealth creation.`,
      icon: '📈',
      type: 'success',
    });
  } else if (avgReturns5Y < 10) {
    suggestions.push({
      title: 'Consider Higher Return Options',
      description: `The average 5-year return of ${avgReturns5Y.toFixed(
        1
      )}% is below market benchmarks. You might want to explore high-performing ${
        categories[0]
      } funds or consider adding mid-cap funds for potential growth acceleration.`,
      icon: '⚠️',
      type: 'warning',
    });
  } else {
    suggestions.push({
      title: 'Moderate Performance Portfolio',
      description: `With ${avgReturns5Y.toFixed(
        1
      )}% average 5-year returns, your selection offers balanced growth. Consider ${
        bestPerformer.name
      } as your primary investment for optimal returns within this group.`,
      icon: '📊',
      type: 'info',
    });
  }

  // Suggestion 2: Expense Ratio Analysis
  if (avgExpenseRatio < 0.75) {
    suggestions.push({
      title: 'Cost-Efficient Selection',
      description: `Excellent cost management! Your funds have an average expense ratio of ${avgExpenseRatio.toFixed(
        2
      )}%, with ${
        lowestExpense.name
      } at just ${lowestExpense.expenseRatio.toFixed(
        2
      )}%. Lower expenses compound into higher net returns over time—this selection will save you approximately ₹${(
        (avgExpenseRatio - 0.5) *
        100000
      ).toFixed(0)} per ₹10 lakh invested annually.`,
      icon: '💰',
      type: 'success',
    });
  } else if (avgExpenseRatio > 1.0) {
    suggestions.push({
      title: 'Higher Expense Ratios Detected',
      description: `Your selected funds have an average expense ratio of ${avgExpenseRatio.toFixed(
        2
      )}%, which is above the industry average. Consider switching to direct plans or lower-cost alternatives to improve net returns—even 0.5% difference can mean ₹50,000+ savings on a ₹10 lakh investment over 10 years.`,
      icon: '💸',
      type: 'warning',
    });
  } else {
    suggestions.push({
      title: 'Reasonable Cost Structure',
      description: `Your funds have an average expense ratio of ${avgExpenseRatio.toFixed(
        2
      )}%, which is within acceptable limits. ${
        lowestExpense.name
      } offers the lowest cost at ${lowestExpense.expenseRatio.toFixed(
        2
      )}%—prioritizing this fund can help maximize your net returns.`,
      icon: '💳',
      type: 'info',
    });
  }

  // Suggestion 3: Diversification Analysis
  if (categories.length === 1) {
    const category = categories[0];
    suggestions.push({
      title: 'Limited Diversification',
      description: `All your selected funds belong to the ${category} category. While focused investing can work, consider adding ${
        category === 'Large Cap'
          ? 'Mid Cap or Multi Cap'
          : category === 'Mid Cap'
          ? 'Large Cap or Flexi Cap'
          : 'Debt or Hybrid'
      } funds to reduce concentration risk and smooth out volatility across market cycles.`,
      icon: '⚖️',
      type: 'warning',
    });
  } else if (categories.length === 2) {
    suggestions.push({
      title: 'Good Diversification',
      description: `Your selection spans ${categories.join(
        ' and '
      )} categories, providing balanced exposure. This strategy offers a mix of ${
        categories.includes('Large Cap') ? 'stability' : 'growth'
      } and ${
        categories.includes('Small Cap') || categories.includes('Mid Cap')
          ? 'higher growth potential'
          : 'risk management'
      }—ideal for a well-rounded portfolio.`,
      icon: '🎯',
      type: 'success',
    });
  } else {
    suggestions.push({
      title: 'Excellent Diversification',
      description: `Outstanding! Your funds cover ${
        categories.length
      } different categories (${categories.join(
        ', '
      )}), providing robust diversification across market caps and investment styles. This multi-category approach helps balance risk-reward and performs well across different market conditions.`,
      icon: '🌟',
      type: 'success',
    });
  }

  // Suggestion 4: Rating & Quality Analysis
  if (avgRating >= 4.5) {
    const topRated = funds.filter((f) => f.rating >= 4.5);
    suggestions.push({
      title: 'Premium Quality Funds',
      description: `Excellent choice! ${
        topRated.length === funds.length
          ? 'All your funds'
          : `${topRated.length} out of ${funds.length} funds`
      } have ratings of 4.5+ stars, indicating consistent performance, strong fund management, and reliable track records. These high-quality funds are suitable for core portfolio holdings with ${avgReturns3Y.toFixed(
        1
      )}% average 3-year returns.`,
      icon: '⭐',
      type: 'success',
    });
  } else if (avgRating < 3.5) {
    const lowRated = funds.filter((f) => f.rating < 3.5);
    suggestions.push({
      title: 'Review Fund Quality',
      description: `${lowRated.length} fund(s) have ratings below 3.5 stars, suggesting inconsistent performance or higher risk. Consider replacing these with higher-rated alternatives in the same category—4+ star funds typically deliver 2-3% better annual returns with lower volatility.`,
      icon: '🔍',
      type: 'warning',
    });
  } else {
    suggestions.push({
      title: 'Solid Fund Selection',
      description: `Your funds have an average rating of ${avgRating.toFixed(
        1
      )} stars, representing good quality. ${
        funds.filter((f) => f.rating >= 4).length > 0
          ? `${
              funds.find((f) => f.rating >= 4)?.name
            } stands out as your highest-rated option`
          : 'Consider adding 4+ star funds'
      } for enhanced reliability and consistent returns over time.`,
      icon: '✨',
      type: 'info',
    });
  }

  return suggestions;
}

export default function ComparePage() {
  const { language, mounted: langMounted } = useLanguage();
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    addToCompare,
    mounted: compareMounted,
  } = useCompare();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'equity' | 'commodity'
  >('all');
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(
    null
  );
  const [selectedFunds, setSelectedFunds] = useState<Fund[]>([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const t = (key: string) => getTranslation(language, key);

  // Fetch all available funds for selection (1200 funds like equity page)
  const { funds: allFunds, loading: fundsLoading } = useFunds({
    limit: 1200,
  });

  // Transform and deduplicate funds (same as equity page)
  const availableFunds = useMemo(() => {
    const mapped = allFunds.map((fund) => ({
      ...fund,
      id: fund.id || fund.fundId,
      nav: fund.currentNav || 0,
      returns1Y: fund.returns?.oneYear || 0,
      returns3Y: fund.returns?.threeYear || 0,
      returns5Y: fund.returns?.fiveYear || 0,
    }));

    // Deduplicate funds
    const uniqueFundsMap = new Map<string, (typeof mapped)[0]>();
    mapped.forEach((fund) => {
      const normalizedName = fund.name
        .toLowerCase()
        .replace(
          /\s*-\s*(direct|regular|growth|dividend|idcw|weekly|daily|monthly|quarterly|annual).*$/i,
          ''
        )
        .replace(
          /\s*\((direct|regular|growth|dividend|idcw|weekly|daily|monthly|quarterly|annual).*\)$/i,
          ''
        )
        .trim();

      const existing = uniqueFundsMap.get(normalizedName);
      if (!existing) {
        uniqueFundsMap.set(normalizedName, fund);
      } else {
        const shouldReplace =
          fund.returns1Y > existing.returns1Y ||
          (fund.returns1Y === existing.returns1Y && fund.aum > existing.aum);
        if (shouldReplace) {
          uniqueFundsMap.set(normalizedName, fund);
        }
      }
    });

    const deduplicated = Array.from(uniqueFundsMap.values());

    // Filter for equity funds with valid data
    return deduplicated.filter((fund) => {
      const fundCategory = fund.category?.toLowerCase() || '';
      const isEquityFund =
        fundCategory === 'equity' || fundCategory.includes('equity');
      const hasName = fund.name && fund.name.trim().length > 0;
      const hasFundHouse = fund.fundHouse && fund.fundHouse.trim().length > 0;
      const hasNav = typeof fund.nav === 'number';
      const hasSomeData =
        fund.returns1Y !== 0 ||
        fund.returns3Y !== 0 ||
        fund.returns5Y !== 0 ||
        (fund.aum && fund.aum > 0) ||
        (fund.expenseRatio && fund.expenseRatio > 0);

      return isEquityFund && hasName && hasFundHouse && hasNav && hasSomeData;
    });
  }, [allFunds]);

  // Fetch detailed data for selected funds
  useEffect(() => {
    const fetchSelectedFunds = () => {
      if (compareList.length === 0) {
        setSelectedFunds([]);
        return;
      }

      setComparisonLoading(true);
      setApiError(null);

      try {
        // Get funds from the available funds list (already loaded with all necessary data)
        const fundsFromAvailable = compareList
          .map((id) => availableFunds.find((f) => f.id === id))
          .filter(Boolean) as Fund[];

        if (fundsFromAvailable.length < compareList.length) {
          const missingCount = compareList.length - fundsFromAvailable.length;
          setApiError(
            `${missingCount} fund(s) could not be loaded. Try searching for them again.`
          );
        } else {
          setApiError(null);
        }

        setSelectedFunds(fundsFromAvailable);
      } catch (error) {
        console.error('Error loading selected funds:', error);
        setApiError('Error loading fund data. Please try again.');
        setSelectedFunds([]);
      } finally {
        setComparisonLoading(false);
      }
    };

    fetchSelectedFunds();
  }, [compareList, availableFunds]);

  const funds = selectedFunds;

  // Generate dynamic suggestions - useMemo must be called before any conditional returns
  const dynamicSuggestions = useMemo(
    () => generateDynamicSuggestions(funds),
    [funds]
  );

  // Filter available funds to exclude already selected ones and apply search/category filters
  const filteredAvailableFunds = useMemo(() => {
    let filtered = availableFunds.filter((fund) => {
      // Exclude already selected funds
      if (compareList.includes(fund.id)) return false;

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          fund.name?.toLowerCase().includes(query) ||
          fund.fundHouse?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Apply category filter
      if (categoryFilter === 'equity') {
        const equityCategories = [
          'equity',
          'large cap',
          'mid cap',
          'small cap',
          'multi cap',
          'flexi cap',
          'focused',
          'dividend yield',
          'elss',
          'index',
          'sectoral',
          'thematic',
        ];
        return equityCategories.some(
          (cat) =>
            fund.category?.toLowerCase().includes(cat) ||
            fund.name?.toLowerCase().includes(cat)
        );
      } else if (categoryFilter === 'commodity') {
        const commodityCategories = ['commodity', 'gold', 'silver'];
        return commodityCategories.some(
          (cat) =>
            fund.category?.toLowerCase().includes(cat) ||
            fund.name?.toLowerCase().includes(cat)
        );
      }

      return true; // Show all if 'all' is selected
    });

    // Limit to first 50 for performance
    return filtered.slice(0, 50);
  }, [availableFunds, compareList, categoryFilter, searchQuery]);

  // NOW we can do conditional returns AFTER all hooks
  if (!langMounted || !compareMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  const metrics = [
    {
      key: 'currentNav',
      label: 'Current NAV',
      format: (v: number) => `₹${v?.toFixed(2) || 'N/A'}`,
      description: 'Net Asset Value per unit - Current price of one fund unit',
      category: 'Basic Info',
    },
    {
      key: 'returns.oneYear',
      label: '1 Year Returns',
      format: (v: number) =>
        v ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : 'N/A',
      description:
        'Past 1 year performance - Short-term returns indicating recent momentum',
      higherBetter: true,
      category: 'Performance',
    },
    {
      key: 'returns.threeYear',
      label: '3 Year Returns',
      format: (v: number) =>
        v ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : 'N/A',
      description:
        '3-year annualized returns - Medium-term performance through market cycles',
      higherBetter: true,
      category: 'Performance',
    },
    {
      key: 'returns.fiveYear',
      label: '5 Year Returns',
      format: (v: number) =>
        v ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : 'N/A',
      description:
        '5-year annualized returns - Long-term track record and consistency',
      higherBetter: true,
      category: 'Performance',
    },
    {
      key: 'returns.sinceInception',
      label: 'Returns Since Inception',
      format: (v: number) =>
        v ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : 'N/A',
      description:
        'Performance since fund launch - Complete historical track record',
      higherBetter: true,
      category: 'Performance',
    },
    {
      key: 'aum',
      label: 'Fund Size (AUM)',
      format: (v: number) => (v ? `₹${(v / 10000000).toFixed(1)} Cr` : 'N/A'),
      description:
        'Assets Under Management - Larger size indicates stability, liquidity, and investor confidence',
      category: 'Fund Health',
    },
    {
      key: 'expenseRatio',
      label: 'Expense Ratio',
      format: (v: number) => (v ? `${v.toFixed(2)}%` : 'N/A'),
      description:
        'Annual management fees - Lower means more returns in your pocket. Aim for <1%',
      lowerBetter: true,
      category: 'Cost',
    },
    {
      key: 'ratings.morningstar',
      label: 'Morningstar Rating',
      format: (v: number) => (v ? `⭐ ${v}/5` : 'N/A'),
      description:
        'Independent rating based on risk-adjusted returns - 4+ stars preferred',
      higherBetter: true,
      category: 'Quality',
    },
    {
      key: 'ratings.crisil',
      label: 'CRISIL Rating',
      format: (v: number) => (v ? `⭐ ${v}/5` : 'N/A'),
      description:
        'CRISIL expert rating - Higher rating indicates better quality',
      higherBetter: true,
      category: 'Quality',
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      format: (v: string) => v || 'N/A',
      description:
        'Risk category - Match with your risk appetite and investment goals',
      category: 'Risk Metrics',
    },
    {
      key: 'volatility',
      label: 'Volatility (Std Dev)',
      format: (v: number) => (v ? `${v.toFixed(2)}%` : 'N/A'),
      description:
        'Price fluctuation measure - Lower volatility means stable returns',
      lowerBetter: true,
      category: 'Risk Metrics',
    },
    {
      key: 'sharpeRatio',
      label: 'Sharpe Ratio',
      format: (v: number) => (v ? v.toFixed(2) : 'N/A'),
      description:
        'Risk-adjusted returns - Higher is better. >1 is good, >2 is excellent',
      higherBetter: true,
      category: 'Risk Metrics',
    },
    {
      key: 'beta',
      label: 'Beta',
      format: (v: number) => (v ? v.toFixed(2) : 'N/A'),
      description:
        'Market sensitivity - <1 less volatile than market, >1 more volatile',
      category: 'Risk Metrics',
    },
    {
      key: 'alpha',
      label: 'Alpha',
      format: (v: number) =>
        v ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : 'N/A',
      description:
        'Excess returns vs benchmark - Positive alpha shows fund manager skill',
      higherBetter: true,
      category: 'Risk Metrics',
    },
    {
      key: 'category',
      label: 'Fund Category',
      format: (v: string) => v || 'N/A',
      description:
        'Investment style and asset allocation - Diversify across categories',
      category: 'Basic Info',
    },
    {
      key: 'fundHouse',
      label: 'Fund House',
      format: (v: string) => v || 'N/A',
      description:
        'Asset Management Company - Reputation and track record matters',
      category: 'Basic Info',
    },
    {
      key: 'fundManager',
      label: 'Fund Manager',
      format: (v: any) => {
        if (typeof v === 'string') return v || 'N/A';
        if (v && typeof v === 'object' && v.name) return v.name;
        return 'N/A';
      },
      description:
        'Portfolio manager - Experience and expertise drives performance',
      category: 'Management',
    },
    {
      key: 'managerTenure',
      label: 'Manager Tenure',
      format: (v: number) => (v ? `${v} years` : 'N/A'),
      description:
        'Years managing this fund - Longer tenure indicates consistency',
      category: 'Management',
    },
    {
      key: 'minInvestment',
      label: 'Min Investment',
      format: (v: number) => (v ? `₹${v.toLocaleString()}` : '₹500'),
      description: 'Minimum lumpsum amount - SIP can start from as low as ₹500',
      category: 'Investment Terms',
    },
    {
      key: 'minSIP',
      label: 'Min SIP Amount',
      format: (v: number) => (v ? `₹${v.toLocaleString()}` : '₹500'),
      description: 'Minimum monthly SIP - Start small and increase over time',
      category: 'Investment Terms',
    },
    {
      key: 'exitLoad',
      label: 'Exit Load',
      format: (v: number) => (v ? `${v}% (if < 1 year)` : 'No Exit Load'),
      description:
        'Fee on early withdrawal - Plan to stay invested beyond exit load period',
      lowerBetter: true,
      category: 'Investment Terms',
    },
    {
      key: 'dividendYield',
      label: 'Dividend Yield',
      format: (v: number) => (v ? `${v.toFixed(2)}%` : 'N/A'),
      description:
        'Dividend income generated - Growth option reinvests for compounding',
      category: 'Returns',
    },
    {
      key: 'portfolioTurnover',
      label: 'Portfolio Turnover',
      format: (v: number) => (v ? `${v.toFixed(0)}%` : 'N/A'),
      description:
        'How often stocks are changed - Lower turnover = lower transaction costs',
      lowerBetter: true,
      category: 'Management',
    },
  ];

  // Helper to get nested value from object
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Find best and worst values for highlighting
  const getBestWorstInMetric = (metricKey: string) => {
    if (funds.length === 0) return { best: null, worst: null };
    const values = funds
      .map((f) => getNestedValue(f, metricKey))
      .filter((v) => v !== undefined && v !== null);
    if (values.length === 0) return { best: null, worst: null };

    const metric = metrics.find((m) => m.key === metricKey);

    if (metric?.higherBetter) {
      return { best: Math.max(...values), worst: Math.min(...values) };
    } else if (metric?.lowerBetter) {
      return { best: Math.min(...values), worst: Math.max(...values) };
    }
    return { best: null, worst: null };
  };

  const handleExportPDF = () => {
    // Client-side PDF generation placeholder
    const content = funds
      .map(
        (f) =>
          `${f.name}\n${f.fundHouse}\n${metrics
            .map((m) => `${m.label}: ${m.format((f as any)[m.key])}`)
            .join('\n')}\n\n`
      )
      .join('');

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element.setAttribute('download', 'fund-comparison.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-red-600">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <BackButton />
        </div>
        {/* Compact Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
            Compare Funds
          </h1>
          <p className="text-white/80 text-sm">
            Select 2-5 funds (minimum 2 required) and compare them side-by-side
            with comprehensive analysis to make informed investment decisions
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Compact Sidebar - Fund Selector */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-5 shadow-2xl border-2 border-white/30">
              {/* Selection Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Select Funds
                  </h2>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      compareList.length < 2
                        ? 'bg-gradient-to-r from-red-500 to-orange-600'
                        : compareList.length === 5
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    } text-white`}
                  >
                    {compareList.length}/5{' '}
                    {compareList.length < 2 ? '(Min: 2 Required)' : ''}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      compareList.length < 2
                        ? 'bg-gradient-to-r from-red-500 to-orange-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                    style={{ width: `${(compareList.length / 5) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  <span>Min: 2</span>
                  <span>Max: 5</span>
                </div>
                {compareList.length === 5 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                    ⚠️ Maximum limit reached. Remove a fund to add another.
                  </p>
                )}
                {compareList.length === 1 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-200 dark:border-blue-800">
                    💡 Add at least one more fund to enable comparison
                  </p>
                )}
              </div>

              {/* Selected Funds - Compact */}
              {compareList.length > 0 && (
                <div className="mb-3 space-y-2">
                  {funds.map((fund, index) => (
                    <div
                      key={fund.id}
                      className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-2.5 border border-blue-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {fund.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCompare(fund.id)}
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={clearCompare}
                    className="w-full rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Search & Add Funds */}
              {compareList.length < 5 && (
                <>
                  {/* Category Filter Buttons */}
                  <div className="mb-3 flex gap-2">
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        categoryFilter === 'all'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>🌐</span>
                        <span>All Funds</span>
                        <span className="ml-1 opacity-75">
                          (
                          {
                            availableFunds.filter(
                              (f) => !compareList.includes(f.id)
                            ).length
                          }
                          )
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => setCategoryFilter('equity')}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        categoryFilter === 'equity'
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>📈</span>
                        <span>Equity</span>
                        <span className="ml-1 opacity-75">
                          (
                          {
                            availableFunds.filter((f) => {
                              if (compareList.includes(f.id)) return false;
                              const equityCategories = [
                                'equity',
                                'large cap',
                                'mid cap',
                                'small cap',
                                'multi cap',
                                'flexi cap',
                                'focused',
                                'dividend yield',
                                'elss',
                                'index',
                                'sectoral',
                                'thematic',
                              ];
                              return equityCategories.some(
                                (cat) =>
                                  f.category?.toLowerCase().includes(cat) ||
                                  f.name?.toLowerCase().includes(cat)
                              );
                            }).length
                          }
                          )
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => setCategoryFilter('commodity')}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        categoryFilter === 'commodity'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>🪙</span>
                        <span>Commodity</span>
                        <span className="ml-1 opacity-75">
                          (
                          {
                            availableFunds.filter((f) => {
                              if (compareList.includes(f.id)) return false;
                              const commodityCategories = [
                                'commodity',
                                'gold',
                                'silver',
                              ];
                              return commodityCategories.some(
                                (cat) =>
                                  f.category?.toLowerCase().includes(cat) ||
                                  f.name?.toLowerCase().includes(cat)
                              );
                            }).length
                          }
                          )
                        </span>
                      </div>
                    </button>
                  </div>
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      placeholder="Search funds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 pl-9 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                    />
                    <svg
                      className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  {/* Search Results Info */}
                  {(searchQuery || categoryFilter !== 'all') && (
                    <div className="mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        Found {filteredAvailableFunds.length} fund
                        {filteredAvailableFunds.length !== 1 ? 's' : ''}
                        {categoryFilter !== 'all' &&
                          ` in ${categoryFilter} category`}
                        {searchQuery && ` matching "${searchQuery}"`}
                      </p>
                      {categoryFilter === 'commodity' && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-start gap-1">
                          <span>💡</span>
                          <span>
                            Note: Commodity/Gold funds invest in physical gold
                            or commodities, not stocks. Returns comparison
                            works, but holdings overlap won't apply.
                          </span>
                        </p>
                      )}
                    </div>
                  )}{' '}
                  <div className="space-y-1.5 max-h-96 overflow-y-auto">
                    {fundsLoading ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                        Loading funds...
                      </p>
                    ) : filteredAvailableFunds.length > 0 ? (
                      filteredAvailableFunds.slice(0, 15).map((fund) => (
                        <button
                          key={fund.id}
                          onClick={() => addToCompare(fund.id)}
                          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-750 p-2.5 text-left hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                        >
                          <p className="font-semibold text-gray-900 dark:text-white text-xs line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {fund.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {fund.category}
                            </span>
                            {fund.ratings?.morningstar && (
                              <span className="text-[10px] text-yellow-600 dark:text-yellow-400">
                                ⭐ {fund.ratings.morningstar}
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                        No funds found
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Comparison Results - Cleaner Layout */}
          <div className="lg:col-span-2">
            {/* API Error Notification */}
            {apiError && (
              <div className="mb-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-yellow-800 dark:text-yellow-300 mb-1">
                      API Connection Issue
                    </h3>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                      {apiError}
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                      💡 <strong>Tip:</strong> Make sure the backend server is
                      running. Try starting it with:{' '}
                      <code className="bg-yellow-100 dark:bg-yellow-900/40 px-2 py-0.5 rounded text-[10px]">
                        cd mutual-funds-backend && npm run dev
                      </code>
                    </p>
                  </div>
                  <button
                    onClick={() => setApiError(null)}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition-all flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Minimum Selection Warning */}
            {funds.length === 1 && (
              <div className="mb-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 p-6 shadow-xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-blue-800 dark:text-blue-300 mb-1">
                      Add More Funds to Compare
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                      Please select at least one more fund (minimum 2 funds
                      required) to start the comparison. You can add up to 5
                      funds for comprehensive analysis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Commodity Fund Info Card */}
            {funds.length >= 2 &&
              funds.some(
                (f) =>
                  f.category?.toLowerCase().includes('commodity') ||
                  f.category?.toLowerCase().includes('gold')
              ) && (
                <div className="mb-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 p-6 shadow-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-1">
                        Commodity/Gold Funds Comparison Note
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
                        <strong>Important:</strong> Gold and commodity funds
                        invest in physical gold, gold ETFs, or commodity
                        contracts — not in company stocks.
                      </p>
                      <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1 ml-4 list-disc">
                        <li>
                          Returns comparison works normally for these funds
                        </li>
                        <li>
                          Holdings data will show as "0" or empty (this is
                          expected)
                        </li>
                        <li>
                          For holdings overlap analysis, consider using the
                          Overlap page with equity funds only
                        </li>
                        <li>
                          Commodity funds serve as portfolio diversification and
                          hedge against inflation
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            {comparisonLoading ? (
              <div className="rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-12 text-center shadow-xl border-2 border-white/30">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading comparison...
                </p>
              </div>
            ) : funds.length >= 2 ? (
              <div className="space-y-4">
                {/* Simple Fund Cards in Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {funds.map((fund, idx) => (
                    <div
                      key={fund.id}
                      className="rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 shadow-xl border-2 border-white/30"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 flex-1">
                          {fund.name}
                        </h3>
                      </div>

                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            5Y Return
                          </span>
                          <span className="font-bold text-green-600 dark:text-green-400 text-xs">
                            +{fund.returns?.['5y'] || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            Rating
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white text-xs">
                            ⭐ {fund.ratings?.morningstar || 'N/A'}/5
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            Expense
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white text-xs">
                            {fund.expenseRatio || 'N/A'}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            Risk
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white text-xs">
                            {fund.riskLevel || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/funds/${fund.id}`}
                        className="block rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-center text-xs font-bold text-white hover:shadow-lg transition-all"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Detailed Comparison Table - Simplified */}
                <div className="rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border-2 border-white/30 overflow-hidden">
                  <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Detailed Comparison
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-bold text-white">
                            Metric
                          </th>
                          {funds.map((fund, idx) => (
                            <th
                              key={fund.id}
                              className="px-4 py-3 text-left min-w-[140px]"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-white text-blue-600 text-[10px] font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="text-[10px] font-bold text-white">
                                  Fund {idx + 1}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                          'Basic Info',
                          'Performance',
                          'Risk Metrics',
                          'Quality',
                          'Cost',
                          'Investment Terms',
                          'Management',
                          'Returns',
                        ].map((category) => {
                          const categoryMetrics = metrics.filter(
                            (m) => m.category === category
                          );
                          if (categoryMetrics.length === 0) return null;

                          return (
                            <React.Fragment key={category}>
                              <tr className="bg-gray-100 dark:bg-gray-800">
                                <td
                                  colSpan={funds.length + 1}
                                  className="px-4 py-2"
                                >
                                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                    📊 {category}
                                  </span>
                                </td>
                              </tr>
                              {categoryMetrics.map((metric) => {
                                const { best, worst } = getBestWorstInMetric(
                                  metric.key
                                );
                                return (
                                  <tr
                                    key={metric.key}
                                    className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <td className="px-4 py-3">
                                      <div className="text-xs font-semibold text-gray-900 dark:text-white">
                                        {metric.label}
                                      </div>
                                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                                        {metric.description}
                                      </div>
                                    </td>
                                    {funds.map((fund) => {
                                      const value = getNestedValue(
                                        fund,
                                        metric.key
                                      );
                                      const isBest =
                                        value === best &&
                                        best !== worst &&
                                        value !== null &&
                                        value !== undefined;
                                      const isWorst =
                                        value === worst &&
                                        best !== worst &&
                                        value !== null &&
                                        value !== undefined;

                                      return (
                                        <td
                                          key={fund.id}
                                          className={`px-4 py-3 ${
                                            isBest
                                              ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                                              : isWorst
                                              ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                                              : ''
                                          }`}
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <span
                                              className={`text-xs font-bold ${
                                                isBest
                                                  ? 'text-green-600 dark:text-green-400'
                                                  : isWorst
                                                  ? 'text-red-600 dark:text-red-400'
                                                  : 'text-gray-900 dark:text-white'
                                              }`}
                                            >
                                              {metric.format(value)}
                                            </span>
                                            {isBest && (
                                              <span
                                                className="text-xs"
                                                title="Best in category"
                                              >
                                                🏆
                                              </span>
                                            )}
                                            {isWorst && (
                                              <span
                                                className="text-xs"
                                                title="Needs attention"
                                              >
                                                ⚠️
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Comprehensive Decision-Making Insights */}
                <div className="rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-5 shadow-xl border-2 border-white/30">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">💡</span>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Investment Decision Guide
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Quick Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="rounded-xl p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Avg 5Y Returns
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          +
                          {(
                            funds.reduce(
                              (sum, f) => sum + (f.returns?.['5y'] || 0),
                              0
                            ) / funds.length
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                      <div className="rounded-xl p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Best Performer
                        </p>
                        <p className="text-xs font-bold text-green-600 dark:text-green-400 line-clamp-1">
                          {
                            funds
                              .reduce((best, f) =>
                                (f.returns?.['5y'] || 0) >
                                (best.returns?.['5y'] || 0)
                                  ? f
                                  : best
                              )
                              .name.split(' ')[0]
                          }
                        </p>
                      </div>
                      <div className="rounded-xl p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Avg Expense
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {(
                            funds.reduce(
                              (sum, f) => sum + (f.expenseRatio || 0),
                              0
                            ) / funds.length
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                      <div className="rounded-xl p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Avg Rating
                        </p>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          ⭐{' '}
                          {(
                            funds.reduce(
                              (sum, f) => sum + (f.ratings?.morningstar || 0),
                              0
                            ) / funds.length
                          ).toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {/* AI Insights */}
                    {dynamicSuggestions.length > 0 && (
                      <div className="grid gap-3 md:grid-cols-2">
                        {dynamicSuggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            className={`rounded-xl p-3 border-2 ${
                              suggestion.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : suggestion.type === 'warning'
                                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                            }`}
                          >
                            <div className="flex gap-2">
                              <span className="text-lg flex-shrink-0">
                                {suggestion.icon}
                              </span>
                              <div>
                                <h3
                                  className={`font-bold text-xs mb-1 ${
                                    suggestion.type === 'success'
                                      ? 'text-green-700 dark:text-green-400'
                                      : suggestion.type === 'warning'
                                      ? 'text-yellow-700 dark:text-yellow-400'
                                      : 'text-blue-700 dark:text-blue-400'
                                  }`}
                                >
                                  {suggestion.title}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {suggestion.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Investment Recommendations */}
                    <div className="rounded-xl p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800">
                      <h3 className="font-bold text-sm text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        Key Investment Considerations
                      </h3>
                      <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Investment Horizon:</strong> Choose funds
                            based on your time frame -{' '}
                            {funds.some((f) => f.category?.includes('Equity'))
                              ? 'Equity funds need 5+ years'
                              : 'Debt funds suitable for shorter periods'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Risk Tolerance:</strong>{' '}
                            {funds.filter((f) => f.riskLevel === 'High')
                              .length > 0
                              ? 'High-risk funds included - ensure you can handle volatility'
                              : 'Moderate risk profile - suitable for balanced investors'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Portfolio Allocation:</strong> Diversify
                            investments across{' '}
                            {[...new Set(funds.map((f) => f.category))].length}{' '}
                            categories - don't put all money in one fund
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>SIP vs Lumpsum:</strong> Consider systematic
                            investment (SIP) for rupee cost averaging,
                            especially for equity funds
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Exit Strategy:</strong> Check exit loads -{' '}
                            {funds.some((f) => (f.exitLoad || 0) > 0)
                              ? 'Some funds charge exit fees for early withdrawal'
                              : 'No exit load on these funds'}
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Risk-Return Profile */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="rounded-xl p-4 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-2 border-rose-200 dark:border-rose-800">
                        <h3 className="font-bold text-sm text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-2">
                          <span>⚠️</span> Risk Analysis
                        </h3>
                        <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                          <div className="flex justify-between items-center">
                            <span>High Risk Funds:</span>
                            <span className="font-bold text-red-600 dark:text-red-400">
                              {
                                funds.filter(
                                  (f) =>
                                    f.riskLevel === 'High' ||
                                    f.riskLevel === 'Very High'
                                ).length
                              }
                              /{funds.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Moderate Risk:</span>
                            <span className="font-bold text-yellow-600 dark:text-yellow-400">
                              {
                                funds.filter(
                                  (f) =>
                                    f.riskLevel === 'Moderate' ||
                                    f.riskLevel === 'Moderately High'
                                ).length
                              }
                              /{funds.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Low Risk:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {
                                funds.filter(
                                  (f) =>
                                    f.riskLevel === 'Low' ||
                                    f.riskLevel === 'Moderately Low'
                                ).length
                              }
                              /{funds.length}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-2 italic">
                            💡 Balance high-risk funds with stable options for
                            better portfolio stability
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl p-4 bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 border-2 border-teal-200 dark:border-teal-800">
                        <h3 className="font-bold text-sm text-teal-700 dark:text-teal-400 mb-2 flex items-center gap-2">
                          <span>📈</span> Return Potential
                        </h3>
                        <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                          <div className="flex justify-between items-center">
                            <span>Best 5Y Return:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              +
                              {Math.max(
                                ...funds.map((f) => f.returns?.['5y'] || 0)
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Lowest 5Y Return:</span>
                            <span className="font-bold text-gray-600 dark:text-gray-400">
                              +
                              {Math.min(
                                ...funds.map((f) => f.returns?.['5y'] || 0)
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Return Range:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {(
                                Math.max(
                                  ...funds.map((f) => f.returns?.['5y'] || 0)
                                ) -
                                Math.min(
                                  ...funds.map((f) => f.returns?.['5y'] || 0)
                                )
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-2 italic">
                            💡 Past performance doesn't guarantee future returns
                            - review regularly
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExportPDF}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-bold text-sm text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Report
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-12 text-center shadow-xl border-2 border-white/30">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Start Comparing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select up to 3 mutual funds from the sidebar to compare
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-white/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-700 dark:text-gray-300">
            <p>&copy; 2025 MutualFunds.in. All rights reserved.</p>
            <p className="mt-2">
              Smart comparison powered by real-time data and AI insights
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
}
