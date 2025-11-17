"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";

interface PerformanceTimelineProps {
  totalValue: number;
  totalInvested: number;
}

export function PerformanceTimeline({
  totalValue,
  totalInvested,
}: PerformanceTimelineProps) {
  const [timeRange, setTimeRange] = useState("1M");

  // Mock data - in real app, fetch from backend
  const performanceData = {
    "1D": generateMockData(1),
    "1W": generateMockData(7),
    "1M": generateMockData(30),
    "3M": generateMockData(90),
    "6M": generateMockData(180),
    "1Y": generateMockData(365),
    ALL: generateMockData(365),
  };

  const currentData =
    performanceData[timeRange as keyof typeof performanceData];
  const maxValue = Math.max(...currentData.map((d) => d.value));
  const minValue = Math.min(...currentData.map((d) => d.value));
  const range = maxValue - minValue;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Portfolio Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track your wealth growth over time
            </p>
          </div>
          <Tabs
            value={timeRange}
            onValueChange={setTimeRange}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-7 h-9">
              {["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"].map((range) => (
                <TabsTrigger key={range} value={range} className="text-xs px-2">
                  {range}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="relative h-[200px] mt-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-muted-foreground">
            <span>₹{(maxValue / 1000).toFixed(0)}k</span>
            <span>₹{((maxValue + minValue) / 2000).toFixed(0)}k</span>
            <span>₹{(minValue / 1000).toFixed(0)}k</span>
          </div>

          {/* Chart area */}
          <div className="ml-16 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px bg-border" />
              ))}
            </div>

            {/* Line chart */}
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor="rgb(34, 197, 94)"
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(34, 197, 94)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {/* Area under curve */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={generatePath(currentData, range, minValue, true)}
                fill="url(#gradient)"
              />

              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={generatePath(currentData, range, minValue, false)}
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Period Return</p>
            <p className="text-lg font-bold text-success">
              +
              {(((totalValue - totalInvested) / totalInvested) * 100).toFixed(
                2
              )}
              %
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Highest Value</p>
            <p className="text-lg font-bold text-foreground">
              ₹{(maxValue / 1000).toFixed(1)}k
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg. Growth</p>
            <p className="text-lg font-bold text-foreground">
              +{(12.5).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockData(days: number) {
  const data = [];
  const baseValue = 100000;
  for (let i = 0; i < Math.min(days, 50); i++) {
    const randomChange = (Math.random() - 0.4) * 2000;
    const value = baseValue + i * 500 + randomChange;
    data.push({ date: i, value: Math.max(value, baseValue * 0.9) });
  }
  return data;
}

function generatePath(
  data: { date: number; value: number }[],
  range: number,
  minValue: number,
  closePath: boolean
): string {
  if (data.length === 0) return "";

  const width = 100;
  const height = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - minValue) / range) * height;
    return `${x},${y}`;
  });

  const path = `M ${points.join(" L ")}`;
  if (closePath) {
    return `${path} L ${width},${height} L 0,${height} Z`;
  }
  return path;
}
