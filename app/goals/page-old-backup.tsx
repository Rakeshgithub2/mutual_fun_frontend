'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import {
  Target,
  Home,
  GraduationCap,
  Car,
  Plane,
  Heart,
  Briefcase,
  TrendingUp,
  Calendar,
  DollarSign,
  Calculator,
  PiggyBank,
  ArrowRight,
  CheckCircle,
  Info,
} from 'lucide-react';
import Link from 'next/link';

interface Goal {
  id: string;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
}

const goals: Goal[] = [
  {
    id: 'home',
    name: 'Buy a Home',
    icon: Home,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    description: 'Plan for your dream house down payment',
  },
  {
    id: 'education',
    name: 'Child Education',
    icon: GraduationCap,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    description: "Secure your child's educational future",
  },
  {
    id: 'car',
    name: 'Buy a Car',
    icon: Car,
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    description: 'Save for your next vehicle purchase',
  },
  {
    id: 'vacation',
    name: 'Dream Vacation',
    icon: Plane,
    color: 'teal',
    gradient: 'from-teal-500 to-emerald-600',
    description: 'Plan your perfect holiday getaway',
  },
  {
    id: 'retirement',
    name: 'Retirement',
    icon: PiggyBank,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    description: 'Build a comfortable retirement corpus',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    description: 'Save for your special day',
  },
  {
    id: 'business',
    name: 'Start Business',
    icon: Briefcase,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Fund your entrepreneurial dreams',
  },
  {
    id: 'wealth',
    name: 'Wealth Creation',
    icon: TrendingUp,
    color: 'green',
    gradient: 'from-green-500 to-lime-600',
    description: 'Build long-term wealth systematically',
  },
];

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [targetAmount, setTargetAmount] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [showResult, setShowResult] = useState(false);
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);

  const calculateInvestment = () => {
    const target = parseFloat(targetAmount);
    const years = parseFloat(timeframe);
    const current = parseFloat(currentSavings) || 0;
    const returnRate = parseFloat(expectedReturn) / 100;

    if (!target || !years) return;

    const months = years * 12;
    const monthlyRate = returnRate / 12;

    // Future value of current savings
    const futureValueCurrent = current * Math.pow(1 + monthlyRate, months);

    // Remaining amount needed
    const remaining = target - futureValueCurrent;

    if (remaining <= 0) {
      setMonthlyInvestment(0);
      setShowResult(true);
      return;
    }

    // Calculate monthly SIP using future value of annuity formula
    const sip =
      (remaining * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);

    setMonthlyInvestment(Math.round(sip));
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/">
          <Button
            variant="outline"
            className="mb-6 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl mb-6">
            <Target className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
            Financial Goal Planner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Set your financial goals and discover how much you need to invest
            monthly to achieve them
          </p>
        </motion.div>

        {/* Goal Selection */}
        {!selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Choose Your Financial Goal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-emerald-400 overflow-hidden group"
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${goal.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <goal.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                        {goal.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {goal.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Goal Calculator */}
        {selectedGoal && !showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto shadow-2xl border-2 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${selectedGoal.gradient} rounded-2xl flex items-center justify-center`}
                    >
                      <selectedGoal.icon className="w-6 h-6 text-white" />
                    </div>
                    {selectedGoal.name}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedGoal(null);
                      setShowResult(false);
                      setTargetAmount('');
                      setTimeframe('');
                      setCurrentSavings('');
                    }}
                  >
                    Change Goal
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label
                    htmlFor="targetAmount"
                    className="text-base font-semibold flex items-center gap-2"
                  >
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Target Amount (₹)
                  </Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="mt-2 text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How much money do you need to achieve this goal?
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="timeframe"
                    className="text-base font-semibold flex items-center gap-2"
                  >
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Time Period (Years)
                  </Label>
                  <Input
                    id="timeframe"
                    type="number"
                    placeholder="e.g., 10"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="mt-2 text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    In how many years do you want to achieve this goal?
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="currentSavings"
                    className="text-base font-semibold flex items-center gap-2"
                  >
                    <PiggyBank className="w-5 h-5 text-emerald-600" />
                    Current Savings (₹) - Optional
                  </Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    placeholder="e.g., 500000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="mt-2 text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How much have you already saved for this goal?
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="expectedReturn"
                    className="text-base font-semibold flex items-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Expected Annual Return (%)
                  </Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="mt-2 text-lg"
                  />
                  <div className="flex items-start gap-2 mt-2 text-sm text-gray-500">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Average mutual fund returns: Equity (12-15%), Hybrid
                      (8-10%), Debt (6-7%)
                    </span>
                  </div>
                </div>

                <Button
                  onClick={calculateInvestment}
                  disabled={!targetAmount || !timeframe}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg font-semibold"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Investment Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        {showResult && selectedGoal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-3xl mx-auto shadow-2xl border-2 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  Your Investment Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-8 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                      Monthly SIP Required
                    </p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                      ₹{monthlyInvestment.toLocaleString('en-IN')}
                    </p>
                    {monthlyInvestment === 0 && (
                      <p className="text-green-600 dark:text-green-400 font-semibold">
                        🎉 Your current savings are sufficient to reach your
                        goal!
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Goal
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedGoal.name}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Target Amount
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      ₹{parseFloat(targetAmount).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Time Period
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {timeframe} years
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Expected Return
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {expectedReturn}% p.a.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Investment Breakdown
                  </h4>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Total Investment (Principal):</span>
                      <span className="font-semibold">
                        ₹
                        {(
                          monthlyInvestment * parseFloat(timeframe) * 12 +
                          (parseFloat(currentSavings) || 0)
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Returns:</span>
                      <span className="font-semibold text-green-600">
                        ₹
                        {(
                          parseFloat(targetAmount) -
                          (monthlyInvestment * parseFloat(timeframe) * 12 +
                            (parseFloat(currentSavings) || 0))
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="pt-2 border-t-2 border-blue-300 dark:border-blue-700 flex justify-between font-bold text-lg">
                      <span>Final Amount:</span>
                      <span>
                        ₹{parseFloat(targetAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setShowResult(false);
                      setSelectedGoal(null);
                      setTargetAmount('');
                      setTimeframe('');
                      setCurrentSavings('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Plan Another Goal
                  </Button>
                  <Link href="/search" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                      Explore Funds
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
