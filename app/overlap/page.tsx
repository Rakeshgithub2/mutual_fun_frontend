'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  GitCompare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  PieChart,
  Target,
  Search,
  X,
} from 'lucide-react';
import { useFunds } from '@/lib/hooks/use-funds';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface FundHolding {
  name: string;
  ticker?: string;
  percentage: number;
  sector: string;
  value?: number;
}

interface FundDetails {
  id: string;
  name: string;
  category: string;
  fundHouse: string;
  rating?: number;
  aum?: number;
  returns1Y?: number;
  returns3Y?: number;
  returns5Y?: number;
  returnsSinceInception?: number;
  riskLevel?: string;
  volatility?: number;
  sharpeRatio?: number;
  alpha?: number;
  beta?: number;
  expenseRatio?: number;
  minInvestment?: number;
  minSIP?: number;
  exitLoad?: string;
  fundManager?: string;
  portfolioTurnover?: number;
  holdings?: FundHolding[];
  topHoldings?: FundHolding[];
  sectorAllocation?: Array<{ sector: string; percentage: number }>;
}

interface CommonHolding {
  name: string;
  ticker?: string;
  sector: string;
  fundWeights: { [fundId: string]: number };
  avgWeight: number;
}

interface SectorOverlap {
  sector: string;
  fundAllocations: { [fundId: string]: number };
  avgAllocation: number;
}

interface OverlapResult {
  funds: FundDetails[];
  overlapPercentage: number;
  commonHoldings: CommonHolding[];
  sectorOverlap: SectorOverlap[];
  diversificationScore: number;
  recommendation: string;
  similarities: {
    sameFundManager: string[];
    similarRiskLevel: string[];
    similarCategory: string[];
  };
}

