'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { FundCategories } from '@/components/fund-categories-simple';
import { MarketIndices } from '@/components/market-indices';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/hooks/use-language';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { useFunds } from '@/lib/hooks/use-funds';
import {
  TrendingUp,
  BookOpen,
  Newspaper,
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
  const { funds, loading } = useFunds({ limit: 100 });

  const [activeTab, setActiveTab] = useState<
    'equity' | 'commodity' | 'news' | 'watchlist'
  >('equity');

  const { watchlistFunds } = useMemo(() => {
    const watchlistFunds = funds.filter((fund) => watchlist.includes(fund.id));
    return { watchlistFunds };
  }, [funds, watchlist]);

  const stats = [
    {
      icon: TrendingUp,
      number: funds.filter((f) => f.category === 'Equity').length.toString(),
      label: 'Equity Funds',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: Target,
      number: funds.filter((f) => f.category === 'Commodity').length.toString(),
      label: 'Commodities',
      color: 'from-amber-500 to-amber-700',
    },
    {
      icon: Shield,
      number: '24/7',
      label: 'Support',
      color: 'from-green-500 to-green-700',
    },
    {
      icon: Zap,
      number: '15+',
      label: 'Years Experience',
      color: 'from-purple-500 to-purple-700',
    },
  ];

  if (!watchlistMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />

      {/* Market Indices - Enhanced */}
      <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <MarketIndices />
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center rounded-full px-6 py-3 text-sm font-medium bg-white/10 backdrop-blur-lg text-white ring-2 ring-white/20 hover:ring-white/30 transition-all shadow-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                India's Most Trusted Investment Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-7xl font-bold tracking-tight mb-8"
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Smart Investing
              </span>
              <br />
              <span className="text-white">Made Simple</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto max-w-3xl text-xl text-blue-100 mb-12"
            >
              Discover, compare, and invest in mutual funds with confidence. Our
              AI-powered platform makes wealth building accessible to everyone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link href="/search">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Explore Funds
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  className="border-2 border-slate-300 dark:border-slate-700 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn Investing
                </Button>
              </Link>
            </motion.div>

            {/* Feature Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-8">
                Why Choose MutualFunds.in?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1, duration: 0.6 }}
                    className="text-center group"
                  >
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Investment Categories Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Choose Your Investment Strategy
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Explore our carefully curated fund categories designed to match
              your risk profile and financial goals
            </p>
          </motion.div>

          {/* Enhanced Tab Navigation */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl mb-12 rounded-3xl overflow-hidden">
            <div className="text-center py-8 px-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Investment Categories
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Discover the perfect funds for your investment journey
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center py-8 px-6">
              {[
                {
                  id: 'equity' as const,
                  label: 'Equity Funds',
                  icon: TrendingUp,
                  color: 'from-blue-500 to-blue-700',
                  description: 'Growth-oriented funds',
                  bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                  textColor: 'text-blue-900 dark:text-blue-100',
                },
                {
                  id: 'commodity' as const,
                  label: 'Commodities',
                  icon: Target,
                  color: 'from-amber-500 to-amber-700',
                  description: 'Gold & Silver funds',
                  bgColor: 'bg-amber-50 dark:bg-amber-900/20',
                  textColor: 'text-amber-900 dark:text-amber-100',
                },
                {
                  id: 'news' as const,
                  label: 'Market News',
                  icon: Newspaper,
                  color: 'from-purple-500 to-purple-700',
                  description: 'Latest updates',
                  bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                  textColor: 'text-purple-900 dark:text-purple-100',
                },
                {
                  id: 'watchlist' as const,
                  label: 'My Watchlist',
                  icon: Bookmark,
                  color: 'from-pink-500 via-rose-500 to-red-600',
                  description: 'Saved funds',
                  bgColor: 'bg-pink-50 dark:bg-pink-900/20',
                  textColor: 'text-pink-900 dark:text-pink-100',
                },
              ].map((tab) => (
                <motion.button
                  key={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group flex flex-col items-center gap-3 px-8 py-6 rounded-2xl font-semibold text-sm transition-all duration-300 min-w-[180px] ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105 ring-4 ring-white/20`
                      : `${tab.bgColor} ${tab.textColor} hover:shadow-lg hover:scale-102`
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-gradient-to-r ' + tab.color
                    } transition-all duration-300`}
                  >
                    <tab.icon
                      className={`w-6 h-6 ${
                        activeTab === tab.id ? 'text-white' : 'text-white'
                      }`}
                    />
                  </div>

                  <div className="text-center">
                    <div className="font-bold text-base mb-1">{tab.label}</div>
                    <div
                      className={`text-xs ${
                        activeTab === tab.id ? 'text-white/80' : 'opacity-70'
                      }`}
                    >
                      {tab.description}
                    </div>
                  </div>

                  {tab.id === 'watchlist' && watchlistFunds.length > 0 && (
                    <span
                      className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? 'bg-white text-pink-600'
                          : 'bg-gradient-to-r from-pink-500 to-red-600 text-white'
                      } shadow-lg`}
                    >
                      {watchlistFunds.length}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Fund Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="min-h-[600px]"
          >
            {(activeTab === 'equity' || activeTab === 'commodity') && (
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <FundCategories
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            )}

            {activeTab === 'news' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Newspaper className="w-8 h-8 text-white" />
                    </div>
                    Market Intelligence
                  </h2>
                </div>
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                  <CardContent className="pt-16 pb-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                      <Newspaper className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Real-time Market News Coming Soon
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                      Get the latest market insights, analysis, and news to make
                      informed investment decisions
                    </p>
                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl px-6 py-3">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Notify Me When Available
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'watchlist' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-600 flex items-center justify-center shadow-lg">
                      <Bookmark className="w-8 h-8 text-white" />
                    </div>
                    My Investment Watchlist
                  </h2>
                  {watchlistFunds.length > 0 && (
                    <span className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold text-lg shadow-lg">
                      {watchlistFunds.length} Funds Tracked
                    </span>
                  )}
                </div>

                {watchlistFunds.length > 0 ? (
                  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <FundList funds={watchlistFunds} language={language} />
                  </div>
                ) : (
                  <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                    <CardContent className="pt-20 pb-20 text-center">
                      <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center">
                        <Bookmark className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Start Building Your Watchlist
                      </h3>
                      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                        Track your favorite funds and monitor their performance
                        in real-time
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/search">
                          <Button className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Explore All Funds
                          </Button>
                        </Link>
                        <Link href="/funds?category=equity">
                          <Button
                            variant="outline"
                            className="border-2 border-pink-300 text-pink-700 dark:text-pink-300 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-pink-50 dark:hover:bg-pink-900/20"
                          >
                            <Target className="w-5 h-5 mr-2" />
                            Top Performers
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative mt-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent)] bg-[length:60px_60px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MutualFunds.in
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Your trusted partner in building wealth through smart mutual fund
              investments
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="font-semibold text-white mb-4">Investment</h4>
                <div className="space-y-2 text-slate-400">
                  <div>Equity Funds</div>
                  <div>Debt Funds</div>
                  <div>Hybrid Funds</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Tools</h4>
                <div className="space-y-2 text-slate-400">
                  <div>Portfolio Tracker</div>
                  <div>Fund Compare</div>
                  <div>SIP Calculator</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Learn</h4>
                <div className="space-y-2 text-slate-400">
                  <div>Investment Guide</div>
                  <div>Risk Assessment</div>
                  <div>Market Analysis</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <div className="space-y-2 text-slate-400">
                  <div>Help Center</div>
                  <div>Contact Us</div>
                  <div>Feedback</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-8">
              <p className="text-slate-400">
                © 2025 MutualFunds.in. All rights reserved. | Built with
                precision for smart investors.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
