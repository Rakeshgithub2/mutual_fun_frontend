"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { FundList } from "@/components/fund-list";
import { useLanguage } from "@/lib/hooks/use-language";
import { getTranslation } from "@/lib/i18n";
import { useFunds } from "@/lib/hooks/use-funds";

export default function SearchPage() {
  const { language, mounted: langMounted } = useLanguage();
  const { funds: allFunds, loading } = useFunds();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minExpenseRatio: 0,
    maxExpenseRatio: 2,
    minRating: 0,
    minAUM: 0,
  });

  const t = (key: string) => getTranslation(language, key);

  const categories = useMemo(
    () => [...new Set(allFunds.map((f) => f.category))].sort(),
    [allFunds]
  );

  const results = useMemo(() => {
    return allFunds.filter((fund) => {
      const matchesSearch =
        fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !filters.category || fund.category === filters.category;
      const matchesExpenseRatio =
        fund.expenseRatio >= filters.minExpenseRatio &&
        fund.expenseRatio <= filters.maxExpenseRatio;
      const matchesRating = fund.rating >= filters.minRating;
      const matchesAUM = fund.aum >= filters.minAUM;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesExpenseRatio &&
        matchesRating &&
        matchesAUM
      );
    });
  }, [allFunds, searchQuery, filters]);

  if (!langMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            Search & Filter Funds
          </h1>
          <p className="mt-2 text-muted">
            Find the perfect fund for your investment goals
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 sticky top-24">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Fund name, house..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expense Ratio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expense Ratio: {filters.minExpenseRatio.toFixed(2)}% -{" "}
                  {filters.maxExpenseRatio.toFixed(2)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={filters.maxExpenseRatio}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxExpenseRatio: Number.parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minRating: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="0">All Ratings</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* AUM */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Minimum AUM (₹ Crore)
                </label>
                <input
                  type="number"
                  value={filters.minAUM}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minAUM: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    category: "",
                    minExpenseRatio: 0,
                    maxExpenseRatio: 2,
                    minRating: 0,
                    minAUM: 0,
                  });
                }}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted">{t("common.loading")}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Results: {results.length} fund
                    {results.length !== 1 ? "s" : ""} found
                  </h2>
                </div>

                {results.length > 0 ? (
                  <FundList funds={results} language={language} />
                ) : (
                  <div className="rounded-lg border border-border bg-card p-12 text-center">
                    <p className="text-lg text-muted">
                      {t("common.noResults")}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted">
            <p>&copy; 2025 MutualFunds.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
