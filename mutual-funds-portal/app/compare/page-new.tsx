"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { useCompare } from "@/lib/hooks/use-compare";
import { useFunds } from "@/lib/hooks/use-funds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Shield,
  Award,
  Search,
  Plus,
  AlertCircle,
  CheckCircle,
  Info,
  BarChart3,
  Users,
  GitCompare,
  Percent,
} from "lucide-react";

interface FundOverlap {
  commonCategories: string[];
  similarExpenseRatio: boolean;
  similarRiskLevel: boolean;
  similarReturns: boolean;
  overlapScore: number; // 0-100
  recommendations: string[];
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { funds, loading } = useFunds();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Get selected funds
  const selectedFunds = useMemo(() => {
    return funds.filter((f) => compareList.includes(f.id));
  }, [funds, compareList]);

  // Search filtered funds
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return funds
      .filter(
        (f) =>
          !compareList.includes(f.id) &&
          (f.name.toLowerCase().includes(query) ||
            f.category?.toLowerCase().includes(query) ||
            f.type?.toLowerCase().includes(query))
      )
      .slice(0, 5);
  }, [searchQuery, funds, compareList]);

  // Calculate overlap between funds
  const overlapAnalysis = useMemo((): FundOverlap | null => {
    if (selectedFunds.length < 2) return null;

    const categories = selectedFunds.map((f) => f.category);
    const expenseRatios = selectedFunds.map((f) => f.expenseRatio);
    const returns5Y = selectedFunds.map((f) => f.returns5Y);

    // Find common categories
    const commonCategories = categories.filter(
      (cat, idx) => categories.indexOf(cat) !== idx
    );

    // Check similarity in expense ratios (within 0.5%)
    const avgExpense =
      expenseRatios.reduce((a, b) => a + b, 0) / expenseRatios.length;
    const similarExpenseRatio = expenseRatios.every(
      (e) => Math.abs(e - avgExpense) < 0.5
    );

    // Check similar returns (within 5%)
    const avgReturns = returns5Y.reduce((a, b) => a + b, 0) / returns5Y.length;
    const similarReturns = returns5Y.every((r) => Math.abs(r - avgReturns) < 5);

    // Calculate overlap score
    let overlapScore = 0;
    if (commonCategories.length > 0) overlapScore += 40;
    if (similarExpenseRatio) overlapScore += 30;
    if (similarReturns) overlapScore += 30;

    // Generate recommendations
    const recommendations = [];
    if (overlapScore > 70) {
      recommendations.push(
        "⚠️ High overlap detected! Consider diversifying across different categories"
      );
    }
    if (commonCategories.length === selectedFunds.length) {
      recommendations.push(
        "All funds are in the same category - mix with different asset classes"
      );
    }
    if (similarExpenseRatio) {
      recommendations.push(
        "✅ Consistent expense ratios across funds - good cost management"
      );
    }
    if (!similarReturns) {
      recommendations.push(
        "Different return profiles - good for risk diversification"
      );
    }

    return {
      commonCategories: [...new Set(commonCategories)],
      similarExpenseRatio,
      similarRiskLevel: false,
      similarReturns,
      overlapScore,
      recommendations,
    };
  }, [selectedFunds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <GitCompare className="w-10 h-10 text-blue-600" />
                Compare Funds
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {selectedFunds.length} funds selected • Analyze differences and
                overlaps
              </p>
            </div>
            {selectedFunds.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCompare}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search funds by name to add for comparison..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <Card className="absolute top-full mt-2 w-full z-50 max-h-80 overflow-auto">
                <CardContent className="p-2">
                  {searchResults.map((fund) => (
                    <button
                      key={fund.id}
                      onClick={() => {
                        if (compareList.length < 4) {
                          const addToCompare = (window as any).addToCompare;
                          if (addToCompare) addToCompare(fund.id);
                        }
                        setSearchQuery("");
                        setShowSearch(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold">{fund.name}</div>
                        <div className="text-sm text-gray-600">
                          {fund.category} • {fund.returns5Y}% (5Y)
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-blue-600" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {selectedFunds.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <GitCompare className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold mb-2">No Funds to Compare</h3>
              <p className="text-gray-600 mb-6">
                Search and add funds above or browse funds to start comparing
              </p>
              <Link href="/search">
                <Button className="gap-2">
                  <Search className="w-5 h-5" />
                  Browse Funds
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overlap Analysis Card */}
            {overlapAnalysis && selectedFunds.length >= 2 && (
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                    <AlertCircle className="w-6 h-6" />
                    Fund Overlap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overlap Score */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Overlap Score</span>
                        <span className="text-2xl font-bold">
                          {overlapAnalysis.overlapScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            overlapAnalysis.overlapScore > 70
                              ? "bg-red-500"
                              : overlapAnalysis.overlapScore > 40
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${overlapAnalysis.overlapScore}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Overlap Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg ${
                        overlapAnalysis.commonCategories.length > 0
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-semibold">Category Overlap</span>
                      </div>
                      <p className="text-sm">
                        {overlapAnalysis.commonCategories.length > 0
                          ? `${overlapAnalysis.commonCategories.length} common categories`
                          : "Diverse categories ✓"}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        overlapAnalysis.similarExpenseRatio
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-yellow-100 dark:bg-yellow-900/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Percent className="w-5 h-5" />
                        <span className="font-semibold">Expense Ratios</span>
                      </div>
                      <p className="text-sm">
                        {overlapAnalysis.similarExpenseRatio
                          ? "Consistent costs ✓"
                          : "Varied cost structure"}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg ${
                        overlapAnalysis.similarReturns
                          ? "bg-yellow-100 dark:bg-yellow-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold">Return Profiles</span>
                      </div>
                      <p className="text-sm">
                        {overlapAnalysis.similarReturns
                          ? "Similar returns"
                          : "Diversified returns ✓"}
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Recommendations
                    </h4>
                    {overlapAnalysis.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-sm bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg"
                      >
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comparison Table */}
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-4 font-semibold sticky left-0 bg-gray-50 dark:bg-gray-800 z-10">
                        Metric
                      </th>
                      {selectedFunds.map((fund) => (
                        <th
                          key={fund.id}
                          className="text-left p-4 font-semibold min-w-[250px]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-bold mb-1">{fund.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 font-normal">
                                {fund.category}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCompare(fund.id)}
                              className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {/* 1. NAV / Current Value */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          Current NAV
                        </div>
                      </td>
                      {selectedFunds.map((fund) => (
                        <td key={fund.id} className="p-4">
                          <div className="text-2xl font-bold text-blue-600">
                            ₹{fund.nav?.toFixed(2) || "N/A"}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 2. Returns - 1Y */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />1
                          Year Return
                        </div>
                      </td>
                      {selectedFunds.map((fund) => {
                        const best = Math.max(
                          ...selectedFunds.map((f) => f.returns1Y)
                        );
                        const isBest = fund.returns1Y === best;
                        return (
                          <td key={fund.id} className="p-4">
                            <div
                              className={`text-xl font-bold ${
                                isBest ? "text-green-600" : ""
                              }`}
                            >
                              {fund.returns1Y > 0 ? "+" : ""}
                              {fund.returns1Y.toFixed(2)}%
                              {isBest && (
                                <Award className="inline w-5 h-5 ml-2 text-yellow-500" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* 3. Returns - 3Y */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />3
                          Year Return
                        </div>
                      </td>
                      {selectedFunds.map((fund) => {
                        const best = Math.max(
                          ...selectedFunds.map((f) => f.returns3Y)
                        );
                        const isBest = fund.returns3Y === best;
                        return (
                          <td key={fund.id} className="p-4">
                            <div
                              className={`text-xl font-bold ${
                                isBest ? "text-green-600" : ""
                              }`}
                            >
                              {fund.returns3Y > 0 ? "+" : ""}
                              {fund.returns3Y.toFixed(2)}%
                              {isBest && (
                                <Award className="inline w-5 h-5 ml-2 text-yellow-500" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* 4. Returns - 5Y */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />5
                          Year Return
                        </div>
                      </td>
                      {selectedFunds.map((fund) => {
                        const best = Math.max(
                          ...selectedFunds.map((f) => f.returns5Y)
                        );
                        const isBest = fund.returns5Y === best;
                        return (
                          <td key={fund.id} className="p-4">
                            <div
                              className={`text-xl font-bold ${
                                isBest ? "text-green-600" : ""
                              }`}
                            >
                              {fund.returns5Y > 0 ? "+" : ""}
                              {fund.returns5Y.toFixed(2)}%
                              {isBest && (
                                <Award className="inline w-5 h-5 ml-2 text-yellow-500" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* 5. Expense Ratio */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <Percent className="w-5 h-5 text-orange-600" />
                          Expense Ratio
                        </div>
                      </td>
                      {selectedFunds.map((fund) => {
                        const lowest = Math.min(
                          ...selectedFunds.map((f) => f.expenseRatio)
                        );
                        const isBest = fund.expenseRatio === lowest;
                        return (
                          <td key={fund.id} className="p-4">
                            <div
                              className={`text-xl font-bold ${
                                isBest ? "text-green-600" : ""
                              }`}
                            >
                              {fund.expenseRatio.toFixed(2)}%
                              {isBest && (
                                <CheckCircle className="inline w-5 h-5 ml-2 text-green-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {fund.expenseRatio < 0.75
                                ? "Low cost ✓"
                                : fund.expenseRatio > 1.5
                                ? "High cost"
                                : "Moderate"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* 6. Minimum Investment */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                          Min Investment
                        </div>
                      </td>
                      {selectedFunds.map((fund) => (
                        <td key={fund.id} className="p-4">
                          <div className="text-xl font-bold">
                            ₹
                            {fund.minInvestment?.toLocaleString("en-IN") ||
                              "5,000"}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 7. Fund Category */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-indigo-600" />
                          Category
                        </div>
                      </td>
                      {selectedFunds.map((fund) => (
                        <td key={fund.id} className="p-4">
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium">
                            {fund.category}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* 8. Risk Level */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-red-600" />
                          Risk Level
                        </div>
                      </td>
                      {selectedFunds.map((fund) => {
                        const riskColor =
                          fund.riskLevel === "HIGH"
                            ? "text-red-600 bg-red-100"
                            : fund.riskLevel === "MEDIUM"
                            ? "text-yellow-600 bg-yellow-100"
                            : "text-green-600 bg-green-100";
                        return (
                          <td key={fund.id} className="p-4">
                            <span
                              className={`px-3 py-1 ${riskColor} rounded-full text-sm font-medium`}
                            >
                              {fund.riskLevel || "MEDIUM"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* 9. Fund Manager */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-teal-600" />
                          Fund Manager
                        </div>
                      </td>
                      {selectedFunds.map((fund) => (
                        <td key={fund.id} className="p-4">
                          <div>
                            <div className="font-semibold">
                              {fund.manager?.name || "Not Available"}
                            </div>
                            {fund.manager?.experience && (
                              <div className="text-sm text-gray-600">
                                {fund.manager.experience} years experience
                              </div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 10. Inception Date */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium sticky left-0 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          Inception Date
                        </div>
                      </td>
                      {selectedFunds.map((fund) => (
                        <td key={fund.id} className="p-4">
                          {fund.inceptionDate
                            ? new Date(fund.inceptionDate).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                      ))}
                    </tr>

                    {/* Action Row */}
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <td className="p-4 font-medium sticky left-0 bg-gray-50 dark:bg-gray-800">
                        Actions
                      </td>
                      {selectedFunds.map((fund) => (
                        <td key={fund.id} className="p-4">
                          <div className="flex gap-2">
                            <Link href={`/funds/${fund.id}`}>
                              <Button variant="default" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCompare(fund.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
