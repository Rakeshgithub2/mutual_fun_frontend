"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FinancialMetrics {
  sharpeRatio: number;
  beta: number;
  alpha: number;
  volatility: number;
  maxDrawdown: number;
  informationRatio: number;
}

interface FinancialMetricsCardProps {
  metrics: FinancialMetrics;
  fundName?: string;
}

export function FinancialMetricsCard({
  metrics,
  fundName,
}: FinancialMetricsCardProps) {
  const getSharpeRating = (sharpe: number) => {
    if (sharpe > 2) return { label: "Excellent", color: "bg-green-500" };
    if (sharpe > 1) return { label: "Good", color: "bg-blue-500" };
    if (sharpe > 0) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Poor", color: "bg-red-500" };
  };

  const getBetaRating = (beta: number) => {
    if (beta < 0.8) return { label: "Low Risk", color: "text-green-600" };
    if (beta <= 1.2) return { label: "Moderate Risk", color: "text-blue-600" };
    return { label: "High Risk", color: "text-red-600" };
  };

  const getAlphaRating = (alpha: number) => {
    if (alpha > 2) return { label: "Outperforming", color: "text-green-600" };
    if (alpha > 0) return { label: "Beating Market", color: "text-blue-600" };
    if (alpha > -2)
      return { label: "Underperforming", color: "text-yellow-600" };
    return { label: "Significantly Behind", color: "text-red-600" };
  };

  const sharpeRating = getSharpeRating(metrics.sharpeRatio);
  const betaRating = getBetaRating(metrics.beta);
  const alphaRating = getAlphaRating(metrics.alpha);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📊 Financial Metrics
          {fundName && (
            <span className="text-sm font-normal text-muted-foreground">
              - {fundName}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sharpe Ratio */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">
                Sharpe Ratio
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Measures risk-adjusted returns. Higher is better. &gt;2 is
                      excellent, &gt;1 is good, &gt;0 is fair.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {metrics.sharpeRatio.toFixed(2)}
              </span>
              <Badge className={`${sharpeRating.color} text-white`}>
                {sharpeRating.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Risk-adjusted return performance
            </p>
          </div>
        </div>

        {/* Beta */}
        <div className="flex items-start justify-between pt-3 border-t">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">Beta</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Measures volatility vs market. 1 = market volatility,
                      &lt;1 = less volatile, &gt;1 = more volatile.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {metrics.beta.toFixed(2)}
              </span>
              <span className={`text-sm font-semibold ${betaRating.color}`}>
                {betaRating.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.beta < 1
                ? `${((1 - metrics.beta) * 100).toFixed(
                    0
                  )}% less volatile than market`
                : `${((metrics.beta - 1) * 100).toFixed(
                    0
                  )}% more volatile than market`}
            </p>
          </div>
        </div>

        {/* Alpha */}
        <div className="flex items-start justify-between pt-3 border-t">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">Alpha</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Excess return over benchmark. Positive alpha means
                      outperforming the market.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {metrics.alpha > 0 ? "+" : ""}
                {metrics.alpha.toFixed(2)}%
              </span>
              <span className={`text-sm font-semibold ${alphaRating.color}`}>
                {alphaRating.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Excess return vs market benchmark
            </p>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Volatility
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Standard deviation of returns. Lower is more stable.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-lg font-bold text-foreground">
              {metrics.volatility.toFixed(2)}%
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Max Drawdown
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Maximum observed loss from peak. Shows downside risk.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-lg font-bold text-foreground">
              {metrics.maxDrawdown.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Information Ratio */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              Information Ratio
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Measures consistency of outperformance. Higher is better.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className="text-lg font-bold text-foreground">
            {metrics.informationRatio.toFixed(2)}
          </span>
        </div>

        {/* Overall Rating */}
        <div className="pt-3 border-t bg-muted/30 -mx-6 px-6 py-3 -mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Overall Rating
            </span>
            <div className="flex items-center gap-2">
              {calculateOverallRating(metrics).stars}
              <span className="text-sm font-semibold text-foreground">
                {calculateOverallRating(metrics).label}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateOverallRating(metrics: FinancialMetrics) {
  let score = 0;

  // Sharpe Ratio (0-3 points)
  if (metrics.sharpeRatio > 2) score += 3;
  else if (metrics.sharpeRatio > 1) score += 2;
  else if (metrics.sharpeRatio > 0) score += 1;

  // Alpha (0-3 points)
  if (metrics.alpha > 2) score += 3;
  else if (metrics.alpha > 0) score += 2;
  else if (metrics.alpha > -2) score += 1;

  // Beta - reward moderate risk (0-2 points)
  if (metrics.beta >= 0.8 && metrics.beta <= 1.2) score += 2;
  else if (metrics.beta < 0.8 || metrics.beta <= 1.5) score += 1;

  // Information Ratio (0-2 points)
  if (metrics.informationRatio > 0.5) score += 2;
  else if (metrics.informationRatio > 0) score += 1;

  const maxScore = 10;
  const percentage = (score / maxScore) * 100;

  let stars = "⭐⭐⭐⭐⭐";
  let label = "Excellent";

  if (percentage >= 80) {
    stars = "⭐⭐⭐⭐⭐";
    label = "Excellent";
  } else if (percentage >= 60) {
    stars = "⭐⭐⭐⭐";
    label = "Very Good";
  } else if (percentage >= 40) {
    stars = "⭐⭐⭐";
    label = "Good";
  } else if (percentage >= 20) {
    stars = "⭐⭐";
    label = "Fair";
  } else {
    stars = "⭐";
    label = "Poor";
  }

  return { stars, label, score, percentage };
}
