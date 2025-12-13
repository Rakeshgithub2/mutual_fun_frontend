'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  ExternalLink,
  Share2,
  Bookmark,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react';
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
  language: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = 'https://mutualfun-backend.vercel.app';
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`
  ).replace(/\/+$/, '');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/news/${id}`);
        const data = await response.json();

        if (data.success) {
          setArticle(data.data.article);
          setRelatedNews(data.data.relatedNews || []);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Unable to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

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

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading article...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <BackButton />
          </div>
          <Card className="p-8 text-center">
            <p className="text-lg text-red-600 mb-4">
              {error || 'Article not found'}
            </p>
            <Link href="/news">
              <Button>← Back to News</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8 shadow-2xl">
            <CardContent className="p-8">
              {/* Category & Date */}
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  className={`${getCategoryColor(article.category)} text-white`}
                >
                  {article.category.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {article.source}
                  </span>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
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

              {/* Featured Image */}
              {article.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Summary */}
              <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  {article.summary}
                </p>
              </div>

              {/* Full Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: article.fullContent }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Related News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedNews.map((related) => (
                    <Link
                      key={related.id}
                      href={`/news/${related.id}`}
                      className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${getCategoryColor(
                                related.category
                              )} text-white text-xs`}
                            >
                              {related.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(related.publishedAt).toLocaleDateString(
                                'en-IN'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
