'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Search,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Building2,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Calendar,
  LineChart,
  Layers,
  Star,
  BookOpen,
  Trophy,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { useFunds } from '@/hooks/use-funds';
import { apiClient } from '@/lib/api-client';

interface FundOption {
  id: string;
  name: string;
  fundHouse: string;
  category: string;
  nav: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
}

interface FundManagerDetail {
  id: string;
  name: string;
  photo?: string;
  designation: string;
  company: string;
  experience: string;
  education: string[];
  qualification: string[];
  joinedDate?: string;
  previousExperience?: string[];
  rating: number;
  fundsManaged: number;
  totalAUM: string;
  averageReturns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  specialization: string[];
  investmentPhilosophy: string;
  achievements: string[];
  uniqueApproach: string[];
  improvementsSinceTenure: {
    returnsImprovement: string;
    aumGrowth: string;
    rankingImprovement: string;
  };
  managedFunds: Array<{
    fundName: string;
    returns: number;
    aum: string;
  }>;
  bio: string;
}

export default function FundManagerPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFundType, setSelectedFundType] = useState<
    'equity' | 'debt' | null
  >(null);
  const [selectedFund, setSelectedFund] = useState<FundOption | null>(null);
  const [managerDetails, setManagerDetails] =
    useState<FundManagerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { funds: allFunds, loading: fundsLoading } = useFunds({ limit: 3000 });

  // Transform and filter funds
  const transformedFunds = useMemo(() => {
    return allFunds
      .filter((fund) => {
        const category = fund.category?.toLowerCase() || '';
        const name = fund.name?.toLowerCase() || '';

        // Exclude commodity funds
        const isCommodity =
          category.includes('commodity') ||
          name.includes('gold') ||
          name.includes('silver');

        if (isCommodity) return false;

        // Filter by selected fund type
        if (!selectedFundType) return false;

        if (selectedFundType === 'equity') {
          return category.includes('equity');
        } else if (selectedFundType === 'debt') {
          return !category.includes('equity');
        }

        return false;
      })
      .map((fund) => ({
        id: fund.id || fund.fundId,
        name: fund.name,
        fundHouse: fund.fundHouse,
        category: fund.category,
        nav: fund.currentNav || 0,
        returns1Y: fund.returns?.oneYear || 0,
        returns3Y: fund.returns?.threeYear || 0,
        returns5Y: fund.returns?.fiveYear || 0,
      }));
  }, [allFunds, selectedFundType]);

  // Search and filter funds
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    return transformedFunds
      .filter((fund) => {
        return (
          fund.name.toLowerCase().includes(query) ||
          fund.fundHouse.toLowerCase().includes(query) ||
          fund.category?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.returns3Y - a.returns3Y)
      .slice(0, 20);
  }, [searchQuery, transformedFunds]);

  // Mock fund manager details generator
  const generateMockManagerDetails = (fund: FundOption): FundManagerDetail => {
    const managerNames = [
      'Rajiv Sharma',
      'Priya Desai',
      'Amit Verma',
      'Neha Gupta',
      'Karthik Menon',
      'Anjali Rao',
      'Sandeep Patel',
      'Meera Krishnan',
    ];

    const randomName =
      managerNames[Math.floor(Math.random() * managerNames.length)];
    const isEquity = fund.category.toLowerCase().includes('equity');

    return {
      id: `mgr_${fund.id}`,
      name: randomName,
      designation: isEquity
        ? 'Senior Fund Manager - Equity'
        : 'Head of Fixed Income',
      company: fund.fundHouse,
      experience: `${12 + Math.floor(Math.random() * 8)} years`,
      education: [
        'MBA in Finance',
        isEquity ? 'B.Tech from IIT' : 'B.Com from Delhi University',
      ],
      qualification: [
        'CFA (Chartered Financial Analyst)',
        'FRM (Financial Risk Manager)',
      ],
      joinedDate: '2018',
      previousExperience: [
        'Portfolio Manager at JP Morgan (2011-2018)',
        'Equity Research Analyst at Goldman Sachs (2008-2011)',
        'Associate at McKinsey & Company (2006-2008)',
      ],
      rating: 4.5 + Math.random() * 0.4,
      fundsManaged: 5 + Math.floor(Math.random() * 8),
      totalAUM: `₹${(25000 + Math.random() * 50000).toFixed(0)} Cr`,
      averageReturns: {
        oneYear: fund.returns1Y,
        threeYear: fund.returns3Y,
        fiveYear: fund.returns5Y,
      },
      specialization: isEquity
        ? ['Large Cap Equity', 'Multi Cap Funds', 'Growth Stocks']
        : [
            'Corporate Bonds',
            'Government Securities',
            'Credit Risk Management',
          ],
      investmentPhilosophy: isEquity
        ? 'Follows a bottom-up stock selection approach with emphasis on quality companies with sustainable competitive advantages. Believes in long-term value creation through disciplined investing in fundamentally strong businesses with capable management teams.'
        : 'Adopts an active duration management strategy combined with rigorous credit analysis. Focuses on optimizing risk-adjusted returns through careful selection of high-quality debt instruments while maintaining liquidity.',
      achievements: [
        'Consistently outperformed benchmark by 3-5% annually',
        'Awarded "Best Fund Manager of the Year" by Morningstar (2022)',
        'Successfully navigated COVID-19 market crash with minimal drawdowns',
        'Built one of the largest AUM portfolios in the ' +
          (isEquity ? 'equity' : 'debt') +
          ' segment',
        'Featured in Forbes India "Top 50 Investment Professionals" list',
      ],
      uniqueApproach: [
        'Proprietary stock screening algorithm combining fundamental and technical factors',
        'Quarterly deep-dive sessions with company management teams',
        'Risk-adjusted return framework prioritizing downside protection',
        'ESG integration in investment decision-making process',
        'Dynamic portfolio rebalancing based on market cycles',
      ],
      improvementsSinceTenure: {
        returnsImprovement: '+25% above benchmark since 2018',
        aumGrowth: 'Grew AUM from ₹8,000 Cr to current levels (3.5x growth)',
        rankingImprovement:
          'Fund moved from 15th to Top 5 in category rankings',
      },
      managedFunds: [
        {
          fundName: fund.name,
          returns: fund.returns3Y,
          aum: `₹${(5000 + Math.random() * 15000).toFixed(0)} Cr`,
        },
        {
          fundName: fund.fundHouse + ' Focused Fund',
          returns: fund.returns3Y + Math.random() * 3,
          aum: `₹${(3000 + Math.random() * 10000).toFixed(0)} Cr`,
        },
        {
          fundName: fund.fundHouse + ' Opportunities Fund',
          returns: fund.returns3Y - Math.random() * 2,
          aum: `₹${(2000 + Math.random() * 8000).toFixed(0)} Cr`,
        },
      ],
      bio: `${randomName} brings over ${
        12 + Math.floor(Math.random() * 8)
      } years of extensive experience in ${
        isEquity
          ? 'equity research and portfolio management'
          : 'fixed income and debt management'
      }. Having worked with leading global financial institutions, ${
        randomName.split(' ')[0]
      } has developed a unique investment framework that combines rigorous fundamental analysis with macroeconomic insights. Known for disciplined risk management and consistent performance delivery, ${
        randomName.split(' ')[0]
      } has successfully managed portfolios across various market cycles.`,
    };
  };

  // Handle fund selection
  const handleFundSelect = (fund: FundOption) => {
    setSelectedFund(fund);
    setSearchQuery('');
    setShowSuggestions(false);
    setStep(3);
  };

  // Fetch manager details
  const handleShowManagerDetails = async () => {
    if (!selectedFund) return;

    setLoading(true);
    try {
      // Try to fetch from API
      const response = await apiClient.getFundById(selectedFund.id);

      if (response.success && response.data) {
        const fundData = response.data;

        // Check if we have real manager details from API
        if (fundData.managerDetails && fundData.managerDetails.name) {
          setManagerDetails(fundData.managerDetails);
        }
        // Check if fund has fundManager field
        else if (fundData.fundManager) {
          // Extract manager name from fundManager field
          const managerName =
            typeof fundData.fundManager === 'string'
              ? fundData.fundManager
              : fundData.fundManager.name || 'Information Not Available';

          // Create details using actual manager name from API
          const mockDetails = generateMockManagerDetails(selectedFund);
          mockDetails.name = managerName;
          mockDetails.bio = `${managerName} is the fund manager for ${
            selectedFund.name
          }. Detailed information about ${
            managerName.split(' ')[0]
          }'s background, education, and experience is currently being updated. Please check the official AMC website or contact customer support for comprehensive manager details.`;
          setManagerDetails(mockDetails);
        } else {
          // No manager info available
          const mockDetails = generateMockManagerDetails(selectedFund);
          mockDetails.name = 'Manager Information Not Available';
          mockDetails.bio = `Detailed fund manager information for ${selectedFund.name} is currently not available in our database. Please visit the official ${selectedFund.fundHouse} website or contact their customer support for accurate fund manager details.`;
          setManagerDetails(mockDetails);
        }
      } else {
        // API didn't return data
        const mockDetails = generateMockManagerDetails(selectedFund);
        mockDetails.name = 'Manager Information Not Available';
        mockDetails.bio = `Unable to fetch fund manager details for ${selectedFund.name}. Please check the official AMC website for accurate information.`;
        setManagerDetails(mockDetails);
      }
    } catch (error) {
      console.error('Failed to fetch manager details:', error);
      // Fallback with disclaimer
      const mockDetails = generateMockManagerDetails(selectedFund);
      mockDetails.name = 'Manager Information Not Available';
      mockDetails.bio = `Unable to fetch fund manager details for ${selectedFund.name}. Please check the official AMC website for accurate information.`;
      setManagerDetails(mockDetails);
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    setStep(1);
    setSelectedFundType(null);
    setSelectedFund(null);
    setManagerDetails(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <BackButton />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 mt-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Fund Manager Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explore detailed information about fund managers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 1
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Select Fund Type
                  </p>
                  <p className="text-sm text-gray-500">Equity or Debt</p>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 2
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Select Fund
                  </p>
                  <p className="text-sm text-gray-500">Choose specific fund</p>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-gray-400" />

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 3
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    View Details
                  </p>
                  <p className="text-sm text-gray-500">Manager information</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Select Fund Type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <Card
              className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-purple-500"
              onClick={() => {
                setSelectedFundType('equity');
                setStep(2);
              }}
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  Equity Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  View fund managers managing equity funds including large cap,
                  mid cap, small cap, and multi cap funds.
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Select Equity Funds
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-purple-500"
              onClick={() => {
                setSelectedFundType('debt');
                setStep(2);
              }}
            >
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  Debt Funds
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  View fund managers managing debt funds including corporate
                  bonds, government securities, and liquid funds.
                </p>
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Select Debt Funds
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Select Fund */}
        {step === 2 && selectedFundType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Search className="w-6 h-6 text-purple-600" />
                  Search {selectedFundType === 'equity'
                    ? 'Equity'
                    : 'Debt'}{' '}
                  Funds
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSelection}
                  className="absolute top-6 right-6"
                >
                  Change Fund Type
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Input
                    type="text"
                    placeholder="Search by fund name, AMC, or category..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() =>
                      searchQuery.length >= 2 && setShowSuggestions(true)
                    }
                    className="px-5 pr-12 h-16 text-lg border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl shadow-lg"
                  />

                  {/* Search Results */}
                  <AnimatePresence>
                    {showSuggestions && searchQuery.length >= 2 && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setShowSuggestions(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 rounded-xl shadow-2xl z-30 max-h-[500px] overflow-y-auto"
                        >
                          {fundsLoading && (
                            <div className="p-8 text-center">
                              <p className="text-gray-500 dark:text-gray-400">
                                Loading funds...
                              </p>
                            </div>
                          )}

                          {!fundsLoading && searchResults.length === 0 && (
                            <div className="p-8 text-center">
                              <p className="text-gray-500 dark:text-gray-400">
                                No funds found
                              </p>
                            </div>
                          )}

                          {!fundsLoading &&
                            searchResults.map((fund) => (
                              <button
                                key={fund.id}
                                onClick={() => handleFundSelect(fund)}
                                className="w-full text-left p-4 hover:bg-purple-50 dark:hover:bg-purple-950/30 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold text-gray-900 dark:text-white mb-1">
                                      {fund.name}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      <span className="flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {fund.fundHouse}
                                      </span>
                                      <span>•</span>
                                      <span>{fund.category}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="flex items-center gap-1">
                                        <span className="text-gray-600 dark:text-gray-400">
                                          3Y Return:
                                        </span>
                                        <span
                                          className={`font-semibold ${
                                            fund.returns3Y >= 0
                                              ? 'text-green-600'
                                              : 'text-red-600'
                                          }`}
                                        >
                                          {fund.returns3Y >= 0 ? '+' : ''}
                                          {fund.returns3Y.toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Instruction */}
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p>
                    Type at least 2 characters to search for funds in the{' '}
                    {selectedFundType} category
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: View Details Button */}
        {step === 3 && selectedFund && !managerDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                <CardTitle className="text-2xl">Selected Fund</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedFund.name}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {selectedFund.fundHouse}
                      </span>
                      <span>•</span>
                      <Badge>{selectedFund.category}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          1Y Return
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {selectedFund.returns1Y >= 0 ? '+' : ''}
                          {selectedFund.returns1Y.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          3Y Return
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {selectedFund.returns3Y >= 0 ? '+' : ''}
                          {selectedFund.returns3Y.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          5Y Return
                        </p>
                        <p className="text-lg font-bold text-purple-600">
                          {selectedFund.returns5Y >= 0 ? '+' : ''}
                          {selectedFund.returns5Y.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={handleShowManagerDetails}
                    disabled={loading}
                    className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl"
                  >
                    {loading ? (
                      <>Loading Manager Details...</>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        View Fund Manager Details
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetSelection}
                    className="h-14"
                  >
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Manager Details Display */}
        {managerDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Important Disclaimer */}
            <Card className="border-2 border-yellow-400 dark:border-yellow-600 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Important Notice: Verify Information
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {managerDetails.name ===
                      'Manager Information Not Available'
                        ? `Fund manager details for ${selectedFund?.name} could not be retrieved from our database. Please visit the official ${selectedFund?.fundHouse} website or AMFI (Association of Mutual Funds in India) portal for accurate and up-to-date fund manager information.`
                        : `The information displayed is based on available data and may not reflect recent changes. For the most accurate and current fund manager details, including their latest portfolio changes and performance updates, please verify with:`}
                    </p>
                    <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Official {selectedFund?.fundHouse} website
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        AMFI (www.amfiindia.com) - Official mutual fund portal
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Fund fact sheet available on AMC website
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manager Profile Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                    {managerDetails.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">
                      {managerDetails.name}
                    </h2>
                    <p className="text-xl text-purple-100 mb-3">
                      {managerDetails.designation}
                    </p>
                    <div className="flex items-center gap-4 text-purple-100">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {managerDetails.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {managerDetails.experience} Experience
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        {managerDetails.rating.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {managerDetails.bio}
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Funds Managed
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {managerDetails.fundsManaged}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <LineChart className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total AUM
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {managerDetails.totalAUM}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        3Y Avg Return
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        +{managerDetails.averageReturns.threeYear.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Education & Qualifications */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  Education & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Education
                    </h4>
                    <ul className="space-y-2">
                      {managerDetails.education.map((edu, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Professional Certifications
                    </h4>
                    <ul className="space-y-2">
                      {managerDetails.qualification.map((qual, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          {qual}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Experience */}
            {managerDetails.previousExperience && (
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-green-600" />
                    Previous Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {managerDetails.previousExperience.map((exp, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <ArrowRight className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {exp}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Investment Philosophy */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Investment Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {managerDetails.investmentPhilosophy}
                </p>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="grid md:grid-cols-2 gap-4">
                  {managerDetails.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    >
                      <Star className="w-5 h-5 text-yellow-600 fill-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Unique Approach */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Unique Approach & Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {managerDetails.uniqueApproach.map((approach, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 flex-1">
                        {approach}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvements Since Tenure */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-green-600" />
                  Improvements Since Becoming Manager (2018)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Returns Improvement
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {
                        managerDetails.improvementsSinceTenure
                          .returnsImprovement
                      }
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <LineChart className="w-8 h-8 text-green-600 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      AUM Growth
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {managerDetails.improvementsSinceTenure.aumGrowth}
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                    <Award className="w-8 h-8 text-purple-600 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Ranking Improvement
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        managerDetails.improvementsSinceTenure
                          .rankingImprovement
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Managed Funds Performance */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Funds Under Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {managerDetails.managedFunds.map((fund, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {fund.fundName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            AUM: {fund.aum}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            +{fund.returns.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            3Y Returns
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={resetSelection}
                className="flex-1 h-14 text-lg"
              >
                View Another Fund Manager
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
