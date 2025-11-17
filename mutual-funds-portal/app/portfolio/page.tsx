"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  AlertCircle,
  Download,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/lib/hooks/use-language";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";
import { PortfolioOverviewCard } from "@/components/portfolio/portfolio-overview-card";
import { AllocationChart } from "@/components/portfolio/allocation-chart";
import { HoldingCard } from "@/components/portfolio/holding-card";
import { PortfolioInsights } from "@/components/portfolio/portfolio-insights";
import { PerformanceTimeline } from "@/components/portfolio/performance-timeline";
import {
  PortfolioFiltersPanel,
  PortfolioFilters,
} from "@/components/portfolio/portfolio-filters";
import { PortfolioMetricsSummary } from "@/components/portfolio/portfolio-metrics-summary";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export default function PortfolioPage() {
  const { language, mounted } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<PortfolioFilters>({
    search: "",
    category: "all",
    sortBy: "value-desc",
    returnRange: [-100, 100],
    minInvestment: 0,
    showOnlyPositive: false,
    riskLevel: "all",
    sharpeMin: 0,
  });

  const t = (key: string) => getTranslation(language, key);

  // Fetch real portfolio data from backend
  const fetchPortfolio = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please login to view your portfolio");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/portfolio/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          // Clear token
          localStorage.removeItem("accessToken");
        } else {
          throw new Error("Failed to fetch portfolio");
        }
        return;
      }

      const data = await response.json();
      console.log("✅ Portfolio data received:", data);
      setPortfolioData(data.data);
    } catch (err) {
      console.error("Portfolio fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load portfolio");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchPortfolio();
    }
  }, [mounted]);

  const handleRefresh = () => {
    fetchPortfolio();
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Wallet className="w-16 h-16 text-primary mb-4" />
            </motion.div>
            <p className="text-lg text-muted-foreground">
              Loading your portfolio...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error or empty state
  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                {error ? (
                  <>
                    <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {error}
                    </h2>
                    <p className="text-muted mb-6">
                      {error.includes("login")
                        ? "You need to be logged in to view your portfolio."
                        : "There was a problem loading your portfolio."}
                    </p>
                    <div className="flex gap-4 justify-center">
                      {error.includes("login") ? (
                        <Link href="/auth">
                          <Button>Login Now</Button>
                        </Link>
                      ) : (
                        <Button onClick={() => window.location.reload()}>
                          Try Again
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <PieChart className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      No Investments Yet
                    </h2>
                    <p className="text-muted mb-6">
                      Start investing in mutual funds to build your portfolio
                    </p>
                    <Link href="/">
                      <Button>Explore Funds</Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const holdings = portfolioData.holdings || [];
  const allocation = portfolioData.allocation || [];

  // Add mock financial metrics to holdings (in production, these would come from backend)
  const holdingsWithMetrics = useMemo(() => {
    return holdings.map((holding: any) => ({
      ...holding,
      sharpeRatio: holding.sharpeRatio || Math.random() * 2.5 + 0.5,
      beta: holding.beta || Math.random() * 1.5 + 0.5,
      alpha: holding.alpha || (Math.random() - 0.5) * 6,
    }));
  }, [holdings]);

  // Filter and sort holdings
  const filteredHoldings = useMemo(() => {
    let filtered = [...holdingsWithMetrics];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          (h.fundName || h.name || "").toLowerCase().includes(searchLower) ||
          (h.category || "").toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((h) => h.category === filters.category);
    }

    // Returns filter
    if (filters.showOnlyPositive) {
      filtered = filtered.filter((h) => h.returns > 0);
    }

    // Return range filter
    filtered = filtered.filter(
      (h) =>
        h.returnsPercent >= filters.returnRange[0] &&
        h.returnsPercent <= filters.returnRange[1]
    );

    // Min investment filter
    if (filters.minInvestment > 0) {
      filtered = filtered.filter((h) => h.invested >= filters.minInvestment);
    }

    // Risk level filter (based on Beta)
    if (filters.riskLevel !== "all") {
      filtered = filtered.filter((h) => {
        const beta = h.beta || 1;
        if (filters.riskLevel === "low") return beta < 0.8;
        if (filters.riskLevel === "moderate") return beta >= 0.8 && beta <= 1.2;
        if (filters.riskLevel === "high") return beta > 1.2;
        return true;
      });
    }

    // Sharpe ratio filter
    if (filters.sharpeMin > 0) {
      filtered = filtered.filter(
        (h) => (h.sharpeRatio || 0) >= filters.sharpeMin
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "value-desc":
          return b.current - a.current;
        case "value-asc":
          return a.current - b.current;
        case "returns-desc":
          return b.returns - a.returns;
        case "returns-asc":
          return a.returns - b.returns;
        case "name-asc":
          return (a.fundName || a.name || "").localeCompare(
            b.fundName || b.name || ""
          );
        case "sharpe-desc":
          return (b.sharpeRatio || 0) - (a.sharpeRatio || 0);
        case "alpha-desc":
          return (b.alpha || 0) - (a.alpha || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [holdingsWithMetrics, filters]);

  // Calculate average metrics
  const avgMetrics = useMemo(() => {
    if (filteredHoldings.length === 0) {
      return { avgSharpe: 0, avgBeta: 0, avgAlpha: 0 };
    }
    const totalValue = filteredHoldings.reduce((sum, h) => sum + h.current, 0);
    const avgSharpe = filteredHoldings.reduce(
      (sum, h) => sum + (h.sharpeRatio || 0) * (h.current / totalValue),
      0
    );
    const avgBeta = filteredHoldings.reduce(
      (sum, h) => sum + (h.beta || 1) * (h.current / totalValue),
      0
    );
    const avgAlpha = filteredHoldings.reduce(
      (sum, h) => sum + (h.alpha || 0) * (h.current / totalValue),
      0
    );
    return { avgSharpe, avgBeta, avgAlpha };
  }, [filteredHoldings]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(holdings.map((h: any) => h.category))).filter(
      Boolean
    ) as string[];
  }, [holdings]);

  const handleExportPortfolio = (format: string) => {
    const data = {
      portfolio: portfolioData,
      holdings,
      exportDate: new Date().toISOString(),
      format,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-${format}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <Wallet className="w-10 h-10 text-primary" />
                My Portfolio
              </h1>
              <p className="mt-2 text-muted-foreground text-lg">
                Track your wealth journey and make informed decisions
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportPortfolio("pdf")}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <PortfolioOverviewCard
            title="Total Portfolio Value"
            value={`₹${(portfolioData.totalValue || 0).toLocaleString()}`}
            subtitle="Live NAV values"
            icon={DollarSign}
            trend="neutral"
            delay={0.1}
            badge="LIVE"
          />
          <PortfolioOverviewCard
            title="Total Invested"
            value={`₹${(portfolioData.totalInvested || 0).toLocaleString()}`}
            subtitle={`Across ${holdings.length || 0} holdings`}
            icon={BarChart3}
            trend="neutral"
            delay={0.2}
          />
          <PortfolioOverviewCard
            title="Total Returns"
            value={`${
              (portfolioData.totalReturns || 0) >= 0 ? "+" : ""
            }₹${Math.abs(portfolioData.totalReturns || 0).toLocaleString()}`}
            subtitle={`${
              (portfolioData.totalReturnsPercent || 0) >= 0 ? "+" : ""
            }${(portfolioData.totalReturnsPercent || 0).toFixed(2)}% overall`}
            icon={
              (portfolioData.totalReturns || 0) >= 0 ? TrendingUp : TrendingDown
            }
            trend={(portfolioData.totalReturns || 0) >= 0 ? "up" : "down"}
            delay={0.3}
          />
          <PortfolioOverviewCard
            title="Asset Categories"
            value={`${allocation.length}`}
            subtitle="Diversified portfolio"
            icon={PieChart}
            trend="neutral"
            delay={0.4}
          />
        </div>

        {/* Performance Timeline */}
        <div className="mb-8">
          <PerformanceTimeline
            totalValue={portfolioData.totalValue || 0}
            totalInvested={portfolioData.totalInvested || 0}
          />
        </div>

        {/* Portfolio Metrics Summary */}
        {filteredHoldings.length > 0 && (
          <div className="mb-8">
            <PortfolioMetricsSummary
              avgSharpeRatio={avgMetrics.avgSharpe}
              avgBeta={avgMetrics.avgBeta}
              avgAlpha={avgMetrics.avgAlpha}
              totalHoldings={filteredHoldings.length}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          {/* Allocation Chart */}
          <div className="lg:col-span-1">
            <AllocationChart
              data={allocation.map((item) => ({
                category: item.category,
                value:
                  item.percentage ||
                  (item.value / portfolioData.totalValue) * 100 ||
                  0,
                amount: item.value || item.amount || 0,
              }))}
              totalValue={portfolioData.totalValue || 0}
            />
          </div>

          {/* Insights */}
          <div className="lg:col-span-2">
            <PortfolioInsights
              totalReturnsPercent={portfolioData.totalReturnsPercent || 0}
              allocation={allocation}
              holdingsCount={holdings.length}
              totalValue={portfolioData.totalValue || 0}
            />
          </div>
        </div>

        {/* Holdings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Filters */}
          {holdings.length > 0 && (
            <PortfolioFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              totalHoldings={holdings.length}
              filteredCount={filteredHoldings.length}
            />
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">📂 My Holdings</CardTitle>
                  <CardDescription className="mt-1">
                    {filteredHoldings.length === holdings.length
                      ? "All your mutual fund investments"
                      : `Showing ${filteredHoldings.length} of ${holdings.length} funds`}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {filteredHoldings.length === holdings.length
                      ? "Total Funds"
                      : "Filtered"}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {filteredHoldings.length}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredHoldings.length > 0 ? (
                <div className="space-y-4">
                  {filteredHoldings.map((holding, index) => (
                    <HoldingCard
                      key={holding.id}
                      holding={{
                        id: holding.fundId || holding.id,
                        name:
                          holding.fundName || holding.name || "Unknown Fund",
                        category: holding.category || "OTHER",
                        invested: holding.invested || 0,
                        current: holding.current || 0,
                        returns: holding.returns || 0,
                        returnsPercent: holding.returnsPercent || 0,
                        units: holding.units || 0,
                        nav: holding.nav || 0,
                        sharpeRatio: holding.sharpeRatio,
                        beta: holding.beta,
                        alpha: holding.alpha,
                      }}
                      index={index}
                    />
                  ))}
                </div>
              ) : holdings.length > 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Matching Holdings
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        search: "",
                        category: "all",
                        sortBy: "value-desc",
                        returnRange: [-100, 100],
                        minInvestment: 0,
                        showOnlyPositive: false,
                        riskLevel: "all",
                        sharpeMin: 0,
                      })
                    }
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Holdings Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start your investment journey by exploring top mutual funds
                  </p>
                  <Link href="/">
                    <Button size="lg">Explore Funds</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
