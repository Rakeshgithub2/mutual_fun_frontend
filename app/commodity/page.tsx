'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { useLanguage } from '@/lib/hooks/use-language';
import { getTranslation } from '@/lib/i18n';
import { useFunds } from '@/hooks/use-funds';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CommodityFundsPage() {
  const { language, mounted: langMounted } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [subcategory, setSubcategory] = useState<
    'ALL' | 'GOLD_ETF' | 'SILVER_ETF' | 'COMMODITY'
  >('ALL');
  const [page, setPage] = useState(1);

  // Fetch commodity funds by category (3 separate API calls)
  const { funds: goldFunds = [], loading: loadingGold } = useFunds({
    category: 'GOLD_ETF',
    limit: 100,
    query: searchQuery || undefined,
  });

  const { funds: silverFunds = [], loading: loadingSilver } = useFunds({
    category: 'SILVER_ETF',
    limit: 100,
    query: searchQuery || undefined,
  });

  const { funds: commodityFunds = [], loading: loadingCommodity } = useFunds({
    category: 'COMMODITY',
    limit: 100,
    query: searchQuery || undefined,
  });

  const loading = loadingGold || loadingSilver || loadingCommodity;
  const error = null; // Individual errors handled by each hook

  const t = (key: string) => getTranslation(language, key);

  // Combine all commodity funds
  const allFundsRaw = [...goldFunds, ...silverFunds, ...commodityFunds];

  // Transform API Fund type to FundList's expected type
  const allFunds = allFundsRaw.map((fund) => ({
    id: fund.id || fund.fundId,
    name: fund.name,
    fundHouse: fund.fundHouse,
    category: fund.category,
    nav: fund.currentNav,
    returns1Y: fund.returns?.oneYear || 0,
    returns3Y: fund.returns?.threeYear || 0,
    returns5Y: fund.returns?.fiveYear || 0,
    aum: fund.aum || 0,
    expenseRatio: fund.expenseRatio || 0,
    rating:
      fund.ratings?.morningstar ||
      fund.ratings?.crisil ||
      fund.ratings?.valueResearch ||
      0,
  }));

  // Filter funds by subcategory
  const filteredFunds =
    subcategory === 'ALL'
      ? allFunds
      : allFunds.filter((fund) => fund.category === subcategory);

  // Count funds by category
  const goldCount = allFunds.filter((f) => f.category === 'GOLD_ETF').length;
  const silverCount = allFunds.filter(
    (f) => f.category === 'SILVER_ETF'
  ).length;
  const otherCount = allFunds.filter((f) => f.category === 'COMMODITY').length;

  if (!langMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-950 dark:via-amber-950/20 dark:to-orange-950/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3">
            🥇 Commodity Funds & ETFs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {filteredFunds.length}{' '}
            {subcategory === 'ALL'
              ? 'Total'
              : subcategory === 'GOLD_ETF'
              ? 'Gold'
              : subcategory === 'SILVER_ETF'
              ? 'Silver'
              : 'Other Metal'}{' '}
            Funds Available
          </p>
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border-2 border-amber-200 dark:border-amber-800"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Filter by Commodity Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setSubcategory('ALL');
                setPage(1);
              }}
              className={`p-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 ${
                subcategory === 'ALL'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">🌟</div>
              <div className="text-lg">All</div>
              <div className="text-sm opacity-90">
                ({allFunds.length} funds)
              </div>
            </button>

            <button
              onClick={() => {
                setSubcategory('GOLD_ETF');
                setPage(1);
              }}
              className={`p-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 ${
                subcategory === 'GOLD_ETF'
                  ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">🥇</div>
              <div className="text-lg">Gold Funds</div>
              <div className="text-sm opacity-90">({goldCount} funds)</div>
            </button>

            <button
              onClick={() => {
                setSubcategory('SILVER_ETF');
                setPage(1);
              }}
              className={`p-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 ${
                subcategory === 'SILVER_ETF'
                  ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">🥈</div>
              <div className="text-lg">Silver Funds</div>
              <div className="text-sm opacity-90">({silverCount} funds)</div>
            </button>

            <button
              onClick={() => {
                setSubcategory('COMMODITY');
                setPage(1);
              }}
              className={`p-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 ${
                subcategory === 'COMMODITY'
                  ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-lg">Other Metals</div>
              <div className="text-sm opacity-90">({otherCount} funds)</div>
            </button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Search for funds by name or house..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900 px-6 py-4 text-lg placeholder-gray-400 focus:border-amber-500 dark:focus:border-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-500/20 shadow-lg"
          />
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 grid md:grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/30 p-6 rounded-xl border-2 border-yellow-300 dark:border-yellow-800">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
              🥇 Gold Funds ({goldCount})
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Invest in physical gold through ETFs. Perfect for portfolio
              diversification and inflation hedge.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-900/30 dark:to-slate-900/30 p-6 rounded-xl border-2 border-gray-400 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              🥈 Silver Funds ({silverCount})
            </h3>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              Industrial precious metal with dual investment appeal. Used in
              electronics, solar panels, and jewelry.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 p-6 rounded-xl border-2 border-orange-300 dark:border-orange-800">
            <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-2">
              ⚡ Other Metals ({otherCount})
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-300">
              Copper, Aluminum, Platinum, and multi-commodity funds. Exposure to
              industrial and construction sectors.
            </p>
          </div>
        </motion.div>

        {/* Funds List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Loading commodity funds...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
              <p className="text-lg text-red-600 dark:text-red-400">
                Error loading funds: {String(error)}
              </p>
            </div>
          ) : filteredFunds.length > 0 ? (
            <FundList funds={filteredFunds} language={language} />
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                No funds found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            💡 Why Invest in Commodity Funds?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Portfolio Diversification
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Commodities have low correlation with stocks and bonds,
                providing true diversification to your portfolio.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Inflation Hedge
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Precious metals like gold and silver historically preserve
                purchasing power during inflationary periods.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Crisis Protection
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Gold is considered a safe-haven asset during economic
                uncertainty and geopolitical tensions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Easy & Liquid
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                ETFs provide easy way to invest in physical commodities without
                storage concerns. Trade like stocks with high liquidity.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
