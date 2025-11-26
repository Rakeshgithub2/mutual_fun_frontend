'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { FundList } from '@/components/fund-list';
import { FundCategories } from '@/components/fund-categories-simple';
import { MarketIndices } from '@/components/market-indices';
import { AIChatbot } from '@/components/ai-chatbot';
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
  ArrowRight,
  Star,
  Users,
  DollarSign,
  BarChart3,
  Search,
  Calculator,
  Eye,
  Award,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
  const { watchlist, mounted: watchlistMounted } = useWatchlist();
  const { funds, loading } = useFunds({ limit: 100 });

  const [activeTab, setActiveTab] = useState<
    'equity' | 'commodity' | 'news' | 'watchlist' | 'goals'
  >('equity');

  const { watchlistFunds } = useMemo(() => {
    const watchlistFunds = funds.filter((fund) => watchlist.includes(fund.id));
    return { watchlistFunds };
  }, [funds, watchlist]);

  // Enhanced platform statistics
  const platformStats = [
    {
      icon: Users,
      number: '50K+',
      label: 'Active Investors',
      description: 'Trust our platform',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    {
      icon: DollarSign,
      number: '₹5000Cr+',
      label: 'Assets Under Management',
      description: 'Growing daily',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    {
      icon: BarChart3,
      number: '2000+',
      label: 'Mutual Funds',
      description: 'Available for investment',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
    },
    {
      icon: Award,
      number: '4.9★',
      label: 'User Rating',
      description: 'Excellent reviews',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
  ];

  // Investment tools showcase - matching the design in screenshots
  const investmentTools = [
    {
      icon: TrendingUp,
      title: 'Fund Comparison',
      description:
        'Compare returns, expense ratios, and performance metrics side-by-side.',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-white',
      tags: ['Performance', 'Metrics'],
      link: '/compare',
    },
    {
      icon: Target,
      title: 'Fund Overlap',
      description:
        'Analyze common stock holdings to ensure true portfolio diversification',
      color: 'from-red-500 to-pink-600',
      textColor: 'text-white',
      tags: ['Stock-level', 'Diversification'],
      link: '/overlap',
    },
    {
      icon: Users,
      title: 'Fund Managers',
      description:
        'Expert managers with proven track records and deep market insights.',
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-white',
      tags: ['Profiles', 'Performance'],
      link: '/fund-manager',
    },
    {
      icon: BarChart3,
      title: 'Portfolio Tracker',
      description:
        'Monitor investments, track returns, and get actionable insights',
      color: 'from-red-600 to-orange-600',
      textColor: 'text-white',
      tags: ['Real-time', 'Analytics'],
      link: '/portfolio',
    },
    {
      icon: Calculator,
      title: 'Investment Calculator',
      description: 'Calculate returns, SIP projections, and tax implications',
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-white',
      tags: ['SIP Calculator', 'Tax Calculator'],
      link: '/calculators',
    },
    {
      icon: BookOpen,
      title: 'Knowledge Center',
      description:
        'Learn about mutual funds, commodities, and investment basics',
      color: 'from-orange-500 to-red-600',
      textColor: 'text-white',
      tags: ['Education', 'Guides'],
      link: '/knowledge',
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Premium Financial Background Elements - Ultra Clean & Subtle */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Soft Glowing Blobs - Glassmorphism */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-indigo-300/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-teal-200/25 to-cyan-300/15 rounded-full blur-3xl animate-pulse-glow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/20 to-blue-300/15 rounded-full blur-3xl animate-pulse-glow animation-delay-3000"></div>

        {/* Subtle Grid Pattern - Finance Theme */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="premium-grid"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#1e40af"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#premium-grid)" />
        </svg>

        {/* Smooth Wave Curves - Growth Theme */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: '#6366f1', stopOpacity: 0.2 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#14b8a6', stopOpacity: 0.3 }}
              />
            </linearGradient>
          </defs>
          {/* Multiple Smooth Wave Layers */}
          <path
            d="M0,400 C360,350 720,450 1440,400 L1440,800 L0,800 Z"
            fill="url(#wave-gradient)"
            opacity="0.3"
          />
          <path
            d="M0,450 C360,400 720,500 1440,450 L1440,800 L0,800 Z"
            fill="url(#wave-gradient)"
            opacity="0.2"
          />
          <path
            d="M0,500 C320,480 640,520 1440,500 L1440,800 L0,800 Z"
            fill="url(#wave-gradient)"
            opacity="0.15"
          />
        </svg>

        {/* Abstract Finance Motifs - Line Chart */}
        <svg
          className="absolute top-20 left-20 w-[500px] h-[300px] opacity-[0.06]"
          viewBox="0 0 500 300"
        >
          <defs>
            <linearGradient
              id="chart-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#3b82f6', stopOpacity: 0.4 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#6366f1', stopOpacity: 0.2 }}
              />
            </linearGradient>
          </defs>
          {/* Upward Growth Line */}
          <path
            d="M0,250 L50,240 L100,220 L150,210 L200,180 L250,170 L300,140 L350,120 L400,90 L450,70 L500,50"
            stroke="url(#chart-gradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Data Points */}
          {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={250 - i * 20}
              r="3"
              fill="#3b82f6"
              opacity="0.3"
            />
          ))}
          {/* Fill Area */}
          <path
            d="M0,250 L50,240 L100,220 L150,210 L200,180 L250,170 L300,140 L350,120 L400,90 L450,70 L500,50 L500,300 L0,300 Z"
            fill="url(#chart-gradient)"
            opacity="0.1"
          />
        </svg>

        {/* Candlestick Motifs - Bottom Right */}
        <svg
          className="absolute bottom-20 right-20 w-[400px] h-[250px] opacity-[0.05]"
          viewBox="0 0 400 250"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const x = i * 40 + 20;
            const baseY = 200 - i * 10;
            const height = 60 + i * 5;
            const wickHeight = height + 30;
            return (
              <g key={i}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={baseY - wickHeight}
                  x2={x}
                  y2={baseY}
                  stroke="#10b981"
                  strokeWidth="1"
                  opacity="0.4"
                />
                {/* Candle Body */}
                <rect
                  x={x - 6}
                  y={baseY - height}
                  width="12"
                  height={height}
                  fill="#10b981"
                  opacity="0.5"
                  rx="2"
                />
              </g>
            );
          })}
        </svg>

        {/* Diagonal Lines - Soft Structure */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.015]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="diagonal-lines"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100"
                stroke="#1e40af"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>

        {/* Neumorphism Circles - Subtle Depth */}
        <div className="absolute top-40 right-40 w-32 h-32 rounded-full bg-gradient-to-br from-white/40 to-blue-100/30 backdrop-blur-sm shadow-[8px_8px_16px_rgba(0,0,0,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)] opacity-60"></div>
        <div className="absolute bottom-60 left-60 w-24 h-24 rounded-full bg-gradient-to-br from-white/40 to-indigo-100/30 backdrop-blur-sm shadow-[6px_6px_12px_rgba(0,0,0,0.05),-6px_-6px_12px_rgba(255,255,255,0.8)] opacity-50"></div>

        {/* Floating Particles - Data Points */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/20 animate-float"
              style={{
                left: `${(i * 7 + 10) % 90}%`,
                top: `${(i * 11 + 15) % 80}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${6 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* Premium Light Overlay - Apple Style */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/30"></div>
      </div>

      <Header />

      {/* Market Indices - Financial Theme */}
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="mx-auto max-w-7xl px-4 py-4 relative">
          <MarketIndices />
        </div>
      </div>

      {/* Hero Section - Premium Financial Theme */}
      <section className="relative overflow-hidden bg-white/5 backdrop-blur-sm text-white">
        {/* Premium Glowing Orbs - Glassmorphism */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/25 to-blue-500/15 rounded-full blur-3xl animate-pulse-glow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-teal-400/20 to-cyan-500/15 rounded-full blur-3xl animate-pulse-glow animation-delay-3000"></div>
        </div>

        {/* Subtle Premium Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0h30v30H30V0zm0 30h30v30H30V30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center"
          >
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Invest Smarter with
                </span>
                <br />
                <span className="text-white drop-shadow-lg">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    AI-Powered Tools
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Inspirational Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mb-8 max-w-4xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl"></div>
                <blockquote className="relative px-8 py-6 text-center">
                  <p className="text-lg md:text-xl text-white/95 font-medium leading-relaxed mb-3 italic">
                    "The best investment you can make is in yourself. The more
                    you learn, the more you earn."
                  </p>
                  <p className="text-base md:text-lg text-blue-200 font-semibold">
                    Start your wealth creation journey today — every great
                    investor was once a beginner.
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1">
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                    <span className="text-sm text-white/80 font-medium">
                      Build wealth systematically with mutual funds
                    </span>
                    <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  </div>
                </blockquote>
              </div>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href="/search">
                <Button className="group bg-white hover:bg-gray-50 text-blue-600 font-bold px-10 py-4 text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-4 border-white/50">
                  <Search className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Investment Tools Section - Premium Cards */}
      <section className="py-24 relative overflow-hidden">
        {/* Financial Dashboard Background */}
        <div className="absolute inset-0 opacity-[0.07]">
          {/* Market Data Visualization */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
          >
            {/* Candlestick Chart Pattern - Static values for SSR */}
            {[
              { y1: 80, h1: 180, y2: 120, h2: 90 },
              { y1: 95, h1: 165, y2: 110, h2: 110 },
              { y1: 70, h1: 200, y2: 125, h2: 85 },
              { y1: 105, h1: 155, y2: 115, h2: 95 },
              { y1: 60, h1: 220, y2: 130, h2: 75 },
              { y1: 90, h1: 175, y2: 105, h2: 120 },
              { y1: 75, h1: 190, y2: 135, h2: 80 },
              { y1: 110, h1: 145, y2: 100, h2: 105 },
              { y1: 85, h1: 185, y2: 128, h2: 88 },
              { y1: 65, h1: 210, y2: 108, h2: 115 },
              { y1: 100, h1: 160, y2: 122, h2: 92 },
              { y1: 72, h1: 195, y2: 118, h2: 98 },
              { y1: 88, h1: 178, y2: 112, h2: 108 },
              { y1: 98, h1: 168, y2: 126, h2: 86 },
              { y1: 78, h1: 188, y2: 132, h2: 82 },
              { y1: 92, h1: 172, y2: 116, h2: 102 },
              { y1: 68, h1: 205, y2: 124, h2: 90 },
              { y1: 102, h1: 158, y2: 114, h2: 96 },
              { y1: 82, h1: 182, y2: 120, h2: 94 },
              { y1: 96, h1: 170, y2: 106, h2: 112 },
            ].map((data, i) => (
              <g key={i} transform={`translate(${i * 60 + 50}, 200)`}>
                <rect
                  x="-2"
                  y={data.y1}
                  width="4"
                  height={data.h1}
                  fill="#10B981"
                  opacity="0.3"
                />
                <rect
                  x="-8"
                  y={data.y2}
                  width="16"
                  height={data.h2}
                  fill="#3B82F6"
                  opacity="0.4"
                />
              </g>
            ))}
            {/* Growth trend lines */}
            <path
              d="M50,350 Q300,300 600,250 Q900,200 1150,150"
              stroke="#6366F1"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M50,400 Q250,350 550,300 Q850,250 1150,200"
              stroke="#8B5CF6"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Financial Icons Floating */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-8 h-8 text-blue-400/30 animate-pulse">
            <DollarSign className="w-full h-full" />
          </div>
          <div className="absolute top-32 right-16 w-6 h-6 text-green-400/30 animate-pulse animation-delay-1000">
            <TrendingUp className="w-full h-full" />
          </div>
          <div className="absolute bottom-20 left-20 w-7 h-7 text-purple-400/30 animate-pulse animation-delay-2000">
            <BarChart3 className="w-full h-full" />
          </div>
          <div className="absolute bottom-40 right-32 w-5 h-5 text-yellow-400/30 animate-pulse animation-delay-3000">
            <Calculator className="w-full h-full" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investmentTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link href={tool.link} className="block">
                  <div
                    className={`investment-card relative bg-gradient-to-br ${tool.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-105 min-h-[280px] flex flex-col justify-between border border-white/10 backdrop-blur-sm`}
                  >
                    {/* Financial Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.08]">
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 300 300"
                      >
                        {/* Mini chart lines for each card */}
                        <defs>
                          <pattern
                            id={`pattern-${index}`}
                            patternUnits="userSpaceOnUse"
                            width="40"
                            height="40"
                          >
                            <path
                              d="M0,30 Q10,20 20,25 Q30,15 40,20"
                              stroke="#ffffff"
                              strokeWidth="1"
                              fill="none"
                              opacity="0.3"
                            />
                            <circle
                              cx="10"
                              cy="25"
                              r="1"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                            <circle
                              cx="20"
                              cy="20"
                              r="1"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                            <circle
                              cx="30"
                              cy="18"
                              r="1"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                          </pattern>
                        </defs>
                        <rect
                          width="100%"
                          height="100%"
                          fill={`url(#pattern-${index})`}
                        />
                      </svg>
                    </div>

                    <div className="relative z-10 flex-1">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg"
                      >
                        <tool.icon
                          className={`w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300`}
                        />
                      </motion.div>

                      <h3
                        className={`text-2xl font-bold ${tool.textColor} mb-4 group-hover:scale-105 transition-transform duration-300`}
                      >
                        {tool.title}
                      </h3>

                      <p
                        className={`${tool.textColor} opacity-90 leading-relaxed mb-6 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        {tool.description}
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-2 mb-4">
                      {tool.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium border border-white/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="relative z-10 flex items-center justify-end">
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-300"
                      >
                        <span className="font-semibold">Explore</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Investment Categories Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent mx-3 drop-shadow-lg">
                Investment Strategy
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore fund categories designed to match your risk profile and
              financial aspirations
            </p>
          </motion.div>

          {/* Ultra Premium 3D Tab Navigation - Inspired by Modern Fintech */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/15 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-2 border-white/40 p-6 mb-16 max-w-6xl mx-auto relative overflow-hidden"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-500/10 to-purple-500/10 opacity-60 pointer-events-none animate-pulse-glow"></div>

            {/* Top light reflection */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

            <div className="flex flex-wrap gap-5 justify-center relative z-10">
              {[
                {
                  id: 'equity',
                  label: 'Equity Funds',
                  icon: TrendingUp,
                  gradient: 'from-blue-500 via-cyan-500 to-blue-600',
                  glowColor: 'rgba(59, 130, 246, 0.6)',
                  shadowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
                  iconBg: 'bg-blue-500',
                },
                {
                  id: 'commodity',
                  label: 'Commodities',
                  icon: Target,
                  gradient: 'from-amber-400 via-orange-500 to-red-500',
                  glowColor: 'rgba(251, 146, 60, 0.6)',
                  shadowColor: 'shadow-[0_0_30px_rgba(251,146,60,0.5)]',
                  iconBg: 'bg-orange-500',
                },
                {
                  id: 'news',
                  label: 'Market News',
                  icon: Newspaper,
                  gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
                  glowColor: 'rgba(168, 85, 247, 0.6)',
                  shadowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
                  iconBg: 'bg-purple-500',
                },
                {
                  id: 'watchlist',
                  label: 'My Watchlist',
                  icon: Bookmark,
                  gradient: 'from-rose-500 via-pink-500 to-red-600',
                  glowColor: 'rgba(244, 63, 94, 0.6)',
                  shadowColor: 'shadow-[0_0_30px_rgba(244,63,94,0.5)]',
                  iconBg: 'bg-rose-500',
                },
                {
                  id: 'goals',
                  label: 'Goal Planner',
                  icon: Target,
                  gradient: 'from-emerald-500 via-teal-500 to-green-600',
                  glowColor: 'rgba(16, 185, 129, 0.6)',
                  shadowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]',
                  iconBg: 'bg-emerald-500',
                },
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() =>
                    tab.id === 'goals'
                      ? router.push('/goal-planning')
                      : setActiveTab(tab.id as any)
                  }
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    delay: index * 0.1,
                  }}
                  className={`relative flex items-center gap-4 px-10 py-6 rounded-[1.5rem] font-bold text-base transition-all duration-500 overflow-hidden group min-w-[200px] justify-center ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white ${tab.shadowColor} border-3 border-white/50 transform scale-110`
                      : `bg-white/20 backdrop-blur-xl text-white border-3 border-white/30 hover:bg-white/30 hover:border-white/50 hover:shadow-2xl shadow-xl`
                  }`}
                  style={{
                    boxShadow:
                      activeTab === tab.id
                        ? `0 0 40px ${tab.glowColor}, 0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)`
                        : '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Animated gradient background on active */}
                  {activeTab === tab.id && (
                    <>
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `linear-gradient(135deg, transparent 0%, white 50%, transparent 100%)`,
                          backgroundSize: '200% 200%',
                        }}
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      {/* Pulse ring effect */}
                      <motion.div
                        className="absolute inset-0 rounded-[1.5rem] border-2 border-white/40"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </>
                  )}

                  {/* Hover sparkle effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/70 rounded-full animate-ping animation-delay-500"></div>
                  </div>

                  {/* Radial hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at center, ${tab.glowColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* 3D Icon with background circle */}
                  <div className="relative z-20 flex items-center gap-4">
                    <motion.div
                      animate={
                        activeTab === tab.id
                          ? { rotate: [0, 360], scale: [1, 1.1, 1] }
                          : { rotate: 0, scale: 1 }
                      }
                      transition={{
                        rotate: { duration: 0.8, ease: 'easeInOut' },
                        scale: { duration: 0.4, ease: 'easeInOut' },
                      }}
                      className={`relative w-12 h-12 rounded-xl ${
                        activeTab === tab.id
                          ? 'bg-white/30 shadow-lg'
                          : 'bg-white/10'
                      } backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300`}
                    >
                      {/* Icon glow when active */}
                      {activeTab === tab.id && (
                        <div
                          className={`absolute inset-0 ${tab.iconBg} opacity-20 blur-xl rounded-xl`}
                        ></div>
                      )}
                      <tab.icon
                        className={`w-7 h-7 relative z-10 ${
                          activeTab === tab.id
                            ? 'text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]'
                            : 'text-white/90 drop-shadow-lg'
                        }`}
                      />
                    </motion.div>

                    <div className="flex flex-col items-start">
                      <span className="tracking-wide text-lg font-extrabold leading-tight drop-shadow-lg">
                        {tab.label}
                      </span>
                      {tab.id === 'watchlist' && watchlistFunds.length > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.15 }}
                          className={`mt-1 px-3 py-0.5 rounded-full text-xs font-black shadow-xl ${
                            activeTab === tab.id
                              ? 'bg-white text-blue-600'
                              : 'bg-white/30 text-white backdrop-blur-md border border-white/40'
                          }`}
                        >
                          {watchlistFunds.length} Tracked
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Multi-layer shine effects */}
                  <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden pointer-events-none">
                    {/* Top shine */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-60"></div>
                    {/* Bottom glow on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    {/* Side reflections */}
                    <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/40 via-transparent to-transparent"></div>
                    <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-transparent to-white/40"></div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="min-h-[500px]"
            >
              {(activeTab === 'equity' || activeTab === 'commodity') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50"
                >
                  <FundCategories
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </motion.div>
              )}

              {activeTab === 'news' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-16 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.3,
                          type: 'spring',
                          stiffness: 200,
                        }}
                        className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg"
                      >
                        <Newspaper className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">
                        Real-time Market Intelligence Coming Soon
                      </h3>
                      <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
                        Stay ahead with live market trends, expert analysis, and
                        personalized investment insights
                      </p>
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                        <Clock className="w-5 h-5 mr-3" />
                        Get Notified
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'watchlist' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {watchlistFunds.length > 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-white/50">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center">
                            <Bookmark className="w-6 h-6 text-white" />
                          </div>
                          My Investment Watchlist
                        </h3>
                        <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg">
                          {watchlistFunds.length} funds tracked
                        </span>
                      </div>
                      <FundList funds={watchlistFunds} language={language} />
                    </div>
                  ) : (
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                      <CardContent className="p-16 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.3,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg"
                        >
                          <Bookmark className="w-12 h-12 text-white" />
                        </motion.div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">
                          Build Your Smart Watchlist
                        </h3>
                        <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
                          Track your favorite mutual funds, monitor performance,
                          and get alerts for better investment decisions
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link href="/search">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                              <Search className="w-5 h-5 mr-3" />
                              Explore Funds
                            </Button>
                          </Link>
                          <Link href="/funds?category=equity">
                            <Button
                              variant="outline"
                              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-semibold transition-all"
                            >
                              <Star className="w-5 h-5 mr-3" />
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
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Transform Your
              <span className="text-yellow-300 ml-3">Financial Future?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of smart investors who trust our platform. Start
              your investment journey today with expert guidance and zero
              commission.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/search">
                <Button className="group bg-white hover:bg-gray-50 text-blue-600 font-bold px-12 py-5 text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                  <TrendingUp className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  Start Investing Now
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-12 py-5 text-lg rounded-2xl font-semibold transition-all duration-300"
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MutualFunds.in
              </h3>
              <p className="text-gray-400 text-lg">
                Your trusted investment partner for life
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                {
                  title: 'Investment',
                  links: [
                    'Equity Funds',
                    'Debt Funds',
                    'Hybrid Funds',
                    'Tax Saving',
                  ],
                },
                {
                  title: 'Tools',
                  links: [
                    'SIP Calculator',
                    'Fund Compare',
                    'Portfolio Tracker',
                    'Goal Planner',
                  ],
                },
                {
                  title: 'Learn',
                  links: [
                    'Investment Guide',
                    'Market Analysis',
                    'Fund Research',
                    'Risk Assessment',
                  ],
                },
                {
                  title: 'Support',
                  links: ['Help Center', 'Contact Us', 'FAQs', 'Feedback'],
                },
              ].map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-bold text-lg mb-4">{section.title}</h4>
                  <div className="space-y-2 text-gray-400 text-sm">
                    {section.links.map((link, linkIndex) => (
                      <div
                        key={linkIndex}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {link}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="border-t border-gray-800 pt-8"
            >
              <p className="text-gray-400 text-sm">
                © 2025 MutualFunds.in. All rights reserved. | SEBI Registered
                Investment Advisor
              </p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
