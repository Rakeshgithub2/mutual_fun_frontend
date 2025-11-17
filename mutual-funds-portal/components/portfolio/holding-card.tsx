"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRightLeft,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HoldingCardProps {
  holding: {
    id: string;
    name: string;
    category: string;
    invested: number;
    current: number;
    returns: number;
    returnsPercent: number;
    units: number;
    nav: number;
    sharpeRatio?: number;
    beta?: number;
    alpha?: number;
  };
  index: number;
  onRedeem?: () => void;
}

export function HoldingCard({ holding, index, onRedeem }: HoldingCardProps) {
  const isPositive = holding.returns >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-all hover:border-primary/50">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Link href={`/funds/${holding.id}`}>
                <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer text-lg mb-1">
                  {holding.name}
                </h3>
              </Link>
              <Badge variant="outline" className="text-xs">
                {holding.category}
              </Badge>
            </div>
            <div className="text-right ml-4">
              <p className="text-xl font-bold text-foreground">
                ₹{holding.current.toLocaleString()}
              </p>
              <div
                className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {isPositive ? "+" : ""}₹
                {Math.abs(holding.returns).toLocaleString()}
              </div>
              <p
                className={`text-xs ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {isPositive ? "+" : ""}
                {holding.returnsPercent.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted mb-1">💰 Invested</p>
              <p className="font-semibold text-foreground">
                ₹{holding.invested.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">📊 Units</p>
              <p className="font-semibold text-foreground">
                {holding.units.toFixed(3)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">📈 Current NAV</p>
              <p className="font-semibold text-foreground">
                ₹{holding.nav.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Financial Metrics */}
          {(holding.sharpeRatio !== undefined ||
            holding.beta !== undefined ||
            holding.alpha !== undefined) && (
            <div className="grid grid-cols-3 gap-4 py-3 bg-muted/30 -mx-5 px-5 mt-4">
              {holding.sharpeRatio !== undefined && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <p className="text-xs text-muted mb-1">Sharpe Ratio</p>
                        <p className="font-bold text-foreground flex items-center gap-1">
                          {holding.sharpeRatio.toFixed(2)}
                          {holding.sharpeRatio > 1 && (
                            <span className="text-green-500">✓</span>
                          )}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Risk-adjusted returns. &gt;1 is good, &gt;2 is
                        excellent.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {holding.beta !== undefined && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <p className="text-xs text-muted mb-1">Beta</p>
                        <p className="font-bold text-foreground">
                          {holding.beta.toFixed(2)}
                          {holding.beta < 1
                            ? " 🛡️"
                            : holding.beta > 1.2
                            ? " ⚡"
                            : ""}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Market volatility. &lt;1 = less risky, &gt;1 = more
                        volatile
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {holding.alpha !== undefined && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <p className="text-xs text-muted mb-1">Alpha</p>
                        <p
                          className={`font-bold ${
                            holding.alpha > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {holding.alpha > 0 ? "+" : ""}
                          {holding.alpha.toFixed(2)}%
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Excess returns vs market. Positive = outperforming.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4 mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted">Performance</span>
              <span
                className={`font-semibold ${
                  isPositive ? "text-success" : "text-danger"
                }`}
              >
                {isPositive ? "Gaining" : "Losing"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(Math.abs(holding.returnsPercent), 100)}%`,
                }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full ${
                  isPositive
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Link href={`/invest/${holding.id}`} className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" />
                Add More
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onRedeem}
            >
              <ArrowRightLeft className="w-4 h-4 mr-1" />
              Redeem
            </Button>
            <Link href={`/funds/${holding.id}`}>
              <Button variant="ghost" size="sm">
                <Info className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
