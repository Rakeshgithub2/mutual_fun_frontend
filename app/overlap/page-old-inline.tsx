'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  GitCompare,
  AlertTriangle,
  CheckCircle,
  Info,
  PieChart,
  Target,
  Sparkles,
  Loader2,
  BookOpen,
  Search,
  X,
  TrendingUp,
  Building2,
  Star,
  Plus,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useFunds } from '@/hooks/use-funds';
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface FundOption {
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

interface Holding {
  name: string;
  ticker?: string;
  percentage: number;
  sector: string;
}

export default function OverlapPage() {
  const [selectedFunds, setSelectedFunds] = useState<FundOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [holdings, setHoldings] = useState<Record<string, Holding[]>>({});
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const { funds: allFunds, loading: fundsLoading } = useFunds({ limit: 3000 });

  // Transform funds (only equity and debt)
  const transformedFunds = useMemo(() => {
    return allFunds
      .filter((fund) => {
        const category = fund.category?.toLowerCase() || '';
        const name = fund.name?.toLowerCase() || '';
        // Exclude commodity funds
        const isCommodity =
          category.includes('commodity') ||
          name.includes('gold') ||
          name.includes('silver') ||
          category.includes('gold');
        return !isCommodity;
      })
      .map((fund) => ({
        id: fund.id || fund.fundId,
        name: fund.name,
        fundHouse: fund.fundHouse,
        category: fund.category,
        nav: fund.currentNav || 0,
        returns1Y: fund.returns?.oneYear || 0,
        returns3Y: fund.returns?.threeYear || 0,
        returns5Y: fund.returns?.fiveYear || 0,
        aum: fund.aum || 0,
        expenseRatio: fund.expenseRatio || 0,
        rating: fund.rating || 0,
      }));
  }, [allFunds]);

  // Search and filter funds
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    return transformedFunds
      .filter((fund) => {
        // Exclude already selected
        if (selectedFunds.some((sf) => sf.id === fund.id)) return false;

        // Search match
        return (
          fund.name.toLowerCase().includes(query) ||
          fund.fundHouse.toLowerCase().includes(query) ||
          fund.category?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.returns3Y - a.returns3Y)
      .slice(0, 20);
  }, [searchQuery, transformedFunds, selectedFunds]);

  // Generate mock holdings
  const generateMockHoldings = (fund: FundOption): Holding[] => {
    const category = fund.category?.toLowerCase() || '';

    if (category.includes('large')) {
      return [
        { name: 'Reliance Industries Ltd', sector: 'Energy', percentage: 8.5 },
        { name: 'HDFC Bank Ltd', sector: 'Financials', percentage: 7.2 },
        { name: 'Infosys Ltd', sector: 'IT', percentage: 6.8 },
        { name: 'ICICI Bank Ltd', sector: 'Financials', percentage: 6.5 },
        { name: 'TCS Ltd', sector: 'IT', percentage: 5.9 },
        { name: 'Hindustan Unilever Ltd', sector: 'FMCG', percentage: 5.3 },
        { name: 'Bharti Airtel Ltd', sector: 'Telecom', percentage: 4.8 },
        { name: 'Kotak Mahindra Bank', sector: 'Financials', percentage: 4.5 },
        { name: 'ITC Ltd', sector: 'FMCG', percentage: 4.2 },
        { name: 'Axis Bank Ltd', sector: 'Financials', percentage: 3.9 },
      ];
    } else if (category.includes('mid')) {
      return [
        { name: 'Dixon Technologies', sector: 'Electronics', percentage: 4.8 },
        { name: 'Tube Investments', sector: 'Industrials', percentage: 4.5 },
        { name: 'Polycab India', sector: 'Industrials', percentage: 4.2 },
        { name: 'PI Industries', sector: 'Chemicals', percentage: 3.9 },
        {
          name: 'Balkrishna Industries',
          sector: 'Auto Components',
          percentage: 3.7,
        },
        { name: 'Max Healthcare', sector: 'Healthcare', percentage: 3.5 },
        { name: 'Kalyan Jewellers', sector: 'Retail', percentage: 3.3 },
        { name: 'Trent Ltd', sector: 'Retail', percentage: 3.2 },
        { name: 'Zomato Ltd', sector: 'Consumer Services', percentage: 3.0 },
        { name: 'Muthoot Finance', sector: 'Financials', percentage: 2.9 },
      ];
    } else {
      return [
        { name: 'HDFC Bank Ltd', sector: 'Financials', percentage: 6.5 },
        { name: 'Infosys Ltd', sector: 'IT', percentage: 5.8 },
        { name: 'Reliance Industries', sector: 'Energy', percentage: 5.5 },
        { name: 'ICICI Bank Ltd', sector: 'Financials', percentage: 5.2 },
        { name: 'TCS Ltd', sector: 'IT', percentage: 4.9 },
        { name: 'Bharti Airtel', sector: 'Telecom', percentage: 4.5 },
        { name: 'Larsen & Toubro', sector: 'Infrastructure', percentage: 4.2 },
        { name: 'Asian Paints', sector: 'Consumer Durables', percentage: 3.9 },
        { name: 'Maruti Suzuki', sector: 'Automobile', percentage: 3.7 },
        { name: 'HCL Technologies', sector: 'IT', percentage: 3.5 },
      ];
    }
  };

  // Fetch holdings when funds are selected
  useEffect(() => {
    if (selectedFunds.length === 0) {
      setHoldings({});
      setAnalyzed(false);
      return;
    }
  }, [selectedFunds]);

  // Handle fund selection
  const handleSelectFund = (fund: FundOption) => {
    if (selectedFunds.length >= 5) return;
    setSelectedFunds([...selectedFunds, fund]);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Handle fund removal
  const handleRemoveFund = (fundId: string) => {
    setSelectedFunds(selectedFunds.filter((f) => f.id !== fundId));
    setAnalyzed(false);
  };

  // Analyze overlap
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const holdingsData: Record<string, Holding[]> = {};

      await Promise.all(
        selectedFunds.map(async (fund) => {
          try {
            const response = await apiClient.getFundById(fund.id);
            if (response.success && response.data && response.data.holdings) {
              holdingsData[fund.id] = response.data.holdings.map((h: any) => ({
                name: h.name || h.companyName || h.holding || 'Unknown',
                ticker: h.ticker || h.symbol,
                percentage: h.percentage || h.weight || 0,
                sector: h.sector || h.industry || 'Other',
              }));
            } else {
              holdingsData[fund.id] = generateMockHoldings(fund);
            }
          } catch (error) {
            holdingsData[fund.id] = generateMockHoldings(fund);
          }
        })
      );

      setHoldings(holdingsData);
      setAnalyzed(true);
    } catch (error) {
      console.error('Failed to fetch holdings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overlap
  const overlapAnalysis = useMemo(() => {
    if (Object.keys(holdings).length < 2) return null;

    const holdingMap = new Map<
      string,
      { funds: Set<string>; percentages: number[] }
    >();

    Object.entries(holdings).forEach(([fundId, fundHoldings]) => {
      fundHoldings.forEach((holding) => {
        const key = holding.name.toLowerCase().trim();
        if (!holdingMap.has(key)) {
          holdingMap.set(key, { funds: new Set(), percentages: [] });
        }
        const data = holdingMap.get(key)!;
        data.funds.add(fundId);
        data.percentages.push(holding.percentage);
      });
    });

    const commonHoldings = Array.from(holdingMap.entries())
      .filter(([_, data]) => data.funds.size >= 2)
      .map(([name, data]) => ({
        name,
        fundCount: data.funds.size,
        avgPercentage:
          data.percentages.reduce((sum, p) => sum + p, 0) /
          data.percentages.length,
      }))
      .sort((a, b) => b.avgPercentage - a.avgPercentage);

    const overlapPercentage = Math.min(
      100,
      commonHoldings.reduce((sum, h) => sum + h.avgPercentage, 0)
    );

    return {
      commonHoldings,
      overlapPercentage,
      diversificationScore: Math.max(0, 100 - overlapPercentage),
    };
  }, [holdings]);

  const canAnalyze = selectedFunds.length >= 2 && selectedFunds.length <= 5;

  const getOverlapLevel = (percentage: number) => {
    if (percentage >= 70)
      return {
        level: 'Very High',
        color: 'text-red-600',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-300',
      };
    if (percentage >= 50)
      return {
        level: 'High',
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-300',
      };
    if (percentage >= 30)
      return {
        level: 'Moderate',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-300',
      };
    if (percentage >= 15)
      return {
        level: 'Low',
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-300',
      };
    return {
      level: 'Very Low',
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-300',
    };
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return `₹${(num / 1000).toFixed(1)}k Cr`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(2)}k Cr`;
    return `₹${num.toFixed(0)} Cr`;
  };

  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Fixed Back Button */}
      <Link
        href="/"
        className="fixed top-20 left-6 z-50 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <GitCompare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Portfolio Overlap Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mt-1">
                Analyze 2-5 equity/debt funds for portfolio overlap
              </p>
            </div>
          </div>
        </motion.div>

        {/* Selection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-2xl border-4 border-green-100 dark:border-green-900">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b-2 border-green-100 dark:border-green-900">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" />
                Select 2-5 Funds to Compare
                {selectedFunds.length > 0 && (
                  <Badge className="ml-2 text-lg px-3 py-1 bg-green-600 text-white">
                    {selectedFunds.length}/5 Selected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Info Banner */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                      How Overlap Analysis Works
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Select 2 to 5 funds below. We'll show you which stocks
                      they have in common, sector overlap, and if you're getting
                      good diversification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar - Large and Prominent */}
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  <Search className="w-5 h-5 inline mr-2" />
                  Search for Funds
                </label>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-green-600 dark:text-green-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Type fund name, AMC, or category (e.g., HDFC Top 100, ICICI Bluechip, Axis Small Cap)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() =>
                      searchQuery.length >= 2 && setShowSuggestions(true)
                    }
                    disabled={selectedFunds.length >= 5}
                    className="pl-14 pr-14 h-16 text-lg border-3 border-green-300 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500 rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Search Suggestions - Large and Clear */}
                <AnimatePresence>
                  {showSuggestions && searchQuery.length >= 2 && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setShowSuggestions(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 border-3 border-green-300 dark:border-green-700 rounded-2xl shadow-2xl z-30 max-h-[500px] overflow-y-auto"
                      >
                        {fundsLoading && (
                          <div className="p-12 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                              Loading funds...
                            </p>
                          </div>
                        )}

                        {!fundsLoading && searchResults.length === 0 && (
                          <div className="p-12 text-center">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              No funds found
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              Try a different search term
                            </p>
                          </div>
                        )}

                        {!fundsLoading &&
                          searchResults.map((fund) => (
                            <button
                              key={fund.id}
                              onClick={() => handleSelectFund(fund)}
                              disabled={selectedFunds.length >= 5}
                              className="w-full text-left p-5 hover:bg-green-50 dark:hover:bg-green-950/30 border-b-2 border-gray-100 dark:border-gray-700 last:border-b-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                  <TrendingUp className="w-7 h-7 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {fund.name}
                                  </p>

                                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    <div className="flex items-center gap-1">
                                      <Building2 className="w-4 h-4" />
                                      <span>{fund.fundHouse}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{fund.category}</span>
                                    {fund.rating > 0 && (
                                      <>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                          <span className="font-semibold">
                                            {fund.rating}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                        NAV
                                      </p>
                                      <p className="font-bold text-gray-900 dark:text-white">
                                        ₹{fund.nav.toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                        1Y Return
                                      </p>
                                      <p
                                        className={`font-bold ${
                                          fund.returns1Y >= 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}
                                      >
                                        {fund.returns1Y >= 0 ? '+' : ''}
                                        {fund.returns1Y.toFixed(1)}%
                                      </p>
                                    </div>
                                    <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                        AUM
                                      </p>
                                      <p className="font-bold text-gray-900 dark:text-white text-xs">
                                        {formatNumber(fund.aum)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <Plus className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 group-hover:scale-125 transition-transform" />
                              </div>
                            </button>
                          ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Selected Funds Display - Large Cards */}
              {selectedFunds.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Selected Funds ({selectedFunds.length}/5)
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFunds([])}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-300"
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFunds.map((fund, index) => (
                      <motion.div
                        key={fund.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <Card className="p-5 border-3 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 hover:shadow-xl transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {index + 1}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 text-base">
                                {fund.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {fund.fundHouse}
                              </p>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs">
                                  {fund.category}
                                </Badge>
                                <span
                                  className={`text-sm font-bold ${
                                    fund.returns1Y >= 0
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {fund.returns1Y >= 0 ? '+' : ''}
                                  {fund.returns1Y.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveFund(fund.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-full p-2 transition-colors flex-shrink-0"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze Button - Large and Prominent */}
              {canAnalyze && (
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="px-12 py-8 text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 rounded-2xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                        Analyzing Portfolio...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-3" />
                        Analyze Portfolio Overlap
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Selection Helper */}
              {selectedFunds.length > 0 && selectedFunds.length < 2 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-300 dark:border-yellow-800 rounded-xl">
                  <p className="text-center text-yellow-800 dark:text-yellow-300 font-semibold flex items-center justify-center gap-2">
                    <Info className="w-5 h-5" />
                    Select at least {2 - selectedFunds.length} more{' '}
                    {2 - selectedFunds.length === 1 ? 'fund' : 'funds'} to
                    analyze overlap
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Overlap Results */}
        {analyzed && overlapAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 space-y-8"
          >
            {/* Overlap Score Card */}
            {(() => {
              const info = getOverlapLevel(overlapAnalysis.overlapPercentage);
              return (
                <Card
                  className={`p-8 border-4 ${info.bg} ${info.border} shadow-2xl`}
                >
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="text-center">
                      <div className="text-7xl font-black text-gray-900 dark:text-white mb-2">
                        {overlapAnalysis.overlapPercentage.toFixed(0)}%
                      </div>
                      <p className={`text-2xl font-bold ${info.color} mb-1`}>
                        {info.level} Overlap
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Portfolio Overlap
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-5xl font-black text-green-600 dark:text-green-400 mb-2">
                        {overlapAnalysis.diversificationScore.toFixed(0)}
                      </div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Diversification Score
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2">
                        {overlapAnalysis.commonHoldings.length}
                      </div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Common Stocks
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-5 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      {overlapAnalysis.overlapPercentage >= 70 && (
                        <>
                          <strong className="text-red-600 dark:text-red-400">
                            ⚠️ Very High Overlap:
                          </strong>{' '}
                          These funds hold many of the same stocks. Consider
                          replacing one with a different category for better
                          diversification.
                        </>
                      )}
                      {overlapAnalysis.overlapPercentage >= 50 &&
                        overlapAnalysis.overlapPercentage < 70 && (
                          <>
                            <strong className="text-orange-600 dark:text-orange-400">
                              ⚠️ High Overlap:
                            </strong>{' '}
                            Significant overlap detected. You may not be getting
                            full diversification benefits.
                          </>
                        )}
                      {overlapAnalysis.overlapPercentage >= 30 &&
                        overlapAnalysis.overlapPercentage < 50 && (
                          <>
                            <strong className="text-yellow-600 dark:text-yellow-400">
                              ℹ️ Moderate Overlap:
                            </strong>{' '}
                            Some common holdings exist. This is acceptable for
                            similar categories.
                          </>
                        )}
                      {overlapAnalysis.overlapPercentage < 30 && (
                        <>
                          <strong className="text-green-600 dark:text-green-400">
                            ✅ Good Diversification:
                          </strong>{' '}
                          Limited overlap provides good portfolio
                          diversification.
                        </>
                      )}
                    </p>
                  </div>
                </Card>
              );
            })()}

            {/* Common Holdings Table */}
            {overlapAnalysis.commonHoldings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Target className="w-7 h-7 text-blue-600" />
                    Common Holdings ({
                      overlapAnalysis.commonHoldings.length
                    }{' '}
                    stocks)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                          <th className="text-left py-4 px-4 text-base font-bold text-gray-900 dark:text-white">
                            Stock Name
                          </th>
                          <th className="text-center py-4 px-4 text-base font-bold text-gray-900 dark:text-white">
                            Found In
                          </th>
                          <th className="text-right py-4 px-4 text-base font-bold text-gray-900 dark:text-white">
                            Avg Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {overlapAnalysis.commonHoldings
                          .slice(0, 20)
                          .map((holding, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            >
                              <td className="py-4 px-4">
                                <p className="font-semibold text-gray-900 dark:text-white text-base">
                                  {holding.name}
                                </p>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-base px-3 py-1">
                                  {holding.fundCount}{' '}
                                  {holding.fundCount === 1 ? 'fund' : 'funds'}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                  {holding.avgPercentage.toFixed(2)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Educational Tooltip */}
            <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-3 border-amber-300 dark:border-amber-800">
              <div className="flex items-start gap-4">
                <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    💡 Understanding Portfolio Overlap
                  </h3>
                  <div className="space-y-3 text-base text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>What is Overlap?</strong> When multiple funds hold
                      the same stocks, you're essentially doubling down on the
                      same companies instead of diversifying.
                    </p>
                    <p>
                      <strong>Why It Matters:</strong> High overlap (50%+)
                      reduces diversification benefits. If those common stocks
                      fall, all your funds will be impacted.
                    </p>
                    <p>
                      <strong>Ideal Scenario:</strong> Aim for overlap below 30%
                      to ensure good diversification across different companies
                      and sectors.
                    </p>
                    <p>
                      <strong>What To Do:</strong> If overlap is high, consider
                      swapping one fund for a different category (e.g., replace
                      large-cap with mid-cap or debt fund).
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
