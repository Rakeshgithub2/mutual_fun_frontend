"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Filter,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

export interface PortfolioFilters {
  search: string;
  category: string;
  sortBy: string;
  returnRange: [number, number];
  minInvestment: number;
  showOnlyPositive: boolean;
  riskLevel: string;
  sharpeMin: number;
}

interface PortfolioFiltersProps {
  filters: PortfolioFilters;
  onFiltersChange: (filters: PortfolioFilters) => void;
  categories: string[];
  totalHoldings: number;
  filteredCount: number;
}

export function PortfolioFiltersPanel({
  filters,
  onFiltersChange,
  categories,
  totalHoldings,
  filteredCount,
}: PortfolioFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    onFiltersChange({
      search: "",
      category: "all",
      sortBy: "value-desc",
      returnRange: [-100, 100],
      minInvestment: 0,
      showOnlyPositive: false,
      riskLevel: "all",
      sharpeMin: 0,
    });
  };

  const activeFiltersCount = [
    filters.search !== "",
    filters.category !== "all",
    filters.showOnlyPositive,
    filters.riskLevel !== "all",
    filters.minInvestment > 0,
    filters.sharpeMin > 0,
  ].filter(Boolean).length;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Filter & Sort Holdings
            </h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {filteredCount} of {totalHoldings}
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8"
            >
              {isExpanded ? "Less" : "More"} Filters
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-xs">Search Funds</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Fund name..."
                value={filters.search}
                onChange={(e) =>
                  onFiltersChange({ ...filters, search: e.target.value })
                }
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, category: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-xs">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, sortBy: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value-desc">Highest Value</SelectItem>
                <SelectItem value="value-asc">Lowest Value</SelectItem>
                <SelectItem value="returns-desc">Best Returns</SelectItem>
                <SelectItem value="returns-asc">Worst Returns</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="sharpe-desc">Best Sharpe Ratio</SelectItem>
                <SelectItem value="alpha-desc">Best Alpha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Label className="text-xs">Quick Filter</Label>
            <div className="flex gap-2">
              <Button
                variant={filters.showOnlyPositive ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    showOnlyPositive: !filters.showOnlyPositive,
                  })
                }
                className="flex-1 h-9"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Gains Only
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {/* Return Range */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center justify-between">
                <span>Return Range</span>
                <span className="text-muted-foreground">
                  {filters.returnRange[0]}% to {filters.returnRange[1]}%
                </span>
              </Label>
              <Slider
                min={-100}
                max={100}
                step={5}
                value={filters.returnRange}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    returnRange: value as [number, number],
                  })
                }
                className="mt-2"
              />
            </div>

            {/* Min Investment */}
            <div className="space-y-2">
              <Label className="text-xs">Min Investment</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minInvestment || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minInvestment: Number(e.target.value),
                    })
                  }
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Risk Level */}
            <div className="space-y-2">
              <Label className="text-xs">Risk Level</Label>
              <Select
                value={filters.riskLevel}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, riskLevel: value })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk (Beta &lt; 0.8)</SelectItem>
                  <SelectItem value="moderate">
                    Moderate Risk (Beta 0.8-1.2)
                  </SelectItem>
                  <SelectItem value="high">
                    High Risk (Beta &gt; 1.2)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Sharpe Ratio */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center justify-between">
                <span>Min Sharpe Ratio</span>
                <span className="text-muted-foreground">
                  {filters.sharpeMin.toFixed(1)}
                </span>
              </Label>
              <Slider
                min={0}
                max={3}
                step={0.1}
                value={[filters.sharpeMin]}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, sharpeMin: value[0] })
                }
                className="mt-2"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
