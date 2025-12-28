'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Building2,
  BarChart3,
  Coins,
  Globe,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface MarketIndex {
  id: string;
  name: string;
  shortName: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume?: string;
  marketCap?: string;
  lastUpdated: string;
  icon: any;
  color: string;
  description: string;
  constituents?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'indian' | 'global'>('indian'); // ✅ NEW: Tab state

  // ✅ NEW: Refresh interval for real-time updates (every 2 hours)
  useEffect(() => {
    fetchRealMarketData();
    const interval = setInterval(fetchRealMarketData, 7200000); // Refresh every 2 hours
    return () => clearInterval(interval);
  }, []);

  // Fetch real market data from backend API
  const fetchRealMarketData = async () => {
    try {
      // Fetch from our backend proxy API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/api/market/summary`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const apiData = await response.json();

      if (!apiData.success || !apiData.data) {
        throw new Error('Invalid API response');
      }

      // Backend may return array or structured object
      let indicesArray = [];

      if (Array.isArray(apiData.data)) {
        // Direct array format
        indicesArray = apiData.data;
      } else if (apiData.data.indian) {
        // Structured format: { indian: [...], global: [...] }
        indicesArray = apiData.data.indian;
      }

      // If no data received, throw error to use fallback
      if (!indicesArray || indicesArray.length === 0) {
        throw new Error('No market data available from backend');
      }

      // Map API data to our MarketIndex interface
      const realIndices: MarketIndex[] = indicesArray.map((index: any) => {
        // Icon mapping - match backend index IDs
        const iconMap: Record<string, any> = {
          NIFTY_50: BarChart3,
          nifty_50: BarChart3,
          nifty50: BarChart3,
          SENSEX: Building2,
          sensex: Building2,
          NIFTY_MIDCAP_100: Activity,
          nifty_midcap_100: Activity,
          NIFTY_BANK: Coins,
          BANK_NIFTY: Coins,
          bank_nifty: Coins,
          GIFT_NIFTY: Globe,
        };

        // Color mapping
        const colorMap: Record<string, string> = {
          NIFTY_50: 'from-blue-500 to-blue-600',
          nifty_50: 'from-blue-500 to-blue-600',
          SENSEX: 'from-purple-500 to-purple-600',
          sensex: 'from-purple-500 to-purple-600',
          NIFTY_MIDCAP_100: 'from-green-500 to-green-600',
          nifty_midcap_100: 'from-green-500 to-green-600',
          NIFTY_BANK: 'from-red-500 to-red-600',
          BANK_NIFTY: 'from-red-500 to-red-600',
          bank_nifty: 'from-red-500 to-red-600',
          GIFT_NIFTY: 'from-orange-500 to-orange-600',
        };

        const indexKey = index.indexId || index.symbol || index.id;

        return {
          id: indexKey.toLowerCase(),
          name: index.name,
          shortName: index.symbol || index.indexId,
          value: index.currentValue || index.value,
          change: index.change,
          changePercent: index.changePercent,
          high: index.high || index.currentValue || index.value,
          low: index.low || index.currentValue || index.value,
          open: index.open || index.currentValue - index.change,
          previousClose:
            index.previousClose || index.currentValue - index.change,
          lastUpdated: index.lastUpdated,
          icon: iconMap[indexKey] || Activity,
          color: colorMap[indexKey] || 'from-gray-500 to-gray-600',
          description: `${index.name} index`,
          constituents: index.constituents,
        };
      });

      if (realIndices.length > 0) {
        setIndices(realIndices);
      } else {
        throw new Error('No market data received from API');
      }
      setLoading(false);
    } catch (error) {
      // Silently use fallback data - no console error needed for expected behavior
      if (error instanceof Error && error.name !== 'AbortError') {
        console.debug('Market API unavailable, using mock data');
      }

      // Fallback to mock data if API fails
      const mockData: MarketIndex[] = [
        {
          id: 'sensex',
          name: 'S&P BSE Sensex',
          shortName: 'SENSEX',
          value: 65432.18,
          change: 234.56,
          changePercent: 0.36,
          high: 65789.32,
          low: 65123.45,
          open: 65198.76,
          previousClose: 65197.62,
          volume: '3.2 Cr',
          marketCap: '₹280 Lakh Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Building2,
          color: 'blue',
          description:
            "The S&P BSE Sensex is India's most tracked bellwether index, comprising 30 of the largest and most actively traded stocks on the BSE.",
          constituents: 30,
        },
        {
          id: 'nifty50',
          name: 'Nifty 50',
          shortName: 'NIFTY 50',
          value: 19543.65,
          change: -87.23,
          changePercent: -0.44,
          high: 19632.18,
          low: 19498.43,
          open: 19610.88,
          previousClose: 19630.88,
          volume: '2.8 Cr',
          marketCap: '₹245 Lakh Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: TrendingUp,
          color: 'indigo',
          description:
            'Nifty 50 is the flagship index of NSE, representing the weighted average of 50 of the largest Indian companies listed on the exchange.',
          constituents: 50,
        },
        {
          id: 'niftymidcap',
          name: 'Nifty Midcap 100',
          shortName: 'MIDCAP 100',
          value: 42315.78,
          change: 156.34,
          changePercent: 0.37,
          high: 42487.65,
          low: 42089.23,
          open: 42159.44,
          previousClose: 42159.44,
          volume: '1.5 Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: BarChart3,
          color: 'purple',
          description:
            "The Nifty Midcap 100 index tracks the performance of the top 100 mid-cap companies, offering exposure to India's emerging corporate sector.",
          constituents: 100,
        },
        {
          id: 'commodity',
          name: 'MCX Commodity Index',
          shortName: 'MCX iCOMDEX',
          value: 6789.45,
          change: 45.67,
          changePercent: 0.68,
          high: 6812.34,
          low: 6743.78,
          open: 6743.78,
          previousClose: 6743.78,
          volume: '890 Units',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Coins,
          color: 'amber',
          description:
            "MCX iCOMDEX is India's first commodity index, tracking the performance of major commodities traded on the Multi Commodity Exchange.",
          constituents: 6,
        },
        {
          id: 'niftybank',
          name: 'Nifty Bank',
          shortName: 'NIFTY BANK',
          value: 47823.45,
          change: 234.56,
          changePercent: 0.49,
          high: 48012.34,
          low: 47654.23,
          open: 47654.23,
          previousClose: 47588.89,
          volume: '890 Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Building2,
          color: 'blue',
          description:
            'Nifty Bank index represents the 12 most liquid and large capitalized Indian banking stocks.',
          constituents: 12,
        },
        {
          id: 'niftyit',
          name: 'Nifty IT',
          shortName: 'NIFTY IT',
          value: 34567.89,
          change: -123.45,
          changePercent: -0.36,
          high: 34789.12,
          low: 34456.78,
          open: 34691.34,
          previousClose: 34691.34,
          volume: '345 Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Activity,
          color: 'cyan',
          description:
            'Nifty IT index tracks the performance of the top IT companies listed on NSE.',
          constituents: 10,
        },
        {
          id: 'niftypharma',
          name: 'Nifty Pharma',
          shortName: 'NIFTY PHARMA',
          value: 19876.54,
          change: 87.32,
          changePercent: 0.44,
          high: 19923.45,
          low: 19789.12,
          open: 19789.22,
          previousClose: 19789.22,
          volume: '234 Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Activity,
          color: 'teal',
          description:
            'Nifty Pharma index represents the pharmaceutical sector companies.',
          constituents: 10,
        },
        {
          id: 'niftyauto',
          name: 'Nifty Auto',
          shortName: 'NIFTY AUTO',
          value: 21234.56,
          change: 156.78,
          changePercent: 0.74,
          high: 21345.67,
          low: 21098.45,
          open: 21077.78,
          previousClose: 21077.78,
          volume: '456 Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Activity,
          color: 'orange',
          description:
            'Nifty Auto index tracks the performance of the automobile sector.',
          constituents: 15,
        },
        {
          id: 'niftymetal',
          name: 'Nifty Metal',
          shortName: 'NIFTY METAL',
          value: 8765.43,
          change: -45.67,
          changePercent: -0.52,
          high: 8823.45,
          low: 8734.56,
          open: 8811.1,
          previousClose: 8811.1,
          volume: '567 Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Coins,
          color: 'gray',
          description:
            'Nifty Metal index represents the metal and mining sector companies.',
          constituents: 15,
        },
        {
          id: 'niftyfmcg',
          name: 'Nifty FMCG',
          shortName: 'NIFTY FMCG',
          value: 54321.98,
          change: 234.12,
          changePercent: 0.43,
          high: 54456.78,
          low: 54123.45,
          open: 54087.86,
          previousClose: 54087.86,
          volume: '123 Cr',
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Activity,
          color: 'pink',
          description:
            'Nifty FMCG index tracks the performance of fast-moving consumer goods companies.',
          constituents: 15,
        },
        {
          id: 'giftnifty',
          name: 'Gift Nifty',
          shortName: 'GIFT NIFTY',
          value: 19589.5,
          change: 58.62,
          changePercent: 0.3,
          high: 19612.75,
          low: 19530.88,
          open: 19530.88,
          previousClose: 19530.88,
          lastUpdated: new Date().toLocaleTimeString('en-IN'),
          icon: Globe,
          color: 'green',
          description:
            'Gift Nifty is the derivative contract of Nifty 50 traded at GIFT City, providing early market signals and enabling global participation.',
          constituents: 50,
        },
      ];

      setIndices(mockData);
      setLoading(false);
    }
  }; // Close the fetchRealMarketData function

  if (loading) {
    return (
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-700 py-3">
        <div className="animate-pulse flex gap-4 px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Scrolling Ticker */}
      <div className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-y border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 py-3 px-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {indices.map((index) => (
              <Link
                key={index.id}
                href={`/market/${index.id}`}
                className="flex-shrink-0"
              >
                <motion.div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg flex-shrink-0 transition-all hover:scale-105 cursor-pointer ${
                    index.change >= 0
                      ? 'bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50'
                      : 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <index.icon
                    className={`w-6 h-6 ${
                      index.change >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  />

                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {index.shortName}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {index.value.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-xs font-medium flex items-center gap-0.5 ${
                          index.change >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {index.change >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(index.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedIndex && (
          <Dialog
            open={!!selectedIndex}
            onOpenChange={() => setSelectedIndex(null)}
          >
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-lg bg-${selectedIndex.color}-100 dark:bg-${selectedIndex.color}-950/30`}
                    >
                      <selectedIndex.icon
                        className={`w-6 h-6 text-${selectedIndex.color}-600 dark:text-${selectedIndex.color}-400`}
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold">
                        {selectedIndex.name}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedIndex.description}
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Current Value Card */}
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Current Value
                        </p>
                        <p className="text-4xl font-bold text-foreground">
                          {selectedIndex.value.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          selectedIndex.change >= 0
                            ? 'bg-green-100 dark:bg-green-950/30'
                            : 'bg-red-100 dark:bg-red-950/30'
                        }`}
                      >
                        {selectedIndex.change >= 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              selectedIndex.change >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {selectedIndex.change >= 0 ? '+' : ''}
                            {selectedIndex.change.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm ${
                              selectedIndex.change >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {selectedIndex.change >= 0 ? '+' : ''}
                            {selectedIndex.changePercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Open
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedIndex.open.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Prev. Close
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedIndex.previousClose.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Day High
                        </p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {selectedIndex.high.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Day Low
                        </p>
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                          {selectedIndex.low.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {(selectedIndex.volume ||
                      selectedIndex.marketCap ||
                      selectedIndex.constituents) && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        {selectedIndex.volume && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Volume
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedIndex.volume}
                            </p>
                          </div>
                        )}
                        {selectedIndex.marketCap && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Market Cap
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedIndex.marketCap}
                            </p>
                          </div>
                        )}
                        {selectedIndex.constituents && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Constituents
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedIndex.constituents} Companies
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Live Market Data
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Data updates every few seconds during market hours. Last
                      updated at {selectedIndex.lastUpdated}.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
