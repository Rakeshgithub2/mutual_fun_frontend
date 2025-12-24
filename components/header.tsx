'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/lib/hooks/use-theme';
import { useTranslation } from '@/contexts/TranslationContext';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { useCompare } from '@/lib/hooks/use-compare';
import { useOverlap } from '@/lib/hooks/use-overlap';
import {
  User,
  Briefcase,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  Coins,
  Building2,
  Star,
} from 'lucide-react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { watchlist, mounted: watchlistMounted } = useWatchlist();
  const { compareList, mounted: compareMounted } = useCompare();
  const { overlapList, mounted: overlapMounted } = useOverlap();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = () => {
      const token =
        localStorage.getItem('varta_token') ||
        localStorage.getItem('accessToken');
      const user =
        localStorage.getItem('varta_user') || localStorage.getItem('user');

      if (token && user) {
        setIsSignedIn(true);
        try {
          setUserData(JSON.parse(user));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        setIsSignedIn(false);
        setUserData(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, [mounted]);

  const accountMenuItems = [
    { label: '📊 Dashboard', icon: Briefcase, href: '/dashboard' },
    { label: '💼 Portfolio', icon: Briefcase, href: '/portfolio' },
    { label: '🎯 Goal Planning', icon: Briefcase, href: '/goal-planning' },
    { label: '📑 Reports', icon: Briefcase, href: '/reports' },
    { label: '🔔 Alerts', icon: Briefcase, href: '/alerts' },
    { label: '⚙️ Settings', icon: Briefcase, href: '/settings' },
  ];

  const navigationTabs = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Equity', icon: TrendingUp, href: '/equity' },
    { label: 'Commodity', icon: Coins, href: '/commodity' },
    { label: 'Debt', icon: Building2, href: '/debt' },
    { label: 'Watchlist', icon: Star, href: '/watchlist' },
  ];

  const isActiveTab = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-base font-bold text-white">MF</span>
            </div>
          </Link>

          <Link href="/" className="flex-1 text-center">
            <span className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
              MF Analyzer
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2"
              aria-label="Menu"
              type="button"
              suppressHydrationWarning
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isSignedIn && userData ? (
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 transition-all hover:scale-105"
                >
                  {userData.picture || userData.profilePicture ? (
                    <img
                      src={userData.picture || userData.profilePicture}
                      alt={userData.name || 'User'}
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white dark:bg-gray-800">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
                    </div>
                  )}
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userData.name || userData.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {userData.email}
                      </p>
                    </div>
                    <div className="p-2">
                      {accountMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          onClick={() => setShowAccountMenu(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          localStorage.removeItem('varta_token');
                          localStorage.removeItem('varta_user');
                          localStorage.removeItem('accessToken');
                          localStorage.removeItem('user');
                          setIsSignedIn(false);
                          setUserData(null);
                          setShowAccountMenu(false);
                          window.dispatchEvent(new Event('authChange'));
                          router.push('/');
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <button
                  suppressHydrationWarning
                  className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-md"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActiveTab(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.href === '/watchlist' &&
                    watchlistMounted &&
                    watchlist.length > 0 && (
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-white/20' : 'bg-blue-500 text-white'
                        }`}
                      >
                        {watchlist.length}
                      </span>
                    )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {showMobileMenu && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="p-4 space-y-2">
            <Link
              href="/chat"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="text-xl">🤖</span>
              <span>AI Assistant</span>
            </Link>
            <Link
              href="/calculators"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="text-xl">🧮</span>
              <span>Calculators</span>
            </Link>
            <Link
              href="/glossary"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="text-xl">📚</span>
              <span>Glossary</span>
            </Link>
            <Link
              href="/fund-manager"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="text-xl">👨‍💼</span>
              <span>Fund Managers</span>
            </Link>
            <Link
              href="/overlap"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="text-xl">🔄</span>
              <span>Fund Overlap</span>
              {overlapMounted && overlapList.length > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {overlapList.length}
                </span>
              )}
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="text-xl">⚖️</span>
              <span>Compare Funds</span>
              {compareMounted && compareList.length > 0 && (
                <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {compareList.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
