'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  TrendingUp,
  Award,
  Briefcase,
  Star,
  Building2,
  BarChart3,
  Target,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useFundManagers } from '@/lib/hooks/use-fund-managers';
import { FundManagerSearch } from '@/components/fund-manager-search';
import { useRouter } from 'next/navigation';

// Fallback mock data in case API fails
const mockFundManagers = [
  {
    id: 'fm1',
    name: 'Rajiv Sharma',
    photo: '/managers/rajiv.jpg',
    designation: 'Chief Investment Officer',
    company: 'HDFC Asset Management',
    experience: '18 years',
    education: 'MBA (IIM-A), CFA',
    rating: 4.8,
    fundsManaged: 12,
    aum: '₹85,000 Cr',
    topFunds: ['HDFC Top 100', 'HDFC Balanced Advantage', 'HDFC Mid-Cap'],
    performance: {
      '1Y': '+15.2%',
      '3Y': '+18.5%',
      '5Y': '+22.3%',
    },
    specialization: 'Large Cap & Multi Cap Equity',
    philosophy:
      'Long-term value investing with focus on quality companies and sustainable growth',
  },
  {
    id: 'fm2',
    name: 'Priya Desai',
    photo: '/managers/priya.jpg',
    designation: 'Senior Fund Manager',
    company: 'SBI Mutual Fund',
    experience: '14 years',
    education: 'CA, CFA',
    rating: 4.6,
    fundsManaged: 8,
    aum: '₹62,000 Cr',
    topFunds: ['SBI Blue Chip', 'SBI Focused Equity', 'SBI Small Cap'],
    performance: {
      '1Y': '+17.8%',
      '3Y': '+19.2%',
      '5Y': '+24.1%',
    },
    specialization: 'Small & Mid Cap Equity',
    philosophy:
      'Bottom-up stock picking with emphasis on emerging growth stories and market inefficiencies',
  },
  {
    id: 'fm3',
    name: 'Amit Verma',
    photo: '/managers/amit.jpg',
    designation: 'Head of Fixed Income',
    company: 'ICICI Prudential',
    experience: '16 years',
    education: 'MBA (Finance), CFA',
    rating: 4.7,
    fundsManaged: 10,
    aum: '₹48,000 Cr',
    topFunds: [
      'ICICI Pru Bond Fund',
      'ICICI Pru Liquid',
      'ICICI Pru Credit Risk',
    ],
    performance: {
      '1Y': '+7.5%',
      '3Y': '+8.2%',
      '5Y': '+9.1%',
    },
    specialization: 'Debt & Fixed Income',
    philosophy:
      'Active duration management combined with credit selection to optimize risk-adjusted returns',
  },
  {
    id: 'fm4',
    name: 'Neha Gupta',
    photo: '/managers/neha.jpg',
    designation: 'Fund Manager - Hybrid',
    company: 'Axis Mutual Fund',
    experience: '12 years',
    education: 'MBA, FRM',
    rating: 4.5,
    fundsManaged: 6,
    aum: '₹35,000 Cr',
    topFunds: [
      'Axis Balanced Advantage',
      'Axis Hybrid Equity',
      'Axis Dynamic Equity',
    ],
    performance: {
      '1Y': '+12.8%',
      '3Y': '+14.5%',
      '5Y': '+16.7%',
    },
    specialization: 'Hybrid & Balanced Funds',
    philosophy:
      'Dynamic asset allocation between equity and debt based on market valuations and macro trends',
  },
  {
    id: 'fm5',
    name: 'Karthik Menon',
    photo: '/managers/karthik.jpg',
    designation: 'Chief Equity Strategist',
    company: 'Kotak Mahindra AMC',
    experience: '20 years',
    education: 'MBA (XLRI), CFA',
    rating: 4.9,
    fundsManaged: 15,
    aum: '₹92,000 Cr',
    topFunds: [
      'Kotak Standard Multi Cap',
      'Kotak Emerging Equity',
      'Kotak Flexi Cap',
    ],
    performance: {
      '1Y': '+16.5%',
      '3Y': '+20.1%',
      '5Y': '+25.8%',
    },
    specialization: 'Multi Cap & Flexi Cap Equity',
    philosophy:
      'All-cap approach with tactical allocation across market caps based on opportunity landscape',
  },
  {
    id: 'fm6',
    name: 'Anjali Rao',
    photo: '/managers/anjali.jpg',
    designation: 'Senior Portfolio Manager',
    company: 'Franklin Templeton',
    experience: '15 years',
    education: 'MBA (ISB), CFA',
    rating: 4.4,
    fundsManaged: 7,
    aum: '₹40,000 Cr',
    topFunds: [
      'Franklin India Prima',
      'Franklin India Focused Equity',
      'Franklin India Smaller Cos',
    ],
    performance: {
      '1Y': '+14.3%',
      '3Y': '+17.6%',
      '5Y': '+21.2%',
    },
    specialization: 'Growth & Focused Equity',
    philosophy:
      'Concentrated portfolio of high-conviction ideas with focus on earnings growth and scalability',
  },
];

