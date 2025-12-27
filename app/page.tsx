'use client';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { MarketIndices } from '@/components/market-indices';

const FUND_CATEGORIES = [
  {
    name: 'Equity Funds',
    description: 'High growth potential with market-linked returns',
    count: '2000+ funds',
    color: 'from-blue-500 to-blue-600',
    category: 'equity',
    icon: '📈',
  },
  {
    name: 'Commodity Funds',
    description: 'Invest in gold, silver & commodities',
    count: '200+ funds',
    color: 'from-yellow-500 to-orange-600',
    category: 'commodity',
    icon: '🪙',
  },
  {
    name: 'Debt Funds',
    description: 'Stable returns with lower risk',
    count: '1500+ funds',
    color: 'from-green-500 to-green-600',
    category: 'debt',
    icon: '💰',
  },
];

const QUICK_ACTIONS = [
  {
    name: 'Fund Comparison',
    icon: '⚖️',
    href: '/compare',
    description: 'Compare multiple funds',
  },
  {
    name: 'Fund Overlap',
    icon: '🔄',
    href: '/overlap',
    description: 'Check portfolio overlap',
  },
  {
    name: 'Investment Calculator',
    icon: '🧮',
    href: '/calculators',
    description: 'Calculate returns',
  },
  {
    name: 'Fund Manager',
    icon: '👨‍💼',
    href: '/fund-manager',
    description: 'Find top managers',
  },
  {
    name: 'Goal Planning',
    icon: '🎯',
    href: '/goal-planning',
    description: 'Plan your goals',
  },
  {
    name: 'AI Assistant',
    icon: '🤖',
    href: '/chat',
    description: 'Chat with AI assistant',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* Market Indices - Real-time data from backend */}
      <MarketIndices />

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Fund Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Explore Fund Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FUND_CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href={
                  category.category === 'commodity'
                    ? '/commodity'
                    : category.category === 'equity'
                      ? '/equity'
                      : category.category === 'debt'
                        ? '/debt'
                        : `/equity?category=${category.category}`
                }
              >
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-800 hover:scale-105">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} mb-4 flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {category.count}
                    </p>
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.name} href={action.href}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-800 h-full">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {action.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
