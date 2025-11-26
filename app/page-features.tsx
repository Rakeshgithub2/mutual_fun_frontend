'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { MarketIndices } from '@/components/market-indices';
import { AIChatbot } from '@/components/ai-chatbot';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GitCompare,
  Calculator,
  Users,
  BookOpen,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Shield,
  Target,
  Zap,
  PieChart,
  Brain,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      id: 1,
      title: 'Fund Overlap Analyzer',
      description:
        'Discover portfolio overlaps between your mutual funds. Avoid over-concentration and build true diversification.',
      icon: PieChart,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient:
        'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      href: '/overlap',
      stats: { label: 'Instant Analysis', value: '2 Funds' },
      highlights: [
        'Visual overlap %',
        'Common holdings',
        'Smart recommendations',
      ],
    },
    {
      id: 2,
      title: 'Fund Comparison Tool',
      description:
        'Compare mutual funds side-by-side with detailed performance metrics, returns, and risk analysis.',
      icon: GitCompare,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      bgGradient:
        'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      href: '/compare',
      stats: { label: 'Compare Up To', value: '5 Funds' },
      highlights: ['Performance charts', 'Risk metrics', 'Expense comparison'],
    },
    {
      id: 3,
      title: 'Fund Manager Insights',
      description:
        'Track fund manager performance, experience, and portfolio strategies. Make informed decisions.',
      icon: Users,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient:
        'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
      href: '/fund-manager',
      stats: { label: 'Top Managers', value: '100+' },
      highlights: [
        'Manager track record',
        'AUM under management',
        'Investment style',
      ],
    },
    {
      id: 4,
      title: 'Investment Calculators',
      description:
        'Plan your investments with powerful calculators: SIP, Lumpsum, Tax, Retirement, Goal Planning & more.',
      icon: Calculator,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgGradient:
        'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      href: '/calculators',
      stats: { label: 'Calculators', value: '7+' },
      highlights: ['SIP calculator', 'Tax estimator', 'Retirement planner'],
    },
    {
      id: 5,
      title: 'Knowledge Center',
      description:
        'Learn everything about Mutual Funds and Commodities. From basics to advanced strategies.',
      icon: BookOpen,
      gradient: 'from-indigo-500 via-violet-500 to-purple-500',
      bgGradient:
        'from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20',
      href: '/knowledge',
      stats: { label: 'Articles', value: '200+' },
      highlights: [
        'Mutual fund guides',
        'Commodity insights',
        'Investment strategies',
      ],
    },
    {
      id: 6,
      title: 'AI Investment Assistant',
      description:
        'Get instant answers to your investment questions. Powered by advanced AI for personalized guidance.',
      icon: Brain,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      bgGradient:
        'from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20',
      action: 'openChat',
      stats: { label: 'Available', value: '24/7' },
      highlights: [
        'Smart recommendations',
        'Real-time answers',
        'Market insights',
      ],
    },
  ];

  const handleFeatureClick = (feature: (typeof features)[0]) => {
    if (feature.action === 'openChat') {
      window.dispatchEvent(new CustomEvent('toggleChatbot'));
    }
  };

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
                India's Most Advanced Investment Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Your Complete
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Investment Toolkit
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-light">
              Analyze • Compare • Calculate • Learn • Invest Smarter
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  label: 'Live Market Data',
                  gradient: 'from-blue-400 to-blue-600',
                },
                {
                  icon: Shield,
                  label: 'Secure & Trusted',
                  gradient: 'from-green-400 to-green-600',
                },
                {
                  icon: Target,
                  label: 'Goal Planning',
                  gradient: 'from-purple-400 to-purple-600',
                },
                {
                  icon: Zap,
                  label: 'AI-Powered',
                  gradient: 'from-pink-400 to-pink-600',
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 transform"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} mb-3`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm text-white/80 font-medium">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful Investment Tools
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to make smarter investment decisions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
            >
              <Card
                className={`h-full overflow-hidden border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 transform cursor-pointer bg-gradient-to-br ${feature.bgGradient}`}
                onClick={() => handleFeatureClick(feature)}
              >
                <CardContent className="p-8 flex flex-col h-full">
                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {feature.stats.label}
                      </p>
                      <p
                        className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                      >
                        {feature.stats.value}
                      </p>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {feature.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`}
                        ></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  {feature.href ? (
                    <Link href={feature.href}>
                      <Button
                        className={`w-full bg-gradient-to-r ${feature.gradient} text-white hover:opacity-90 transition-opacity shadow-lg group`}
                        size="lg"
                      >
                        <span className="font-semibold">Explore Now</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className={`w-full bg-gradient-to-r ${feature.gradient} text-white hover:opacity-90 transition-opacity shadow-lg group`}
                      size="lg"
                    >
                      <span className="font-semibold">Start Chatting</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl font-extrabold mb-2">5000+</p>
              <p className="text-white/80">Mutual Funds</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2">100+</p>
              <p className="text-white/80">Fund Managers</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2">7+</p>
              <p className="text-white/80">Calculators</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-2">24/7</p>
              <p className="text-white/80">AI Support</p>
            </div>
          </div>
        </motion.div>
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