export default function FundManagersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const router = useRouter();

  // Fetch real fund managers from API
  const {
    managers: apiManagers,
    loading,
    error,
  } = useFundManagers({ limit: 500 });

  // Use API data if available, otherwise fallback to mock data
  const fundManagers = useMemo(() => {
    if (apiManagers && apiManagers.length > 0) {
      // Transform API data to match expected format
      return apiManagers.map((manager) => ({
        id: manager.managerId || manager.id,
        name: manager.name,
        photo: '/managers/default.jpg',
        designation: manager.designation,
        company: manager.currentFundHouse,
        experience: `${manager.experience} years`,
        education: manager.qualification.join(', '),
        rating: 4.5 + Math.random() * 0.4, // Generate rating between 4.5-4.9
        fundsManaged: manager.fundsManaged,
        aum: `₹${(manager.totalAumManaged / 10000).toFixed(1)}K Cr`,
        topFunds: manager.fundsList.slice(0, 3).map((f) => f.fundName),
        performance: {
          '1Y': `+${manager.averageReturns.oneYear.toFixed(1)}%`,
          '3Y': `+${manager.averageReturns.threeYear.toFixed(1)}%`,
          '5Y': `+${manager.averageReturns.fiveYear.toFixed(1)}%`,
        },
        specialization: manager.designation.includes('Equity')
          ? 'Equity Funds'
          : manager.designation.includes('Debt')
          ? 'Debt & Fixed Income'
          : manager.designation.includes('Hybrid')
          ? 'Hybrid & Balanced Funds'
          : 'Multi Asset',
        philosophy: manager.bio,
      }));
    }
    return mockFundManagers;
  }, [apiManagers]);

  const specializations = [
    'All',
    'Large Cap & Multi Cap Equity',
    'Small & Mid Cap Equity',
    'Debt & Fixed Income',
    'Hybrid & Balanced Funds',
    'Multi Cap & Flexi Cap Equity',
    'Growth & Focused Equity',
  ];

  // Get search suggestions based on user input
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const suggestions: Array<{
      type: 'name' | 'company' | 'specialization' | 'fund';
      text: string;
      manager: (typeof fundManagers)[0];
    }> = [];

    fundManagers.forEach((manager) => {
      // Name suggestions
      if (manager.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'name',
          text: manager.name,
          manager,
        });
      }

      // Company suggestions
      if (manager.company.toLowerCase().includes(query)) {
        const existing = suggestions.find((s) => s.text === manager.company);
        if (!existing) {
          suggestions.push({
            type: 'company',
            text: manager.company,
            manager,
          });
        }
      }

      // Specialization suggestions
      if (manager.specialization.toLowerCase().includes(query)) {
        const existing = suggestions.find(
          (s) => s.text === manager.specialization
        );
        if (!existing) {
          suggestions.push({
            type: 'specialization',
            text: manager.specialization,
            manager,
          });
        }
      }

      // Top funds suggestions
      manager.topFunds.forEach((fund) => {
        if (fund.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'fund',
            text: fund,
            manager,
          });
        }
      });
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  };

  const suggestions = getSearchSuggestions();

  const filteredManagers = fundManagers.filter((manager) => {
    const matchesSearch =
      manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.specialization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      manager.topFunds.some((fund) =>
        fund.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSpecialization =
      selectedSpecialization === 'All' ||
      manager.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: (typeof suggestions)[0]) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Loading fund managers...
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Fetching data from API
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-4">
          <BackButton />
        </div>
        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Using sample data. API connection: {error}
            </p>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Expert Fund Managers</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Meet Our Fund Managers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore the experienced professionals managing India's
            top-performing mutual funds
          </p>
        </motion.div>

        {/* Fund Manager Search by Fund Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Card className="shadow-2xl border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Search className="w-6 h-6 text-green-600" />
                Search Fund Manager by Fund Name
              </CardTitle>
              <CardDescription>
                Find fund managers by searching for the funds they manage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FundManagerSearch
                onManagerSelect={(managerId) =>
                  router.push(`/fund-manager/${managerId}`)
                }
                showInstructions={true}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Search with Autocomplete */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Search by name, company, fund, or specialization..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    onKeyDown={handleKeyDown}
                    className="pl-10 h-12 text-base border-2"
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                      {suggestions.map((suggestion, idx) => (
                        <div
                          key={`${suggestion.type}-${suggestion.text}-${idx}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                            idx === selectedSuggestionIndex
                              ? 'bg-green-50 dark:bg-green-900/30'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon based on type */}
                            <div
                              className={`mt-0.5 flex-shrink-0 ${
                                suggestion.type === 'name'
                                  ? 'text-blue-600'
                                  : suggestion.type === 'company'
                                  ? 'text-purple-600'
                                  : suggestion.type === 'specialization'
                                  ? 'text-green-600'
                                  : 'text-amber-600'
                              }`}
                            >
                              {suggestion.type === 'name' && (
                                <Users className="w-5 h-5" />
                              )}
                              {suggestion.type === 'company' && (
                                <Building2 className="w-5 h-5" />
                              )}
                              {suggestion.type === 'specialization' && (
                                <Target className="w-5 h-5" />
                              )}
                              {suggestion.type === 'fund' && (
                                <BarChart3 className="w-5 h-5" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                  {suggestion.text}
                                </p>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    suggestion.type === 'name'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                      : suggestion.type === 'company'
                                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                      : suggestion.type === 'specialization'
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                  }`}
                                >
                                  {suggestion.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="truncate">
                                  {suggestion.manager.name}
                                </span>
                                <span>•</span>
                                <span className="truncate">
                                  {suggestion.manager.company}
                                </span>
                                {suggestion.type === 'fund' && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      {suggestion.manager.rating}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter by Specialization */}
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="h-12 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: 'Total Managers',
              value: fundManagers.length.toString(),
              icon: Users,
              color: 'from-green-500 to-emerald-600',
            },
            {
              label: 'Total AUM',
              value: '₹3.6L Cr',
              icon: Building2,
              color: 'from-blue-500 to-cyan-600',
            },
            {
              label: 'Funds Managed',
              value: fundManagers
                .reduce((sum, m) => sum + m.fundsManaged, 0)
                .toString(),
              icon: BarChart3,
              color: 'from-purple-500 to-pink-600',
            },
            {
              label: 'Avg Experience',
              value: '16 years',
              icon: Award,
              color: 'from-amber-500 to-orange-600',
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
            >
              <Card className="shadow-xl hover:shadow-2xl transition-all">
                <CardContent className="pt-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Fund Managers Grid */}
        {filteredManagers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManagers.map((manager, idx) => (
              <motion.div
                key={manager.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <Link href={`/fund-manager/${manager.id}`}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-300 dark:hover:border-green-700 cursor-pointer group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Users className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {manager.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {manager.designation}
                          </p>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {manager.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Experience
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {manager.experience}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            AUM
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {manager.aum}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Funds
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {manager.fundsManaged}
                          </p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Rating
                          </p>
                          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400" />
                            {manager.rating}/5
                          </p>
                        </div>
                      </div>

                      {/* Specialization */}
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Specialization
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {manager.specialization}
                        </p>
                      </div>

                      {/* Performance */}
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                          Average Returns
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">1Y</p>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">
                              {manager.performance['1Y']}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">3Y</p>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">
                              {manager.performance['3Y']}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">5Y</p>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">
                              {manager.performance['5Y']}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Education & Credentials */}
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Education & Credentials
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {manager.education}
                        </p>
                      </div>

                      {/* Investment Philosophy */}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3 h-3" />
                          Investment Philosophy
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                          {manager.philosophy}
                        </p>
                      </div>

                      {/* Top Funds */}
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                          Top Managed Funds
                        </p>
                        <div className="space-y-1">
                          {manager.topFunds.slice(0, 3).map((fund, fundIdx) => (
                            <div
                              key={fundIdx}
                              className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              {fund}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Summary */}
                      <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Performance Highlights
                          </p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(manager.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              1Y Return
                            </p>
                            <p className="text-xs font-bold text-green-600 dark:text-green-400">
                              {manager.performance['1Y']}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              3Y Return
                            </p>
                            <p className="text-xs font-bold text-green-600 dark:text-green-400">
                              {manager.performance['3Y']}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              5Y Return
                            </p>
                            <p className="text-xs font-bold text-green-600 dark:text-green-400">
                              {manager.performance['5Y']}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Summary */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-[10px] text-gray-500">
                              Total Funds
                            </p>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                              {manager.fundsManaged}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-[10px] text-gray-500">
                              Experience
                            </p>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                              {manager.experience}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div className="pt-2">
                        <div className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all group-hover:shadow-xl flex items-center justify-center gap-2">
                          View Complete Profile & Analysis
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="shadow-2xl">
            <CardContent className="py-16 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Fund Managers Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Award className="w-7 h-7 text-blue-600" />
                Why Fund Manager Expertise Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-bold mb-2">Performance Track Record</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Experienced managers consistently deliver better
                    risk-adjusted returns across market cycles
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                  <Shield className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold mb-2">Risk Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Professional managers employ sophisticated strategies to
                    protect your capital during downturns
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl">
                  <Briefcase className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold mb-2">Investment Philosophy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Each manager's unique approach and philosophy shapes fund
                    performance and investor outcomes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
