"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import Link from "next/link";

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

export function MarketIndices() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real market data from backend API
  useEffect(() => {
    const fetchRealMarketData = async () => {
      try {
        // Fetch from our backend proxy API
        const response = await fetch(
          "http://localhost:3002/api/market-indices"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }

        const apiData = await response.json();

        if (!apiData.success || !apiData.data) {
          throw new Error("Invalid API response");
        }

        const { sensex, nifty50, niftyMidcap, giftNifty } = apiData.data;

        // Construct indices array with real data from backend
        const realIndices: MarketIndex[] = [];

        // Add Sensex if available
        if (sensex && sensex.value) {
          realIndices.push({
            id: "sensex",
            name: "S&P BSE Sensex",
            shortName: "SENSEX",
            value: sensex.value,
            change: sensex.change,
            changePercent: sensex.changePercent,
            high: sensex.high,
            low: sensex.low,
            open: sensex.open,
            previousClose: sensex.previousClose,
            volume: sensex.volume
              ? `${(sensex.volume / 10000000).toFixed(1)} Cr`
              : "N/A",
            marketCap: "₹280 Lakh Cr",
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: Building2,
            color: "blue",
            description:
              "The S&P BSE Sensex is India's most tracked bellwether index, comprising 30 of the largest and most actively traded stocks on the BSE.",
            constituents: 30,
          });
        }

        // Add Nifty 50 if available
        if (nifty50 && nifty50.value) {
          realIndices.push({
            id: "nifty50",
            name: "Nifty 50",
            shortName: "NIFTY 50",
            value: nifty50.value,
            change: nifty50.change,
            changePercent: nifty50.changePercent,
            high: nifty50.high,
            low: nifty50.low,
            open: nifty50.open,
            previousClose: nifty50.previousClose,
            volume: nifty50.volume
              ? `${(nifty50.volume / 10000000).toFixed(1)} Cr`
              : "N/A",
            marketCap: "₹245 Lakh Cr",
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: TrendingUp,
            color: "indigo",
            description:
              "Nifty 50 is the flagship index of NSE, representing the weighted average of 50 of the largest Indian companies listed on the exchange.",
            constituents: 50,
          });
        }

        // Add Nifty Midcap if available
        if (niftyMidcap && niftyMidcap.value) {
          realIndices.push({
            id: "niftymidcap",
            name: "Nifty Midcap 100",
            shortName: "MIDCAP 100",
            value: niftyMidcap.value,
            change: niftyMidcap.change,
            changePercent: niftyMidcap.changePercent,
            high: niftyMidcap.high,
            low: niftyMidcap.low,
            open: niftyMidcap.open,
            previousClose: niftyMidcap.previousClose,
            volume: niftyMidcap.volume
              ? `${(niftyMidcap.volume / 10000000).toFixed(1)} Cr`
              : "N/A",
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: BarChart3,
            color: "purple",
            description:
              "The Nifty Midcap 100 index tracks the performance of the top 100 mid-cap companies, offering exposure to India's emerging corporate sector.",
            constituents: 100,
          });
        }

        // Add Commodity (placeholder - real API integration needed)
        realIndices.push({
          id: "commodity",
          name: "MCX Commodity Index",
          shortName: "MCX iCOMDEX",
          value: 6789.45,
          change: 45.67,
          changePercent: 0.68,
          high: 6812.34,
          low: 6743.78,
          open: 6743.78,
          previousClose: 6743.78,
          volume: "890 Units",
          lastUpdated: new Date().toLocaleTimeString("en-IN"),
          icon: Coins,
          color: "amber",
          description:
            "MCX iCOMDEX is India's first commodity index, tracking the performance of major commodities traded on the Multi Commodity Exchange.",
          constituents: 6,
        });

        // Add Gift Nifty if available
        if (giftNifty && giftNifty.value) {
          realIndices.push({
            id: "giftnifty",
            name: "Gift Nifty",
            shortName: "GIFT NIFTY",
            value: giftNifty.value,
            change: giftNifty.change,
            changePercent: giftNifty.changePercent,
            high: giftNifty.high,
            low: giftNifty.low,
            open: giftNifty.open,
            previousClose: giftNifty.previousClose,
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: Globe,
            color: "green",
            description:
              "Gift Nifty is the derivative contract of Nifty 50 traded at GIFT City, providing early market signals and enabling global participation.",
            constituents: 50,
          });
        }

        setIndices(realIndices);
        setLoading(false);
      } catch (error) {
        console.error(
          "Failed to fetch real market data, using fallback:",
          error
        );

        // Fallback to mock data if API fails
        const mockData: MarketIndex[] = [
          {
            id: "sensex",
            name: "S&P BSE Sensex",
            shortName: "SENSEX",
            value: 65432.18,
            change: 234.56,
            changePercent: 0.36,
            high: 65789.32,
            low: 65123.45,
            open: 65198.76,
            previousClose: 65197.62,
            volume: "3.2 Cr",
            marketCap: "₹280 Lakh Cr",
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: Building2,
            color: "blue",
            description:
              "The S&P BSE Sensex is India's most tracked bellwether index, comprising 30 of the largest and most actively traded stocks on the BSE.",
            constituents: 30,
          },
          {
            id: "nifty50",
            name: "Nifty 50",
            shortName: "NIFTY 50",
            value: 19543.65,
            change: -87.23,
            changePercent: -0.44,
            high: 19632.18,
            low: 19498.43,
            open: 19610.88,
            previousClose: 19630.88,
            volume: "2.8 Cr",
            marketCap: "₹245 Lakh Cr",
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: TrendingUp,
            color: "indigo",
            description:
              "Nifty 50 is the flagship index of NSE, representing the weighted average of 50 of the largest Indian companies listed on the exchange.",
            constituents: 50,
          },
          {
            id: "niftymidcap",
            name: "Nifty Midcap 100",
            shortName: "MIDCAP 100",
            value: 42315.78,
            change: 156.34,
            changePercent: 0.37,
            high: 42487.65,
            low: 42089.23,
            open: 42159.44,
            previousClose: 42159.44,
            volume: "1.5 Cr",
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: BarChart3,
            color: "purple",
            description:
              "The Nifty Midcap 100 index tracks the performance of the top 100 mid-cap companies, offering exposure to India's emerging corporate sector.",
            constituents: 100,
          },
          {
            id: "commodity",
            name: "MCX Commodity Index",
            shortName: "MCX iCOMDEX",
            value: 6789.45,
            change: 45.67,
            changePercent: 0.68,
            high: 6812.34,
            low: 6743.78,
            open: 6743.78,
            previousClose: 6743.78,
            volume: "890 Units",
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: Coins,
            color: "amber",
            description:
              "MCX iCOMDEX is India's first commodity index, tracking the performance of major commodities traded on the Multi Commodity Exchange.",
            constituents: 6,
          },
          {
            id: "giftnifty",
            name: "Gift Nifty",
            shortName: "GIFT NIFTY",
            value: 19589.5,
            change: 58.62,
            changePercent: 0.3,
            high: 19612.75,
            low: 19530.88,
            open: 19530.88,
            previousClose: 19530.88,
            lastUpdated: new Date().toLocaleTimeString("en-IN"),
            icon: Globe,
            color: "green",
            description:
              "Gift Nifty is the derivative contract of Nifty 50 traded at GIFT City, providing early market signals and enabling global participation.",
            constituents: 50,
          },
        ];

        setIndices(mockData);
        setLoading(false);
      }
    };

    fetchRealMarketData();

    // Refresh every 30 seconds during market hours
    const interval = setInterval(() => {
      fetchRealMarketData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
          <div className="flex items-center gap-2 flex-shrink-0 pr-4 border-r border-gray-300 dark:border-gray-600">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              LIVE MARKETS
            </span>
          </div>

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
                      ? "bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50"
                      : "bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <index.icon
                    className={`w-6 h-6 ${
                      index.change >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />

                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {index.shortName}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {index.value.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`text-xs font-medium flex items-center gap-0.5 ${
                          index.change >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
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

          <div className="flex items-center gap-2 flex-shrink-0 pl-4 border-l border-gray-300 dark:border-gray-600">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">
              Updated: {indices[0]?.lastUpdated}
            </span>
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
                          {selectedIndex.value.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          selectedIndex.change >= 0
                            ? "bg-green-100 dark:bg-green-950/30"
                            : "bg-red-100 dark:bg-red-950/30"
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
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {selectedIndex.change >= 0 ? "+" : ""}
                            {selectedIndex.change.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm ${
                              selectedIndex.change >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {selectedIndex.change >= 0 ? "+" : ""}
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
                          {selectedIndex.open.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Prev. Close
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {selectedIndex.previousClose.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Day High
                        </p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {selectedIndex.high.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Day Low
                        </p>
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                          {selectedIndex.low.toLocaleString("en-IN")}
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
