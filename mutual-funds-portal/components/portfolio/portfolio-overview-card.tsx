"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PortfolioOverviewCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  delay?: number;
  badge?: string;
}

export function PortfolioOverviewCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
  delay = 0,
  badge,
}: PortfolioOverviewCardProps) {
  const trendColors = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-muted",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="relative">
            <Icon className="h-4 w-4 text-muted" />
            {badge && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] px-1 rounded-full">
                {badge}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <p className={`text-xs mt-1 ${trendColors[trend]}`}>{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
