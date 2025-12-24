/**
 * Fund Manager Profile Page
 *
 * Displays comprehensive profile for a fund manager including:
 *  - Header with photo, designation, experience
 *  - Key stats (funds managed, AUM, success rate)
 *  - Education & qualifications
 *  - Investment philosophy
 *  - Track record
 *  - Achievements
 *  - Career history
 *  - Funds currently managed with detailed info
 *  - Specialization tags
 */

'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Target,
  Calendar,
  BarChart3,
  ArrowLeft,
  Star,
} from 'lucide-react';
import Link from 'next/link';

interface FundManagerProfileProps {
  params: Promise<{ managerName: string }>;
}

export default function FundManagerProfilePage({
  params,
}: FundManagerProfileProps) {
  const { managerName } = use(params);
  const router = useRouter();
  const decodedName = decodeURIComponent(managerName);

  const [manager, setManager] = useState<any>(null);
  const [funds, setFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          'https://mutualfun-backend.vercel.app/api';

        // Fetch manager profile
        const managerRes = await fetch(
          `${baseUrl}/fund-managers?name=${encodeURIComponent(decodedName)}`
        );
        if (!managerRes.ok) {
          throw new Error('Manager not found');
        }
        const managerData = await managerRes.json();
        setManager(managerData.data);

        // Fetch funds managed by this manager
        const fundsRes = await fetch(
          `${baseUrl}/funds?fundManager=${encodeURIComponent(
            decodedName
          )}&limit=500`
        );
        if (fundsRes.ok) {
          const fundsData = await fundsRes.json();
          setFunds(fundsData.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, [decodedName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Loading profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !manager) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-lg text-red-600 mb-4">Manager not found</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The fund manager profile could not be loaded.'}
            </p>
            <Button onClick={() => router.push('/fund-manager')}>
              Back to Fund Managers
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/fund-manager')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Fund Managers
        </Button>

        {/* Header Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold flex-shrink-0 border-4 border-white/30">
                {manager.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {manager.name}
                </h1>
                <p className="text-xl opacity-90 mb-1">{manager.designation}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4" />
                  <span className="text-lg">{manager.fundHouse}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-sm opacity-80">Experience</div>
                    <div className="text-2xl font-bold">
                      {manager.experience} Yrs
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-sm opacity-80">Funds</div>
                    <div className="text-2xl font-bold">
                      {manager.trackRecord?.fundsUnderManagement ||
                        funds.length}
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-sm opacity-80">Total AUM</div>
                    <div className="text-2xl font-bold">
                      ₹{(manager.trackRecord?.totalAUM || 0).toLocaleString()}{' '}
                      Cr
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-sm opacity-80">Avg Returns</div>
                    <div className="text-2xl font-bold">
                      {manager.trackRecord?.averageAnnualReturn || 0}%
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <div className="text-sm opacity-80">Success Rate</div>
                    <div className="text-2xl font-bold">
                      {manager.successRate || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Education & Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {manager.education?.map((edu: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {edu}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Track Record */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Track Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Average Annual Return
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {manager.trackRecord?.averageAnnualReturn || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Best Year Return
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {manager.trackRecord?.bestYearReturn || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Benchmark Outperformance
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    +{manager.benchmarkOutperformance || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Investor Base
                  </span>
                  <span className="text-xl font-bold">
                    {(manager.investorBase || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Philosophy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Investment Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {manager.investmentPhilosophy || manager.bio}
            </p>
          </CardContent>
        </Card>

        {/* Achievements */}
        {manager.achievements && manager.achievements.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Major Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {manager.achievements.map(
                  (achievement: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {achievement}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Career History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Career History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <div className="font-semibold text-lg">
                    {manager.fundHouse}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Since {manager.joinedFundHouse} •{' '}
                    {new Date().getFullYear() - manager.joinedFundHouse} years
                  </div>
                </div>
              </div>
              {manager.previousCompanies &&
                manager.previousCompanies.length > 0 && (
                  <div className="pl-4 border-l-2 border-gray-300 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Previous Experience:
                    </p>
                    <ul className="space-y-1">
                      {manager.previousCompanies.map(
                        (company: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-gray-700 dark:text-gray-300 text-sm"
                          >
                            {company}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Funds Under Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Funds Under Management ({funds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {funds.map((fund: any) => (
                <Card
                  key={fund.fundId}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {fund.name}
                    </h3>
                    <Badge variant="secondary" className="mb-3">
                      {fund.category} - {fund.subCategory}
                    </Badge>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">NAV</div>
                        <div className="font-semibold">₹{fund.currentNav}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">1Y Return</div>
                        <div
                          className={`font-semibold ${
                            fund.returns?.oneYear > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {fund.returns?.oneYear || 0}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">AUM</div>
                        <div className="font-semibold">
                          ₹{fund.aum?.toFixed(0)} Cr
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Rating</div>
                        <div className="font-semibold">
                          {'⭐'.repeat(fund.ratings?.morningstar || 0)}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/funds/${fund.fundId}`)}
                      size="sm"
                      className="w-full mt-3"
                      variant="outline"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specialization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-600" />
              Specialization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {manager.specialization
                ?.split(',')
                .map((spec: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">
                    {spec.trim()}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
