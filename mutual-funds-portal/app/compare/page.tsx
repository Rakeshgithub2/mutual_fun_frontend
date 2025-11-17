"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { useCompare } from "@/lib/hooks/use-compare";
import { useFunds } from "@/lib/hooks/use-funds";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Trash2,
  Plus,
  Search,
  X,
  ArrowLeft,
  Target,
  Award,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle2,
  Info,
  Layers,
  GitCompare,
  Sparkles,
} from "lucide-react";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCompare } =
    useCompare();
  const { funds } = useFunds();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeView, setActiveView] = useState<"comparison" | "overlap">(
    "comparison"
  );

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

  // Calculate overlap analysis
  const overlapAnalysis = useMemo(() => {
    if (selectedFunds.length < 2) return null;

    const categories = selectedFunds.map((f) => f?.category);
    const uniqueCategories = new Set(categories);
    const categoryOverlap = Math.round(
      ((categories.length - uniqueCategories.size) / categories.length) * 100
    );

    const avgExpenseRatio =
      selectedFunds.reduce((sum, f) => sum + (f?.expenseRatio || 0), 0) /
      selectedFunds.length;
    const avgReturn5Y =
      selectedFunds.reduce((sum, f) => sum + (f?.returns5Y || 0), 0) /
      selectedFunds.length;

    // Mock data for holdings - in production, fetch from API
    const holdings = [
      {
        name: "Reliance Industries",
        sector: "Energy",
        funds: [
          { fundIndex: 0, weight: 8.5 },
          { fundIndex: 1, weight: 9.2 },
        ],
      },
      {
        name: "HDFC Bank",
        sector: "Banking",
        funds: [
          { fundIndex: 0, weight: 7.8 },
          { fundIndex: 1, weight: 8.1 },
        ],
      },
      {
        name: "Infosys",
        sector: "IT",
        funds: [
          { fundIndex: 0, weight: 6.5 },
          { fundIndex: 1, weight: 7.0 },
        ],
      },
      {
        name: "TCS",
        sector: "IT",
        funds: [{ fundIndex: 0, weight: 5.2 }],
      },
      {
        name: "ICICI Bank",
        sector: "Banking",
        funds: [{ fundIndex: 1, weight: 5.1 }],
      },
    ];

    const commonStocks = holdings.filter((h) => h.funds.length > 1);
    const uniqueStocks = holdings.filter((h) => h.funds.length === 1);

    // Sector allocation
    const sectorMap: Record<string, number[]> = {};
    holdings.forEach((holding) => {
      if (!sectorMap[holding.sector]) {
        sectorMap[holding.sector] = new Array(selectedFunds.length).fill(0);
      }
      holding.funds.forEach((f) => {
        sectorMap[holding.sector][f.fundIndex] += f.weight;
      });
    });

    return {
      categoryOverlap,
      uniqueCategories: uniqueCategories.size,
      avgExpenseRatio,
      avgReturn5Y,
      bestPerformer: selectedFunds.reduce((best, f) =>
        (f?.returns5Y || 0) > (best?.returns5Y || 0) ? f : best
      ),
      lowestExpense: selectedFunds.reduce((low, f) =>
        (f?.expenseRatio || 0) < (low?.expenseRatio || 0) ? f : low
      ),
      holdings,
      commonStocks,
      uniqueStocks,
      sectorAllocation: sectorMap,
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
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Compare Mutual Funds
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Select funds to compare side-by-side and discover portfolio
              overlaps
            </p>
            <Link href="/search">
              <Button size="lg" className="gap-2">
                <Search className="w-5 h-5" />
                Browse Funds to Compare
              </Button>
            </Link>
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
                Fund Comparison
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

        {/* View Tabs */}
        <div className="flex gap-3 mb-8">
          <Button
            variant={activeView === "comparison" ? "default" : "outline"}
            onClick={() => setActiveView("comparison")}
            className="gap-2"
          >
            <GitCompare className="w-4 h-4" />
            Fund Comparison
          </Button>
          <Button
            variant={activeView === "overlap" ? "default" : "outline"}
            onClick={() => setActiveView("overlap")}
            className="gap-2"
            disabled={selectedFunds.length < 2}
          >
            <Layers className="w-4 h-4" />
            Fund Overlap
            {selectedFunds.length < 2 && (
              <span className="text-xs">(Select 2+ funds)</span>
            )}
          </Button>
        </div>

        {/* Overlap Analysis */}
        {overlapAnalysis && selectedFunds.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-none text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">
                    Portfolio Overlap Analysis
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/80 mb-1">
                      Category Overlap
                    </p>
                    <p className="text-3xl font-bold">
                      {overlapAnalysis.categoryOverlap}%
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/80 mb-1">
                      Unique Categories
                    </p>
                    <p className="text-3xl font-bold">
                      {overlapAnalysis.uniqueCategories}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/80 mb-1">Avg. Expense</p>
                    <p className="text-3xl font-bold">
                      {overlapAnalysis.avgExpenseRatio.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/80 mb-1">Avg. 5Y Return</p>
                    <p className="text-3xl font-bold">
                      {overlapAnalysis.avgReturn5Y.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4" />
                    <span>
                      Best Performer: {overlapAnalysis.bestPerformer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Lowest Cost: {overlapAnalysis.lowestExpense.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Common Stock Holdings */}
        {overlapAnalysis && overlapAnalysis.commonStocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold">Common Stock Holdings</h2>
                  <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                    {overlapAnalysis.commonStocks.length} stocks in multiple
                    funds
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">
                          Stock Name
                        </th>
                        <th className="text-left py-3 px-2 font-semibold">
                          Sector
                        </th>
                        {selectedFunds.map((fund, idx) => (
                          <th
                            key={idx}
                            className="text-right py-3 px-2 font-semibold"
                          >
                            {fund.name.split(" ")[0]}...
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {overlapAnalysis.commonStocks.map((stock, idx) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-2 font-medium">
                            {stock.name}
                          </td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {stock.sector}
                            </span>
                          </td>
                          {selectedFunds.map((fund, fundIdx) => {
                            const holding = stock.funds.find(
                              (f) => f.fundIndex === fundIdx
                            );
                            return (
                              <td
                                key={fundIdx}
                                className="py-3 px-2 text-right"
                              >
                                {holding ? (
                                  <span className="font-semibold text-green-600">
                                    {holding.weight.toFixed(1)}%
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Unique Holdings & Sector Focus */}
        {overlapAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Unique Holdings */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold">Unique Holdings</h2>
                </div>
                <div className="space-y-4">
                  {selectedFunds.map((fund, idx) => {
                    const uniqueCount = overlapAnalysis.uniqueStocks.filter(
                      (s) => s.funds[0].fundIndex === idx
                    ).length;
                    const totalHoldings = overlapAnalysis.holdings.filter((h) =>
                      h.funds.some((f) => f.fundIndex === idx)
                    ).length;
                    const uniquePercent = (uniqueCount / totalHoldings) * 100;

                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm line-clamp-1">
                            {fund.name}
                          </span>
                          <span className="text-sm font-semibold text-purple-600">
                            {uniqueCount} unique
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${uniquePercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {uniquePercent.toFixed(0)}% of portfolio is unique
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sector Allocation */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold">Sector Focus</h2>
                </div>
                <div className="space-y-4">
                  {Object.entries(overlapAnalysis.sectorAllocation).map(
                    ([sector, allocations]) => {
                      const maxAllocation = Math.max(...allocations);
                      return (
                        <div key={sector}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">
                              {sector}
                            </span>
                            <span className="text-xs text-gray-500">
                              Max: {maxAllocation.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {allocations.map((allocation, idx) => (
                              <div key={idx} className="flex-1">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all"
                                    style={{
                                      width: `${
                                        (allocation / maxAllocation) * 100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-1">
                                  {allocation.toFixed(1)}%
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedFunds.map((fund, index) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-transparent hover:border-blue-500 transition-all">
                <CardContent className="p-6">
                  {/* Header */}
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

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(fund.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{fund.rating}</span>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">5Y Return</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {fund.returns5Y?.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">3Y Return</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {fund.returns3Y?.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">1Y Return</span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {fund.returns1Y?.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium">
                          Expense Ratio
                        </span>
                      </div>
                      <span className="font-bold text-orange-600">
                        {fund.expenseRatio?.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">Risk Level</span>
                      </div>
                      <span className="font-bold text-gray-600">
                        {fund.riskLevel || "Moderate"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-medium">
                          Min. Investment
                        </span>
                      </div>
                      <span className="font-bold text-teal-600">
                        ₹{fund.minInvestment?.toLocaleString() || "5,000"}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/funds/${fund.id}`} className="block mt-4">
                    <Button className="w-full gap-2">
                      <Info className="w-4 h-4" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Smart Insights */}
        {selectedFunds.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Smart Insights</h2>
            <div className="grid gap-4">
              {overlapAnalysis.categoryOverlap > 50 && (
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                        High Category Overlap
                      </h3>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        {overlapAnalysis.categoryOverlap}% of your selected
                        funds are in similar categories. Consider diversifying
                        across different asset classes for better risk
                        management.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {overlapAnalysis.avgExpenseRatio < 0.75 && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                        Cost-Efficient Selection
                      </h3>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Great job! Your funds have an average expense ratio of{" "}
                        {overlapAnalysis.avgExpenseRatio.toFixed(2)}%, which is
                        below the industry average. Lower costs mean more
                        returns in your pocket.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {overlapAnalysis.avgReturn5Y > 15 && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 flex gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        Strong Performance Track Record
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Your selection shows{" "}
                        {overlapAnalysis.avgReturn5Y.toFixed(1)}% average 5-year
                        returns, significantly above market benchmarks.{" "}
                        {overlapAnalysis.bestPerformer.name} is your top
                        performer.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
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
                    <h2 className="text-2xl font-bold">Add Fund to Compare</h2>
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
