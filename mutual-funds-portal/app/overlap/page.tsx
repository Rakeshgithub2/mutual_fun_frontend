"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { useCompare } from "@/lib/hooks/use-compare";
import { useFunds } from "@/lib/hooks/use-funds";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Layers,
  Search,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Building2,
  Trash2,
  PieChart,
  Target,
  Shield,
  BarChart3,
  TrendingDown,
  Activity,
  DollarSign,
} from "lucide-react";

export default function OverlapPage() {
  const { compareList, removeFromCompare, clearCompare, addToCompare } =
    useCompare();
  const { funds } = useFunds();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const selectedFunds = useMemo(() => {
    return compareList
      .map((id) => funds.find((f) => f.id === id))
      .filter(Boolean);
  }, [compareList, funds]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return funds
      .filter(
        (f) =>
          (f.name.toLowerCase().includes(query) ||
            f.category?.toLowerCase().includes(query)) &&
          !compareList.includes(f.id)
      )
      .slice(0, 8);
  }, [searchQuery, funds, compareList]);

  // Simulate stock overlap calculation (in real app, this would come from API)
  const overlapData = useMemo(() => {
    if (selectedFunds.length < 2) return null;

    // Mock data for demonstration - in production, fetch from API
    const commonStocks = [
      {
        name: "Reliance Industries",
        sector: "Energy",
        marketCap: "Large",
        fund1Weight: 8.5,
        fund2Weight: 9.2,
      },
      {
        name: "HDFC Bank",
        sector: "Banking",
        marketCap: "Large",
        fund1Weight: 7.8,
        fund2Weight: 8.1,
      },
      {
        name: "Infosys",
        sector: "IT",
        marketCap: "Large",
        fund1Weight: 6.5,
        fund2Weight: 7.0,
      },
      {
        name: "TCS",
        sector: "IT",
        marketCap: "Large",
        fund1Weight: 5.2,
        fund2Weight: 6.8,
      },
      {
        name: "ICICI Bank",
        sector: "Banking",
        marketCap: "Large",
        fund1Weight: 4.9,
        fund2Weight: 5.1,
      },
      {
        name: "Bharti Airtel",
        sector: "Telecom",
        marketCap: "Large",
        fund1Weight: 3.8,
        fund2Weight: 4.2,
      },
      {
        name: "Wipro",
        sector: "IT",
        marketCap: "Large",
        fund1Weight: 3.5,
        fund2Weight: 0,
      },
      {
        name: "Asian Paints",
        sector: "Consumer",
        marketCap: "Large",
        fund1Weight: 0,
        fund2Weight: 3.9,
      },
    ];

    // Sector-wise overlap
    const sectorData: Record<
      string,
      { fund1: number; fund2: number; overlap: number }
    > = {};
    commonStocks.forEach((stock) => {
      if (!sectorData[stock.sector]) {
        sectorData[stock.sector] = { fund1: 0, fund2: 0, overlap: 0 };
      }
      sectorData[stock.sector].fund1 += stock.fund1Weight;
      sectorData[stock.sector].fund2 += stock.fund2Weight;
      sectorData[stock.sector].overlap += Math.min(
        stock.fund1Weight,
        stock.fund2Weight
      );
    });

    // Market cap distribution
    const marketCapData = {
      large: { fund1: 45.2, fund2: 48.8, overlap: 38.7 },
      mid: { fund1: 28.5, fund2: 25.3, overlap: 18.2 },
      small: { fund1: 26.3, fund2: 25.9, overlap: 15.8 },
    };

    const totalOverlapPercentage = commonStocks.reduce(
      (sum, stock) => sum + Math.min(stock.fund1Weight, stock.fund2Weight),
      0
    );

    // Top holdings unique to each fund
    const uniqueToFund1 = [
      { name: "Wipro", sector: "IT", weight: 3.5 },
      { name: "Mahindra & Mahindra", sector: "Auto", weight: 3.2 },
      { name: "Dr Reddy's", sector: "Pharma", weight: 2.8 },
    ];

    const uniqueToFund2 = [
      { name: "Asian Paints", sector: "Consumer", weight: 3.9 },
      { name: "Bajaj Finance", sector: "Financial", weight: 3.4 },
      { name: "Kotak Bank", sector: "Banking", weight: 2.9 },
    ];

    // Calculate diversification score (0-100, higher is better)
    const diversificationScore = Math.min(
      100,
      Math.round(
        100 - totalOverlapPercentage + Object.keys(sectorData).length * 5
      )
    );

    // Risk metrics
    const riskMetrics = {
      correlationCoefficient: 0.78, // How similar the funds move together
      overlappingRisk:
        totalOverlapPercentage > 40
          ? "High"
          : totalOverlapPercentage > 20
          ? "Medium"
          : "Low",
      sectorConcentration: Object.values(sectorData).some((s) => s.overlap > 15)
        ? "High"
        : "Moderate",
    };

    return {
      commonStocks: commonStocks.filter(
        (s) => s.fund1Weight > 0 && s.fund2Weight > 0
      ),
      allStocks: commonStocks,
      totalOverlap: totalOverlapPercentage,
      uniqueToFund1Percent: 100 - totalOverlapPercentage,
      uniqueToFund2Percent: 100 - totalOverlapPercentage,
      uniqueToFund1Holdings: uniqueToFund1,
      uniqueToFund2Holdings: uniqueToFund2,
      sectorData,
      marketCapData,
      diversificationScore,
      riskMetrics,
      totalCommonStocks: commonStocks.filter(
        (s) => s.fund1Weight > 0 && s.fund2Weight > 0
      ).length,
      fund1UniqueCount: commonStocks.filter(
        (s) => s.fund1Weight > 0 && s.fund2Weight === 0
      ).length,
      fund2UniqueCount: commonStocks.filter(
        (s) => s.fund1Weight === 0 && s.fund2Weight > 0
      ).length,
    };
  }, [selectedFunds]);

  if (selectedFunds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-6">
              <Layers className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fund Overlap Analysis
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover common stocks between funds to avoid redundant
              investments and ensure true diversification
            </p>
            <Link href="/search">
              <Button size="lg" className="gap-2">
                <Search className="w-5 h-5" />
                Select Funds to Analyze
              </Button>
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  if (selectedFunds.length === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-600" />
            <h1 className="text-3xl font-bold mb-4">Add One More Fund</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Select at least 2 funds to analyze portfolio overlap
            </p>
            <Button
              onClick={() => setShowSearch(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Fund
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fund Overlap Analysis
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFunds.length}{" "}
                {selectedFunds.length === 1 ? "fund" : "funds"} selected
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Fund
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Selected Funds Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {selectedFunds.map((fund, index) => {
            if (!fund) return null;
            return (
              <motion.div
                key={fund.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-transparent hover:border-blue-500 transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <Link href={`/funds/${fund.id}`}>
                          <h3 className="font-bold text-lg hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {fund.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {fund.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCompare(fund.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          5Y Return
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {fund.returns5Y?.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Expense Ratio
                        </p>
                        <p className="text-lg font-bold text-orange-600">
                          {fund.expenseRatio?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Overlap Summary */}
        {overlapData && (
          <Card className="mb-8 bg-gradient-to-br from-orange-600 to-pink-600 border-none text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-7 h-7" />
                <h2 className="text-2xl font-bold">Overlap Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-2">Total Overlap</p>
                  <p className="text-4xl font-bold">
                    {overlapData.totalOverlap.toFixed(1)}%
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    Common stock holdings
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-2">Unique to Fund 1</p>
                  <p className="text-4xl font-bold">
                    {overlapData.uniqueToFund1Percent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    {overlapData.fund1UniqueCount} exclusive stocks
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-2">Unique to Fund 2</p>
                  <p className="text-4xl font-bold">
                    {overlapData.uniqueToFund2Percent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    {overlapData.fund2UniqueCount} exclusive stocks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Stocks */}
        {overlapData && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Common Stock Holdings
              </h3>
              <div className="space-y-3">
                {overlapData.commonStocks.map((stock, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{stock.name}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Overlap:{" "}
                        <span className="font-bold text-orange-600">
                          {Math.min(
                            stock.fund1Weight,
                            stock.fund2Weight
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Fund 1 Weight
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${stock.fund1Weight * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {stock.fund1Weight}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Fund 2 Weight
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${stock.fund2Weight * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {stock.fund2Weight}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        {overlapData && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold">Insights & Recommendations</h3>
            {overlapData.totalOverlap > 40 && (
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      High Portfolio Overlap Detected
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {overlapData.totalOverlap.toFixed(1)}% of the portfolio
                      consists of common stocks. Consider diversifying across
                      different sectors or market caps to reduce concentration
                      risk.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            {overlapData.totalOverlap < 20 && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                      Good Diversification
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Only {overlapData.totalOverlap.toFixed(1)}% overlap
                      between funds. Your selection provides good
                      diversification across different stocks, reducing
                      concentration risk.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Add Fund to Analyze</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSearch(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search funds by name or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((fund) => (
                        <div
                          key={fund.id}
                          onClick={() => {
                            addToCompare(fund.id);
                            setSearchQuery("");
                            setShowSearch(false);
                          }}
                          className="p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all"
                        >
                          <h3 className="font-semibold mb-1">{fund.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {fund.category}
                          </p>
                        </div>
                      ))
                    ) : searchQuery ? (
                      <p className="text-center text-gray-500 py-8">
                        No funds found
                      </p>
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        Start typing to search funds
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
