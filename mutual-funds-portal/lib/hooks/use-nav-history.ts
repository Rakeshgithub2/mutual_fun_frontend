"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

interface NavDataPoint {
  date: string;
  nav: number;
  displayDate: string;
}

export function useNavHistory(fundId: string, period: string = "1Y") {
  const [navData, setNavData] = useState<NavDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavHistory = async () => {
      if (!fundId) return;

      setLoading(true);
      setError(null);

      try {
        // Calculate date range based on period
        const toDate = new Date();
        const fromDate = new Date();

        switch (period) {
          case "1M":
            fromDate.setMonth(fromDate.getMonth() - 1);
            break;
          case "6M":
            fromDate.setMonth(fromDate.getMonth() - 6);
            break;
          case "1Y":
            fromDate.setFullYear(fromDate.getFullYear() - 1);
            break;
          case "3Y":
            fromDate.setFullYear(fromDate.getFullYear() - 3);
            break;
          case "5Y":
            fromDate.setFullYear(fromDate.getFullYear() - 5);
            break;
          case "10Y":
            fromDate.setFullYear(fromDate.getFullYear() - 10);
            break;
          default:
            fromDate.setFullYear(fromDate.getFullYear() - 1);
        }

        const params = new URLSearchParams({
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        });

        const response = await fetch(
          `${API_URL}/funds/${fundId}/navs?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch NAV history: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Transform API response to chart format
        const transformedData = (data.data || []).map((item: any) => {
          const date = new Date(item.date);
          return {
            date: date.toLocaleDateString("en-IN", {
              month: "short",
              year:
                period === "3Y" || period === "5Y" || period === "10Y"
                  ? "2-digit"
                  : undefined,
              day: period === "1M" ? "numeric" : undefined,
            }),
            nav: item.nav,
            displayDate: date.toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          };
        });

        setNavData(transformedData);
      } catch (err) {
        console.error("Error fetching NAV history:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch NAV history"
        );
        setNavData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavHistory();
  }, [fundId, period]);

  return {
    navData,
    loading,
    error,
  };
}
