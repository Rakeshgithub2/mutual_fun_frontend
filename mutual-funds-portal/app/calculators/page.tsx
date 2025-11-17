"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  TrendingUp,
  Target,
  StepForward,
  Briefcase,
  DollarSign,
  Receipt,
  IndianRupee,
  ArrowRight,
  Sparkles,
  Home,
  PiggyBank,
  Percent,
  Calendar,
  Wallet,
  Zap,
  CheckCircle,
  Info,
  Shield,
  Lock,
} from "lucide-react";
import { InfoButton } from "@/components/info-button";
import Link from "next/link";

// Financial terms definitions
const financialTerms = {
  sip: {
    term: "SIP (Systematic Investment Plan)",
    definition:
      "SIP is a method of investing a fixed amount regularly (monthly, quarterly) in mutual funds. Instead of investing a large amount at once, you invest small amounts consistently over time, similar to a recurring deposit but in mutual funds.",
    importance:
      "SIP helps build wealth through disciplined investing and rupee cost averaging. It removes the need to time the market perfectly and makes investing accessible to everyone, starting from as low as ₹500 per month. It leverages the power of compounding to generate long-term wealth.",
    futureUsage:
      "SIPs are ideal for long-term financial goals like retirement planning (20-30 years), children's education (10-15 years), buying a house (7-10 years), or building an emergency corpus. The longer you stay invested, the more powerful compounding becomes.",
    pros: [
      "Rupee cost averaging reduces impact of market volatility",
      "Disciplined investing builds consistent saving habit",
    ],
    cons: [
      "Returns not guaranteed and subject to market risk",
      "Requires patience - works best for 5+ year horizons",
    ],
  },
  lumpsum: {
    term: "Lumpsum Investment",
    definition:
      "Lumpsum investment means investing a large amount of money in one go into mutual funds or other investment vehicles. This is typically done when you have a significant amount like bonus, inheritance, or sale proceeds available for investment.",
    importance:
      "Lumpsum investing allows your entire capital to start working immediately, potentially generating returns from day one. It's particularly effective during market corrections or when you have high conviction about market direction. Can generate higher returns than SIP if market timing is favorable.",
    futureUsage:
      "Best suited when you receive windfall gains (inheritance, bonus, property sale) or during market crashes when valuations are attractive. Also ideal if you have accumulated cash and want to deploy it strategically rather than keeping it idle.",
    pros: [
      "Entire amount starts compounding immediately",
      "Lower transaction costs compared to multiple SIP installments",
    ],
    cons: [
      "Requires large capital upfront",
      "Higher risk if market corrects immediately after investment",
    ],
  },
  expectedReturn: {
    term: "Expected Return",
    definition:
      "Expected return is the anticipated annual percentage growth on your investment, based on historical fund performance, market conditions, and asset class. For equity funds, typical range is 10-15% p.a., debt funds 6-8% p.a., and hybrid funds 8-12% p.a.",
    importance:
      "Setting realistic return expectations is crucial for financial planning. Overestimating returns can lead to inadequate savings, while underestimating may result in excessive contributions. Expected return directly impacts how much wealth you'll accumulate over time.",
    futureUsage:
      "Use expected returns to calculate future value of investments, determine required monthly SIP amounts for goals, and compare different investment options. Adjust expectations based on your risk profile - conservative (7-9%), moderate (9-12%), aggressive (12-15%).",
    pros: [
      "Helps in realistic financial goal planning",
      "Enables comparison between investment options",
    ],
    cons: [
      "Past returns don't guarantee future performance",
      "Actual returns may vary significantly from expectations",
    ],
  },
  timePeriod: {
    term: "Investment Time Period",
    definition:
      "Time period refers to the duration for which you plan to stay invested, typically measured in years. This is the period between starting your investment and when you need to withdraw the money for your goal.",
    importance:
      "Time is the most powerful factor in wealth creation due to compounding. Longer investment horizons allow you to take more equity exposure (higher risk, higher returns), ride out market volatility, and benefit from multiple market cycles. Even small monthly investments can grow substantially over 20-30 years.",
    futureUsage:
      "Match your investment time period with your financial goals: Short-term goals (<3 years) - debt funds, Medium-term (3-7 years) - hybrid funds, Long-term (>7 years) - equity funds. Longer time periods justify higher equity allocation and SIP investments.",
    pros: [
      "Longer periods reduce per-year volatility impact",
      "Compounding effect multiplies wealth exponentially",
    ],
    cons: [
      "Money remains locked for extended duration",
      "Early withdrawal may incur exit loads and tax implications",
    ],
  },
  goalPlanning: {
    term: "Goal-Based Planning",
    definition:
      "Goal-based planning involves identifying specific financial objectives (buying home, child's education, retirement) and creating a targeted investment strategy for each goal with defined timeline and required corpus.",
    importance:
      "Having clear goals provides direction and motivation for consistent investing. It helps determine how much to invest, where to invest, and for how long. Goal-based approach ensures you're not investing blindly but working towards concrete life milestones.",
    futureUsage:
      "Create separate investment portfolios for each major life goal. For example: Retirement corpus goal - 30 year SIP in equity funds, Child's education - 15 year SIP in balanced funds, Emergency fund - 1 year expenses in liquid funds. Review goals annually and adjust investments.",
    pros: [
      "Provides clarity and purpose to investments",
      "Helps prioritize multiple financial needs",
    ],
    cons: [
      "Requires disciplined tracking and periodic reviews",
      "May need to adjust plans if circumstances change",
    ],
  },
  stepUpSIP: {
    term: "Step-Up SIP",
    definition:
      "Step-Up SIP allows you to increase your SIP amount periodically (annually or semi-annually) by a fixed percentage (typically 5-15%). For example, if you start with ₹5,000/month and increase by 10% annually, it becomes ₹5,500 in year 2, ₹6,050 in year 3, and so on.",
    importance:
      "As your income grows with promotions and increments, your investments should also increase proportionally. Step-Up SIP ensures your investment pace matches your income growth, helping you build significantly larger corpus without feeling the pinch of higher contributions.",
    futureUsage:
      "Ideal for salaried professionals expecting regular salary hikes. Start with a comfortable amount and set 10% annual step-up. This strategy can increase your final corpus by 30-50% compared to regular SIP over 20-25 years, making it highly effective for retirement planning.",
    pros: [
      "Significantly boosts wealth accumulation over time",
      "Aligns investments with income growth automatically",
    ],
    cons: [
      "Higher future commitments may strain cash flow during job loss",
      "Not suitable if income growth is uncertain",
    ],
  },
  retirement: {
    term: "Retirement Planning",
    definition:
      "Retirement planning is the process of determining retirement income goals and creating an investment strategy to achieve them. It involves calculating how much corpus you'll need to maintain your lifestyle post-retirement (typically 60-65 years) when regular income stops.",
    importance:
      "With increasing life expectancy (75-80 years), you may live 20-25 years post-retirement. Without adequate planning, you risk outliving your savings or compromising lifestyle. Starting early gives you the advantage of longer compounding and smaller monthly commitments.",
    futureUsage:
      "Calculate required retirement corpus using rule of thumb: 25-30 times your annual expenses. For ₹50,000/month expenses (₹6L/year), you need ₹1.5-1.8 Cr corpus. Start SIP early (age 25-30) to build this corpus comfortably with equity funds. Post-retirement, shift to debt funds for stable income.",
    pros: [
      "Ensures financial independence in old age",
      "Early planning reduces monthly investment burden",
    ],
    cons: [
      "Requires very long investment horizon (30-40 years)",
      "Inflation can erode purchasing power of corpus",
    ],
  },
};

