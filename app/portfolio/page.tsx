"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Download,
  PieChart,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/hooks/use-language";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export default function PortfolioPage() {
  const { language, mounted } = useLanguage();
  const [timeRange, setTimeRange] = useState("1M");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  const t = (key: string) => getTranslation(language, key);

  // Fetch real portfolio data from backend
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
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
        setError(
          err instanceof Error ? err.message : "Failed to load portfolio"
        );
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchPortfolio();
    }
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Portfolio</h1>
            <p className="mt-2 text-muted">
              Track your investments and performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExportPortfolio("pdf")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportPortfolio("csv")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Portfolio Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{(portfolioData.totalValue || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted flex items-center gap-1 mt-1">
                  <span className="text-success">Live NAV values</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Invested
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{(portfolioData.totalInvested || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted mt-1">
                  Across {holdings.length || 0} holdings
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Returns
                </CardTitle>
                {portfolioData.returns >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    (portfolioData.totalReturns || 0) >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {(portfolioData.totalReturns || 0) >= 0 ? "+" : ""}₹
                  {(portfolioData.totalReturns || 0).toLocaleString()}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    (portfolioData.totalReturns || 0) >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {(portfolioData.totalReturns || 0) >= 0 ? "+" : ""}
                  {(portfolioData.totalReturnsPercent || 0).toFixed(2)}% overall
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Asset Allocation
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {allocation.length} Categories
                </div>
                <p className="text-xs text-muted mt-1">Diversified portfolio</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Allocation Chart */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution by fund category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocation.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {item.category}
                        </span>
                        <span className="text-muted">{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <div className="text-xs text-muted">
                        ₹{item.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted mb-4">
                    Portfolio Health Score
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-gradient-to-r from-success via-primary to-accent"
                      />
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                      85%
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Excellent diversification
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Holdings Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Holdings</CardTitle>
                    <CardDescription>
                      All your mutual fund investments
                    </CardDescription>
                  </div>
                  <Tabs
                    value={timeRange}
                    onValueChange={setTimeRange}
                    className="w-auto"
                  >
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="1D" className="text-xs">
                        1D
                      </TabsTrigger>
                      <TabsTrigger value="1M" className="text-xs">
                        1M
                      </TabsTrigger>
                      <TabsTrigger value="1Y" className="text-xs">
                        1Y
                      </TabsTrigger>
                      <TabsTrigger value="ALL" className="text-xs">
                        ALL
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding, index) => (
                    <motion.div
                      key={holding.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Link href={`/funds/${holding.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                              {holding.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted">
                            {holding.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            ₹{holding.current.toLocaleString()}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              holding.returns >= 0
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            {holding.returns >= 0 ? "+" : ""}₹
                            {holding.returns.toLocaleString()} (
                            {holding.returnsPercent >= 0 ? "+" : ""}
                            {holding.returnsPercent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm pt-3 border-t border-border">
                        <div>
                          <p className="text-muted">Invested</p>
                          <p className="font-medium text-foreground">
                            ₹{holding.invested.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Units</p>
                          <p className="font-medium text-foreground">
                            {holding.units.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Current NAV</p>
                          <p className="font-medium text-foreground">
                            ₹{holding.nav.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link href={`/invest/${holding.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Add More
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="flex-1">
                          Redeem
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {holdings.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted mb-4">No holdings yet</p>
                    <Link href="/">
                      <Button>Start Investing</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
