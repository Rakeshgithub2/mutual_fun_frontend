'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Activity,
  Building2,
  BarChart3,
  Coins,
  Globe,
  Calendar,
  Clock,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Sparkles,
  TrendingUpIcon,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MarketIndex {
  id: string;
  name: string;
  shortName: string;
  value: number;
  change?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  volume?: string;
  marketCap?: string;
  lastUpdated: string;
  icon: any;
  color: string;
  description: string;
  constituents?: number;
  about?: string;
  keyPoints?: string[];
  topStocks?: Array<{ name: string; weight: string }>;
  historicalData?: Array<{ date: string; value: number }>;
}

// Helper function to get importance points for each index
const getImportancePoints = (indexId: string): string[] => {
  const importanceMap: Record<string, string[]> = {
    sensex: [
      'Benchmark for large-cap equity mutual funds performance comparison',
      'Represents the pulse and health of Indian stock market',
      'Used by fund managers to compare portfolio returns against market',
      "Reflects the performance of India's top blue-chip companies",
      'Key indicator for portfolio rebalancing and asset allocation decisions',
      'Helps investors understand market trends and investment timing',
    ],
    nifty50: [
      'Primary benchmark for index funds and ETFs tracking Indian markets',
      'Indicates overall market direction and investor sentiment',
      'Used extensively for derivatives trading and hedging strategies',
      'Essential for passive investment strategies and portfolio construction',
      'Helps in making informed asset allocation decisions',
      'Critical reference point for active fund managers to beat',
    ],
    niftymidcap: [
      'Benchmark for mid-cap mutual funds performance evaluation',
      'Higher growth potential compared to large-cap indices',
      'Balances risk and return in diversified investment portfolios',
      "Captures India's emerging companies and growth stories",
      'Important for diversification beyond large-cap investments',
      'Reflects domestic economic growth and consumption trends',
    ],
    niftysmallcap: [
      'Benchmark for small-cap mutual funds and aggressive portfolios',
      'Highest return potential with proportionally higher risk',
      'Captures grassroots economic growth and entrepreneurship',
      'Suitable for long-term wealth creation in aggressive portfolios',
      'Indicates domestic consumption and manufacturing trends',
      'Provides diversification benefits in bull markets',
    ],
    niftybank: [
      'Benchmark for banking sector mutual funds',
      'Reflects health of Indian financial system and credit growth',
      'Key indicator of economic activity and lending trends',
      'Important for sectoral allocation in equity portfolios',
      'Highly responsive to RBI monetary policy changes',
      'Essential for understanding interest rate cycle impact',
    ],
    niftyit: [
      'Benchmark for technology sector mutual funds',
      'Reflects global IT demand and outsourcing trends',
      'Dollar-dependent sector providing forex diversification',
      'Important for export-oriented exposure in portfolios',
      'Key indicator of digital transformation worldwide',
      'Benefits from global tech spending and innovation',
    ],
    niftypharma: [
      'Benchmark for pharma and healthcare sector funds',
      'Defensive sector providing stability during market volatility',
      'Benefits from rising healthcare spending and aging population',
      'Export-oriented sector with global market exposure',
      'Key for portfolio diversification and risk reduction',
      'Non-cyclical nature provides consistent returns',
    ],
    niftyauto: [
      'Benchmark for auto sector mutual funds',
      'Indicates consumer demand and economic prosperity',
      'Cyclical sector useful for tactical allocation strategies',
      'Benefits from rural income growth and urbanization',
      'Key indicator of manufacturing sector health',
      'Sensitive to interest rates and fuel prices',
    ],
    niftyfmcg: [
      'Defensive sector benchmark for conservative investors',
      'Provides stable returns during market downturns',
      'Reflects consumer spending patterns and sentiment',
      'Low volatility sector for risk-averse portfolios',
      'Essential for balanced and conservative mutual funds',
      'Non-discretionary consumption provides recession resistance',
    ],
    niftymetal: [
      'Cyclical sector for tactical investment opportunities',
      'Benefits from infrastructure and construction spending',
      'Sensitive to global commodity prices and demand',
      'High beta sector for aggressive portfolio allocation',
      'Important industrial growth and capex indicator',
      'Provides inflation hedge through commodity exposure',
    ],
    commodity: [
      'Benchmark for commodity mutual funds and ETFs',
      'Provides hedge against inflation in portfolios',
      'Diversification beyond traditional equity investments',
      'Reflects raw material price trends for industries',
      'Important for inflation-protected investment strategies',
      'Useful for understanding supply-demand dynamics',
    ],
    giftnifty: [
      'Early market sentiment indicator before NSE opens',
      'Used by fund managers for pre-market analysis',
      'Helps in timing entry and exit decisions',
      'Indicates global participation and foreign interest',
      'Useful for intraday and tactical fund strategies',
      'Provides overnight market direction cues',
    ],
  };

  return (
    importanceMap[indexId] || [
      'Important market indicator for investment decisions',
      'Helps in portfolio diversification strategies',
      'Used for performance comparison and benchmarking',
      'Reflects specific sector or market segment trends',
      'Essential for understanding market dynamics',
    ]
  );
};