export default function CalculatorsPage() {
  const router = useRouter();
  const [sipResult, setSipResult] = useState<any>(null);
  const [lumpsumResult, setLumpsumResult] = useState<any>(null);
  const [goalResult, setGoalResult] = useState<any>(null);
  const [stepUpResult, setStepUpResult] = useState<any>(null);
  const [retirementResult, setRetirementResult] = useState<any>(null);
  const [taxResult, setTaxResult] = useState<any>(null);

  // Suppress hydration warnings caused by browser extensions
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Extra attributes from the server")
      ) {
        return;
      }
      originalError.call(console, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const calculateSIP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("http://localhost:3002/api/calculator/sip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monthlyInvestment: formData.get("monthlyInvestment"),
        expectedReturn: formData.get("expectedReturn"),
        timePeriod: formData.get("timePeriod"),
      }),
    });

    const data = await response.json();
    if (data.data) setSipResult(data.data);
  };

  const calculateLumpsum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch(
      "http://localhost:3002/api/calculator/lumpsum",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investment: formData.get("investment"),
          expectedReturn: formData.get("expectedReturn"),
          timePeriod: formData.get("timePeriod"),
        }),
      }
    );

    const data = await response.json();
    if (data.data) setLumpsumResult(data.data);
  };

  const calculateGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch("http://localhost:3002/api/calculator/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetAmount: formData.get("targetAmount"),
        timePeriod: formData.get("timePeriod"),
        expectedReturn: formData.get("expectedReturn"),
        currentSavings: formData.get("currentSavings") || 0,
        goalName: formData.get("goalName"),
      }),
    });

    const data = await response.json();
    if (data.data) setGoalResult(data.data);
  };

  const calculateStepUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch(
      "http://localhost:3002/api/calculator/step-up-sip",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialSIP: formData.get("initialSIP"),
          stepUpPercentage: formData.get("stepUpPercentage"),
          expectedReturn: formData.get("expectedReturn"),
          timePeriod: formData.get("timePeriod"),
        }),
      }
    );

    const data = await response.json();
    if (data.data) setStepUpResult(data.data);
  };

  const calculateRetirement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch(
      "http://localhost:3002/api/calculator/retirement",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAge: formData.get("currentAge"),
          retirementAge: formData.get("retirementAge"),
          currentSavings: formData.get("currentSavings") || 0,
          monthlyExpense: formData.get("monthlyExpense"),
          expectedReturn: formData.get("expectedReturn") || 12,
          inflationRate: formData.get("inflationRate") || 6,
        }),
      }
    );

    const data = await response.json();
    if (data.data) setRetirementResult(data.data);
  };

  const calculateTax = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const purchasePrice = parseFloat(formData.get("purchasePrice") as string);
    const salePrice = parseFloat(formData.get("salePrice") as string);
    const holdingPeriod = parseInt(formData.get("holdingPeriod") as string);
    const assetType = formData.get("assetType") as string;

    const capitalGain = salePrice - purchasePrice;

    let isLongTerm = false;
    let taxRate = 0;
    let taxAmount = 0;
    let netGain = 0;
    let exemptionLimit = 0;
    let taxableGain = 0;

    if (assetType === "equity") {
      // Equity shares and equity mutual funds
      isLongTerm = holdingPeriod >= 12; // 12 months for equity

      if (isLongTerm) {
        // LTCG: 10% above ₹1 lakh
        exemptionLimit = 100000;
        taxableGain = Math.max(0, capitalGain - exemptionLimit);
        taxRate = 10;
        taxAmount = (taxableGain * taxRate) / 100;
      } else {
        // STCG: 15%
        taxRate = 15;
        taxAmount = (capitalGain * taxRate) / 100;
        taxableGain = capitalGain;
      }
    } else if (assetType === "debt") {
      // Debt mutual funds and bonds
      isLongTerm = holdingPeriod >= 36; // 36 months for debt

      if (isLongTerm) {
        // LTCG: 20% with indexation benefit (simplified without indexation here)
        taxRate = 20;
        taxAmount = (capitalGain * taxRate) / 100;
        taxableGain = capitalGain;
      } else {
        // STCG: Added to income, taxed as per slab (assuming 30% for calculation)
        taxRate = 30;
        taxAmount = (capitalGain * taxRate) / 100;
        taxableGain = capitalGain;
      }
    }

    netGain = capitalGain - taxAmount;

    setTaxResult({
      purchasePrice,
      salePrice,
      capitalGain,
      holdingPeriod,
      assetType,
      isLongTerm,
      taxRate,
      exemptionLimit,
      taxableGain,
      taxAmount,
      netGain,
      effectiveTaxRate:
        capitalGain > 0 ? ((taxAmount / capitalGain) * 100).toFixed(2) : 0,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      suppressHydrationWarning
    >
      <Header />

      <main
        className="container mx-auto px-4 py-8 max-w-7xl"
        suppressHydrationWarning
      >
        {/* Enhanced Header with Back Button */}
        <div className="mb-10">
          <div className="mb-6">
            <button
              onClick={() => {
                console.log("Back button clicked!");
                window.location.href = "http://localhost:5001";
              }}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all hover:scale-105 cursor-pointer bg-white dark:bg-gray-900 relative z-50"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl">
                  <Calculator className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Investment Calculators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
              Make informed investment decisions with our comprehensive suite of
              financial calculators. Plan your SIP, calculate returns, and
              achieve your financial goals.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Accurate Results
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  Data Privacy
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full border border-purple-200 dark:border-purple-800">
                <Calculator className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                  Free to Use
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="mb-8 max-w-4xl mx-auto">
          <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong className="font-bold text-amber-700 dark:text-amber-500">
                      Disclaimer:
                    </strong>{" "}
                    These calculators provide estimates for educational purposes
                    only. Actual returns may vary based on market conditions,
                    fund performance, and other factors. Please consult a
                    financial advisor before making investment decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sip" className="space-y-10">
          <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50/98 via-blue-50/98 to-indigo-50/98 dark:from-gray-900/98 dark:via-gray-800/98 dark:to-gray-900/98 backdrop-blur-2xl pb-6 pt-3 shadow-lg">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-3 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 p-4 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-gray-700 backdrop-blur-xl">
              <TabsTrigger
                value="sip"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 rounded-2xl font-bold py-4 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="hidden sm:inline">SIP</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="lumpsum"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 rounded-2xl font-bold py-4 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="hidden sm:inline">Lumpsum</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="goal"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 rounded-2xl font-bold py-4 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="hidden sm:inline">Goal</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="stepup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 rounded-2xl font-bold py-4 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <StepForward className="w-5 h-5" />
                  <span className="hidden sm:inline">Step-up</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="retirement"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 rounded-2xl font-bold py-4 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="hidden sm:inline">Retirement</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="tax"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:via-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 rounded-2xl font-bold py-4 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Receipt className="w-5 h-5" />
                  <span className="hidden sm:inline">Tax</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* SIP Calculator */}
          <TabsContent value="sip" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl hover:shadow-blue-200/50 dark:hover:shadow-blue-800/50 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-b-2 border-blue-100 dark:border-blue-900">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        SIP Calculator
                        <InfoButton {...financialTerms.sip} />
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-300 mt-2">
                        Calculate returns on your Systematic Investment Plan
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <Lock className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                        Secure
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form
                    onSubmit={calculateSIP}
                    className="space-y-6"
                    suppressHydrationWarning
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="monthlyInvestment"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                      >
                        <PiggyBank className="w-4 h-4 text-blue-600" />
                        Monthly Investment (₹)
                      </Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="monthlyInvestment"
                          name="monthlyInvestment"
                          type="number"
                          placeholder="5000"
                          required
                          className="mt-2 h-14 text-lg border-2 focus:border-blue-500 dark:focus:border-blue-400 pl-10 font-semibold"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Minimum recommended: ₹500
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="expectedReturn"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                      >
                        <Percent className="w-4 h-4 text-purple-600" />
                        Expected Return (% p.a.)
                        <InfoButton {...financialTerms.expectedReturn} />
                      </Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="expectedReturn"
                          name="expectedReturn"
                          type="number"
                          step="0.1"
                          placeholder="12"
                          required
                          className="mt-2 h-14 text-lg border-2 focus:border-purple-500 dark:focus:border-purple-400 pl-10 font-semibold"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Equity funds typically: 10-15% | Debt funds: 6-8%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="timePeriod"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Time Period (years)
                        <InfoButton {...financialTerms.timePeriod} />
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="timePeriod"
                          name="timePeriod"
                          type="number"
                          placeholder="10"
                          required
                          className="mt-2 h-14 text-lg border-2 focus:border-indigo-500 dark:focus:border-indigo-400 pl-10 font-semibold"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Longer duration = Better compounding effect
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate SIP Returns
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {sipResult && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                  <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 animate-pulse"></div>
                    <CardHeader className="border-b-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                        <TrendingUp className="w-7 h-7 text-green-600" />
                        Your SIP Returns
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        Investment growth projection over {sipResult.timePeriod}{" "}
                        years
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Monthly Investment:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {formatCurrency(sipResult.monthlyInvestment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Time Period:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {sipResult.timePeriod} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Expected Return:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {sipResult.expectedReturn}% p.a.
                        </span>
                      </div>
                      <div className="my-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          Investment Breakdown
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-blue-600" />
                                Your Investment
                              </span>
                              <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                {formatCurrency(sipResult.totalInvestment)}
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${
                                    (sipResult.totalInvestment /
                                      sipResult.futureValue) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                Estimated Gains
                              </span>
                              <span className="text-lg font-bold text-green-700 dark:text-green-400">
                                {formatCurrency(sipResult.estimatedReturns)}
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out delay-200"
                                style={{
                                  width: `${
                                    (sipResult.estimatedReturns /
                                      sipResult.futureValue) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl border-2 border-purple-300 dark:border-purple-700 shadow-lg">
                        <div>
                          <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100 block mb-1">
                            Future Value:
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total wealth after {sipResult.timePeriod} years
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                            {formatCurrency(sipResult.futureValue)}
                          </span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center justify-end gap-1 mt-1">
                            <TrendingUp className="w-4 h-4" />+
                            {(
                              (sipResult.estimatedReturns /
                                sipResult.totalInvestment) *
                              100
                            ).toFixed(1)}
                            % gain
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pros and Cons Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Pros */}
                    <Card className="shadow-xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <span className="text-2xl">✅</span> SIP Advantages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Rupee Cost Averaging:</strong> Buy more
                              units when prices are low, fewer when high
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Disciplined Investing:</strong> Automates
                              savings and builds wealth habit
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Power of Compounding:</strong> Returns
                              generate returns over long term
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Flexible Amounts:</strong> Start with as
                              low as ₹500/month
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Tax Benefits:</strong> ELSS SIPs offer
                              deduction under Section 80C
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Cons */}
                    <Card className="shadow-xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                          <span className="text-2xl">⚠️</span> Considerations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Market Risk:</strong> Returns not
                              guaranteed, subject to market volatility
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Long-term Commitment:</strong> Requires
                              patience, minimum 5-7 years recommended
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Exit Load:</strong> Early withdrawal may
                              incur charges (1-2%)
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Fund Selection:</strong> Wrong fund choice
                              can underperform expectations
                            </span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              •
                            </span>
                            <span className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              <strong>Missed Opportunities:</strong> May miss
                              lump sum gains in bull markets
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Expert Advice */}
                  <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                        <span className="text-2xl">💡</span> Expert Tips for SIP
                        Success
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                        <p className="leading-relaxed">
                          <strong>1. Start Early:</strong> Time is your biggest
                          ally. Starting at 25 vs 35 can double your wealth.
                        </p>
                        <p className="leading-relaxed">
                          <strong>2. Increase Annually:</strong> Step-up your
                          SIP by 10-15% yearly as income grows.
                        </p>
                        <p className="leading-relaxed">
                          <strong>3. Stay Invested:</strong> Don't stop SIP
                          during market downturns - that's when you buy more
                          units cheap.
                        </p>
                        <p className="leading-relaxed">
                          <strong>4. Diversify:</strong> Spread SIPs across
                          large-cap, mid-cap, and flexi-cap funds.
                        </p>
                        <p className="leading-relaxed">
                          <strong>5. Review Quarterly:</strong> Check fund
                          performance every 3 months, but don't exit based on
                          short-term dips.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Lumpsum Calculator */}
          <TabsContent value="lumpsum" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl hover:shadow-green-200/50 dark:hover:shadow-green-800/50 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-b-2 border-green-100 dark:border-green-900">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Lumpsum Calculator
                    <InfoButton {...financialTerms.lumpsum} />
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    Calculate returns on one-time investment
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={calculateLumpsum} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="investment"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Investment Amount (₹)
                      </Label>
                      <Input
                        id="investment"
                        name="investment"
                        type="number"
                        placeholder="100000"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="expectedReturn"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Expected Return (% p.a.)
                      </Label>
                      <Input
                        id="expectedReturn"
                        name="expectedReturn"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="timePeriod"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Time Period (years)
                      </Label>
                      <Input
                        id="timePeriod"
                        name="timePeriod"
                        type="number"
                        placeholder="5"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-green-500 dark:focus:border-green-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      Calculate Lumpsum Returns
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {lumpsumResult && (
                <Card className="shadow-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
                  <CardHeader className="border-b-2 border-emerald-200 dark:border-emerald-800">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      Lumpsum Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Investment:
                      </span>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {formatCurrency(lumpsumResult.investment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Time Period:
                      </span>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {lumpsumResult.timePeriod} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Expected Return:
                      </span>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {lumpsumResult.expectedReturn}% p.a.
                      </span>
                    </div>
                    <hr className="my-4 border-2 border-emerald-200 dark:border-emerald-800" />
                    <div className="flex justify-between items-center p-4 bg-green-100 dark:bg-green-900/40 rounded-xl">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        Estimated Returns:
                      </span>
                      <span className="font-extrabold text-2xl text-green-700 dark:text-green-400">
                        {formatCurrency(lumpsumResult.estimatedReturns)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 shadow-lg">
                      <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
                        Future Value:
                      </span>
                      <span className="font-extrabold text-4xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {formatCurrency(lumpsumResult.futureValue)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Goal Planning Calculator */}
          <TabsContent value="goal">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Planning Calculator</CardTitle>
                  <CardDescription>
                    Calculate monthly SIP needed for your financial goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={calculateGoal} className="space-y-4">
                    <div>
                      <Label htmlFor="goalName">Goal Name</Label>
                      <Input
                        id="goalName"
                        name="goalName"
                        placeholder="House Down Payment"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                      <Input
                        id="targetAmount"
                        name="targetAmount"
                        type="number"
                        placeholder="2000000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentSavings">
                        Current Savings (₹)
                      </Label>
                      <Input
                        id="currentSavings"
                        name="currentSavings"
                        type="number"
                        placeholder="100000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timePeriod">Time Period (years)</Label>
                      <Input
                        id="timePeriod"
                        name="timePeriod"
                        type="number"
                        placeholder="5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedReturn">
                        Expected Return (% p.a.)
                      </Label>
                      <Input
                        id="expectedReturn"
                        name="expectedReturn"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      Calculate Goal SIP
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {goalResult && (
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardHeader>
                    <CardTitle>Goal Planning Results</CardTitle>
                    {goalResult.goalName && (
                      <CardDescription>{goalResult.goalName}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Target Amount:</span>
                      <span className="font-bold">
                        {formatCurrency(goalResult.targetAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Current Savings:</span>
                      <span className="font-bold">
                        {formatCurrency(goalResult.currentSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Time Period:</span>
                      <span className="font-bold">
                        {goalResult.timePeriod} years
                      </span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between border-2 border-primary rounded-lg p-3 bg-white dark:bg-gray-900">
                      <span className="font-bold text-lg">
                        Required Monthly SIP:
                      </span>
                      <span className="font-bold text-2xl text-primary">
                        {formatCurrency(goalResult.requiredMonthlySIP)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                      <p>
                        💡 Current savings will grow to{" "}
                        {formatCurrency(
                          goalResult.breakdown?.currentSavingsGrowth
                        )}
                      </p>
                      <p>
                        💡 Your SIP contribution:{" "}
                        {formatCurrency(goalResult.breakdown?.sipContribution)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Step-up SIP Calculator */}
          <TabsContent value="stepup">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step-up SIP Calculator</CardTitle>
                  <CardDescription>
                    Calculate SIP with annual increment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={calculateStepUp} className="space-y-4">
                    <div>
                      <Label htmlFor="initialSIP">
                        Initial Monthly SIP (₹)
                      </Label>
                      <Input
                        id="initialSIP"
                        name="initialSIP"
                        type="number"
                        placeholder="5000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stepUpPercentage">
                        Annual Step-up (%)
                      </Label>
                      <Input
                        id="stepUpPercentage"
                        name="stepUpPercentage"
                        type="number"
                        step="0.1"
                        placeholder="10"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedReturn">
                        Expected Return (% p.a.)
                      </Label>
                      <Input
                        id="expectedReturn"
                        name="expectedReturn"
                        type="number"
                        step="0.1"
                        placeholder="12"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="timePeriod">Time Period (years)</Label>
                      <Input
                        id="timePeriod"
                        name="timePeriod"
                        type="number"
                        placeholder="10"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <StepForward className="w-5 h-5 mr-2" />
                      Calculate Step-up SIP
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {stepUpResult && (
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                  <CardHeader>
                    <CardTitle>Step-up SIP Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Initial SIP:</span>
                      <span className="font-bold">
                        {formatCurrency(stepUpResult.initialSIP)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Final SIP:</span>
                      <span className="font-bold">
                        {formatCurrency(stepUpResult.finalMonthlySIP)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Step-up Rate:</span>
                      <span className="font-bold">
                        {stepUpResult.stepUpPercentage}% p.a.
                      </span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                      <span className="font-medium">Total Investment:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(stepUpResult.totalInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated Returns:</span>
                      <span className="font-bold text-lg text-green-600">
                        {formatCurrency(stepUpResult.estimatedReturns)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="font-bold text-lg">Future Value:</span>
                      <span className="font-bold text-2xl text-primary">
                        {formatCurrency(stepUpResult.futureValue)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Retirement Calculator */}
          <TabsContent value="retirement">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Calculator</CardTitle>
                  <CardDescription>Plan your retirement corpus</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={calculateRetirement} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentAge">Current Age</Label>
                        <Input
                          id="currentAge"
                          name="currentAge"
                          type="number"
                          placeholder="30"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="retirementAge">Retirement Age</Label>
                        <Input
                          id="retirementAge"
                          name="retirementAge"
                          type="number"
                          placeholder="60"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="monthlyExpense">
                        Current Monthly Expense (₹)
                      </Label>
                      <Input
                        id="monthlyExpense"
                        name="monthlyExpense"
                        type="number"
                        placeholder="40000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentSavings">
                        Current Retirement Savings (₹)
                      </Label>
                      <Input
                        id="currentSavings"
                        name="currentSavings"
                        type="number"
                        placeholder="500000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expectedReturn">
                          Expected Return (%)
                        </Label>
                        <Input
                          id="expectedReturn"
                          name="expectedReturn"
                          type="number"
                          step="0.1"
                          placeholder="12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inflationRate">
                          Inflation Rate (%)
                        </Label>
                        <Input
                          id="inflationRate"
                          name="inflationRate"
                          type="number"
                          step="0.1"
                          placeholder="6"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Briefcase className="w-5 h-5 mr-2" />
                      Calculate Retirement Plan
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {retirementResult && (
                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
                  <CardHeader>
                    <CardTitle>Retirement Plan Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Years to Retirement:</span>
                      <span className="font-bold">
                        {retirementResult.yearsToRetirement} years
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        Current Monthly Expense:
                      </span>
                      <span className="font-bold">
                        {formatCurrency(retirementResult.currentMonthlyExpense)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        Future Monthly Expense:
                      </span>
                      <span className="font-bold text-orange-600">
                        {formatCurrency(retirementResult.futureMonthlyExpense)}
                      </span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                      <span className="font-medium">Corpus Needed:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(retirementResult.corpusNeeded)}
                      </span>
                    </div>
                    <div className="flex justify-between border-2 border-primary rounded-lg p-3 bg-white dark:bg-gray-900">
                      <span className="font-bold text-lg">
                        Required Monthly SIP:
                      </span>
                      <span className="font-bold text-2xl text-primary">
                        {formatCurrency(retirementResult.requiredMonthlySIP)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                      <p>
                        💡 Current savings will grow to{" "}
                        {formatCurrency(
                          retirementResult.breakdown?.currentSavingsGrowth
                        )}
                      </p>
                      <p>💡 Assumes 6% withdrawal rate in retirement</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Capital Gains Tax Calculator */}
          <TabsContent value="tax" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-2xl border-2 border-red-200 dark:border-red-800 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl hover:shadow-red-200/50 dark:hover:shadow-red-800/50 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border-b-2 border-red-100 dark:border-red-900">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Receipt className="w-6 h-6 text-red-600" />
                    Capital Gains Tax Calculator
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    Calculate LTCG and STCG tax on stocks and mutual funds
                    (India)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={calculateTax} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="assetType"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Asset Type
                      </Label>
                      <select
                        id="assetType"
                        name="assetType"
                        required
                        className="mt-2 w-full h-12 text-lg border-2 rounded-md px-3 bg-white dark:bg-gray-950 focus:border-red-500 dark:focus:border-red-400"
                      >
                        <option value="equity">
                          Equity Shares / Equity Mutual Funds
                        </option>
                        <option value="debt">Debt Mutual Funds / Bonds</option>
                      </select>
                    </div>
                    <div>
                      <Label
                        htmlFor="purchasePrice"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Purchase Price (₹)
                      </Label>
                      <Input
                        id="purchasePrice"
                        name="purchasePrice"
                        type="number"
                        step="0.01"
                        placeholder="100000"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-red-500 dark:focus:border-red-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="salePrice"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Sale Price (₹)
                      </Label>
                      <Input
                        id="salePrice"
                        name="salePrice"
                        type="number"
                        step="0.01"
                        placeholder="150000"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-red-500 dark:focus:border-red-400"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="holdingPeriod"
                        className="text-base font-semibold text-gray-700 dark:text-gray-200"
                      >
                        Holding Period (months)
                      </Label>
                      <Input
                        id="holdingPeriod"
                        name="holdingPeriod"
                        type="number"
                        placeholder="18"
                        required
                        className="mt-2 h-12 text-lg border-2 focus:border-red-500 dark:focus:border-red-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Receipt className="w-5 h-5 mr-2" />
                      Calculate Tax
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {taxResult && (
                <div className="space-y-6">
                  <Card className="shadow-2xl border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
                    <CardHeader className="border-b-2 border-orange-200 dark:border-orange-800">
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        Tax Calculation Results
                      </CardTitle>
                      <CardDescription className="text-lg font-semibold">
                        {taxResult.isLongTerm
                          ? "Long Term Capital Gains (LTCG)"
                          : "Short Term Capital Gains (STCG)"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Purchase Price:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {formatCurrency(taxResult.purchasePrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Sale Price:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {formatCurrency(taxResult.salePrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Holding Period:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {taxResult.holdingPeriod} months
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-900/40 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Asset Type:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100 capitalize">
                          {taxResult.assetType === "equity"
                            ? "Equity / Equity MF"
                            : "Debt MF / Bonds"}
                        </span>
                      </div>
                      <hr className="my-4 border-2 border-orange-200 dark:border-orange-800" />
                      <div className="flex justify-between items-center p-4 bg-green-100 dark:bg-green-900/40 rounded-xl">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          Capital Gain:
                        </span>
                        <span className="font-extrabold text-2xl text-green-700 dark:text-green-400">
                          {formatCurrency(taxResult.capitalGain)}
                        </span>
                      </div>
                      {taxResult.exemptionLimit > 0 && (
                        <div className="flex justify-between items-center p-4 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                          <span className="font-bold text-gray-800 dark:text-gray-200">
                            Exemption Limit:
                          </span>
                          <span className="font-extrabold text-xl text-blue-700 dark:text-blue-400">
                            {formatCurrency(taxResult.exemptionLimit)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-4 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          Taxable Gain:
                        </span>
                        <span className="font-extrabold text-xl text-amber-700 dark:text-amber-400">
                          {formatCurrency(taxResult.taxableGain)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-red-100 dark:bg-red-900/40 rounded-xl">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          Tax Rate:
                        </span>
                        <span className="font-extrabold text-2xl text-red-700 dark:text-red-400">
                          {taxResult.taxRate}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 rounded-2xl border-2 border-red-300 dark:border-red-700 shadow-lg">
                        <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
                          Tax Payable:
                        </span>
                        <span className="font-extrabold text-4xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                          {formatCurrency(taxResult.taxAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-lg">
                        <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">
                          Net Gain (After Tax):
                        </span>
                        <span className="font-extrabold text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatCurrency(taxResult.netGain)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Effective Tax Rate:
                        </span>
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {taxResult.effectiveTaxRate}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tax Rules Information */}
                  <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                        <span className="text-2xl">📋</span> Indian Capital
                        Gains Tax Rules
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/70 dark:bg-gray-900/40 rounded-lg">
                          <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">
                            Equity Shares & Equity Mutual Funds
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-800 dark:text-gray-200">
                            <li>
                              • <strong>LTCG:</strong> 10% tax on gains above ₹1
                              lakh (holding &gt; 12 months)
                            </li>
                            <li>
                              • <strong>STCG:</strong> 15% tax on all gains
                              (holding ≤ 12 months)
                            </li>
                            <li>
                              • STT (Securities Transaction Tax) must be paid
                            </li>
                          </ul>
                        </div>
                        <div className="p-4 bg-white/70 dark:bg-gray-900/40 rounded-lg">
                          <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-2">
                            Debt Mutual Funds & Bonds
                          </h4>
                          <ul className="text-sm space-y-1 text-gray-800 dark:text-gray-200">
                            <li>
                              • <strong>LTCG:</strong> 20% with indexation
                              benefit (holding &gt; 36 months)
                            </li>
                            <li>
                              • <strong>STCG:</strong> Added to income, taxed as
                              per your tax slab (holding ≤ 36 months)
                            </li>
                            <li>
                              • New debt MF rules (post April 2023) may apply
                            </li>
                          </ul>
                        </div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-300 dark:border-amber-700">
                          <p className="text-sm text-amber-900 dark:text-amber-200">
                            <strong>⚠️ Note:</strong> This calculator provides
                            estimates based on current tax laws. Actual tax may
                            vary based on your income slab, deductions, and
                            recent budget changes. Consult a tax advisor for
                            accurate calculations.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tax Saving Tips */}
                  <Card className="shadow-xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                        <span className="text-2xl">💰</span> Tax Optimization
                        Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">
                            1.
                          </span>
                          <span>
                            <strong>Hold for Long Term:</strong> LTCG rates are
                            much lower than STCG. Try to hold equity for 12+
                            months and debt for 36+ months.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">
                            2.
                          </span>
                          <span>
                            <strong>Use ₹1 Lakh Exemption:</strong> Equity LTCG
                            up to ₹1 lakh per year is tax-free. Plan your exits
                            strategically across financial years.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">
                            3.
                          </span>
                          <span>
                            <strong>Tax Loss Harvesting:</strong> Offset your
                            capital gains with capital losses to reduce tax
                            liability.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">
                            4.
                          </span>
                          <span>
                            <strong>Indexation Benefit:</strong> For debt MFs
                            held 36+ months, indexation reduces taxable gains by
                            adjusting for inflation.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">
                            5.
                          </span>
                          <span>
                            <strong>Gift to Family:</strong> Consider gifting
                            appreciated securities to family members in lower
                            tax brackets (within legal limits).
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action Section */}
        <div className="mt-16 mb-8">
          <Card className="shadow-2xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
            <CardContent className="relative py-12 px-6 md:px-12">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Ready to Start Your Investment Journey?
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                  Explore thousands of mutual funds, compare performance,
                  analyze portfolios, and build your personalized investment
                  strategy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/">
                    <Button className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                      <TrendingUp className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Explore Mutual Funds
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/compare">
                    <Button
                      variant="outline"
                      className="h-14 px-8 text-lg font-bold border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group"
                    >
                      <Target className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                      Compare Funds
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>10,000+ Mutual Funds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Real-time Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Expert Analysis</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
