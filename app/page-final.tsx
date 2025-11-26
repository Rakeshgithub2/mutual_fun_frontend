'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { MarketIndices } from '@/components/market-indices';
import { AIChatbot } from '@/components/ai-chatbot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/hooks/use-language';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { useFunds } from '@/lib/hooks/use-funds';
import {
  GitCompare,
  Calculator,
  Users,
  BookOpen,
  TrendingUp,
  PieChart,
  LineChart,
  Building2,
  Newspaper,
  ArrowRight,
  Bookmark,
  Sparkles,
  Shield,
  Target,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { language } = useLanguage();
  const { watchlist, mounted: watchlistMounted } = useWatchlist();
  const { funds, loading } = useFunds();
  const [activeTab, setActiveTab] = useState<
    'equity' | 'commodity' | 'news' | 'watchlist'
  >('equity');

  const features = [
    {
      id: 1,
      title: 'Fund Overlap',
      icon: PieChart,
      gradient: 'from-cyan-500 to-blue-600',
      href: '/overlap',
    },
    {
      id: 2,
      title: 'Fund Compare',
      icon: GitCompare,
      gradient: 'from-purple-500 to-indigo-600',
      href: '/compare',
    },
    {
      id: 3,
      title: 'Fund Manager',
      icon: Users,
      gradient: 'from-orange-500 to-red-600',
      href: '/fund-manager',
    },
    {
      id: 4,
      title: 'Calculators',
      icon: Calculator,
      gradient: 'from-green-500 to-teal-600',
      href: '/calculators',
    },
    {
      id: 5,
      title: 'Knowledge',
      icon: BookOpen,
      gradient: 'from-pink-500 to-rose-600',
      href: '/knowledge',
    },
    {
      id: 6,
      title: 'Portfolio',
      icon: TrendingUp,
      gradient: 'from-amber-500 to-yellow-600',
      href: '/portfolio',
    },
  ];

  // Filter funds
  const {
    equityFunds,
    commodityFunds,
    watchlistFunds,
    largeCap,
    midCap,
    smallCap,
  } = useMemo(() => {
    return {
      equityFunds: funds.filter(
        (f) =>
          f.category?.includes('Equity') ||
          f.category?.includes('Growth') ||
          f.category?.includes('Cap') ||
          f.type === 'Equity'
      ),
      commodityFunds: funds.filter(
        (f) =>
          f.category?.includes('Commodity') ||
          f.category?.includes('Gold') ||
          f.category === 'ETF' ||
          f.type === 'Commodity'
      ),
      watchlistFunds: funds.filter((f) => watchlist.includes(f.id)),
      largeCap: funds.filter((f) => f.category?.includes('Large Cap')),
      midCap: funds.filter((f) => f.category?.includes('Mid Cap')),
      smallCap: funds.filter((f) => f.category?.includes('Small Cap')),
    };
  }, [funds, watchlist]);

  if (loading || !watchlistMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted">Loading...</p>
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
      <section className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">
                Smart Investment Platform for Everyone
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              Grow Your Wealth with
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Smarter Mutual Funds
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 font-light">
              Transform your financial future with expert tools, real-time
              insights, and intelligent portfolio management
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  label: 'Secure Platform',
                  gradient: 'from-blue-400 to-blue-600',
                },
                {
                  icon: Target,
                  label: 'Goal Planning',
                  gradient: 'from-green-400 to-green-600',
                },
                {
                  icon: Zap,
                  label: 'Instant Analysis',
                  gradient: 'from-purple-400 to-purple-600',
                },
                {
                  icon: TrendingUp,
                  label: 'Smart Returns',
                  gradient: 'from-pink-400 to-pink-600',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 transform"
                >
                  <div
                    className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${item.gradient} mb-2`}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-white/80 font-medium">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <Link href={feature.href}>
                <Card className="h-full overflow-hidden border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-2xl hover:scale-110 transform cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-2`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-[calc(4rem+3.5rem)] z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700 shadow-xl mb-8 rounded-2xl">
          <div className="flex gap-2 overflow-x-auto py-4 px-4 scrollbar-hide">
            {[
              {
                id: 'equity' as const,
                label: 'Equity Funds',
                icon: LineChart,
                color: 'from-blue-500 to-blue-700',
              },
              {
                id: 'commodity' as const,
                label: 'Commodities',
                icon: Building2,
                color: 'from-amber-500 to-amber-700',
              },
              {
                id: 'news' as const,
                label: 'Market News',
                icon: Newspaper,
                color: 'from-purple-500 to-purple-700',
              },
              {
                id: 'watchlist' as const,
                label: 'My Watchlist',
                icon: Bookmark,
                color: 'from-pink-500 via-rose-500 to-red-600',
              },
            ].map((tab) => (
              <button
                key={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-xl scale-105`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 'watchlist' && watchlistFunds.length > 0 && (
                  <span
                    className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-gradient-to-r from-pink-500 to-red-600 text-white'
                    }`}
                  >
                    {watchlistFunds.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fund Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'equity' && (
              <div className="space-y-10">
                {largeCap.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        Large Cap Funds
                      </h2>
                      <Link href="/search?category=Large+Cap">
                        <Button
                          variant="outline"
                          className="gap-2 hover:scale-105 transition-transform"
                        >
                          View All <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    <FundList
                      funds={largeCap.slice(0, 6)}
                      language={language}
                    />
                  </div>
                )}

                {midCap.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        Mid Cap Funds
                      </h2>
                      <Link href="/search?category=Mid+Cap">
                        <Button
                          variant="outline"
                          className="gap-2 hover:scale-105 transition-transform"
                        >
                          View All <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    <FundList funds={midCap.slice(0, 6)} language={language} />
                  </div>
                )}

                {smallCap.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        Small Cap Funds
                      </h2>
                      <Link href="/search?category=Small+Cap">
                        <Button
                          variant="outline"
                          className="gap-2 hover:scale-105 transition-transform"
                        >
                          View All <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    <FundList
                      funds={smallCap.slice(0, 6)}
                      language={language}
                    />
                  </div>
                )}

                {equityFunds.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-700 flex items-center justify-center shadow-lg">
                          <LineChart className="w-7 h-7 text-white" />
                        </div>
                        All Equity Funds
                      </h2>
                      <Link href="/search?type=equity">
                        <Button
                          variant="outline"
                          className="gap-2 hover:scale-105 transition-transform"
                        >
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
              </div>
            )}

            {activeTab === 'commodity' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    Commodity Funds & ETFs
                  </h2>
                  <Link href="/search?type=commodity">
                    <Button
                      variant="outline"
                      className="gap-2 hover:scale-105 transition-transform"
                    >
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
                  <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-2">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        No commodity funds available
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'news' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-lg">
                      <Newspaper className="w-7 h-7 text-white" />
                    </div>
                    Latest Market News
                  </h2>
                </div>
                <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-2">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Market news coming soon
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-600 flex items-center justify-center shadow-lg">
                      <Bookmark className="w-7 h-7 text-white" />
                    </div>
                    My Watchlist
                  </h2>
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold">
                    {watchlistFunds.length} Funds
                  </span>
                </div>
                {watchlistFunds.length > 0 ? (
                  <FundList funds={watchlistFunds} language={language} />
                ) : (
                  <Card className="bg-white/80 backdrop-blur-xl shadow-2xl border-2">
                    <CardContent className="pt-16 pb-16 text-center">
                      <Bookmark className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                      <h3 className="text-2xl font-bold mb-3">
                        Your watchlist is empty
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Start adding funds to track them
                      </p>
                      <Link href="/search">
                        <Button className="gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700">
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

      {/* Footer */}
      <footer className="border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl py-12 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                India's smartest investment platform
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/overlap" className="hover:text-primary">
                    Fund Overlap
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-primary">
                    Compare Funds
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
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/knowledge" className="hover:text-primary">
                    Knowledge Center
                  </Link>
                </li>
                <li>
                  <Link href="/glossary" className="hover:text-primary">
                    Glossary
                  </Link>
                </li>
                <li>
                  <Link href="/fund-manager" className="hover:text-primary">
                    Fund Managers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Account</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
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
                <li>
                  <Link href="/settings" className="hover:text-primary">
                    Settings
                  </Link>
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

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
