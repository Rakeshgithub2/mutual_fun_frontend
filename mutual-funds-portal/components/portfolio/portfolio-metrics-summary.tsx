"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Shield, Target } from "lucide-react";

interface PortfolioMetricsSummaryProps {
  avgSharpeRatio: number;
  avgBeta: number;
  avgAlpha: number;
  totalHoldings: number;
}

export function PortfolioMetricsSummary({
  avgSharpeRatio,
  avgBeta,
  avgAlpha,
  totalHoldings,
}: PortfolioMetricsSummaryProps) {
  const getRiskLevel = (beta: number) => {
    if (beta < 0.8)
      return { label: "Low Risk", color: "bg-green-500", icon: Shield };
    if (beta <= 1.2)
      return { label: "Moderate", color: "bg-blue-500", icon: Target };
    return { label: "High Risk", color: "bg-red-500", icon: TrendingUp };
  };

  const getPerformanceLevel = (sharpe: number) => {
    if (sharpe > 2) return { label: "Excellent", color: "bg-green-500" };
    if (sharpe > 1) return { label: "Good", color: "bg-blue-500" };
    if (sharpe > 0) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Poor", color: "bg-red-500" };
  };

  const riskLevel = getRiskLevel(avgBeta);
  const performanceLevel = getPerformanceLevel(avgSharpeRatio);
  const RiskIcon = riskLevel.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Portfolio Risk & Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Average Sharpe Ratio */}
          <div className="text-center">
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">
                Avg Sharpe Ratio
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-bold text-foreground">
                  {avgSharpeRatio.toFixed(2)}
                </span>
              </div>
              <Badge className={`${performanceLevel.color} text-white`}>
                {performanceLevel.label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Risk-adjusted returns
              </p>
            </div>
          </div>

          {/* Average Beta */}
          <div className="text-center">
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">
                Portfolio Beta
              </p>
              <div className="flex items-center gap-2 mb-2">
                <RiskIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-3xl font-bold text-foreground">
                  {avgBeta.toFixed(2)}
                </span>
              </div>
              <Badge className={`${riskLevel.color} text-white`}>
                {riskLevel.label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Market volatility
              </p>
            </div>
          </div>

          {/* Average Alpha */}
          <div className="text-center">
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">
                Portfolio Alpha
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-3xl font-bold ${
                    avgAlpha > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {avgAlpha > 0 ? "+" : ""}
                  {avgAlpha.toFixed(2)}%
                </span>
              </div>
              <Badge
                variant={avgAlpha > 0 ? "default" : "destructive"}
                className="bg-opacity-80"
              >
                {avgAlpha > 0 ? "Outperforming" : "Underperforming"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Vs market benchmark
              </p>
            </div>
          </div>

          {/* Portfolio Quality Score */}
          <div className="text-center">
            <div className="flex flex-col items-center">
              <p className="text-sm text-muted-foreground mb-2">
                Quality Score
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-bold text-foreground">
                  {calculateQualityScore(
                    avgSharpeRatio,
                    avgBeta,
                    avgAlpha
                  ).toFixed(0)}
                  /100
                </span>
              </div>
              <div className="flex items-center gap-1">
                {getStarRating(
                  calculateQualityScore(avgSharpeRatio, avgBeta, avgAlpha)
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on {totalHoldings} holdings
              </p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div>
                <p className="font-medium text-foreground mb-1">
                  Risk Assessment
                </p>
                <p className="text-xs text-muted-foreground">
                  {avgBeta < 0.8
                    ? "Your portfolio is less volatile than the market, providing stability."
                    : avgBeta <= 1.2
                    ? "Your portfolio has moderate volatility, balanced with the market."
                    : "Your portfolio is more volatile than the market, higher risk/reward."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📊</span>
              <div>
                <p className="font-medium text-foreground mb-1">
                  Performance Analysis
                </p>
                <p className="text-xs text-muted-foreground">
                  {avgSharpeRatio > 1
                    ? "Excellent risk-adjusted returns. Your portfolio efficiently manages risk."
                    : avgSharpeRatio > 0
                    ? "Fair risk-adjusted returns. Consider reviewing fund selection."
                    : "Below-average risk-adjusted returns. Portfolio review recommended."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateQualityScore(
  sharpe: number,
  beta: number,
  alpha: number
): number {
  let score = 0;

  // Sharpe ratio contribution (0-40 points)
  if (sharpe > 2) score += 40;
  else if (sharpe > 1.5) score += 35;
  else if (sharpe > 1) score += 25;
  else if (sharpe > 0.5) score += 15;
  else if (sharpe > 0) score += 5;

  // Beta contribution (0-30 points) - reward moderate risk
  if (beta >= 0.8 && beta <= 1.2) score += 30;
  else if (beta >= 0.6 && beta <= 1.5) score += 20;
  else if (beta < 0.6 || beta <= 1.8) score += 10;

  // Alpha contribution (0-30 points)
  if (alpha > 3) score += 30;
  else if (alpha > 1.5) score += 25;
  else if (alpha > 0) score += 15;
  else if (alpha > -2) score += 5;

  return Math.min(100, score);
}

function getStarRating(score: number) {
  const stars = Math.ceil(score / 20);
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <span key={i} className={i < stars ? "text-yellow-500" : "text-gray-300"}>
        ⭐
      </span>
    ));
}
