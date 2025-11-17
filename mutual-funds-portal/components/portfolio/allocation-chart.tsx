"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface AllocationItem {
  category: string;
  value: number;
  amount: number;
  color?: string;
}

interface AllocationChartProps {
  data: AllocationItem[];
  totalValue: number;
}

const categoryColors: { [key: string]: string } = {
  EQUITY: "bg-blue-500",
  DEBT: "bg-green-500",
  HYBRID: "bg-purple-500",
  LIQUID: "bg-cyan-500",
  ELSS: "bg-orange-500",
  "MONEY MARKET": "bg-yellow-500",
  "INDEX FUND": "bg-pink-500",
  SECTORAL: "bg-red-500",
  OTHER: "bg-gray-500",
};

export function AllocationChart({ data, totalValue }: AllocationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Asset Allocation
        </CardTitle>
        <CardDescription>Your portfolio distribution</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Donut Chart */}
        <div className="mb-6">
          <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
            <defs>
              {data.map((item, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    style={{
                      stopColor: categoryColors[item.category] || "#666",
                      stopOpacity: 1,
                    }}
                  />
                  <stop
                    offset="100%"
                    style={{
                      stopColor: categoryColors[item.category] || "#444",
                      stopOpacity: 0.8,
                    }}
                  />
                </linearGradient>
              ))}
            </defs>
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="40"
            />
            {data.map((item, index) => {
              const previousTotal = data
                .slice(0, index)
                .reduce((sum, i) => sum + i.value, 0);
              const percentage = (item.value / totalValue) * 100;
              const circumference = 2 * Math.PI * 80;
              const offset = (previousTotal / totalValue) * circumference;
              const dashArray = `${
                (percentage / 100) * circumference
              } ${circumference}`;

              return (
                <motion.circle
                  key={item.category}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="40"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-offset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: -offset }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  style={{ transformOrigin: "center" }}
                />
              );
            })}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-2xl font-bold"
              fill="currentColor"
            >
              ₹{(totalValue / 100000).toFixed(1)}L
            </text>
            <text
              x="100"
              y="115"
              textAnchor="middle"
              className="text-xs"
              fill="hsl(var(--muted-foreground))"
            >
              Total Value
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = (item.value / totalValue) * 100;
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        categoryColors[item.category] || "bg-gray-500"
                      }`}
                    />
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-muted font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden mr-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${
                        categoryColors[item.category] || "bg-gray-500"
                      }`}
                    />
                  </div>
                  <span className="text-muted min-w-[80px] text-right">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Diversification Score */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">
              🎯 Diversification Score
            </p>
            <span className="text-2xl font-bold text-foreground">
              {calculateDiversificationScore(data)}%
            </span>
          </div>
          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calculateDiversificationScore(data)}%` }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
            />
          </div>
          <p className="text-xs text-muted mt-2">
            {getDiversificationMessage(calculateDiversificationScore(data))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateDiversificationScore(data: AllocationItem[]): number {
  // Simple diversification score based on number of categories and distribution
  const numCategories = data.length;
  const maxVariance = Math.max(...data.map((d) => d.value));
  const avgValue = data.reduce((sum, d) => sum + d.value, 0) / numCategories;
  const variance =
    data.reduce((sum, d) => sum + Math.pow(d.value - avgValue, 2), 0) /
    numCategories;

  const categoryScore = Math.min((numCategories / 6) * 50, 50); // Max 50 points for 6+ categories
  const distributionScore = Math.max(0, 50 - (variance / avgValue) * 10); // Max 50 points for even distribution

  return Math.round(categoryScore + distributionScore);
}

function getDiversificationMessage(score: number): string {
  if (score >= 85) return "🌟 Excellent diversification!";
  if (score >= 70) return "👍 Good diversification";
  if (score >= 50) return "⚠️ Consider diversifying more";
  return "❗ High concentration risk - diversify now";
}
