'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Newspaper,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Languages,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  source: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  url: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = 'https://mutualfun-backend.vercel.app';
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api`
      : `${BASE_URL}/api`
  ).replace(/\/+$/, '');

  // Fetch news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/news?language=${language}`);
      const data = await response.json();

      if (data.success) {
        setNews(data.data.articles || []);
        setLastUpdated(new Date(data.data.lastUpdated));
      } else {
        setError('Failed to load news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [language]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      stocks: 'bg-blue-500',
      'mutual-funds': 'bg-purple-500',
      market: 'bg-green-500',
      economy: 'bg-orange-500',
      commodities: 'bg-yellow-500',
      crypto: 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  // Language labels
  const languageLabels: { [key: string]: string } = {
    english: 'English',
    hindi: 'हिंदी',
    kannada: 'ಕನ್ನಡ',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <BackButton />
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Financial News
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Top 20 market news updated daily at 6:00 AM
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी</SelectItem>
                    <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Refresh Button */}
              <Button
                onClick={fetchNews}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                Last updated:{' '}
                {lastUpdated.toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          )}
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading latest news...
              </p>
            </div>
          </div>
        ) : (
          /* News Grid */
          <div className="grid gap-6">
            {news.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-xl transition-all hover:border-blue-400 dark:hover:border-blue-600 group">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      {article.imageUrl && (
                        <div className="hidden md:block w-48 h-32 flex-shrink-0">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={`${getCategoryColor(
                                  article.category
                                )} text-white`}
                              >
                                {article.category.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(article.publishedAt)}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                              {article.summary}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Sparkles className="w-3 h-3" />
                              <span>{article.source}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4">
                          <Link href={`/news/${article.id}`}>
                            <Button
                              variant="default"
                              size="sm"
                              className="group/btn"
                            >
                              Read More
                              <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                          {article.url && (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Source
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && !error && (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No news available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for the latest financial news updates.
            </p>
          </div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Stay Updated with Market News
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our news section is automatically updated every morning at
                    6:00 AM with the top 20 financial news stories covering
                    stocks, mutual funds, market trends, and economic updates.
                    Available in English, Hindi, and Kannada.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