export default function OverlapPage() {
  const { funds, loading } = useFunds({ limit: 100 });
  const [selectedFundIds, setSelectedFundIds] = useState<string[]>([]);
  const [result, setResult] = useState<OverlapResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'equity' | 'commodity'
  >('all');

  // Filter funds based on category and search query
  const filteredFunds = useMemo(() => {
    let filtered = funds;

    // Apply category filter
    if (categoryFilter === 'equity') {
      filtered = funds.filter(
        (fund) =>
          fund.category?.toLowerCase().includes('equity') ||
          fund.category?.toLowerCase().includes('large cap') ||
          fund.category?.toLowerCase().includes('mid cap') ||
          fund.category?.toLowerCase().includes('small cap') ||
          fund.category?.toLowerCase().includes('multi cap') ||
          fund.category?.toLowerCase().includes('flexi cap') ||
          fund.category?.toLowerCase().includes('focused') ||
          fund.category?.toLowerCase().includes('dividend yield') ||
          fund.category?.toLowerCase().includes('elss') ||
          fund.category?.toLowerCase().includes('index') ||
          fund.category?.toLowerCase().includes('sectoral') ||
          fund.category?.toLowerCase().includes('thematic')
      );
    } else if (categoryFilter === 'commodity') {
      filtered = funds.filter(
        (fund) =>
          fund.category?.toLowerCase().includes('commodity') ||
          fund.category?.toLowerCase().includes('gold') ||
          fund.category?.toLowerCase().includes('silver') ||
          fund.name?.toLowerCase().includes('commodity') ||
          fund.name?.toLowerCase().includes('gold') ||
          fund.name?.toLowerCase().includes('silver')
      );
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (fund) =>
          fund.name.toLowerCase().includes(query) ||
          fund.category?.toLowerCase().includes(query) ||
          fund.fundHouse?.toLowerCase().includes(query) ||
          fund.manager?.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [funds, searchQuery, categoryFilter]);

  const toggleFundSelection = (fundId: string) => {
    setSelectedFundIds((prev) => {
      if (prev.includes(fundId)) {
        return prev.filter((id) => id !== fundId);
      } else {
        if (prev.length >= 5) return prev; // Max 5 funds
        return [...prev, fundId];
      }
    });
  };

  const analyzeOverlap = async () => {
    if (selectedFundIds.length < 2) return;

    setAnalyzing(true);
    console.log('Starting overlap analysis for funds:', selectedFundIds);

    try {
      // Fetch detailed data for all selected funds
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
      console.log('Using API URL:', API_URL);

      const fundDetailsPromises = selectedFundIds.map(async (id) => {
        console.log(`Fetching fund details for: ${id}`);
        const url = `${API_URL}/funds/${id}`;
        console.log('Request URL:', url);
        const response = await fetch(url);
        console.log(`Response status for ${id}:`, response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to fetch fund ${id}:`, errorText);
          throw new Error(
            `Failed to fetch fund ${id}: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log(`Fund data for ${id}:`, data);
        // Extract and map the fund data from the API response
        const fundData = data.data || data;

        // Map API response to our interface format
        return {
          ...fundData,
          returns1Y: fundData.returns?.oneYear,
          returns3Y: fundData.returns?.threeYear,
          returns5Y: fundData.returns?.fiveYear,
          returnsSinceInception: fundData.returns?.sinceInception,
          rating:
            fundData.ratings?.morningstar ||
            fundData.ratings?.crisil ||
            fundData.ratings?.valueResearch,
          volatility: fundData.riskMetrics?.standardDeviation,
          sharpeRatio: fundData.riskMetrics?.sharpeRatio,
          alpha: fundData.riskMetrics?.alpha,
          beta: fundData.riskMetrics?.beta,
          minSIP: fundData.sipMinAmount,
          exitLoad: fundData.exitLoad?.toString(),
          // Ensure we have topHoldings available
          topHoldings: fundData.topHoldings || fundData.holdings || [],
        };
      });

      const fundDetails: FundDetails[] = await Promise.all(fundDetailsPromises);
      console.log('All fund details fetched:', fundDetails.length, 'funds');
      console.log('Fund details:', fundDetails);

      // Calculate common holdings across all funds
      const holdingsMap = new Map<string, CommonHolding>();

      fundDetails.forEach((fund) => {
        // Use topHoldings instead of holdings
        const holdings = fund.topHoldings || fund.holdings || [];
        console.log(
          `Processing holdings for ${fund.name}:`,
          holdings.length,
          'holdings'
        );

        if (holdings.length === 0) {
          const isCommodityFund =
            fund.category?.toLowerCase().includes('commodity') ||
            fund.category?.toLowerCase().includes('gold') ||
            fund.category?.toLowerCase().includes('silver') ||
            fund.name?.toLowerCase().includes('gold') ||
            fund.name?.toLowerCase().includes('silver');
          console.warn(
            `⚠️ No holdings found for fund: ${fund.name} (${fund.id})${
              isCommodityFund
                ? ' - This is expected for commodity/gold funds'
                : ''
            }`
          );
        }

        holdings.forEach((holding) => {
          const key = holding.name.toLowerCase().trim();
          if (!holdingsMap.has(key)) {
            holdingsMap.set(key, {
              name: holding.name,
              ticker: holding.ticker,
              sector: holding.sector,
              fundWeights: {},
              avgWeight: 0,
            });
          }
          const commonHolding = holdingsMap.get(key)!;
          commonHolding.fundWeights[fund.id] = holding.percentage;
        });
      });

      console.log('Total unique holdings across all funds:', holdingsMap.size);

      // Filter to only common holdings (present in 2+ funds)
      const allHoldings = Array.from(holdingsMap.values());
      console.log('Holdings before filtering:', allHoldings.length);

      const commonHoldings: CommonHolding[] = allHoldings
        .filter((holding) => {
          const numFunds = Object.keys(holding.fundWeights).length;
          if (numFunds >= 2) {
            console.log(
              `✓ Common holding found: ${holding.name} (in ${numFunds} funds)`
            );
          }
          return numFunds >= 2;
        })
        .map((holding) => {
          const weights = Object.values(holding.fundWeights);
          holding.avgWeight =
            weights.reduce((sum, w) => sum + w, 0) / weights.length;
          return holding;
        })
        .sort((a, b) => b.avgWeight - a.avgWeight);

      console.log('Common holdings found:', commonHoldings.length);

      // Check if any fund has placeholder/dummy data
      const hasDummyData = fundDetails.some((fund) => {
        const holdings = fund.topHoldings || fund.holdings || [];
        return holdings.some(
          (h) =>
            h.name.toLowerCase().includes('stock ') &&
            (h.ticker?.startsWith('STOCK') || h.ticker?.match(/^STOCK\d+$/))
        );
      });

      if (hasDummyData) {
        console.warn(
          '⚠️ Warning: Some funds contain placeholder/dummy data (Stock 1, Stock 2, etc.). Overlap analysis may show 0% because these placeholder names do not match real company names in other funds.'
        );
      }

      // Also get unique holdings for each fund
      const uniqueHoldingsPerFund = fundDetails.map((fund) => {
        const fundHoldings = fund.topHoldings || fund.holdings || [];
        const uniqueHoldings = fundHoldings.filter((holding) => {
          const key = holding.name.toLowerCase().trim();
          const commonHolding = holdingsMap.get(key);
          return (
            commonHolding && Object.keys(commonHolding.fundWeights).length === 1
          );
        });
        console.log(`Unique holdings for ${fund.name}:`, uniqueHoldings.length);
        return { fundName: fund.name, uniqueHoldings };
      });

      // Calculate sector overlap
      const sectorMap = new Map<string, SectorOverlap>();
      fundDetails.forEach((fund) => {
        fund.sectorAllocation?.forEach((sector) => {
          if (!sectorMap.has(sector.sector)) {
            sectorMap.set(sector.sector, {
              sector: sector.sector,
              fundAllocations: {},
              avgAllocation: 0,
            });
          }
          const sectorOverlap = sectorMap.get(sector.sector)!;
          sectorOverlap.fundAllocations[fund.id] = sector.percentage;
        });
      });

      const sectorOverlap: SectorOverlap[] = Array.from(sectorMap.values())
        .filter((sector) => Object.keys(sector.fundAllocations).length >= 2)
        .map((sector) => {
          const allocations = Object.values(sector.fundAllocations);
          sector.avgAllocation =
            allocations.reduce((sum, a) => sum + a, 0) / allocations.length;
          return sector;
        })
        .sort((a, b) => b.avgAllocation - a.avgAllocation);

      // Calculate overlap percentage
      const totalHoldingsCount = fundDetails.reduce(
        (sum, fund) => sum + ((fund.topHoldings || fund.holdings)?.length || 0),
        0
      );
      const avgHoldingsPerFund = totalHoldingsCount / fundDetails.length;
      const overlapPercentage = Math.round(
        (commonHoldings.length / avgHoldingsPerFund) * 100
      );

      // Diversification score (0-100, higher is better)
      const diversificationScore = Math.max(0, 100 - overlapPercentage);

      // Find similarities
      const similarities = {
        sameFundManager: [] as string[],
        similarRiskLevel: [] as string[],
        similarCategory: [] as string[],
      };

      // Check for same fund manager
      const managerGroups = new Map<string, string[]>();
      fundDetails.forEach((fund) => {
        const managerName =
          typeof fund.fundManager === 'string'
            ? fund.fundManager
            : typeof fund.fundManager === 'object' && fund.fundManager?.name
            ? fund.fundManager.name
            : null;

        if (managerName) {
          if (!managerGroups.has(managerName)) {
            managerGroups.set(managerName, []);
          }
          managerGroups.get(managerName)!.push(fund.name);
        }
      });
      managerGroups.forEach((fundNames, manager) => {
        if (fundNames.length >= 2) {
          similarities.sameFundManager.push(
            `${manager} manages: ${fundNames.join(', ')}`
          );
        }
      });

      // Check for similar risk levels
      const riskGroups = new Map<string, string[]>();
      fundDetails.forEach((fund) => {
        const risk = fund.riskLevel || 'Unknown';
        if (!riskGroups.has(risk)) {
          riskGroups.set(risk, []);
        }
        riskGroups.get(risk)!.push(fund.name);
      });
      riskGroups.forEach((fundNames, risk) => {
        if (fundNames.length >= 2 && risk !== 'Unknown') {
          similarities.similarRiskLevel.push(
            `${risk} risk: ${fundNames.join(', ')}`
          );
        }
      });

      // Check for similar categories
      const categoryGroups = new Map<string, string[]>();
      fundDetails.forEach((fund) => {
        if (!categoryGroups.has(fund.category)) {
          categoryGroups.set(fund.category, []);
        }
        categoryGroups.get(fund.category)!.push(fund.name);
      });
      categoryGroups.forEach((fundNames, category) => {
        if (fundNames.length >= 2) {
          similarities.similarCategory.push(
            `${category}: ${fundNames.join(', ')}`
          );
        }
      });

      // Check if any fund is a commodity/gold fund
      const hasCommodityFunds = fundDetails.some(
        (fund) =>
          fund.category?.toLowerCase().includes('commodity') ||
          fund.category?.toLowerCase().includes('gold') ||
          fund.category?.toLowerCase().includes('silver') ||
          fund.name?.toLowerCase().includes('gold') ||
          fund.name?.toLowerCase().includes('silver')
      );
      const commodityFundCount = fundDetails.filter(
        (fund) =>
          fund.category?.toLowerCase().includes('commodity') ||
          fund.category?.toLowerCase().includes('gold') ||
          fund.category?.toLowerCase().includes('silver') ||
          fund.name?.toLowerCase().includes('gold') ||
          fund.name?.toLowerCase().includes('silver')
      ).length;

      // Generate recommendation
      let recommendation = '';
      if (hasCommodityFunds && commonHoldings.length === 0) {
        recommendation = `ℹ️ **About Commodity/Gold Funds**: ${
          commodityFundCount === fundDetails.length ? 'All' : commodityFundCount
        } of your selected funds ${
          commodityFundCount === 1 ? 'is a' : 'are'
        } commodity/gold fund${
          commodityFundCount === 1 ? '' : 's'
        }. Gold and commodity funds don't hold stocks - they invest in physical gold, gold ETFs, or commodity contracts. Therefore, **0% holdings overlap is expected and normal**. For meaningful overlap analysis, compare equity funds with other equity funds, or debt funds with other debt funds. Commodity funds serve as portfolio diversification tools and hedge against market volatility.${
          fundDetails.length > commodityFundCount
            ? ' The remaining equity/debt funds in your selection show diversification benefits.'
            : ''
        }`;
      } else if (hasDummyData && commonHoldings.length === 0) {
        recommendation = `ℹ️ **Note about Data Quality**: Some of the selected funds contain placeholder/dummy data (e.g., "Stock 1", "Stock 2" instead of real company names like "HDFC Bank" or "Reliance Industries"). This prevents accurate overlap calculation. The 0% overlap shown is due to mismatched placeholder names, not actual fund diversification. For accurate overlap analysis, please select funds that have real company holding data, or wait for the backend to be populated with actual fund holdings from reliable sources.${
          hasCommodityFunds
            ? ' Note: Commodity/gold funds naturally have no stock holdings.'
            : ''
        }`;
      } else if (overlapPercentage < 20) {
        recommendation = `🎯 Excellent diversification! Your ${fundDetails.length} selected funds have minimal overlap (${overlapPercentage}%) with only ${commonHoldings.length} common holdings. This portfolio offers strong diversification across different stocks and sectors, reducing concentration risk significantly. Your diversification score is ${diversificationScore}/100.`;
      } else if (overlapPercentage < 35) {
        recommendation = `✅ Good diversification. With ${overlapPercentage}% overlap across ${fundDetails.length} funds and ${commonHoldings.length} common holdings, some common stocks exist but investing in all of them can still add meaningful value to your portfolio. Each fund has unique holdings that contribute to overall diversification. Diversification score: ${diversificationScore}/100.`;
      } else if (overlapPercentage < 50) {
        recommendation = `⚠️ Moderate overlap detected (${overlapPercentage}%). Your ${fundDetails.length} funds share ${commonHoldings.length} common holdings representing a significant portion of their portfolios. Consider if all funds are necessary or if reducing to 2-3 funds provides sufficient exposure without redundancy. Review unique holdings of each fund. Diversification score: ${diversificationScore}/100.`;
      } else {
        recommendation = `🚨 High overlap alert! ${overlapPercentage}% overlap with ${commonHoldings.length} common holdings across your ${fundDetails.length} funds means they hold very similar stocks. This creates concentration risk and defeats the purpose of diversification. Consider choosing 2-3 funds with distinct investment styles or funds from different categories to achieve true diversification. Diversification score: ${diversificationScore}/100.`;
      }

      // Add dummy data warning to any recommendation if needed
      if (hasDummyData && commonHoldings.length > 0) {
        recommendation += `\n\n⚠️ Note: Some funds contain placeholder data which may affect accuracy.`;
      }

      const analysisResult = {
        funds: fundDetails,
        overlapPercentage,
        commonHoldings,
        sectorOverlap,
        diversificationScore,
        recommendation,
        similarities,
      };
      console.log('Analysis completed successfully:', analysisResult);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing overlap:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error details:', {
        error,
        selectedFundIds,
        API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
      });
      alert(
        `Failed to analyze fund overlap: ${errorMessage}\n\nPlease check the console for details.`
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const getOverlapColor = (percentage: number) => {
    if (percentage < 20) return 'text-green-600';
    if (percentage < 40) return 'text-blue-600';
    if (percentage < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverlapIcon = (percentage: number) => {
    if (percentage < 40) return <CheckCircle className="w-6 h-6" />;
    if (percentage < 60) return <Info className="w-6 h-6" />;
    return <AlertTriangle className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted">Loading funds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-4">
          <BackButton />
        </div>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Portfolio Optimization Tool</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Fund Overlap Analyzer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover if your mutual funds hold similar stocks. Avoid
            over-concentration and build a truly diversified portfolio.
          </p>
        </motion.div>

        {/* Selection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 shadow-2xl border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <GitCompare className="w-7 h-7 text-purple-600" />
                Select Two Funds to Compare
              </CardTitle>
              <CardDescription className="text-base">
                Choose any two mutual funds from your portfolio or watchlist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selection Progress */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">
                    Select Funds to Analyze
                  </Label>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      selectedFundIds.length < 2
                        ? 'bg-gradient-to-r from-red-500 to-orange-600'
                        : selectedFundIds.length === 5
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    } text-white`}
                  >
                    {selectedFundIds.length}/5{' '}
                    {selectedFundIds.length < 2 ? '(Min: 2 Required)' : ''}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 shadow-inner">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 shadow-sm ${
                      selectedFundIds.length < 2
                        ? 'bg-gradient-to-r from-red-500 to-orange-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                    style={{ width: `${(selectedFundIds.length / 5) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-3">
                  <span>Minimum: 2 funds</span>
                  <span>Maximum: 5 funds</span>
                </div>
                {selectedFundIds.length === 5 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-3 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                    ⚠️ Maximum 5 funds reached. Deselect a fund to choose
                    another.
                  </p>
                )}
                {selectedFundIds.length === 1 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    💡 Select at least one more fund to analyze portfolio
                    overlap and diversification
                  </p>
                )}
              </div>

              {/* Selected Funds */}
              {selectedFundIds.length > 0 && (
                <div className="space-y-2 mb-4">
                  <Label className="text-sm font-semibold">
                    Selected Funds:
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedFundIds.map((fundId, index) => {
                      const fund = funds.find((f) => f.id === fundId);
                      return (
                        <div
                          key={fundId}
                          className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-3 border-2 border-blue-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {fund?.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {fund?.category} • ⭐ {fund?.rating || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFundSelection(fundId)}
                            className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center text-sm font-bold"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fund Selection List */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Available Funds (Click to{' '}
                  {selectedFundIds.length >= 5 ? 'deselect first' : 'add'}):
                </Label>

                {/* Category Filter Buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <span key="icon-all" className="mr-1">
                      🌐
                    </span>
                    All Funds
                    <span key="count-all" className="ml-2 text-xs opacity-80">
                      ({funds.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('equity')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      categoryFilter === 'equity'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <span key="icon-equity" className="mr-1">
                      📈
                    </span>
                    Equity
                    <span
                      key="count-equity"
                      className="ml-2 text-xs opacity-80"
                    >
                      (
                      {
                        funds.filter(
                          (f) =>
                            f.category?.toLowerCase().includes('equity') ||
                            f.category?.toLowerCase().includes('cap') ||
                            f.category?.toLowerCase().includes('elss') ||
                            f.category?.toLowerCase().includes('index') ||
                            f.category?.toLowerCase().includes('sectoral') ||
                            f.category?.toLowerCase().includes('thematic')
                        ).length
                      }
                      )
                    </span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('commodity')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      categoryFilter === 'commodity'
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <span key="icon-commodity" className="mr-1">
                      🪙
                    </span>
                    Commodity
                    <span
                      key="count-commodity"
                      className="ml-2 text-xs opacity-80"
                    >
                      (
                      {
                        funds.filter(
                          (f) =>
                            f.category?.toLowerCase().includes('commodity') ||
                            f.category?.toLowerCase().includes('gold') ||
                            f.category?.toLowerCase().includes('silver') ||
                            f.name?.toLowerCase().includes('gold') ||
                            f.name?.toLowerCase().includes('silver')
                        ).length
                      }
                      )
                    </span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search funds by name, category, or fund house..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Search Results Info */}
                {(searchQuery || categoryFilter !== 'all') && (
                  <div className="mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Found{' '}
                      {
                        filteredFunds.filter(
                          (f) => !selectedFundIds.includes(f.id)
                        ).length
                      }{' '}
                      fund
                      {filteredFunds.filter(
                        (f) => !selectedFundIds.includes(f.id)
                      ).length !== 1
                        ? 's'
                        : ''}
                      {categoryFilter !== 'all' &&
                        ` in ${categoryFilter} category`}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                    {categoryFilter === 'commodity' && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                        💡 Gold/Commodity funds don't hold stocks - they invest
                        in gold/commodities. Overlap analysis works best between
                        equity funds.
                      </p>
                    )}
                  </div>
                )}

                <div className="max-h-80 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                  {filteredFunds.filter((f) => !selectedFundIds.includes(f.id))
                    .length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">
                        No funds found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {searchQuery
                          ? `No funds match "${searchQuery}"`
                          : 'All available funds have been selected'}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-3 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredFunds
                      .filter((f) => !selectedFundIds.includes(f.id))
                      .map((fund) => (
                        <button
                          key={fund.id}
                          onClick={() => toggleFundSelection(fund.id)}
                          disabled={selectedFundIds.length >= 5}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            selectedFundIds.length >= 5
                              ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-750'
                          }`}
                        >
                          <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 mb-1">
                            {fund.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                              {fund.category}
                            </span>
                            <span>⭐ {fund.rating || 'N/A'}</span>
                            <span>
                              ₹{(fund.aum / 10000000).toFixed(0)} Cr AUM
                            </span>
                          </div>
                        </button>
                      ))
                  )}
                </div>
              </div>

              <Button
                onClick={analyzeOverlap}
                disabled={selectedFundIds.length < 2 || analyzing}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing Portfolio Overlap...
                  </>
                ) : (
                  <>
                    <GitCompare className="w-5 h-5 mr-2" />
                    Analyze Overlap ({selectedFundIds.length} Fund
                    {selectedFundIds.length !== 1 ? 's' : ''})
                  </>
                )}
              </Button>

              {selectedFundIds.length === 1 && (
                <p className="text-center text-sm text-amber-600 dark:text-amber-400">
                  ⚠️ Please select at least one more fund to analyze overlap
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Commodity Fund Info Card */}
            {result.funds.some(
              (f) =>
                f.category?.toLowerCase().includes('commodity') ||
                f.category?.toLowerCase().includes('gold')
            ) && (
              <Card className="shadow-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-1">
                        Commodity/Gold Funds in Analysis
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-2">
                        <strong>Important:</strong> Gold and commodity funds
                        invest in physical gold, gold ETFs, or commodity
                        contracts — not in company stocks.
                      </p>
                      <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1 ml-4 list-disc">
                        <li>
                          Holdings overlap will show as "0%" for commodity funds
                          (this is expected)
                        </li>
                        <li>
                          Commodity funds serve as portfolio diversification and
                          hedge against inflation
                        </li>
                        <li>
                          For meaningful holdings overlap analysis, select
                          equity funds only
                        </li>
                        <li>
                          Returns comparison still works normally for these
                          funds
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overlap Summary Cards */}
            <div className="grid md:grid-cols-5 gap-4">
              <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Funds Analyzed
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {result.funds.length}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Portfolio components
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-2 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Avg Overlap
                    </p>
                    <p
                      className={`text-3xl font-bold ${getOverlapColor(
                        result.overlapPercentage
                      )}`}
                    >
                      {result.overlapPercentage}%
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Common holdings
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-2 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Common Stocks
                    </p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {result.commonHoldings.length}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Overlapping positions
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-2 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {result.diversificationScore >= 70
                        ? '✅'
                        : result.diversificationScore >= 50
                        ? '⚠️'
                        : '🚨'}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Diversification
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        result.diversificationScore >= 70
                          ? 'text-green-600 dark:text-green-400'
                          : result.diversificationScore >= 50
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {result.diversificationScore >= 70
                        ? 'Excellent'
                        : result.diversificationScore >= 50
                        ? 'Good'
                        : 'Poor'}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Score: {result.diversificationScore}/100
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-2 border-indigo-200 dark:border-indigo-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔄</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Unique Holdings
                    </p>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {100 - result.overlapPercentage}%
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      True diversification
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overlap Percentage */}
            <Card className="shadow-2xl border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <PieChart className="w-7 h-7 text-purple-600" />
                  Detailed Overlap Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Understanding portfolio overlap across{' '}
                  {selectedFundIds.length} selected funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div
                    className={`inline-flex items-center gap-3 ${getOverlapColor(
                      result.overlapPercentage
                    )}`}
                  >
                    {getOverlapIcon(result.overlapPercentage)}
                    <span className="text-6xl font-extrabold">
                      {result.overlapPercentage}%
                    </span>
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
                    Average Portfolio Overlap
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Based on common holdings across all {selectedFundIds.length}{' '}
                    funds
                  </p>

                  <div className="mt-8 max-w-3xl mx-auto">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Unique Holdings
                      </span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Common Stocks
                      </span>
                    </div>
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex shadow-lg">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                        style={{ width: `${100 - result.overlapPercentage}%` }}
                      >
                        {100 - result.overlapPercentage}%
                      </div>
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
                        style={{ width: `${result.overlapPercentage}%` }}
                      >
                        {result.overlapPercentage}%
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>Diversified Portfolio Elements</span>
                      <span>Overlapping Holdings</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation Section */}
                <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Expert Recommendation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {result.recommendation}
                  </p>

                  {/* Additional Insights */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        What This Means
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>
                          • {result.overlapPercentage}% of holdings are common
                          across funds
                        </li>
                        <li>
                          • {100 - result.overlapPercentage}% represents unique
                          diversification
                        </li>
                        <li>
                          • {result.commonHoldings.length} stocks appear in
                          multiple funds
                        </li>
                        <li>
                          • Portfolio concentration risk is{' '}
                          {result.overlapPercentage < 30
                            ? 'low'
                            : result.overlapPercentage < 50
                            ? 'moderate'
                            : 'high'}
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Action Items
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {result.overlapPercentage < 30 ? (
                          <>
                            <li key="action-1">
                              ✓ Continue with current fund selection
                            </li>
                            <li key="action-2">
                              ✓ Portfolio is well-diversified
                            </li>
                            <li key="action-3">
                              ✓ Consider rebalancing periodically
                            </li>
                            <li key="action-4">
                              ✓ Monitor performance quarterly
                            </li>
                          </>
                        ) : result.overlapPercentage < 50 ? (
                          <>
                            <li key="action-1">
                              ⚠ Review funds with similar strategies
                            </li>
                            <li key="action-2">
                              ⚠ Consider consolidating to 2-3 funds
                            </li>
                            <li key="action-3">
                              ⚠ Check sector-wise allocation
                            </li>
                            <li key="action-4">
                              ⚠ Evaluate expense ratios vs benefits
                            </li>
                          </>
                        ) : (
                          <>
                            <li key="action-1">
                              🚨 Reduce number of similar funds
                            </li>
                            <li key="action-2">
                              🚨 Choose funds with distinct styles
                            </li>
                            <li key="action-3">
                              🚨 Add different category funds
                            </li>
                            <li key="action-4">🚨 Consult financial advisor</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Holdings - Enhanced */}
            {result.commonHoldings.length > 0 && (
              <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                    Common Holdings Analysis - Real Company Data
                  </CardTitle>
                  <CardDescription className="text-base">
                    Detailed breakdown of {result.commonHoldings.length} stocks
                    appearing across {result.funds.length} funds with actual
                    investment percentages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.commonHoldings.slice(0, 20).map((holding, idx) => {
                      const fundsInvested = Object.keys(holding.fundWeights);
                      return (
                        <div
                          key={idx}
                          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border-2 border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">
                                  {holding.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {holding.ticker && (
                                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                                      {holding.ticker}
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                                    {holding.sector}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold">
                                    In {fundsInvested.length}/
                                    {result.funds.length} Funds
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="flex-shrink-0 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                              Avg {holding.avgWeight.toFixed(2)}%
                            </span>
                          </div>

                          {/* Individual fund weights */}
                          <div className="grid gap-2">
                            {result.funds.map((fund) => {
                              const weight = holding.fundWeights[fund.id];
                              if (!weight) return null;
                              return (
                                <div
                                  key={fund.id}
                                  className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-gray-700"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold line-clamp-1 flex-1">
                                      {fund.name}
                                    </p>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-2">
                                      {weight.toFixed(2)}%
                                    </p>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                                      style={{
                                        width: `${Math.min(weight * 2, 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-3 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">
                                Combined Portfolio Impact (Average Weight):
                              </span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {holding.avgWeight.toFixed(2)}% across{' '}
                                {fundsInvested.length} fund
                                {fundsInvested.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {result.commonHoldings.length > 20 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Showing top 20 of {result.commonHoldings.length} common
                        holdings. These represent the most significant overlaps
                        in your portfolio.
                      </p>
                    </div>
                  )}

                  {/* Holdings Summary */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                    <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Holdings Impact Analysis
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          Total Common Stocks
                        </p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {result.commonHoldings.length}
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          Avg Weight per Stock
                        </p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {result.commonHoldings.length > 0
                            ? (
                                result.commonHoldings.reduce(
                                  (sum, h) => sum + h.avgWeight,
                                  0
                                ) / result.commonHoldings.length
                              ).toFixed(2)
                            : '0.00'}
                          %
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          Concentration Risk
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            result.overlapPercentage < 30
                              ? 'text-green-600 dark:text-green-400'
                              : result.overlapPercentage < 50
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {result.overlapPercentage < 30
                            ? 'Low'
                            : result.overlapPercentage < 50
                            ? 'Medium'
                            : 'High'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sector Overlap Analysis */}
            {result.sectorOverlap.length > 0 && (
              <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <PieChart className="w-7 h-7 text-green-600" />
                    Sector Overlap Analysis
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sector-wise allocation across {result.funds.length} funds
                    showing investment concentration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.sectorOverlap.slice(0, 10).map((sector, idx) => {
                      const sectorsInvested = Object.keys(
                        sector.fundAllocations
                      );
                      return (
                        <div
                          key={idx}
                          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-xl border-2 border-green-100 dark:border-gray-700"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">
                                  {sector.sector}
                                </h4>
                                <span className="text-[10px] text-gray-600 dark:text-gray-400">
                                  Present in {sectorsInvested.length}/
                                  {result.funds.length} funds
                                </span>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold">
                              Avg {sector.avgAllocation.toFixed(2)}%
                            </span>
                          </div>

                          <div className="grid gap-2">
                            {result.funds.map((fund) => {
                              const allocation =
                                sector.fundAllocations[fund.id];
                              if (!allocation) return null;
                              return (
                                <div
                                  key={fund.id}
                                  className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-200 dark:border-gray-700"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold line-clamp-1 flex-1">
                                      {fund.name}
                                    </p>
                                    <p className="text-sm font-bold text-green-600 dark:text-green-400 ml-2">
                                      {allocation.toFixed(2)}%
                                    </p>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                                      style={{
                                        width: `${Math.min(allocation, 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fund Similarities */}
            <Card className="shadow-2xl border-2 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="w-7 h-7 text-amber-600" />
                  Other Similarities Between Funds
                </CardTitle>
                <CardDescription className="text-base">
                  Real-world similarities that may affect diversification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Same Fund Manager */}
                {result.similarities.sameFundManager.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                    <h4 className="font-bold text-sm text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                      👨‍💼 Same Fund Manager
                    </h4>
                    <div className="space-y-2">
                      {result.similarities.sameFundManager.map(
                        (similarity, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700"
                          >
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {similarity}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">
                      ⚠️ Funds managed by the same person may have similar
                      investment philosophies and stock picks.
                    </p>
                  </div>
                )}

                {/* Similar Risk Level */}
                {result.similarities.similarRiskLevel.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                    <h4 className="font-bold text-sm text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                      ⚠️ Similar Risk Levels
                    </h4>
                    <div className="space-y-2">
                      {result.similarities.similarRiskLevel.map(
                        (similarity, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700"
                          >
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {similarity}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-3">
                      💡 Consider mixing different risk levels for better
                      risk-adjusted returns.
                    </p>
                  </div>
                )}

                {/* Similar Category */}
                {result.similarities.similarCategory.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-sm text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                      📁 Same Fund Category
                    </h4>
                    <div className="space-y-2">
                      {result.similarities.similarCategory.map(
                        (similarity, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700"
                          >
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {similarity}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
                      🎯 Funds in the same category (e.g., Large Cap) tend to
                      invest in similar stocks. Consider diversifying across
                      categories.
                    </p>
                  </div>
                )}

                {result.similarities.sameFundManager.length === 0 &&
                  result.similarities.similarRiskLevel.length === 0 &&
                  result.similarities.similarCategory.length === 0 && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Excellent! Your selected funds have diverse
                        characteristics with different fund managers, risk
                        levels, and categories.
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Comprehensive Fund Details for Decision Making */}
            <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="w-7 h-7 text-green-600" />
                  Comprehensive Fund Details for Decision Making
                </CardTitle>
                <CardDescription className="text-base">
                  All key information needed to make an informed investment
                  decision across {selectedFundIds.length} funds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Individual Fund Cards with Complete Information */}
                <div className="grid gap-4">
                  {result.funds.map((fund, index) => {
                    if (!fund) return null;

                    return (
                      <div
                        key={fund.id}
                        className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {fund.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <span
                                key={`category-${fund.id}`}
                                className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold"
                              >
                                {fund.category}
                              </span>
                              <span
                                key={`fundhouse-${fund.id}`}
                                className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold"
                              >
                                {fund.fundHouse}
                              </span>
                              <span
                                key={`rating-${fund.id}`}
                                className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-xs font-semibold"
                              >
                                ⭐ {fund.rating || 'N/A'}/5
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Comprehensive Metrics Grid */}
                        <div className="grid md:grid-cols-3 gap-3">
                          {/* Performance Metrics */}
                          <div
                            key={`performance-${fund.id}`}
                            className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800"
                          >
                            <h4 className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Performance Returns
                            </h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  1 Year:
                                </span>
                                <span className="font-bold text-green-600 dark:text-green-400">
                                  +{fund.returns1Y?.toFixed(2) || 0}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  3 Year:
                                </span>
                                <span className="font-bold text-green-600 dark:text-green-400">
                                  +{fund.returns3Y?.toFixed(2) || 0}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  5 Year:
                                </span>
                                <span className="font-bold text-green-600 dark:text-green-400">
                                  +{fund.returns5Y?.toFixed(2) || 0}%
                                </span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Since Inception:
                                </span>
                                <span className="font-bold text-green-600 dark:text-green-400">
                                  +
                                  {fund.returnsSinceInception?.toFixed(2) ||
                                    'N/A'}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Risk & Quality Metrics */}
                          <div
                            key={`risk-${fund.id}`}
                            className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-amber-200 dark:border-amber-800"
                          >
                            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Risk & Quality
                            </h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Risk Level:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {fund.riskLevel || 'Moderate'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Volatility:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {fund.volatility?.toFixed(2) || 'N/A'}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Sharpe Ratio:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {fund.sharpeRatio?.toFixed(2) || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Alpha:
                                </span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                  {fund.alpha
                                    ? (fund.alpha > 0 ? '+' : '') +
                                      fund.alpha.toFixed(2)
                                    : 'N/A'}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Investment Terms */}
                          <div
                            key={`terms-${fund.id}`}
                            className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800"
                          >
                            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              Investment Terms
                            </h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Expense Ratio:
                                </span>
                                <span className="font-bold text-red-600 dark:text-red-400">
                                  {fund.expenseRatio?.toFixed(2) || 'N/A'}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Min Investment:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  ₹
                                  {fund.minInvestment?.toLocaleString() ||
                                    '5,000'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Min SIP:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  ₹{fund.minSIP?.toLocaleString() || '500'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Exit Load:
                                </span>
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {fund.exitLoad ? `${fund.exitLoad}%` : 'None'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Fund Information */}
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="grid md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Fund Size (AUM)
                              </p>
                              <p className="font-bold text-blue-600 dark:text-blue-400">
                                ₹{((fund.aum || 0) / 10000000).toFixed(0)} Cr
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Fund Manager
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                                {typeof fund.fundManager === 'string'
                                  ? fund.fundManager
                                  : typeof fund.fundManager === 'object' &&
                                    fund.fundManager?.name
                                  ? fund.fundManager.name
                                  : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Beta
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {fund.beta?.toFixed(2) || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                Turnover Ratio
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {fund.portfolioTurnover?.toFixed(0) || 'N/A'}%
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Investment Recommendation for This Fund */}
                        <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                          <h4 className="text-xs font-bold text-green-700 dark:text-green-400 mb-2">
                            💡 Investment Suitability
                          </h4>
                          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                            {(fund.returns5Y || 0) > 15
                              ? '✓ Strong long-term performer'
                              : '⚠️ Moderate returns'}{' '}
                            •
                            {(fund.expenseRatio || 10) < 1
                              ? ' ✓ Low-cost fund'
                              : ' ⚠️ Higher expenses'}{' '}
                            •
                            {(fund.rating || 0) >= 4
                              ? ' ✓ High-quality rated'
                              : ' Consider quality'}{' '}
                            •
                            {fund.riskLevel === 'High' ||
                            fund.riskLevel === 'Very High'
                              ? ' ⚠️ High risk - long horizon needed'
                              : ' ✓ Suitable for moderate risk appetite'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Comparative Summary */}
                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <h4 className="text-base font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Portfolio-Level Decision Making Summary
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Best Performers */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
                      <h5 className="text-sm font-bold text-green-700 dark:text-green-400 mb-3">
                        🏆 Best in Class
                      </h5>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            Highest 5Y Returns:
                          </p>
                          <p className="font-bold text-green-600 dark:text-green-400">
                            {
                              result.funds.reduce(
                                (best, f) =>
                                  (f.returns5Y || 0) > (best.returns5Y || 0)
                                    ? f
                                    : best,
                                result.funds[0]
                              ).name
                            }{' '}
                            (+
                            {Math.max(
                              ...result.funds.map((f) => f.returns5Y || 0)
                            ).toFixed(2)}
                            %)
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            Lowest Cost:
                          </p>
                          <p className="font-bold text-green-600 dark:text-green-400">
                            {
                              result.funds.reduce(
                                (low, f) =>
                                  (f.expenseRatio || 10) <
                                  (low.expenseRatio || 10)
                                    ? f
                                    : low,
                                result.funds[0]
                              ).name
                            }{' '}
                            (
                            {Math.min(
                              ...result.funds.map((f) => f.expenseRatio || 10)
                            ).toFixed(2)}
                            %)
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            Highest Rated:
                          </p>
                          <p className="font-bold text-green-600 dark:text-green-400">
                            {
                              result.funds.reduce(
                                (best, f) =>
                                  (f.rating || 0) > (best.rating || 0)
                                    ? f
                                    : best,
                                result.funds[0]
                              ).name
                            }{' '}
                            (⭐{' '}
                            {Math.max(
                              ...result.funds.map((f) => f.rating || 0)
                            )}
                            /5)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Investment Strategy */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                      <h5 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3">
                        🎯 Recommended Strategy
                      </h5>
                      <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Allocation:</strong>{' '}
                            {result.overlapPercentage < 30
                              ? 'Invest equally across all funds for maximum diversification'
                              : 'Focus on 2-3 funds with lowest overlap and best performance'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Investment Mode:</strong> Start with SIP ₹
                            {Math.min(
                              ...result.funds.map((f) => f.minSIP || 500)
                            ).toLocaleString()}
                            /month minimum
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Time Horizon:</strong> Minimum{' '}
                            {result.funds.some((f) =>
                              f.category?.includes('Equity')
                            )
                              ? '5+ years'
                              : '3+ years'}{' '}
                            recommended
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                            ✓
                          </span>
                          <span>
                            <strong>Review Frequency:</strong> Check portfolio
                            overlap and rebalance annually
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/compare">
                <Button variant="outline" size="lg" className="gap-2 shadow-lg">
                  <GitCompare className="w-5 h-5" />
                  Detailed Performance Comparison
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="gap-2 shadow-lg">
                  <PieChart className="w-5 h-5" />
                  Add to My Portfolio
                </Button>
              </Link>
              <button
                onClick={() => {
                  const report = `Portfolio Overlap Analysis Report
========================

Funds Analyzed: ${result.funds.length}
- ${result.funds.map((f) => f.name).join('\n- ')}

Overlap Analysis:
- Overlap Percentage: ${result.overlapPercentage}%
- Common Holdings: ${result.commonHoldings.length} stocks
- Diversification Score: ${result.diversificationScore}/100
- Diversification Quality: ${
                    result.diversificationScore >= 70
                      ? 'Excellent'
                      : result.diversificationScore >= 50
                      ? 'Good'
                      : 'Poor'
                  }

Top Common Holdings:
${result.commonHoldings
  .slice(0, 10)
  .map(
    (h, i) =>
      `${i + 1}. ${h.name} (${h.sector}) - Avg Weight: ${h.avgWeight.toFixed(
        2
      )}%`
  )
  .join('\n')}

Sector Overlap:
${result.sectorOverlap
  .slice(0, 5)
  .map(
    (s, i) =>
      `${i + 1}. ${s.sector} - Avg Allocation: ${s.avgAllocation.toFixed(2)}%`
  )
  .join('\n')}

Similarities:
${
  result.similarities.sameFundManager.length > 0
    ? `Same Fund Manager: ${result.similarities.sameFundManager.join('; ')}`
    : ''
}
${
  result.similarities.similarCategory.length > 0
    ? `Same Category: ${result.similarities.similarCategory.join('; ')}`
    : ''
}

Recommendation: 
${result.recommendation}

Generated: ${new Date().toLocaleString()}`;
                  navigator.clipboard.writeText(report);
                  alert('Detailed analysis report copied to clipboard!');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                📋 Copy Detailed Report
              </button>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        {!result && (
          <Card className="mt-8 shadow-xl border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Info className="w-7 h-7 text-blue-600" />
                Why Analyze Fund Overlap? (2-5 Funds)
              </CardTitle>
              <CardDescription className="text-base">
                Multi-fund overlap analysis helps you build a truly diversified
                portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">
                    True Diversification
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Ensure your 2-5 selected funds invest in different stocks
                    for real portfolio diversity. Avoid holding multiple funds
                    with identical stock picks.
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <div className="text-3xl mb-3">⚠️</div>
                  <h3 className="font-bold text-lg mb-2 text-purple-700 dark:text-purple-400">
                    Avoid Over-concentration
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Prevent excessive concentration risk by identifying funds
                    that hold similar stocks. High overlap defeats the purpose
                    of diversification.
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-400">
                    Optimize Portfolio
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Build a balanced portfolio that maximizes risk-adjusted
                    returns while maintaining optimal diversification across
                    your fund selection.
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold text-lg mb-4 text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  What You'll Discover
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
                      🔍 Overlap Percentage
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      See what percentage of stocks are common across your
                      selected funds. Lower overlap = better diversification.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
                      📋 Common Holdings
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Identify specific stocks that appear in multiple funds and
                      their weightages.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
                      💡 Smart Recommendations
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get actionable advice on whether to keep all funds or
                      consolidate based on overlap levels.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
                      🎯 Risk Assessment
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Understand concentration risk and how it affects your
                      portfolio's stability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-lg mb-3 text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Best Practices
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>Target &lt;30% overlap:</strong> Aim for less than
                      30% overlap across funds for optimal diversification
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>Mix categories:</strong> Select funds from
                      different categories (Large Cap, Mid Cap, Debt, etc.)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>2-3 funds ideal:</strong> Most investors need only
                      2-3 well-chosen mutual funds for diversification
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>Annual review:</strong> Check overlap annually as
                      fund managers change portfolios
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
