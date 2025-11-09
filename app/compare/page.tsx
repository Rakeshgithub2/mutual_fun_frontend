"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { useCompare } from "@/lib/hooks/use-compare";
import { useLanguage } from "@/lib/hooks/use-language";
import { getTranslation } from "@/lib/i18n";
import mockFunds from "@/data/mock-funds.json";

// Helper function to generate dynamic suggestions based on selected funds
function generateDynamicSuggestions(funds: any[]) {
  if (funds.length === 0) return [];

  const suggestions: Array<{
    title: string;
    description: string;
    icon: string;
    type: "info" | "warning" | "success" | "tip";
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
      title: "Strong Long-term Performance",
      description: `Your selected funds have an average 5-year return of ${avgReturns5Y.toFixed(
        1
      )}%, which is above the market average. ${
        bestPerformer.name
      } leads with ${bestPerformer.returns5Y.toFixed(
        1
      )}% returns, making it an excellent anchor for long-term wealth creation.`,
      icon: "📈",
      type: "success",
    });
  } else if (avgReturns5Y < 10) {
    suggestions.push({
      title: "Consider Higher Return Options",
      description: `The average 5-year return of ${avgReturns5Y.toFixed(
        1
      )}% is below market benchmarks. You might want to explore high-performing ${
        categories[0]
      } funds or consider adding mid-cap funds for potential growth acceleration.`,
      icon: "⚠️",
      type: "warning",
    });
  } else {
    suggestions.push({
      title: "Moderate Performance Portfolio",
      description: `With ${avgReturns5Y.toFixed(
        1
      )}% average 5-year returns, your selection offers balanced growth. Consider ${
        bestPerformer.name
      } as your primary investment for optimal returns within this group.`,
      icon: "📊",
      type: "info",
    });
  }

  // Suggestion 2: Expense Ratio Analysis
  if (avgExpenseRatio < 0.75) {
    suggestions.push({
      title: "Cost-Efficient Selection",
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
      icon: "💰",
      type: "success",
    });
  } else if (avgExpenseRatio > 1.0) {
    suggestions.push({
      title: "Higher Expense Ratios Detected",
      description: `Your selected funds have an average expense ratio of ${avgExpenseRatio.toFixed(
        2
      )}%, which is above the industry average. Consider switching to direct plans or lower-cost alternatives to improve net returns—even 0.5% difference can mean ₹50,000+ savings on a ₹10 lakh investment over 10 years.`,
      icon: "💸",
      type: "warning",
    });
  } else {
    suggestions.push({
      title: "Reasonable Cost Structure",
      description: `Your funds have an average expense ratio of ${avgExpenseRatio.toFixed(
        2
      )}%, which is within acceptable limits. ${
        lowestExpense.name
      } offers the lowest cost at ${lowestExpense.expenseRatio.toFixed(
        2
      )}%—prioritizing this fund can help maximize your net returns.`,
      icon: "💳",
      type: "info",
    });
  }

  // Suggestion 3: Diversification Analysis
  if (categories.length === 1) {
    const category = categories[0];
    suggestions.push({
      title: "Limited Diversification",
      description: `All your selected funds belong to the ${category} category. While focused investing can work, consider adding ${
        category === "Large Cap"
          ? "Mid Cap or Multi Cap"
          : category === "Mid Cap"
          ? "Large Cap or Flexi Cap"
          : "Debt or Hybrid"
      } funds to reduce concentration risk and smooth out volatility across market cycles.`,
      icon: "⚖️",
      type: "warning",
    });
  } else if (categories.length === 2) {
    suggestions.push({
      title: "Good Diversification",
      description: `Your selection spans ${categories.join(
        " and "
      )} categories, providing balanced exposure. This strategy offers a mix of ${
        categories.includes("Large Cap") ? "stability" : "growth"
      } and ${
        categories.includes("Small Cap") || categories.includes("Mid Cap")
          ? "higher growth potential"
          : "risk management"
      }—ideal for a well-rounded portfolio.`,
      icon: "🎯",
      type: "success",
    });
  } else {
    suggestions.push({
      title: "Excellent Diversification",
      description: `Outstanding! Your funds cover ${
        categories.length
      } different categories (${categories.join(
        ", "
      )}), providing robust diversification across market caps and investment styles. This multi-category approach helps balance risk-reward and performs well across different market conditions.`,
      icon: "🌟",
      type: "success",
    });
  }

  // Suggestion 4: Rating & Quality Analysis
  if (avgRating >= 4.5) {
    const topRated = funds.filter((f) => f.rating >= 4.5);
    suggestions.push({
      title: "Premium Quality Funds",
      description: `Excellent choice! ${
        topRated.length === funds.length
          ? "All your funds"
          : `${topRated.length} out of ${funds.length} funds`
      } have ratings of 4.5+ stars, indicating consistent performance, strong fund management, and reliable track records. These high-quality funds are suitable for core portfolio holdings with ${avgReturns3Y.toFixed(
        1
      )}% average 3-year returns.`,
      icon: "⭐",
      type: "success",
    });
  } else if (avgRating < 3.5) {
    const lowRated = funds.filter((f) => f.rating < 3.5);
    suggestions.push({
      title: "Review Fund Quality",
      description: `${lowRated.length} fund(s) have ratings below 3.5 stars, suggesting inconsistent performance or higher risk. Consider replacing these with higher-rated alternatives in the same category—4+ star funds typically deliver 2-3% better annual returns with lower volatility.`,
      icon: "🔍",
      type: "warning",
    });
  } else {
    suggestions.push({
      title: "Solid Fund Selection",
      description: `Your funds have an average rating of ${avgRating.toFixed(
        1
      )} stars, representing good quality. ${
        funds.filter((f) => f.rating >= 4).length > 0
          ? `${
              funds.find((f) => f.rating >= 4)?.name
            } stands out as your highest-rated option`
          : "Consider adding 4+ star funds"
      } for enhanced reliability and consistent returns over time.`,
      icon: "✨",
      type: "info",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(
    null
  );

  const t = (key: string) => getTranslation(language, key);

  // Move all data processing and useMemo BEFORE conditional returns
  const funds = mockFunds.funds.filter((f) => compareList.includes(f.id));
  const availableFunds = mockFunds.funds.filter(
    (f) => !compareList.includes(f.id)
  );

  // Filter funds based on search
  const filteredAvailableFunds = availableFunds.filter(
    (fund) =>
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate dynamic suggestions - useMemo must be called before any conditional returns
  const dynamicSuggestions = useMemo(
    () => generateDynamicSuggestions(funds),
    [funds]
  );

  // NOW we can do conditional returns AFTER all hooks
  if (!langMounted || !compareMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t("common.loading")}
      </div>
    );
  }

  const metrics = [
    {
      key: "nav",
      label: "NAV",
      format: (v: number) => `₹${v.toFixed(2)}`,
      description: "Net Asset Value per unit",
    },
    {
      key: "returns1Y",
      label: "1Y Returns",
      format: (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`,
      description: "Annual returns",
      higherBetter: true,
    },
    {
      key: "returns3Y",
      label: "3Y Returns",
      format: (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`,
      description: "3-year annualized returns",
      higherBetter: true,
    },
    {
      key: "returns5Y",
      label: "5Y Returns",
      format: (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`,
      description: "5-year annualized returns",
      higherBetter: true,
    },
    {
      key: "aum",
      label: "AUM",
      format: (v: number) => `₹${(v / 1000).toFixed(1)}K Cr`,
      description: "Assets Under Management",
    },
    {
      key: "expenseRatio",
      label: "Expense Ratio",
      format: (v: number) => `${v.toFixed(2)}%`,
      description: "Annual fund charges",
      lowerBetter: true,
    },
    {
      key: "rating",
      label: "Rating",
      format: (v: number) => `${v}/5`,
      description: "Fund quality rating",
      higherBetter: true,
    },
  ];

  // Find best and worst values for highlighting
  const getBestWorstInMetric = (metricKey: string) => {
    if (funds.length === 0) return { best: null, worst: null };
    const values = funds.map((f) => (f as any)[metricKey]);
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
            .join("\n")}\n\n`
      )
      .join("");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", "fund-comparison.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header with Animation */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <svg
                className="w-6 h-6 text-white"
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Compare Funds
            </h1>
          </div>
          <p className="mt-2 text-lg text-muted-foreground">
            Analyze and compare up to 3 mutual funds side-by-side with
            intelligent insights
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar - Add Funds */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 sticky top-24 shadow-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Fund Selection
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      compareList.length === 3
                        ? "bg-primary/20 text-primary"
                        : compareList.length > 0
                        ? "bg-accent/20 text-accent"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {compareList.length}/3
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(compareList.length / 3) * 100}%` }}
                  />
                </div>
              </div>

              {compareList.length > 0 && (
                <div className="mb-4 space-y-2">
                  {funds.map((fund, index) => (
                    <div
                      key={fund.id}
                      className="group relative flex items-center justify-between rounded-lg bg-gradient-to-r from-background to-muted/30 p-3 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {fund.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fund.fundHouse}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCompare(fund.id)}
                        className="flex-shrink-0 ml-2 w-7 h-7 rounded-full bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all duration-200 flex items-center justify-center group-hover:scale-110"
                        title="Remove fund"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {compareList.length > 0 && (
                <button
                  onClick={clearCompare}
                  className="mb-4 w-full rounded-lg border-2 border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10 hover:border-danger/50 transition-all duration-200"
                >
                  🗑️ Clear All Funds
                </button>
              )}

              {compareList.length < 3 && (
                <>
                  <h3 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Add More Funds
                  </h3>

                  {/* Search Input */}
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      placeholder="Search funds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <svg
                      className="w-4 h-4 absolute left-3 top-3 text-muted-foreground"
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

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredAvailableFunds.length > 0 ? (
                      filteredAvailableFunds.slice(0, 20).map((fund) => (
                        <button
                          key={fund.id}
                          onClick={() => addToCompare(fund.id)}
                          className="w-full rounded-lg border border-border/50 bg-background/50 hover:bg-card p-3 text-left hover:border-primary/50 transition-all duration-200 hover:shadow-md group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground line-clamp-1 text-sm group-hover:text-primary transition-colors">
                                {fund.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {fund.fundHouse}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                                  {fund.category}
                                </span>
                                <span className="text-xs text-primary font-medium">
                                  ⭐ {fund.rating}
                                </span>
                              </div>
                            </div>
                            <svg
                              className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No funds found
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="lg:col-span-3">
            {funds.length > 0 ? (
              <div className="space-y-6">
                {/* Quick Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Avg 5Y Returns",
                      value: `${(
                        funds.reduce((s, f) => s + f.returns5Y, 0) /
                        funds.length
                      ).toFixed(1)}%`,
                      icon: "📈",
                      color: "from-green-500 to-emerald-600",
                    },
                    {
                      label: "Avg Rating",
                      value: `${(
                        funds.reduce((s, f) => s + f.rating, 0) / funds.length
                      ).toFixed(1)}/5`,
                      icon: "⭐",
                      color: "from-yellow-500 to-orange-600",
                    },
                    {
                      label: "Avg Expense",
                      value: `${(
                        funds.reduce((s, f) => s + f.expenseRatio, 0) /
                        funds.length
                      ).toFixed(2)}%`,
                      icon: "💰",
                      color: "from-blue-500 to-cyan-600",
                    },
                    {
                      label: "Total AUM",
                      value: `₹${(
                        funds.reduce((s, f) => s + f.aum, 0) / 1000
                      ).toFixed(1)}K Cr`,
                      icon: "🏦",
                      color: "from-purple-500 to-pink-600",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-2`}
                      >
                        {stat.icon}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Comparison Grid */}
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-foreground sticky left-0 bg-muted/30 backdrop-blur-sm z-10">
                            Metric
                          </th>
                          {funds.map((fund, idx) => (
                            <th
                              key={fund.id}
                              className="px-6 py-4 text-left min-w-[200px]"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="text-sm font-semibold text-foreground line-clamp-2">
                                    {fund.name}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground font-normal">
                                  {fund.fundHouse}
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {fund.category}
                                  </span>
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.map((metric, idx) => {
                          const { best, worst } = getBestWorstInMetric(
                            metric.key
                          );
                          return (
                            <tr
                              key={metric.key}
                              className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                                highlightedMetric === metric.key
                                  ? "bg-primary/5"
                                  : ""
                              }`}
                              onMouseEnter={() =>
                                setHighlightedMetric(metric.key)
                              }
                              onMouseLeave={() => setHighlightedMetric(null)}
                            >
                              <td className="px-6 py-4 sticky left-0 bg-card/95 backdrop-blur-sm z-10">
                                <div>
                                  <div className="text-sm font-medium text-foreground">
                                    {metric.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {metric.description}
                                  </div>
                                </div>
                              </td>
                              {funds.map((fund) => {
                                const value = (fund as any)[metric.key];
                                const isBest = value === best && best !== worst;
                                const isWorst =
                                  value === worst && best !== worst;
                                const isPositive = metric.key.includes(
                                  "returns"
                                )
                                  ? value >= 0
                                  : true;

                                return (
                                  <td
                                    key={fund.id}
                                    className={`px-6 py-4 relative ${
                                      isBest
                                        ? "bg-green-500/10"
                                        : isWorst
                                        ? "bg-red-500/10"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`text-sm font-semibold ${
                                          metric.key.includes("returns") &&
                                          !isPositive
                                            ? "text-danger"
                                            : isBest
                                            ? "text-green-600 dark:text-green-400"
                                            : isWorst
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-foreground"
                                        }`}
                                      >
                                        {metric.format(value)}
                                      </span>
                                      {isBest && (
                                        <span className="text-xs">🏆</span>
                                      )}
                                      {isWorst &&
                                        best !== null &&
                                        worst !== null && (
                                          <span className="text-xs">⚠️</span>
                                        )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fund Details Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {funds.map((fund, idx) => (
                    <div
                      key={fund.id}
                      className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {fund.category}
                        </span>
                      </div>

                      <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {fund.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {fund.fundHouse}
                      </p>

                      <div className="space-y-2.5 text-sm mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            5Y Returns
                          </span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            +{fund.returns5Y}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="font-semibold text-foreground">
                            ⭐ {fund.rating}/5
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Expense Ratio
                          </span>
                          <span className="font-semibold text-foreground">
                            {fund.expenseRatio}%
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/funds/${fund.id}`}
                        className="block rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-center text-sm font-semibold text-white hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
                      >
                        View Full Details →
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Dynamic AI-Powered Suggestions */}
                {dynamicSuggestions.length > 0 && (
                  <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-muted/30 backdrop-blur-sm p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-foreground">
                        🤖 AI-Powered Insights Based on Your Selection
                      </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {dynamicSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg p-4 border-2 ${
                            suggestion.type === "success"
                              ? "bg-green-500/5 border-green-500/30 hover:border-green-500/50"
                              : suggestion.type === "warning"
                              ? "bg-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50"
                              : suggestion.type === "tip"
                              ? "bg-blue-500/5 border-blue-500/30 hover:border-blue-500/50"
                              : "bg-muted/20 border-border/50 hover:border-primary/50"
                          } transition-all duration-300 hover:shadow-md group`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                              {suggestion.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`font-semibold mb-2 ${
                                  suggestion.type === "success"
                                    ? "text-green-700 dark:text-green-400"
                                    : suggestion.type === "warning"
                                    ? "text-yellow-700 dark:text-yellow-400"
                                    : suggestion.type === "tip"
                                    ? "text-blue-700 dark:text-blue-400"
                                    : "text-foreground"
                                }`}
                              >
                                {suggestion.title}
                              </h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {suggestion.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export Button */}
                <button
                  onClick={handleExportPDF}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-4 font-semibold text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
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
                  Export Comparison Report
                </button>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-border bg-card/30 backdrop-blur-sm p-16 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-primary"
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
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Start Your Comparison
                </h3>
                <p className="text-muted-foreground mb-2">
                  Select up to 3 mutual funds from the sidebar
                </p>
                <p className="text-sm text-muted-foreground">
                  Get detailed analytics and AI-powered insights instantly
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
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
