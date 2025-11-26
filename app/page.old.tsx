'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { MarketIndices } from '@/components/market-indices';
import { AIChatbot } from '@/components/ai-chatbot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/hooks/use-language';
import { useFunds } from '@/lib/hooks/use-funds';
import {
  GitCompare,
  Calculator,
  Users,
  BookOpen,
  Brain,
  PieChart,
  TrendingUp,
  LineChart,
  Building2,
  Newspaper,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { language } = useLanguage();
  const { funds, loading } = useFunds();
  const [activeTab, setActiveTab] = useState<'equity' | 'commodity' | 'news'>(
    'equity'
  );

  const features = [
    {
      id: 1,
      title: 'Fund Overlap',
      icon: PieChart,
      gradient: 'from-blue-500 to-cyan-500',
      href: '/overlap',
    },
    {
      id: 2,
      title: 'Fund Comparison',
      icon: GitCompare,
      gradient: 'from-purple-500 to-pink-500',
      href: '/compare',
    },
    {
      id: 3,
      title: 'Fund Manager',
      icon: Users,
      gradient: 'from-orange-500 to-amber-500',
      href: '/fund-manager',
    },
    {
      id: 4,
      title: 'Calculators',
      icon: Calculator,
      gradient: 'from-green-500 to-emerald-500',
      href: '/calculators',
    },
    {
      id: 5,
      title: 'Knowledge',
      icon: BookOpen,
      gradient: 'from-indigo-500 to-violet-500',
      href: '/knowledge',
    },
    {
      id: 6,
      title: 'AI Assistant',
      icon: Brain,
      gradient: 'from-pink-500 to-rose-500',
      action: 'openChat',
    },
  ];

  const handleFeatureClick = (feature: (typeof features)[0]) => {
    if (feature.action === 'openChat') {
      window.dispatchEvent(new CustomEvent('toggleChatbot'));
    }
  };

  // Filter funds
  const { equityFunds, commodityFunds, largeCap, midCap, smallCap } =
    useMemo(() => {
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
        largeCap: funds.filter((f) => f.category?.includes('Large Cap')),
        midCap: funds.filter((f) => f.category?.includes('Mid Cap')),
        smallCap: funds.filter((f) => f.category?.includes('Small Cap')),
      };
    }, [funds]);

  if (loading) {
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Feature Cards - Compact Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              {feature.href ? (
                <Link href={feature.href}>
                  <Card className="h-full overflow-hidden border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:scale-105 transform cursor-pointer">
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
              ) : (
                <Card
                  className="h-full overflow-hidden border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:scale-105 transform cursor-pointer"
                  onClick={() => handleFeatureClick(feature)}
                >
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
              )}
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-[calc(4rem+3.5rem)] z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg mb-8 rounded-xl">
          <div className="flex gap-2 overflow-x-auto py-3 px-4 scrollbar-hide">
            {[
              { id: 'equity' as const, label: 'Equity Funds', icon: LineChart },
              {
                id: 'commodity' as const,
                label: 'Commodity & ETFs',
                icon: Building2,
              },
              { id: 'news' as const, label: 'Market News', icon: Newspaper },
            ].map((tab) => (
              <button
                key={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
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
              <div className="space-y-8">
                {/* Large Cap Funds */}
                {largeCap.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        Large Cap Funds
                      </h2>
                      <Link href="/search?category=Large+Cap">
                        <Button variant="outline" size="sm" className="gap-2">
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

                {/* Mid Cap Funds */}
                {midCap.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        Mid Cap Funds
                      </h2>
                      <Link href="/search?category=Mid+Cap">
                        <Button variant="outline" size="sm" className="gap-2">
                          View All <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    <FundList funds={midCap.slice(0, 6)} language={language} />
                  </div>
                )}

                {/* Small Cap Funds */}
                {smallCap.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        Small Cap Funds
                      </h2>
                      <Link href="/search?category=Small+Cap">
                        <Button variant="outline" size="sm" className="gap-2">
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

                {/* All Equity Funds */}
                {equityFunds.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                          <LineChart className="w-6 h-6 text-white" />
                        </div>
                        All Equity Funds
                      </h2>
                      <Link href="/search?type=equity">
                        <Button variant="outline" size="sm" className="gap-2">
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
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      Commodity Funds & ETFs
                    </h2>
                    <Link href="/search?type=commodity">
                      <Button variant="outline" size="sm" className="gap-2">
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
              </div>
            )}

            {activeTab === 'news' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-white" />
                      </div>
                      Latest Market News
                    </h2>
                  </div>
                  <Card className="backdrop-blur-xl shadow-xl">
                    <CardContent className="pt-12 pb-12 text-center">
                      <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg text-gray-600">
                        Market news coming soon
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-12 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                India's premier investment platform
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
