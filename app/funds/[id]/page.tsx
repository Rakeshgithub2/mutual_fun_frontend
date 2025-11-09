"use client";
import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Header } from "@/components/header";
import { InfoModal } from "@/components/info-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWatchlist } from "@/lib/hooks/use-watchlist";
import { useLanguage } from "@/lib/hooks/use-language";
import { useFund } from "@/lib/hooks/use-funds";
import { getTranslation } from "@/lib/i18n";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  DollarSign,
} from "lucide-react";

export default function FundDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language, mounted: langMounted } = useLanguage();
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    mounted: watchlistMounted,
  } = useWatchlist();
  const { fund, loading, error } = useFund(id);
  const [chartPeriod, setChartPeriod] = useState("1Y");

  const t = (key: string) => getTranslation(language, key);

  // Generate mock NAV history data with realistic patterns
  const generateNavData = (period: string) => {
    const dataPoints =
      period === "1M"
        ? 30
        : period === "6M"
        ? 26 // Weekly data for 6 months
        : period === "1Y"
        ? 52 // Weekly data for 1 year
        : period === "3Y"
        ? 36 // Monthly data for 3 years
        : 60; // Monthly data for 5 years

    const data = [];
    const currentNav = fund?.nav || 250;
    const totalReturn =
      period === "1M"
        ? 0.02
        : period === "6M"
        ? 0.06
        : period === "1Y"
        ? (fund?.returns1Y || 12) / 100
        : period === "3Y"
        ? (fund?.returns3Y || 15) / 100
        : (fund?.returns5Y || 13) / 100;

    const startNav = currentNav / (1 + totalReturn);

    for (let i = 0; i <= dataPoints; i++) {
      const date = new Date();
      if (period === "1M") {
        date.setDate(date.getDate() - (dataPoints - i));
      } else {
        if (period === "6M" || period === "1Y") {
          date.setDate(date.getDate() - (dataPoints - i) * 7); // Weekly
        } else {
          date.setMonth(date.getMonth() - (dataPoints - i)); // Monthly
        }
      }

      // Create smooth upward trend with realistic volatility
      const progress = i / dataPoints;
      const trend = startNav * (1 + totalReturn * progress);
      const volatility = trend * 0.03 * (Math.random() - 0.5);
      const nav = trend + volatility;

      data.push({
        date: date.toLocaleDateString("en-IN", {
          month: "short",
          year: period === "3Y" || period === "5Y" ? "2-digit" : undefined,
          day: period === "1M" ? "numeric" : undefined,
        }),
        nav: parseFloat(nav.toFixed(2)),
        displayDate: date.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    }
    return data;
  };

  if (!langMounted || !watchlistMounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-lg text-red-600">
              {error ? `⚠️ ${error}` : t("common.noResults")}
            </p>
            {error && (
              <p className="mt-2 text-sm text-muted">
                Make sure the backend server is running
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(fund.id);
  const navData = generateNavData(chartPeriod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Royal Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl p-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {fund.name}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                    {fund.fundHouse}
                  </p>
                </div>
                <button
                  onClick={() =>
                    inWatchlist
                      ? removeFromWatchlist(fund.id)
                      : addToWatchlist(fund.id)
                  }
                  className="text-4xl hover:scale-125 transition-transform duration-300"
                >
                  {inWatchlist ? "⭐" : "☆"}
                </button>
              </div>
              <div className="flex gap-3 flex-wrap mt-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg">
                  <PieChart className="w-4 h-4" />
                  {fund.category}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
                  ⭐ {fund.rating}/5 Rating
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
                  <Shield className="w-4 h-4" />
                  High Quality
                </span>
              </div>
            </div>
            <div className="text-right bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold mb-2">
                CURRENT NAV
              </p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                ₹{fund.nav.toFixed(2)}
              </p>
              <div className="flex items-center justify-end gap-2">
                {fund.returns1Y >= 0 ? (
                  <>
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                      +{fund.returns1Y.toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 dark:text-red-400 font-bold text-lg">
                      {fund.returns1Y.toFixed(2)}%
                    </span>
                  </>
                )}
                <span className="text-gray-500 dark:text-gray-400 ml-1 font-medium">
                  (1 Year)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/compare" className="flex-1">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-semibold"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Compare Funds
              </Button>
            </Link>
            <Button
              onClick={() =>
                inWatchlist
                  ? removeFromWatchlist(fund.id)
                  : addToWatchlist(fund.id)
              }
              variant="outline"
              size="lg"
              className="border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 font-semibold"
            >
              {inWatchlist ? "⭐ In Watchlist" : "☆ Add to Watchlist"}
            </Button>
          </div>
        </motion.div>

        {/* Enhanced NAV Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 shadow-2xl border-2 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-t-xl border-b-2 border-purple-100 dark:border-purple-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <Activity className="w-7 h-7 text-blue-600" />
                    NAV Performance Analysis
                  </CardTitle>
                  <CardDescription className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Track historical Net Asset Value trends and performance
                    patterns
                  </CardDescription>
                </div>
                <Tabs
                  value={chartPeriod}
                  onValueChange={setChartPeriod}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1"
                >
                  <TabsList className="grid grid-cols-5 gap-1">
                    <TabsTrigger
                      value="1M"
                      className="text-sm font-semibold px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                    >
                      1M
                    </TabsTrigger>
                    <TabsTrigger
                      value="6M"
                      className="text-sm font-semibold px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                    >
                      6M
                    </TabsTrigger>
                    <TabsTrigger
                      value="1Y"
                      className="text-sm font-semibold px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                    >
                      1Y
                    </TabsTrigger>
                    <TabsTrigger
                      value="3Y"
                      className="text-sm font-semibold px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                    >
                      3Y
                    </TabsTrigger>
                    <TabsTrigger
                      value="5Y"
                      className="text-sm font-semibold px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                    >
                      5Y
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {/* Enhanced Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Starting NAV",
                    value: `₹${navData[0]?.nav.toFixed(2)}`,
                    icon: TrendingUp,
                    gradient: "from-green-400 to-emerald-500",
                  },
                  {
                    label: "Current NAV",
                    value: `₹${navData[navData.length - 1]?.nav.toFixed(2)}`,
                    icon: Activity,
                    gradient: "from-blue-400 to-indigo-500",
                  },
                  {
                    label: "Absolute Change",
                    value: `${
                      navData[navData.length - 1]?.nav >= navData[0]?.nav
                        ? "+"
                        : ""
                    }₹${(
                      navData[navData.length - 1]?.nav - navData[0]?.nav
                    ).toFixed(2)}`,
                    icon: ArrowUpRight,
                    gradient:
                      navData[navData.length - 1]?.nav >= navData[0]?.nav
                        ? "from-green-400 to-emerald-500"
                        : "from-red-400 to-rose-500",
                  },
                  {
                    label: "Total Returns",
                    value: `${
                      navData[navData.length - 1]?.nav >= navData[0]?.nav
                        ? "+"
                        : ""
                    }${(
                      ((navData[navData.length - 1]?.nav - navData[0]?.nav) /
                        navData[0]?.nav) *
                      100
                    ).toFixed(2)}%`,
                    icon: BarChart3,
                    gradient:
                      navData[navData.length - 1]?.nav >= navData[0]?.nav
                        ? "from-green-400 to-emerald-500"
                        : "from-red-400 to-rose-500",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className={`p-5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg text-white`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-5 h-5" />
                      <p className="text-xs font-semibold opacity-90">
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-2xl font-extrabold">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Chart */}
              <div className="h-[450px] bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={navData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="50%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="#ec4899"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#9ca3af"
                      strokeOpacity={0.3}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      tick={{ fontSize: 13, fill: "#4b5563", fontWeight: 500 }}
                      tickLine={false}
                      axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                      dy={10}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tick={{ fontSize: 13, fill: "#4b5563", fontWeight: 500 }}
                      tickLine={false}
                      axisLine={{ stroke: "#d1d5db", strokeWidth: 2 }}
                      dx={-10}
                      tickFormatter={(value) => `₹${value}`}
                      domain={["dataMin - 5", "dataMax + 5"]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-2xl p-4">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                                📅 {data.displayDate}
                              </p>
                              <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ₹{data.nav.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                                Net Asset Value
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="nav"
                      stroke="url(#colorNav)"
                      strokeWidth={4}
                      fill="url(#colorNav)"
                      dot={false}
                      activeDot={{
                        r: 8,
                        fill: "#8b5cf6",
                        stroke: "#fff",
                        strokeWidth: 3,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Legend */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"></div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      NAV Performance Trend
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-1 bg-gray-400 rounded shadow"></div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Reference Grid
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-lg shadow font-medium text-gray-700 dark:text-gray-200">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Hover over chart for detailed values
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Key Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              icon: DollarSign,
              label: "Current NAV",
              value: `₹${fund.nav.toFixed(2)}`,
              term: "nav" as const,
              description: "Price per unit",
              gradient: "from-blue-500 to-indigo-600",
              bgGradient:
                "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50",
            },
            {
              icon: PieChart,
              label: "Assets Under Management",
              value: `₹${(fund.aum / 1000).toFixed(1)}K Cr`,
              term: "aum" as const,
              description: "Total fund size",
              gradient: "from-purple-500 to-pink-600",
              bgGradient:
                "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
            },
            {
              icon: BarChart3,
              label: "Expense Ratio",
              value: `${fund.expenseRatio.toFixed(2)}%`,
              term: "expenseRatio" as const,
              description: "Annual management cost",
              gradient: "from-orange-500 to-amber-600",
              bgGradient:
                "from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50",
            },
            {
              icon: Shield,
              label: "Fund Rating",
              value: `${fund.rating}/5 ⭐`,
              term: "rating" as const,
              description: "Performance rating",
              gradient: "from-green-500 to-emerald-600",
              bgGradient:
                "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Card
                className={`hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <InfoModal term={stat.term}>{stat.label}</InfoModal>
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Returns & Insights Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          {/* Historical Returns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Historical Returns
              </CardTitle>
              <CardDescription>
                Annualized performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "1-Year Return",
                    value: fund.returns1Y,
                    term: "returns1Y" as const,
                    period: "Short-term",
                  },
                  {
                    label: "3-Year Return",
                    value: fund.returns3Y,
                    term: "returns3Y" as const,
                    period: "Mid-term",
                  },
                  {
                    label: "5-Year Return",
                    value: fund.returns5Y,
                    term: "returns5Y" as const,
                    period: "Long-term",
                  },
                ].map((ret, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg bg-muted/50 p-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted">
                        <InfoModal term={ret.term}>{ret.label}</InfoModal>
                      </p>
                      {ret.value >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-danger" />
                      )}
                    </div>
                    <p
                      className={`text-3xl font-bold ${
                        ret.value >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {ret.value >= 0 ? "+" : ""}
                      {ret.value.toFixed(2)}%
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {ret.period} performance
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                <p className="font-semibold text-foreground mb-1">
                  💡 Expert Tip:
                </p>
                <p className="text-muted text-xs">
                  5-year returns are most reliable for fund selection. Compare
                  with category average and benchmark index for better context.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fund Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-5 h-5" />
                Fund Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted">Volatility</span>
                  <span className="text-sm font-medium text-foreground">
                    Medium
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 1 }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted">Risk Level</span>
                  <span className="text-sm font-medium text-foreground">
                    Moderate
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "55%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-yellow-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted">
                    Returns Consistency
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    High
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-success"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted mb-2">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-foreground">1.45</p>
                <p className="text-xs text-muted mt-1">
                  Excellent risk-adjusted returns
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Top Holdings
          </h2>
          <div className="space-y-3">
            {fund.holdings.map((holding, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-foreground">{holding.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${holding.percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-medium">
                    {holding.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg text-sm text-foreground">
            <p className="font-semibold mb-1">What are holdings?</p>
            <p className="text-muted text-xs">
              These are the companies the fund invests in. Diversified holdings
              reduce risk.
            </p>
          </div>
        </div>

        {/* Pros and Cons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
            Investment Analysis: Pros & Cons
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pros Section */}
            <Card className="shadow-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                      Advantages
                    </CardTitle>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Why investors choose this fund
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {fund.category === "LARGE_CAP"
                          ? "Stability & Lower Risk"
                          : fund.category === "MID_CAP"
                          ? "Growth Potential"
                          : fund.category === "SMALL_CAP"
                          ? "High Growth Opportunity"
                          : "Balanced Approach"}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {fund.category === "LARGE_CAP"
                          ? "Large-cap funds offer stability with established companies and lower volatility compared to mid and small caps."
                          : fund.category === "MID_CAP"
                          ? "Mid-cap companies have strong growth potential as they transition to large-cap status."
                          : fund.category === "SMALL_CAP"
                          ? "Small-cap funds can deliver exceptional returns by investing in emerging businesses with high growth prospects."
                          : "Multi-cap flexibility allows fund manager to optimize returns across market segments."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Strong Historical Performance
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {fund.returns5Y > 15
                          ? `Excellent 5-year returns of ${fund.returns5Y.toFixed(
                              1
                            )}% p.a. significantly outperform category average.`
                          : fund.returns5Y > 12
                          ? `Solid 5-year returns of ${fund.returns5Y.toFixed(
                              1
                            )}% p.a. demonstrate consistent performance.`
                          : `Returns of ${fund.returns5Y.toFixed(
                              1
                            )}% p.a. align with market expectations for this category.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Competitive Expense Ratio
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {fund.expenseRatio < 1
                          ? `Low expense ratio of ${fund.expenseRatio.toFixed(
                              2
                            )}% means more returns stay in your pocket.`
                          : fund.expenseRatio < 1.5
                          ? `Moderate expense ratio of ${fund.expenseRatio.toFixed(
                              2
                            )}% is competitive for this category.`
                          : `Expense ratio of ${fund.expenseRatio.toFixed(
                              2
                            )}% includes premium fund management services.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Substantial AUM Base
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {fund.aum > 10000
                          ? `Large AUM of ₹${(fund.aum / 1000).toFixed(
                              1
                            )}K Cr provides stability and demonstrates investor confidence.`
                          : fund.aum > 5000
                          ? `Strong AUM of ₹${(fund.aum / 1000).toFixed(
                              1
                            )}K Cr indicates good investor participation.`
                          : `Growing AUM of ₹${(fund.aum / 1000).toFixed(
                              1
                            )}K Cr shows increasing investor interest.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">5</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Experienced Fund Management
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        Managed by {fund.manager.name} with proven expertise and
                        strong track record in equity investing.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cons Section */}
            <Card className="shadow-2xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                      Considerations
                    </CardTitle>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Important factors to consider
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {fund.category === "LARGE_CAP"
                          ? "Limited Growth Potential"
                          : fund.category === "MID_CAP"
                          ? "Moderate Volatility"
                          : fund.category === "SMALL_CAP"
                          ? "High Volatility Risk"
                          : "Market Timing Challenges"}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {fund.category === "LARGE_CAP"
                          ? "Large-cap funds may offer lower returns compared to mid and small caps during bull markets."
                          : fund.category === "MID_CAP"
                          ? "Mid-cap funds experience higher volatility than large-cap funds, requiring patience during market corrections."
                          : fund.category === "SMALL_CAP"
                          ? "Small-cap funds can face severe drawdowns (30-40%) during market downturns, not suitable for risk-averse investors."
                          : "Market cap allocation timing can impact returns if sector rotation occurs."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Long Investment Horizon Required
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        Equity funds require minimum 5-7 year investment horizon
                        to ride out market cycles and generate optimal returns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Market Risk & No Guaranteed Returns
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        Returns are subject to market conditions and not
                        guaranteed. Past performance doesn't ensure future
                        results.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Exit Load & Lock-in Considerations
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        Most equity funds charge 1% exit load if redeemed within
                        1 year. Plan your liquidity needs accordingly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-amber-200 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-200 group">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-bold">5</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Tax Implications on Returns
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        LTCG above ₹1.25L taxed at 12.5% and STCG at 20%. Factor
                        in post-tax returns when planning investments.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Suitability */}
          <Card className="mt-6 shadow-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <span className="text-2xl">💡</span> Investment Suitability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/80 dark:bg-gray-900/40 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                    ✅ Best For:
                  </p>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <li>
                      •{" "}
                      {fund.category === "LARGE_CAP"
                        ? "Conservative investors"
                        : fund.category === "MID_CAP"
                        ? "Moderate risk-takers"
                        : fund.category === "SMALL_CAP"
                        ? "Aggressive investors"
                        : "Balanced investors"}
                    </li>
                    <li>• Long-term wealth creation (7+ years)</li>
                    <li>• SIP investors</li>
                    <li>
                      •{" "}
                      {fund.category === "SMALL_CAP" ||
                      fund.category === "MID_CAP"
                        ? "Young investors (25-40 age)"
                        : "All age groups"}
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-white/80 dark:bg-gray-900/40 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                    ⚠️ Not Suitable For:
                  </p>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Short-term goals ({"<"}3 years)</li>
                    <li>• Risk-averse investors</li>
                    <li>• Those needing guaranteed returns</li>
                    <li>• Emergency fund parking</li>
                  </ul>
                </div>
                <div className="p-4 bg-white/80 dark:bg-gray-900/40 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                    📊 Portfolio Allocation:
                  </p>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <li>
                      •{" "}
                      {fund.category === "LARGE_CAP"
                        ? "40-60% of equity portfolio"
                        : fund.category === "MID_CAP"
                        ? "20-30% of equity portfolio"
                        : fund.category === "SMALL_CAP"
                        ? "10-20% of equity portfolio"
                        : "Core 30-50% allocation"}
                    </li>
                    <li>• Diversify across market caps</li>
                    <li>• Rebalance annually</li>
                    <li>• Review every 6 months</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Fund Manager Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-2 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg">
                  👨‍💼
                </div>
                Fund Management Details
              </CardTitle>
              <CardDescription className="text-base">
                Professional portfolio management and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/fund-manager/${fund.id}`}
                className="block rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-300 p-6 -m-2 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800"
              >
                <div className="flex gap-6 cursor-pointer">
                  <div className="relative">
                    <img
                      src={fund.manager.photo || "/placeholder.svg"}
                      alt={fund.manager.name}
                      className="h-32 w-32 rounded-2xl object-cover shadow-xl ring-4 ring-purple-100 dark:ring-purple-900"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all mb-2">
                      {fund.manager.name}
                    </h3>
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {fund.manager.bio}
                    </p>

                    {/* Manager Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                          Experience
                        </p>
                        <p className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          15+ Years
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-3 rounded-xl border border-purple-100 dark:border-purple-900">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                          Funds Managed
                        </p>
                        <p className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          12 Funds
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-3 rounded-xl border border-green-100 dark:border-green-900">
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                          Track Record
                        </p>
                        <p className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          Excellent
                        </p>
                      </div>
                    </div>

                    {/* Qualifications */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        "MBA Finance",
                        "CFA Charter",
                        "15+ Years Experience",
                      ].map((qual, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold border border-purple-200 dark:border-purple-800"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm group">
                      <span>View Complete Profile & Track Record</span>
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Management Philosophy */}
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl">
                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Investment Philosophy & Strategy
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  The fund follows a disciplined value investing approach
                  combined with growth momentum strategies. Portfolio
                  construction emphasizes quality companies with strong
                  fundamentals, sustainable competitive advantages, and
                  attractive valuations.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">
                        Bottom-up Stock Picking
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Fundamental analysis driven
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">
                        Risk-Adjusted Returns
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Sharpe ratio optimization
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">
                        Long-term Value Creation
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        3-5 year investment horizon
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs">
                        Active Portfolio Management
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Regular rebalancing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex gap-4 flex-wrap"
        >
          <Link href="/compare" className="flex-1 min-w-[200px]">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Compare with Other Funds
            </Button>
          </Link>
          <Button
            onClick={() =>
              inWatchlist
                ? removeFromWatchlist(fund.id)
                : addToWatchlist(fund.id)
            }
            variant="outline"
            size="lg"
            className="flex-1 min-w-[200px] border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-bold shadow-lg"
          >
            {inWatchlist ? "⭐ Remove from Watchlist" : "☆ Add to Watchlist"}
          </Button>
          <Link href="/" className="min-w-[150px]">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-2 border-gray-300 dark:border-gray-700 font-bold shadow-lg"
            >
              ← Back to Home
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                About
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                India's premier mutual funds platform
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <Link
                    href="/glossary"
                    className="hover:text-purple-600 transition-colors font-medium"
                  >
                    Glossary
                  </Link>
                </li>
                <li>
                  <Link
                    href="/calculators"
                    className="hover:text-purple-600 transition-colors font-medium"
                  >
                    Calculators
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tools
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <Link
                    href="/portfolio"
                    className="hover:text-purple-600 transition-colors font-medium"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/alerts"
                    className="hover:text-purple-600 transition-colors font-medium"
                  >
                    Alerts
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors font-medium"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 transition-colors font-medium"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-purple-200 dark:border-purple-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              &copy; 2025 MutualFunds Portal. Built with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
