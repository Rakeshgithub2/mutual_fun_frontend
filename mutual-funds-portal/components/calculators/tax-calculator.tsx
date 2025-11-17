"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calculator, TrendingUp, Info, Download, Share2, AlertCircle } from "lucide-react";

type FundType = "equity" | "debt" | "hybrid";
type IncomeSlab = "below_2.5L" | "2.5L_to_5L" | "5L_to_10L" | "above_10L";

interface TaxCalculation {
  gains: number;
  capitalGainsTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  netProceeds: number;
  effectiveTaxRate: number;
}

export default function TaxCalculator() {
  // Input states
  const [fundType, setFundType] = useState<FundType>("equity");
  const [investmentAmount, setInvestmentAmount] = useState<string>("100000");
  const [redemptionAmount, setRedemptionAmount] = useState<string>("150000");
  const [holdingPeriod, setHoldingPeriod] = useState<string>("24"); // in months
  const [incomeSlab, setIncomeSlab] = useState<IncomeSlab>("5L_to_10L");
  const [hasIndexationBenefit, setHasIndexationBenefit] = useState<boolean>(false);

  // Tax rates and thresholds
  const TAX_RULES = {
    equity: {
      stcg: { rate: 0.20, threshold: 12 }, // 20% for holding < 12 months
      ltcg: { rate: 0.125, exemption: 125000, threshold: 12 }, // 12.5% for > 1L, exemption up to 1.25L
    },
    debt: {
      stcg: { rate: 0, threshold: 36, appliesSlabRate: true }, // Slab rate for < 36 months
      ltcg: { rate: 0.125, threshold: 36, appliesIndexation: true }, // 12.5% without indexation or 20% with indexation
    },
    hybrid: {
      stcg: { rate: 0.20, threshold: 12 }, // Treated as equity if >65% equity
      ltcg: { rate: 0.125, exemption: 125000, threshold: 12 },
    },
  };

  const INCOME_TAX_SLABS = {
    below_2.5L: { rate: 0, name: "Below ₹2.5 Lakh" },
    "2.5L_to_5L": { rate: 0.05, name: "₹2.5L - ₹5L (5%)" },
    "5L_to_10L": { rate: 0.20, name: "₹5L - ₹10L (20%)" },
    above_10L: { rate: 0.30, name: "Above ₹10L (30%)" },
  };

  // Calculate gains
  const investment = parseFloat(investmentAmount) || 0;
  const redemption = parseFloat(redemptionAmount) || 0;
  const holding = parseFloat(holdingPeriod) || 0;
  const gains = redemption - investment;

  // Calculate tax
  const taxCalculation = useMemo((): TaxCalculation => {
    if (gains <= 0) {
      return {
        gains: 0,
        capitalGainsTax: 0,
        surcharge: 0,
        cess: 0,
        totalTax: 0,
        netProceeds: redemption,
        effectiveTaxRate: 0,
      };
    }

    const rules = TAX_RULES[fundType];
    const isLongTerm = holding >= rules.ltcg.threshold;
    let capitalGainsTax = 0;

    if (isLongTerm) {
      // Long Term Capital Gains
      if (fundType === "equity" || fundType === "hybrid") {
        const taxableGains = Math.max(0, gains - (rules.ltcg.exemption || 0));
        capitalGainsTax = taxableGains * rules.ltcg.rate;
      } else if (fundType === "debt") {
        if (hasIndexationBenefit) {
          // 20% with indexation (assume 10% indexation benefit)
          const indexedGains = gains * 0.9; // After indexation
          capitalGainsTax = indexedGains * 0.20;
        } else {
          // 12.5% without indexation
          capitalGainsTax = gains * 0.125;
        }
      }
    } else {
      // Short Term Capital Gains
      if (fundType === "equity" || fundType === "hybrid") {
        capitalGainsTax = gains * rules.stcg.rate;
      } else if (fundType === "debt") {
        // Apply slab rate
        const slabRate = INCOME_TAX_SLABS[incomeSlab].rate;
        capitalGainsTax = gains * slabRate;
      }
    }

    // Calculate surcharge (if income > 50L, assume 10% surcharge for simplicity)
    const surcharge = redemption > 5000000 ? capitalGainsTax * 0.10 : 0;

    // Calculate cess (4% on tax + surcharge)
    const cess = (capitalGainsTax + surcharge) * 0.04;

    const totalTax = capitalGainsTax + surcharge + cess;
    const netProceeds = redemption - totalTax;
    const effectiveTaxRate = (totalTax / gains) * 100;

    return {
      gains,
      capitalGainsTax,
      surcharge,
      cess,
      totalTax,
      netProceeds,
      effectiveTaxRate,
    };
  }, [fundType, investment, redemption, holding, incomeSlab, hasIndexationBenefit, gains]);

  const isLongTerm = holding >= TAX_RULES[fundType].ltcg.threshold;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Capital Gains Tax Calculator</CardTitle>
                  <CardDescription className="text-gray-600">
                    Calculate LTCG & STCG tax on mutual fund investments
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-white">
                {isLongTerm ? "LTCG" : "STCG"}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
              <CardDescription>Enter your investment and redemption details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fund Type */}
              <div className="space-y-2">
                <Label htmlFor="fundType" className="flex items-center gap-2">
                  Fund Type
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Equity: >65% equity allocation</p>
                        <p>Debt: >65% debt allocation</p>
                        <p>Hybrid: Mixed allocation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select value={fundType} onValueChange={(val) => setFundType(val as FundType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equity">Equity Fund</SelectItem>
                    <SelectItem value="debt">Debt Fund</SelectItem>
                    <SelectItem value="hybrid">Hybrid Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Investment Amount */}
              <div className="space-y-2">
                <Label htmlFor="investment">Investment Amount (₹)</Label>
                <Input
                  id="investment"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="100000"
                />
              </div>

              {/* Redemption Amount */}
              <div className="space-y-2">
                <Label htmlFor="redemption">Redemption Amount (₹)</Label>
                <Input
                  id="redemption"
                  type="number"
                  value={redemptionAmount}
                  onChange={(e) => setRedemptionAmount(e.target.value)}
                  placeholder="150000"
                />
              </div>

              {/* Holding Period */}
              <div className="space-y-2">
                <Label htmlFor="holding" className="flex items-center gap-2">
                  Holding Period (Months)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Equity/Hybrid: LTCG if held ≥12 months</p>
                        <p>Debt: LTCG if held ≥36 months</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="holding"
                  type="number"
                  value={holdingPeriod}
                  onChange={(e) => setHoldingPeriod(e.target.value)}
                  placeholder="24"
                />
                <p className="text-sm text-gray-500">
                  Threshold: {TAX_RULES[fundType].ltcg.threshold} months for LTCG
                </p>
              </div>

              {/* Income Slab (for Debt STCG) */}
              {fundType === "debt" && !isLongTerm && (
                <div className="space-y-2">
                  <Label htmlFor="incomeSlab" className="flex items-center gap-2">
                    Your Income Slab
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>STCG on debt funds is taxed at your income tax slab rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select value={incomeSlab} onValueChange={(val) => setIncomeSlab(val as IncomeSlab)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INCOME_TAX_SLABS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Indexation Benefit (for Debt LTCG) */}
              {fundType === "debt" && isLongTerm && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="indexation"
                      checked={hasIndexationBenefit}
                      onChange={(e) => setHasIndexationBenefit(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="indexation" className="flex items-center gap-2 cursor-pointer">
                      Apply Indexation Benefit (20% with indexation vs 12.5% without)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Indexation adjusts purchase price for inflation</p>
                            <p>20% tax on indexed gains vs 12.5% on actual gains</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                </div>
              )}

              {/* Quick Presets */}
              <div className="pt-4 border-t">
                <Label className="mb-3 block">Quick Scenarios</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInvestmentAmount("100000");
                      setRedemptionAmount("150000");
                      setHoldingPeriod("24");
                    }}
                  >
                    50% Gain (2Y)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInvestmentAmount("500000");
                      setRedemptionAmount("750000");
                      setHoldingPeriod("36");
                    }}
                  >
                    50% Gain (3Y)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInvestmentAmount("1000000");
                      setRedemptionAmount("2000000");
                      setHoldingPeriod("60");
                    }}
                  >
                    100% Gain (5Y)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInvestmentAmount("100000");
                      setRedemptionAmount("115000");
                      setHoldingPeriod("6");
                    }}
                  >
                    15% Gain (6M)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>Tax Breakdown</CardTitle>
              <CardDescription>
                {isLongTerm ? "Long Term" : "Short Term"} Capital Gains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Capital Gains */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Capital Gains</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(taxCalculation.gains)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((taxCalculation.gains / investment) * 100).toFixed(2)}% return
                </p>
              </div>

              {/* Tax Components */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capital Gains Tax</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation.capitalGainsTax)}</span>
                </div>

                {taxCalculation.surcharge > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Surcharge (10%)</span>
                    <span className="font-semibold">{formatCurrency(taxCalculation.surcharge)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Health & Education Cess (4%)</span>
                  <span className="font-semibold">{formatCurrency(taxCalculation.cess)}</span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Total Tax</span>
                    <span className="text-xl font-bold text-red-600">
                      {formatCurrency(taxCalculation.totalTax)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Effective rate: {taxCalculation.effectiveTaxRate.toFixed(2)}%
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Net Proceeds</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(taxCalculation.netProceeds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax Rate Info */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Tax Rate Applied</span>
                </div>
                <p className="text-xs text-gray-600">
                  {isLongTerm ? (
                    <>
                      {fundType === "equity" || fundType === "hybrid"
                        ? `12.5% on gains above ₹1,25,000`
                        : hasIndexationBenefit
                        ? `20% with indexation benefit`
                        : `12.5% without indexation`}
                    </>
                  ) : (
                    <>
                      {fundType === "equity" || fundType === "hybrid"
                        ? `20% flat rate`
                        : `As per your income tax slab (${INCOME_TAX_SLABS[incomeSlab].rate * 100}%)`}
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tax Comparison Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tax Rate Reference</CardTitle>
            <CardDescription>Current tax rates for different fund types and holding periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Fund Type</th>
                    <th className="text-left py-3 px-4">Holding Period</th>
                    <th className="text-left py-3 px-4">Tax Type</th>
                    <th className="text-left py-3 px-4">Tax Rate</th>
                    <th className="text-left py-3 px-4">Additional Info</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Equity</td>
                    <td className="py-3 px-4">&lt; 12 months</td>
                    <td className="py-3 px-4"><Badge variant="outline">STCG</Badge></td>
                    <td className="py-3 px-4">20%</td>
                    <td className="py-3 px-4 text-gray-600">Flat rate + cess</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Equity</td>
                    <td className="py-3 px-4">≥ 12 months</td>
                    <td className="py-3 px-4"><Badge variant="outline">LTCG</Badge></td>
                    <td className="py-3 px-4">12.5%</td>
                    <td className="py-3 px-4 text-gray-600">₹1.25L exemption</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Debt</td>
                    <td className="py-3 px-4">&lt; 36 months</td>
                    <td className="py-3 px-4"><Badge variant="outline">STCG</Badge></td>
                    <td className="py-3 px-4">Slab Rate</td>
                    <td className="py-3 px-4 text-gray-600">As per income tax slab</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Debt</td>
                    <td className="py-3 px-4">≥ 36 months</td>
                    <td className="py-3 px-4"><Badge variant="outline">LTCG</Badge></td>
                    <td className="py-3 px-4">12.5% / 20%</td>
                    <td className="py-3 px-4 text-gray-600">With/without indexation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Hybrid</td>
                    <td className="py-3 px-4">Any</td>
                    <td className="py-3 px-4"><Badge variant="outline">Both</Badge></td>
                    <td className="py-3 px-4">As Equity</td>
                    <td className="py-3 px-4 text-gray-600">If equity &gt; 65%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Surcharge of 10% applies if total income exceeds ₹50 lakhs</li>
                    <li>Health & Education Cess of 4% applies on (Tax + Surcharge)</li>
                    <li>State governments do not levy separate capital gains tax</li>
                    <li>Tax rates are subject to change as per Union Budget announcements</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
