"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/hooks/use-theme";
import { useLanguage } from "@/lib/hooks/use-language";
import { useWatchlist } from "@/lib/hooks/use-watchlist";
import { useCompare } from "@/lib/hooks/use-compare";
import { getTranslation } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { User, Briefcase, LogOut, ChevronDown, Menu, X } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { language, changeLanguage, mounted: langMounted } = useLanguage();
  const { watchlist, mounted: watchlistMounted } = useWatchlist();
  const { compareList, mounted: compareMounted } = useCompare();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        setIsSignedIn(true);
        try {
          setUserData(JSON.parse(user));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      } else {
        setIsSignedIn(false);
        setUserData(null);
      }
    };

    checkAuth();

    // Listen for storage changes (cross-tab sync)
    window.addEventListener("storage", checkAuth);

    // Custom event for same-tab updates
    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  if (!mounted || !langMounted) return null;

  const t = (key: string) => getTranslation(language, key);

  const accountMenuItems = [
    { label: "Portfolio", icon: Briefcase, href: "/portfolio" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-sm font-bold text-white">MF</span>
            </div>
            <span className="hidden font-bold text-primary sm:inline">
              {t("header.brand")}
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden flex-1 mx-8 md:block">
            <Link href="/search">
              <input
                type="text"
                placeholder={t("header.search")}
                className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                readOnly
              />
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Calculators Link */}
            <Link
              href="/calculators"
              className="hidden sm:inline rounded-lg px-3 py-2 text-sm font-medium hover:bg-card transition-colors"
              title="Calculators"
            >
              🧮
            </Link>

            {/* Glossary Link */}
            <Link
              href="/glossary"
              className="hidden sm:inline rounded-lg px-3 py-2 text-sm font-medium hover:bg-card transition-colors"
              title="Glossary"
            >
              📚
            </Link>

            {/* Compare Link */}
            <Link
              href="/compare"
              className="hidden sm:inline relative rounded-lg px-3 py-2 text-sm font-medium hover:bg-card transition-colors"
              title="Compare Funds"
            >
              ⚖️
              {compareMounted && compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-lg">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-card transition-colors"
              >
                {language.toUpperCase()}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 rounded-lg border border-border bg-background shadow-lg">
                  {(["en", "hi", "kn"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        changeLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-card first:rounded-t-lg last:rounded-b-lg"
                    >
                      {lang === "en"
                        ? "English"
                        : lang === "hi"
                        ? "हिंदी"
                        : "ಕನ್ನಡ"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 hover:bg-card transition-colors"
              aria-label={isDark ? t("common.lightMode") : t("common.darkMode")}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Watchlist */}
            <Link
              href="/?tab=watchlist"
              className="relative rounded-lg p-2 hover:bg-card transition-colors"
              title={t("header.watchlist")}
            >
              ⭐
              {watchlistMounted && watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white shadow-lg animate-pulse">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden rounded-lg p-2 hover:bg-card transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Account Menu */}
            {!isSignedIn ? (
              <Link
                href="/auth"
                className="hidden lg:inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light transition-colors"
              >
                {t("header.signIn")}
              </Link>
            ) : (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {userData?.profilePicture ? (
                      <img
                        src={userData.profilePicture}
                        alt={userData.name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML =
                            '<svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                        }}
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="hidden xl:inline">My Account</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showAccountMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowAccountMenu(false)}
                    ></div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-background shadow-lg z-50">
                      <div className="p-4 border-b border-border flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {userData?.profilePicture ? (
                            <img
                              src={userData.profilePicture}
                              alt={userData.name || "User"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                e.currentTarget.style.display = "none";
                                e.currentTarget.parentElement!.innerHTML =
                                  '<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                              }}
                            />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {userData?.name || "User"}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {userData?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>

                      <div className="py-2">
                        {accountMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setShowAccountMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-card transition-colors"
                            >
                              <Icon className="w-4 h-4 text-muted" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="border-t border-border p-2">
                        <button
                          onClick={() => {
                            // Clear authentication data
                            localStorage.removeItem("accessToken");
                            localStorage.removeItem("refreshToken");
                            localStorage.removeItem("user");
                            setIsSignedIn(false);
                            setUserData(null);
                            setShowAccountMenu(false);
                            // Dispatch event for cross-tab sync
                            window.dispatchEvent(new Event("authChange"));
                            // Redirect to home
                            router.push("/");
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-danger hover:bg-danger/10 rounded-md transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-border py-4">
            {/* Mobile Search */}
            <Link href="/search" onClick={() => setShowMobileMenu(false)}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={t("header.search")}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm placeholder-muted cursor-pointer"
                  readOnly
                />
              </div>
            </Link>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-4">
              <Link
                href="/calculators"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-card transition-colors"
              >
                <span>🧮</span>
                <span className="text-sm font-medium">Calculators</span>
              </Link>
              <Link
                href="/glossary"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-card transition-colors"
              >
                <span>📚</span>
                <span className="text-sm font-medium">Glossary</span>
              </Link>
              <Link
                href="/compare"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-card transition-colors"
              >
                <span>⚖️</span>
                <span className="text-sm font-medium">Compare</span>
                {compareMounted && compareList.length > 0 && (
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                    {compareList.length}
                  </span>
                )}
              </Link>
              <Link
                href="/?tab=watchlist"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-card transition-colors"
              >
                <span>⭐</span>
                <span className="text-sm font-medium">Watchlist</span>
                {watchlistMounted && watchlist.length > 0 && (
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white">
                    {watchlist.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Account Menu */}
            {isSignedIn && (
              <>
                <div className="border-t border-border pt-4 mb-4">
                  <div className="px-4 mb-3">
                    <p className="font-semibold text-foreground">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-muted">
                      {userData?.email || "user@example.com"}
                    </p>
                  </div>

                  {accountMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-card transition-colors"
                      >
                        <Icon className="w-4 h-4 text-muted" />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-2">
                  <button
                    onClick={() => {
                      // Clear authentication data
                      localStorage.removeItem("accessToken");
                      localStorage.removeItem("refreshToken");
                      localStorage.removeItem("user");
                      setIsSignedIn(false);
                      setUserData(null);
                      setShowMobileMenu(false);
                      // Dispatch event for cross-tab sync
                      window.dispatchEvent(new Event("authChange"));
                      // Redirect to home
                      router.push("/");
                    }}
                    className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            )}

            {!isSignedIn && (
              <div className="border-t border-border pt-4">
                <Link
                  href="/auth"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-light transition-colors"
                >
                  {t("header.signIn")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
