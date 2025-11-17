"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { FundList } from "@/components/fund-list";
import { MarketIndices } from "@/components/market-indices";
import { KnowledgeButton } from "@/components/knowledge-button";
import { useLanguage } from "@/lib/hooks/use-language";
import { useWatchlist } from "@/lib/hooks/use-watchlist";
import { useFunds } from "@/lib/hooks/use-funds";
import { getTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles,
  BarChart3,
  Bookmark,
  Newspaper,
  LineChart,
  Building2,
  Calculator,
  Target,
  GitCompare,
  Users,
  Briefcase,
  Layers,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  tags: string[];
  publishedAt: string;
}

export default function Home() {
  const { language, mounted: langMounted } = useLanguage();
  const { watchlist, mounted: watchlistMounted } = useWatchlist();
  const { funds, loading: fundsLoading, error } = useFunds();
  const [activeTab, setActiveTab] = useState<
    "equity" | "commodity" | "news" | "watchlist"
  >("equity");
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [knowledgeTab, setKnowledgeTab] = useState<"mutualfunds" | "commodity">(
    "mutualfunds"
  );

  const t = (key: string) => getTranslation(language, key);

  // Fetch news
  useEffect(() => {
    if (activeTab === "news" && news.length === 0) {
      setNewsLoading(true);
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

      fetch(`${API_URL}/news/latest?limit=12`)
        .then((res) => res.json())
        .then((data) => {
          if (data.data && Array.isArray(data.data)) {
            setNews(data.data);
          }
          setNewsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch news:", err);
          setNewsLoading(false);
        });
    }
  }, [activeTab, news.length]);

  // Filter funds
  const { equityFunds, commodityFunds, watchlistFunds } = useMemo(() => {
    return {
      equityFunds: funds.filter(
        (f) =>
          f.category?.includes("Equity") ||
          f.category?.includes("Growth") ||
          f.category?.includes("Cap") ||
          f.type === "Equity"
      ),
      commodityFunds: funds.filter(
        (f) =>
          f.category?.includes("Commodity") ||
          f.category?.includes("Gold") ||
          f.category === "ETF" ||
          f.type === "Commodity"
      ),
      watchlistFunds: funds.filter((f) => watchlist.includes(f.id)),
    };
  }, [funds, watchlist]);

  if (!langMounted || !watchlistMounted || fundsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-red-500 bg-red-50 p-6 text-center">
          <p className="text-lg text-red-600">⚠️ Failed to load funds</p>
          <p className="mt-2 text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Market Indices */}
      <div className="sticky top-16 z-50">
        <MarketIndices />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">
                Trusted by 10,000+ Investors
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Invest Smarter with
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                AI-Powered Tools
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-16 font-light">
              Track 5000+ funds • Calculate returns • Compare intelligently •
              Invest confidently
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Calculator,
                  label: "Smart Calculators",
                  value: "5+",
                  gradient: "from-blue-400 to-blue-600",
                },
                {
                  icon: BarChart3,
                  label: "Mutual Funds",
                  value: "5000+",
                  gradient: "from-purple-400 to-purple-600",
                },
                {
                  icon: Target,
                  label: "Fund Analysis",
                  value: "Real-time",
                  gradient: "from-pink-400 to-pink-600",
                },
                {
                  icon: Shield,
                  label: "Secure & Trusted",
                  value: "100%",
                  gradient: "from-orange-400 to-orange-600",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 transform"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-3`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">
                    {feature.value}
                  </p>
                  <p className="text-sm text-white/80 font-medium">
                    {feature.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fund Comparison */}
          <Link href="/compare">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <GitCompare className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Fund Comparison
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Compare returns, expense ratios, and performance metrics
                  side-by-side
                </p>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Performance
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Metrics
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Fund Overlap */}
          <Link href="/overlap">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-pink-600 p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Fund Overlap
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Analyze common stock holdings to ensure true portfolio
                  diversification
                </p>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Stock-level
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Diversification
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Fund Manager Details */}
          <Link href="/search">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Fund Managers
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Expert managers with proven track records and deep market
                  insights
                </p>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Profiles
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Performance
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Portfolio Tracker */}
          <Link href="/portfolio">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-pink-600 p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Portfolio Tracker
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Monitor investments, track returns, and get actionable
                  insights
                </p>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Real-time
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Analytics
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Investment Calculator */}
          <Link href="/calculators">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 transform cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Investment Calculator
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Calculate returns, SIP projections, and tax implications
                </p>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    SIP Calculator
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    Tax Calculator
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Knowledge Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => setShowKnowledge(true)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 p-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105 transform cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Knowledge Center
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Learn about mutual funds, commodities, and investment basics
              </p>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                  Education
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                  Guides
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-[calc(4rem+3.5rem)] z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {[
              { id: "equity" as const, label: "Equity Funds", icon: LineChart },
              {
                id: "commodity" as const,
                label: "Commodity Funds",
                icon: Building2,
              },
              { id: "news" as const, label: "Market News", icon: Newspaper },
              { id: "watchlist" as const, label: "Watchlist", icon: Bookmark },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.id === "watchlist" && watchlistFunds.length > 0 && (
                  <span
                    className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {watchlistFunds.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "equity" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <LineChart className="w-8 h-8 text-blue-600" />
                      Equity Mutual Funds
                      <KnowledgeButton term="equity" />
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {equityFunds.length} funds • High growth potential
                    </p>
                  </div>
                  <Link href="/search?type=equity">
                    <Button variant="outline" className="gap-2">
                      View All <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <FundList
                  funds={equityFunds.slice(0, 12)}
                  language={language}
                />
              </div>
            )}

            {activeTab === "commodity" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-amber-600" />
                      Commodity Funds & ETFs
                      <KnowledgeButton term="etf" />
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {commodityFunds.length} funds
                    </p>
                  </div>
                  <Link href="/search?type=commodity">
                    <Button variant="outline" className="gap-2">
                      View All <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                {commodityFunds.length > 0 ? (
                  <FundList
                    funds={commodityFunds.slice(0, 12)}
                    language={language}
                  />
                ) : (
                  <Card className="bg-white/60 backdrop-blur-xl shadow-xl">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg text-gray-600">
                        No commodity funds available
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "news" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Newspaper className="w-8 h-8 text-purple-600" />
                    Latest Market News
                    <KnowledgeButton term="sensex" />
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Stay updated with market trends
                  </p>
                </div>

                {newsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="backdrop-blur-xl shadow-xl">
                        <CardContent className="pt-6 space-y-4 animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : news.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((article) => (
                      <Card
                        key={article.id}
                        className="backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all"
                      >
                        <CardContent className="pt-6 space-y-3">
                          <h3 className="font-semibold line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {article.content}
                          </p>
                          <div className="flex justify-between pt-3 border-t">
                            <span className="text-xs text-gray-500">
                              {article.source}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                article.publishedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="backdrop-blur-xl shadow-xl">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg text-gray-600">No news available</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "watchlist" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Bookmark className="w-8 h-8 text-pink-600" />
                    Your Watchlist
                    <KnowledgeButton term="portfolio" />
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {watchlistFunds.length} funds tracked
                  </p>
                </div>

                {watchlistFunds.length > 0 ? (
                  <FundList funds={watchlistFunds} language={language} />
                ) : (
                  <Card className="backdrop-blur-xl shadow-xl">
                    <CardContent className="pt-16 pb-16 text-center">
                      <Bookmark className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                      <h3 className="text-2xl font-bold mb-3">
                        Your watchlist is empty
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Start adding funds to track them
                      </p>
                      <Link href="/search">
                        <Button className="gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Explore Funds
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Knowledge Center Modal */}
      <AnimatePresence>
        {showKnowledge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowKnowledge(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] overflow-hidden"
            >
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">
                            Knowledge Center
                          </h2>
                          <p className="text-white/90 text-sm">
                            Learn investment basics and build your financial
                            knowledge
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKnowledge(false)}
                        className="text-white hover:bg-white/20"
                      >
                        <span className="text-2xl">×</span>
                      </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setKnowledgeTab("mutualfunds")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          knowledgeTab === "mutualfunds"
                            ? "bg-white text-amber-600 shadow-lg"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        Mutual Funds
                      </button>
                      <button
                        onClick={() => setKnowledgeTab("commodity")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          knowledgeTab === "commodity"
                            ? "bg-white text-amber-600 shadow-lg"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        Commodities
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 max-h-[60vh] overflow-y-auto">
                    {knowledgeTab === "mutualfunds" && (
                      <div className="space-y-8">
                        {/* What is MF */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 text-blue-600">
                            <BookOpen className="w-6 h-6" />
                            What are Mutual Funds?
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            A mutual fund is a professionally managed investment
                            vehicle that pools money from multiple investors to
                            purchase a diversified portfolio of stocks, bonds,
                            or other securities. Each investor owns shares in
                            the fund, which represent a portion of the holdings.
                          </p>
                        </div>

                        {/* Why Important */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-green-600">
                            Why are Mutual Funds Important?
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Professional Management
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Expert fund managers make investment decisions
                                  on your behalf
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Diversification
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Spread risk across multiple securities with a
                                  single investment
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Accessibility
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Start investing with as little as ₹500 through
                                  SIP
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Liquidity
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Easy to buy and sell, typically within 1-3
                                  business days
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Advantages */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-purple-600">
                            Advantages
                          </h3>
                          <ul className="space-y-3">
                            {[
                              "Low minimum investment requirements",
                              "Professional portfolio management and research",
                              "Economies of scale reduce transaction costs",
                              "Systematic Investment Plans (SIP) for disciplined investing",
                              "Tax benefits under ELSS (Equity Linked Savings Scheme)",
                              "Regulatory oversight by SEBI ensures transparency",
                            ].map((adv, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {adv}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Disadvantages */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-red-600">
                            Disadvantages & Risks
                          </h3>
                          <ul className="space-y-3">
                            {[
                              "Market risk: Returns are not guaranteed and can fluctuate",
                              "Expense ratios and management fees reduce overall returns",
                              "Exit loads may apply if redeemed within a specified period",
                              "Less control over individual investment decisions",
                              "Tax implications on capital gains (STCG and LTCG)",
                              "Past performance doesn't guarantee future results",
                            ].map((dis, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {dis}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Types */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-indigo-600">
                            Types of Mutual Funds
                          </h3>
                          <div className="grid md:grid-cols-3 gap-4">
                            <Card className="bg-indigo-50 dark:bg-indigo-900/20">
                              <CardContent className="p-4">
                                <h4 className="font-bold mb-2">Equity Funds</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Invest in stocks for long-term growth
                                  potential
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-indigo-50 dark:bg-indigo-900/20">
                              <CardContent className="p-4">
                                <h4 className="font-bold mb-2">Debt Funds</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Invest in bonds for stable income and lower
                                  risk
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-indigo-50 dark:bg-indigo-900/20">
                              <CardContent className="p-4">
                                <h4 className="font-bold mb-2">Hybrid Funds</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Balanced mix of equity and debt securities
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    )}

                    {knowledgeTab === "commodity" && (
                      <div className="space-y-8">
                        {/* What is Commodity */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 text-blue-600">
                            <BookOpen className="w-6 h-6" />
                            What are Commodities?
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Commodities are raw materials or primary
                            agricultural products that can be bought and sold.
                            They include precious metals (gold, silver), energy
                            (crude oil, natural gas), agricultural products
                            (wheat, coffee), and industrial metals (copper,
                            aluminum). Commodity investments help diversify
                            portfolios and hedge against inflation.
                          </p>
                        </div>

                        {/* Why Important */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-green-600">
                            Why Invest in Commodities?
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Inflation Hedge
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Commodity prices typically rise with
                                  inflation, protecting purchasing power
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Portfolio Diversification
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Low correlation with stocks and bonds reduces
                                  overall portfolio risk
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Global Demand
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Essential resources with consistent worldwide
                                  demand
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  ✓ Crisis Protection
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Gold and other precious metals often
                                  appreciate during economic uncertainty
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Advantages */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-purple-600">
                            Advantages
                          </h3>
                          <ul className="space-y-3">
                            {[
                              "Hedge against inflation and currency devaluation",
                              "Portfolio diversification with low stock market correlation",
                              "Tangible assets with intrinsic value",
                              "Global trading opportunities 24/7",
                              "Potential for high returns during supply shortages",
                              "Strategic asset allocation for risk management",
                            ].map((adv, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {adv}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Disadvantages */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-red-600">
                            Disadvantages & Risks
                          </h3>
                          <ul className="space-y-3">
                            {[
                              "High price volatility driven by supply/demand dynamics",
                              "No dividend or interest income (except through funds)",
                              "Storage costs for physical commodities",
                              "Geopolitical risks affect prices significantly",
                              "Leverage in futures can amplify losses",
                              "Complex market requiring specialized knowledge",
                            ].map((dis, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {dis}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Types */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-indigo-600">
                            Types of Commodities
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <Card className="bg-indigo-50 dark:bg-indigo-900/20">
                              <CardContent className="p-4">
                                <h4 className="font-bold mb-2">
                                  🥇 Precious Metals
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Gold, Silver, Platinum, Palladium
                                </p>
                                <p className="text-xs text-gray-500">
                                  Safe-haven assets and industrial uses
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-indigo-50 dark:bg-indigo-900/20">
                              <CardContent className="p-4">
                                <h4 className="font-bold mb-2">⚡ Energy</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Crude Oil, Natural Gas, Coal
                                </p>
                                <p className="text-xs text-gray-500">
                                  Essential for global economy and
                                  transportation
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-indigo-50 dark:bg-indigo-900/20">
                              <CardContent className="p-4">
                                <h4 className="font-bold mb-2">
                                  🌾 Agricultural
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Wheat, Coffee, Cotton, Sugar
                                </p>
                                <p className="text-xs text-gray-500">
                                  Food and textile industry essentials
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-indigo-50 dark:bg-indigo-900/20">
                              <CardContent className="p-4">
                                <h4 className="font-bold mb-2">
                                  🏗️ Industrial Metals
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Copper, Aluminum, Zinc, Nickel
                                </p>
                                <p className="text-xs text-gray-500">
                                  Construction and manufacturing materials
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* How to Invest */}
                        <div>
                          <h3 className="text-2xl font-bold mb-3 text-orange-600">
                            How to Invest in Commodities?
                          </h3>
                          <div className="space-y-3">
                            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  1. Commodity ETFs
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Trade commodity exposure like stocks through
                                  exchange-traded funds
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  2. Commodity Mutual Funds
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Professionally managed funds investing in
                                  commodity-related securities
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  3. Futures & Options
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Derivative contracts for experienced traders
                                  (higher risk)
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">
                                  4. Physical Ownership
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Direct purchase of gold, silver, or other
                                  physical commodities
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-12 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                India's premier mutual funds platform
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/glossary" className="hover:text-primary">
                    Glossary
                  </Link>
                </li>
                <li>
                  <Link href="/calculators" className="hover:text-primary">
                    Calculators
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/portfolio" className="hover:text-primary">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className="hover:text-primary">
                    Alerts
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 MutualFunds Portal. Built with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