export default function MarketIndexPage() {
  const params = useParams();
  const router = useRouter();
  const [indexData, setIndexData] = useState<MarketIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    Array<{ time: string; value: number; timestamp: number }>
  >([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    '1D' | '1W' | '1M' | '1Y' | '5Y'
  >('1D');
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);

  // Generate intraday data (like Groww app - real-time updates)
  const generateIntradayData = (currentValue: number, openValue: number) => {
    const data = [];
    const now = new Date();
    const marketOpen = new Date(now);
    marketOpen.setHours(9, 15, 0, 0); // Market opens at 9:15 AM

    const currentTime = now.getTime();
    const startTime = marketOpen.getTime();

    // Generate data points every 5 minutes from market open to now
    let value = openValue;
    const intervals = Math.floor((currentTime - startTime) / (5 * 60 * 1000)); // 5-minute intervals

    for (let i = 0; i <= Math.min(intervals, 75); i++) {
      // Max 75 intervals (6.25 hours)
      const timestamp = startTime + i * 5 * 60 * 1000;
      const time = new Date(timestamp);

      // Add realistic intraday movement
      const volatility = 0.001;
      const trend = (currentValue - openValue) / intervals;
      value += trend + (Math.random() - 0.5) * 2 * volatility * value;

      data.push({
        time: time.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        value: parseFloat(value.toFixed(2)),
        timestamp: timestamp,
      });
    }

    // Ensure last point matches current value
    if (data.length > 0) {
      data[data.length - 1].value = currentValue;
    }

    return data;
  };

  // Generate weekly data (last 7 days)
  const generateWeeklyData = (
    currentValue: number,
    volatility: number = 0.015
  ) => {
    const data = [];
    const days = 7;
    let value = currentValue * 0.98;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const change = (Math.random() - 0.5) * 2 * volatility * value;
      value += change;

      if (i < 2) {
        value += (currentValue - value) * 0.3;
      }

      data.push({
        time: date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        }),
        value: parseFloat(value.toFixed(2)),
        timestamp: date.getTime(),
      });
    }

    return data;
  };

  // Generate monthly data (last 30 days)
  const generateMonthlyData = (
    currentValue: number,
    volatility: number = 0.02
  ) => {
    const data = [];
    const days = 30;
    let value = currentValue * 0.95;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const change = (Math.random() - 0.5) * 2 * volatility * value;
      value += change;

      if (i < 5) {
        value += (currentValue - value) * 0.2;
      }

      data.push({
        time: date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        }),
        value: parseFloat(value.toFixed(2)),
        timestamp: date.getTime(),
      });
    }

    return data;
  };

  // Generate yearly data (last 12 months)
  const generateYearlyData = (
    currentValue: number,
    volatility: number = 0.03
  ) => {
    const data = [];
    const months = 12;
    let value = currentValue * 0.85;

    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const change = (Math.random() - 0.5) * 2 * volatility * value;
      value += change;

      if (i < 2) {
        value += (currentValue - value) * 0.25;
      }

      data.push({
        time: date.toLocaleDateString('en-IN', {
          month: 'short',
          year: '2-digit',
        }),
        value: parseFloat(value.toFixed(2)),
        timestamp: date.getTime(),
      });
    }

    return data;
  };

  // Generate 5-year data (last 60 months)
  const generateFiveYearData = (
    currentValue: number,
    volatility: number = 0.04
  ) => {
    const data = [];
    const months = 60; // 5 years = 60 months
    let value = currentValue * 0.55; // Start from ~55% of current value (realistic growth)

    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      // Add realistic long-term growth with volatility
      const growthTrend = (currentValue - value) / (i + 1);
      const randomChange = (Math.random() - 0.45) * volatility * value; // Slight upward bias
      value += growthTrend * 0.5 + randomChange;

      // Ensure gradual approach to current value
      if (i < 3) {
        value += (currentValue - value) * 0.3;
      }

      // Sample every 2 months for cleaner visualization (30 points total)
      if (i % 2 === 0) {
        data.push({
          time: date.toLocaleDateString('en-IN', {
            month: 'short',
            year: '2-digit',
          }),
          value: parseFloat(value.toFixed(2)),
          timestamp: date.getTime(),
        });
      }
    }

    // Ensure last point matches current value
    if (data.length > 0) {
      data[data.length - 1].value = currentValue;
    }

    return data;
  };

  // Update chart data based on selected time range
  useEffect(() => {
    if (indexData && indexData.value) {
      const indexId = params.id as string;
      const volatility = indexId === 'niftymidcap' ? 0.025 : 0.015;

      let newChartData;
      switch (selectedTimeRange) {
        case '1D':
          newChartData = generateIntradayData(
            indexData.value,
            indexData.open ?? indexData.value
          );
          break;
        case '1W':
          newChartData = generateWeeklyData(indexData.value, volatility);
          break;
        case '1M':
          newChartData = generateMonthlyData(indexData.value, volatility);
          break;
        case '1Y':
          newChartData = generateYearlyData(indexData.value, volatility);
          break;
        case '5Y':
          newChartData = generateFiveYearData(indexData.value, volatility);
          break;
        default:
          newChartData = generateIntradayData(
            indexData.value,
            indexData.open ?? indexData.value
          );
      }

      setChartData(newChartData);
    }
  }, [indexData, selectedTimeRange, params.id]);

  // Real-time updates for intraday view (like Groww)
  useEffect(() => {
    if (selectedTimeRange === '1D' && indexData) {
      setIsLiveUpdating(true);

      const interval = setInterval(() => {
        // Simulate real-time data update every 5 seconds
        const now = new Date();
        const currentHour = now.getHours();

        // Only update during market hours (9:15 AM to 3:30 PM)
        if (currentHour >= 9 && currentHour < 16) {
          setChartData((prevData) => {
            if (prevData.length === 0) return prevData;

            // Add small random fluctuation to simulate real-time update
            const lastPoint = prevData[prevData.length - 1];
            const fluctuation =
              (Math.random() - 0.5) * 0.0005 * lastPoint.value;
            const newValue = lastPoint.value + fluctuation;

            const newPoint = {
              time: now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              value: parseFloat(newValue.toFixed(2)),
              timestamp: now.getTime(),
            };

            // Keep last 100 points for smooth chart
            const updatedData = [...prevData.slice(-99), newPoint];
            return updatedData;
          });
        }
      }, 5000); // Update every 5 seconds

      return () => {
        clearInterval(interval);
        setIsLiveUpdating(false);
      };
    }
  }, [selectedTimeRange, indexData]);

  useEffect(() => {
    const fetchIndexData = async () => {
      try {
        const BASE_URL = 'https://mutualfun-backend.vercel.app';
        const response = await fetch(`${BASE_URL}/api/market-indices`);
        const apiData = await response.json();

        if (!apiData.success || !apiData.data) {
          throw new Error('Invalid API response');
        }

        const { sensex, nifty50, niftyMidcap, giftNifty } = apiData.data;
        const indexId = params.id as string;

        let data: MarketIndex | null = null;

        switch (indexId) {
          case 'sensex':
            if (sensex && sensex.value) {
              data = {
                id: 'sensex',
                name: 'S&P BSE Sensex',
                shortName: 'SENSEX',
                value: sensex.value ?? 0,
                change: sensex.change ?? 0,
                changePercent: sensex.changePercent ?? 0,
                high: sensex.high ?? sensex.value ?? 0,
                low: sensex.low ?? sensex.value ?? 0,
                open: sensex.open ?? sensex.value ?? 0,
                previousClose: sensex.previousClose ?? sensex.value ?? 0,
                volume: sensex.volume
                  ? `${(sensex.volume / 10000000).toFixed(1)} Cr`
                  : 'N/A',
                marketCap: '₹280 Lakh Cr',
                lastUpdated: new Date().toLocaleTimeString('en-IN'),
                icon: Building2,
                color: 'blue',
                description:
                  "The S&P BSE Sensex is India's most tracked bellwether index, comprising 30 of the largest and most actively traded stocks on the BSE.",
                constituents: 30,
                about:
                  'The S&P BSE Sensex, also called the BSE 30 or simply the Sensex, is a free-float market-weighted stock market index of 30 well-established and financially sound companies listed on the Bombay Stock Exchange (BSE). Since its inception in 1986, the index has become one of the most prominent equity indices in India. It serves as a barometer of the Indian stock market and economy.',
                keyPoints: [
                  'Oldest stock market index in India, established on January 1, 1986',
                  'Comprises 30 of the largest, most liquid, and financially sound companies',
                  "Represents about 45% of the BSE's free-float market capitalization",
                  'Base year is 1978-79 with a base value of 100 points',
                  'Reviewed quarterly to ensure it reflects market trends accurately',
                  'Uses free-float market capitalization methodology for calculations',
                ],
                topStocks: [
                  { name: 'Reliance Industries', weight: '10.2%' },
                  { name: 'HDFC Bank', weight: '9.8%' },
                  { name: 'Infosys', weight: '8.5%' },
                  { name: 'ICICI Bank', weight: '7.9%' },
                  { name: 'TCS', weight: '7.2%' },
                  { name: 'Bharti Airtel', weight: '5.8%' },
                  { name: 'ITC', weight: '4.9%' },
                  { name: 'Kotak Mahindra Bank', weight: '4.5%' },
                  { name: 'HUL', weight: '4.1%' },
                  { name: 'Axis Bank', weight: '3.8%' },
                ],
              };
            }
            break;

          case 'nifty50':
            if (nifty50 && nifty50.value) {
              data = {
                id: 'nifty50',
                name: 'Nifty 50',
                shortName: 'NIFTY 50',
                value: nifty50.value ?? 0,
                change: nifty50.change ?? 0,
                changePercent: nifty50.changePercent ?? 0,
                high: nifty50.high ?? nifty50.value ?? 0,
                low: nifty50.low ?? nifty50.value ?? 0,
                open: nifty50.open ?? nifty50.value ?? 0,
                previousClose: nifty50.previousClose ?? nifty50.value ?? 0,
                volume: nifty50.volume
                  ? `${(nifty50.volume / 10000000).toFixed(1)} Cr`
                  : 'N/A',
                marketCap: '₹245 Lakh Cr',
                lastUpdated: new Date().toLocaleTimeString('en-IN'),
                icon: TrendingUp,
                color: 'indigo',
                description:
                  'Nifty 50 is the flagship index of NSE, representing the weighted average of 50 of the largest Indian companies listed on the exchange.',
                constituents: 50,
                about:
                  'The Nifty 50 is the flagship index of the National Stock Exchange of India (NSE). It is a diversified 50-stock index accounting for 13 sectors of the Indian economy. The index is used for a variety of purposes such as benchmarking fund portfolios, index-based derivatives, and index funds. Nifty 50 represents about 66% of the free-float market capitalization of stocks listed on NSE.',
                keyPoints: [
                  'Launched on April 22, 1996, with a base date of November 3, 1995',
                  'Covers 50 stocks across 13 major sectors of the Indian economy',
                  "Represents approximately 66% of NSE's free-float market cap",
                  'Base value set at 1000 points and base capital at ₹2.06 trillion',
                  'Rebalanced semi-annually in March and September',
                  'Most liquid index in India with derivatives trading available',
                ],
                topStocks: [
                  { name: 'Reliance Industries', weight: '10.5%' },
                  { name: 'HDFC Bank', weight: '10.1%' },
                  { name: 'ICICI Bank', weight: '8.7%' },
                  { name: 'Infosys', weight: '7.9%' },
                  { name: 'TCS', weight: '6.8%' },
                  { name: 'Bharti Airtel', weight: '5.4%' },
                  { name: 'ITC', weight: '4.7%' },
                  { name: 'State Bank of India', weight: '4.2%' },
                  { name: 'HUL', weight: '3.9%' },
                  { name: 'Kotak Mahindra Bank', weight: '3.6%' },
                ],
              };
            }
            break;

          case 'niftymidcap':
            if (niftyMidcap && niftyMidcap.value) {
              data = {
                id: 'niftymidcap',
                name: 'Nifty Midcap 100',
                shortName: 'MIDCAP 100',
                value: niftyMidcap.value,
                change: niftyMidcap.change,
                changePercent: niftyMidcap.changePercent,
                high: niftyMidcap.high,
                low: niftyMidcap.low,
                open: niftyMidcap.open,
                previousClose: niftyMidcap.previousClose,
                volume: niftyMidcap.volume
                  ? `${(niftyMidcap.volume / 10000000).toFixed(1)} Cr`
                  : 'N/A',
                lastUpdated: new Date().toLocaleTimeString('en-IN'),
                icon: BarChart3,
                color: 'purple',
                description:
                  "The Nifty Midcap 100 index tracks the performance of the top 100 mid-cap companies, offering exposure to India's emerging corporate sector.",
                constituents: 100,
                about:
                  'The Nifty Midcap 100 represents the performance of 100 mid-cap companies listed on NSE. These companies typically have market capitalizations between ₹5,000 crore and ₹20,000 crore. Mid-cap stocks offer a balance between the stability of large-caps and the growth potential of small-caps. This index is ideal for investors seeking higher growth with moderate risk tolerance.',
                keyPoints: [
                  'Tracks 100 mid-sized companies with strong growth potential',
                  'Companies ranked from 101st to 200th by market capitalization',
                  'Offers exposure to emerging businesses and sectors',
                  'Higher volatility compared to large-cap indices',
                  'Historically delivered superior returns over long periods',
                  'Rebalanced semi-annually to maintain relevance',
                ],
                topStocks: [
                  { name: 'Adani Ports', weight: '3.2%' },
                  { name: 'SBI Life Insurance', weight: '2.9%' },
                  { name: 'Adani Green Energy', weight: '2.7%' },
                  { name: 'Zomato', weight: '2.5%' },
                  { name: 'Trent', weight: '2.4%' },
                  { name: "Divi's Labs", weight: '2.3%' },
                  { name: 'ABB India', weight: '2.1%' },
                  { name: 'Bosch', weight: '2.0%' },
                  { name: 'Pidilite Industries', weight: '1.9%' },
                  { name: 'Siemens', weight: '1.8%' },
                ],
              };
            }
            break;

          case 'giftnifty':
            if (giftNifty && giftNifty.value) {
              data = {
                id: 'giftnifty',
                name: 'Gift Nifty',
                shortName: 'GIFT NIFTY',
                value: giftNifty.value ?? 0,
                change: giftNifty.change ?? 0,
                changePercent: giftNifty.changePercent ?? 0,
                high: giftNifty.high ?? giftNifty.value ?? 0,
                low: giftNifty.low ?? giftNifty.value ?? 0,
                open: giftNifty.open ?? giftNifty.value ?? 0,
                previousClose: giftNifty.previousClose ?? giftNifty.value ?? 0,
                lastUpdated: new Date().toLocaleTimeString('en-IN'),
                icon: Globe,
                color: 'green',
                description:
                  'Gift Nifty is the derivative contract of Nifty 50 traded at GIFT City, providing early market signals and enabling global participation.',
                constituents: 50,
                about:
                  "Gift Nifty (Gujarat International Finance Tec-City Nifty) is a derivative contract based on the Nifty 50 index, traded at India's first International Financial Services Centre in GIFT City, Gujarat. It replaced SGX Nifty in 2022, bringing back trading activity to India. Gift Nifty trades for extended hours, providing early indications of how Indian markets might open.",
                keyPoints: [
                  'Launched in July 2022, replacing SGX Nifty',
                  "Traded at GIFT City, India's first IFSC",
                  'Provides early market signals before NSE opens',
                  'Facilitates global participation in Indian markets',
                  'Trading hours: 6:30 AM to 11:30 PM IST',
                  'Settled in USD, attracting foreign investors',
                ],
              };
            }
            break;

          case 'commodity':
            data = {
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
              about:
                "MCX iCOMDEX (Multi Commodity Exchange Composite Index) is India's first real-time commodity futures index. It provides a snapshot of commodity price movements across energy, metals, and agricultural sectors. The index is calculated using the most liquid futures contracts of six major commodities traded on MCX.",
              keyPoints: [
                "India's first real-time commodity futures index",
                'Tracks 6 major commodities: Gold, Silver, Crude Oil, Natural Gas, Copper, and Zinc',
                'Base value set at 1000 on June 15, 2005',
                'Rebalanced quarterly to reflect market dynamics',
                'Useful for portfolio diversification beyond equities',
                'Provides hedging opportunities against inflation',
              ],
              topStocks: [
                { name: 'Gold', weight: '25%' },
                { name: 'Crude Oil', weight: '25%' },
                { name: 'Silver', weight: '17%' },
                { name: 'Natural Gas', weight: '13%' },
                { name: 'Copper', weight: '10%' },
                { name: 'Zinc', weight: '10%' },
              ],
            };
            break;
        }

        setIndexData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch index data:', error);
        setLoading(false);
      }
    };

    fetchIndexData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading market data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!indexData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Index Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The requested market index could not be found.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = indexData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-2 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br from-${indexData.color}-100 to-${indexData.color}-200 dark:from-${indexData.color}-950/30 dark:to-${indexData.color}-900/30`}
                  >
                    <IconComponent
                      className={`w-10 h-10 text-${indexData.color}-600 dark:text-${indexData.color}-400`}
                    />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                      {indexData.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {indexData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Value */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Value
                  </p>
                  <p className="text-5xl font-bold text-gray-900 dark:text-white">
                    {indexData.value?.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || 'N/A'}
                  </p>
                </div>
                <div
                  className={`flex items-center justify-center gap-4 px-6 py-4 rounded-2xl ${
                    (indexData.change ?? 0) >= 0
                      ? 'bg-green-50 dark:bg-green-950/30'
                      : 'bg-red-50 dark:bg-red-950/30'
                  }`}
                >
                  {(indexData.change ?? 0) >= 0 ? (
                    <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-12 h-12 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <p
                      className={`text-3xl font-bold ${
                        (indexData.change ?? 0) >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {(indexData.change ?? 0) >= 0 ? '+' : ''}
                      {(indexData.change ?? 0).toFixed(2)}
                    </p>
                    <p
                      className={`text-xl ${
                        (indexData.change ?? 0) >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {(indexData.change ?? 0) >= 0 ? '+' : ''}
                      {(indexData.changePercent ?? 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-muted-foreground mb-1">Open</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {indexData.open?.toLocaleString('en-IN') || 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-muted-foreground mb-1">
                    Prev. Close
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {indexData.previousClose?.toLocaleString('en-IN') || 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30">
                  <p className="text-xs text-muted-foreground mb-1">Day High</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {indexData.high?.toLocaleString('en-IN') || 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30">
                  <p className="text-xs text-muted-foreground mb-1">Day Low</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {indexData.low?.toLocaleString('en-IN') || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              {(indexData.volume ||
                indexData.marketCap ||
                indexData.constituents) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  {indexData.volume && (
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Volume
                      </p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {indexData.volume}
                      </p>
                    </div>
                  )}
                  {indexData.marketCap && (
                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Market Cap
                      </p>
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {indexData.marketCap}
                      </p>
                    </div>
                  )}
                  {indexData.constituents && (
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Constituents
                      </p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {indexData.constituents} Companies
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Last Updated */}
              <div className="flex items-center gap-2 mt-6 pt-6 border-t">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Last updated: {indexData.lastUpdated}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-Time Market Chart (Groww Style) */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="border-2 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <TrendingUpIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h2 className="text-2xl font-bold">Market Performance</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedTimeRange === '1D'
                            ? "Today's intraday movement"
                            : selectedTimeRange === '1W'
                              ? 'Last 7 days'
                              : selectedTimeRange === '1M'
                                ? 'Last 30 days'
                                : selectedTimeRange === '1Y'
                                  ? 'Last 12 months'
                                  : 'Last 5 years'}
                        </p>
                        {isLiveUpdating && selectedTimeRange === '1D' && (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time Range Selector (Improved Design) */}
                  <div className="flex gap-1 bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    {(['1D', '1W', '1M', '1Y', '5Y'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedTimeRange(range)}
                        className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                          selectedTimeRange === range
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[500px] mt-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLine
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="lineGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor={
                              (indexData.change ?? 0) >= 0
                                ? '#059669'
                                : '#dc2626'
                            }
                            stopOpacity={1}
                          />
                          <stop
                            offset="50%"
                            stopColor={
                              (indexData.change ?? 0) >= 0
                                ? '#10b981'
                                : '#ef4444'
                            }
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor={
                              (indexData.change ?? 0) >= 0
                                ? '#34d399'
                                : '#f87171'
                            }
                            stopOpacity={1}
                          />
                        </linearGradient>
                        {/* Glow effect for line */}
                        <filter id="shadow" height="200%">
                          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                          <feOffset dx="0" dy="0" result="offsetblur" />
                          <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5" />
                          </feComponentTransfer>
                          <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="5 5"
                        stroke="currentColor"
                        className="opacity-10"
                        vertical={false}
                        horizontal={true}
                      />
                      <XAxis
                        dataKey="time"
                        tick={{
                          fill: 'currentColor',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        tickLine={false}
                        className="text-gray-600 dark:text-gray-400"
                        axisLine={{
                          stroke: 'currentColor',
                          strokeWidth: 1,
                          className: 'opacity-20',
                        }}
                        tickMargin={12}
                        interval={
                          selectedTimeRange === '1D'
                            ? 'preserveStartEnd'
                            : selectedTimeRange === '5Y'
                              ? Math.floor(chartData.length / 8)
                              : 'preserveEnd'
                        }
                        angle={selectedTimeRange === '5Y' ? -15 : 0}
                        textAnchor={
                          selectedTimeRange === '5Y' ? 'end' : 'middle'
                        }
                      />
                      <YAxis
                        tick={{
                          fill: 'currentColor',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        tickLine={false}
                        className="text-gray-600 dark:text-gray-400"
                        axisLine={{
                          stroke: 'currentColor',
                          strokeWidth: 1,
                          className: 'opacity-20',
                        }}
                        tickMargin={10}
                        domain={['auto', 'auto']}
                        tickFormatter={(value) =>
                          value.toLocaleString('en-IN', {
                            notation: 'compact',
                            compactDisplay: 'short',
                            maximumFractionDigits: 1,
                          })
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgba(75, 85, 99, 0.3)',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                          backdropFilter: 'blur(10px)',
                        }}
                        labelStyle={{
                          fontWeight: '700',
                          marginBottom: '8px',
                          color: '#f9fafb',
                          fontSize: '13px',
                          letterSpacing: '0.5px',
                        }}
                        itemStyle={{
                          color: '#fff',
                          fontSize: '16px',
                          fontWeight: '700',
                          padding: '4px 0',
                        }}
                        formatter={(value: number) => [
                          `₹ ${value.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                          '',
                        ]}
                        cursor={{
                          stroke:
                            (indexData.change ?? 0) >= 0
                              ? '#10b981'
                              : '#ef4444',
                          strokeWidth: 2,
                          strokeDasharray: '8 4',
                          opacity: 0.5,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={3.5}
                        dot={false}
                        activeDot={{
                          r: 7,
                          fill:
                            (indexData.change ?? 0) >= 0
                              ? '#10b981'
                              : '#ef4444',
                          stroke: '#fff',
                          strokeWidth: 3,
                          filter: 'url(#shadow)',
                        }}
                        animationDuration={800}
                        animationEasing="ease-out"
                        filter="url(#shadow)"
                      />
                    </RechartsLine>
                  </ResponsiveContainer>
                </div>

                {/* Chart Stats - Enhanced Design */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="group hover:scale-105 transition-transform duration-200">
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                          High
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {Math.max(
                          ...chartData.map((d) => d.value)
                        ).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                        Peak value
                      </p>
                    </div>
                  </div>
                  <div className="group hover:scale-105 transition-transform duration-200">
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200 dark:border-red-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
                          Low
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {Math.min(
                          ...chartData.map((d) => d.value)
                        ).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                        Lowest point
                      </p>
                    </div>
                  </div>
                  <div className="group hover:scale-105 transition-transform duration-200">
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                          Average
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {(
                          chartData.reduce((sum, d) => sum + d.value, 0) /
                          chartData.length
                        ).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                        Mean value
                      </p>
                    </div>
                  </div>
                  <div className="group hover:scale-105 transition-transform duration-200">
                    <div className="text-center p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                          Range
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {(
                          ((Math.max(...chartData.map((d) => d.value)) -
                            Math.min(...chartData.map((d) => d.value))) /
                            Math.min(...chartData.map((d) => d.value))) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                      <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                        Volatility
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* About Section */}
        {indexData.about && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="border-2 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold">About {indexData.name}</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {indexData.about}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Points */}
        {indexData.keyPoints && indexData.keyPoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-2 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-2xl font-bold">Key Highlights</h2>
                </div>
                <ul className="space-y-4">
                  {indexData.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-base leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top Stocks */}
        {indexData.topStocks && indexData.topStocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="border-2 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <LineChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold">
                    Top{' '}
                    {indexData.id === 'commodity'
                      ? 'Components'
                      : 'Constituents'}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {indexData.topStocks.map((stock, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {stock.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
                        {stock.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Why This Index Matters - Importance Section */}
          <Card className="mb-6 shadow-xl border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Why This Index Matters for Mutual Fund Investors
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Key insights for your investment decisions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getImportancePoints(id).map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-lg">
                Live Market Data
              </p>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                Market data updates in real-time during trading hours (9:15 AM -
                3:30 PM IST). The information displayed is for educational
                purposes and should not be considered as investment advice.
                Always consult with a financial advisor before making investment
                decisions.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
