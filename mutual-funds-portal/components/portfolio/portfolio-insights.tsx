"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Award,
} from "lucide-react";

interface PortfolioInsightsProps {
  totalReturnsPercent: number;
  allocation: any[];
  holdingsCount: number;
  totalValue: number;
}

export function PortfolioInsights({
  totalReturnsPercent,
  allocation,
  holdingsCount,
  totalValue,
}: PortfolioInsightsProps) {
  const insights = generateInsights(
    totalReturnsPercent,
    allocation,
    holdingsCount,
    totalValue
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Smart Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Alert
              className={`${
                insight.type === "success"
                  ? "border-green-500/50 bg-green-500/10"
                  : insight.type === "warning"
                  ? "border-yellow-500/50 bg-yellow-500/10"
                  : "border-blue-500/50 bg-blue-500/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {insight.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : insight.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  ) : insight.type === "target" ? (
                    <Target className="w-5 h-5 text-blue-600" />
                  ) : insight.type === "achievement" ? (
                    <Award className="w-5 h-5 text-purple-600" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground text-sm">
                      {insight.title}
                    </h4>
                    {insight.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {insight.badge}
                      </Badge>
                    )}
                  </div>
                  <AlertDescription className="text-xs text-muted-foreground">
                    {insight.description}
                  </AlertDescription>
                  {insight.action && (
                    <p className="text-xs font-medium text-primary mt-2">
                      💡 {insight.action}
                    </p>
                  )}
                </div>
              </div>
            </Alert>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

interface Insight {
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "target" | "achievement";
  badge?: string;
  action?: string;
}

function generateInsights(
  totalReturnsPercent: number,
  allocation: any[],
  holdingsCount: number,
  totalValue: number
): Insight[] {
  const insights: Insight[] = [];

  // Performance insights
  if (totalReturnsPercent > 15) {
    insights.push({
      title: "Excellent Performance! 🎉",
      description: `Your portfolio is outperforming with ${totalReturnsPercent.toFixed(
        1
      )}% returns. You're beating market averages!`,
      type: "achievement",
      badge: "Top Performer",
    });
  } else if (totalReturnsPercent > 8) {
    insights.push({
      title: "Healthy Returns",
      description: `Your portfolio is generating ${totalReturnsPercent.toFixed(
        1
      )}% returns, which is above inflation and savings accounts.`,
      type: "success",
    });
  } else if (totalReturnsPercent > 0) {
    insights.push({
      title: "Positive Growth",
      description: `Your portfolio is growing with ${totalReturnsPercent.toFixed(
        1
      )}% returns. Consider rebalancing for better performance.`,
      type: "info",
      action: "Review underperforming funds and consider switching",
    });
  } else {
    insights.push({
      title: "Portfolio Needs Attention",
      description: `Your portfolio is down ${Math.abs(
        totalReturnsPercent
      ).toFixed(
        1
      )}%. Market downturns are temporary - stay invested for long-term gains.`,
      type: "warning",
      action: "Don't panic sell. Consider SIP in quality funds during dips",
    });
  }

  // Diversification insights
  const dominantCategory = allocation.reduce((max, cat) =>
    cat.value > max.value ? cat : max
  );
  const dominantPercent =
    (dominantCategory.value /
      allocation.reduce((sum, cat) => sum + cat.value, 0)) *
    100;

  if (dominantPercent > 60) {
    insights.push({
      title: "High Concentration Risk",
      description: `${dominantPercent.toFixed(0)}% of your portfolio is in ${
        dominantCategory.category
      }. Consider diversifying to reduce risk.`,
      type: "warning",
      badge: "Action Needed",
      action: `Add funds from other categories like ${getSuggestedCategories(
        allocation
      )}`,
    });
  } else if (allocation.length >= 4) {
    insights.push({
      title: "Well Diversified Portfolio",
      description: `Your investments are spread across ${allocation.length} categories, reducing overall risk and volatility.`,
      type: "success",
    });
  }

  // Holdings insights
  if (holdingsCount < 3) {
    insights.push({
      title: "Increase Fund Count",
      description: `You have ${holdingsCount} ${
        holdingsCount === 1 ? "fund" : "funds"
      }. Experts recommend 5-7 funds for optimal diversification.`,
      type: "target",
      action: "Add 2-3 more funds from different categories",
    });
  } else if (holdingsCount > 12) {
    insights.push({
      title: "Too Many Funds",
      description: `Managing ${holdingsCount} funds can be complex. Consider consolidating to 5-10 quality funds.`,
      type: "warning",
      action: "Review overlapping funds and reduce redundancy",
    });
  }

  // Portfolio size insights
  if (totalValue < 50000) {
    insights.push({
      title: "Building Your Wealth",
      description: `Your portfolio value is ₹${totalValue.toLocaleString()}. Keep investing consistently through SIPs to grow your wealth.`,
      type: "target",
      badge: "Getting Started",
      action: "Start a monthly SIP to automate your investments",
    });
  } else if (totalValue >= 500000 && totalValue < 1000000) {
    insights.push({
      title: "Halfway to First Million! 🎯",
      description: `You've built ₹${(totalValue / 100000).toFixed(
        1
      )}L. Keep up the momentum to reach your first million.`,
      type: "achievement",
      badge: "Milestone",
    });
  } else if (totalValue >= 1000000) {
    insights.push({
      title: "Millionaire Status Achieved! 🏆",
      description: `Congratulations! Your portfolio has crossed ₹${(
        totalValue / 100000
      ).toFixed(1)}L. Consider tax-saving strategies now.`,
      type: "achievement",
      badge: "Elite Investor",
    });
  }

  // Tax saving insight
  const hasELSS = allocation.some((cat) => cat.category === "ELSS");
  if (!hasELSS && totalValue > 100000) {
    insights.push({
      title: "Save Tax with ELSS",
      description:
        "You can save up to ₹46,800 in taxes (Section 80C) by investing in ELSS funds while building wealth.",
      type: "info",
      badge: "Tax Tip",
      action: "Explore top-rated ELSS funds for tax-saving investments",
    });
  }

  return insights;
}

function getSuggestedCategories(currentAllocation: any[]): string {
  const allCategories = [
    "EQUITY",
    "DEBT",
    "HYBRID",
    "LIQUID",
    "ELSS",
    "INDEX FUND",
  ];
  const currentCategories = currentAllocation.map((a) => a.category);
  const missing = allCategories.filter((c) => !currentCategories.includes(c));
  return missing.slice(0, 2).join(" or ");
}
