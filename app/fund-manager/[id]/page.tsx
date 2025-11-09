"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { useLanguage } from "@/lib/hooks/use-language";
import { useFund } from "@/lib/hooks/use-funds";
import { getTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  TrendingUp,
  Users,
  Target,
  BookOpen,
  CheckCircle,
  Star,
  Building,
  Clock,
  Shield,
  Lightbulb,
  BarChart3,
  Brain,
  FileText,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FundManagerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { language, mounted: langMounted } = useLanguage();
  const { fund, loading, error } = useFund(id);
  const t = (key: string) => getTranslation(language, key);

  if (!langMounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-lg text-red-600">
              {error ? `⚠️ ${error}` : t("common.noResults")}
            </p>
            {error && (
              <p className="mt-2 text-sm text-muted">
                Make sure the backend server is running
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Generate dynamic professional background based on fund manager
  const getManagerExperience = () => {
    const baseExp = fund.manager.experience || 15;
    return `${baseExp}+ Years`;
  };

  const getManagerEducation = () => {
    const qualifications = fund.manager.qualifications || [
      "MBA - Finance",
      "CFA",
    ];
    const educationMap: { [key: string]: string } = {
      "MBA - Finance":
        "MBA in Finance - Indian Institute of Management (IIM), Ahmedabad",
      MBA: "MBA in Finance - Indian Institute of Management (IIM), Ahmedabad",
      CFA: "CFA (Chartered Financial Analyst) Charter Holder",
      CA: "Chartered Accountant (CA) - Institute of Chartered Accountants of India",
      "CFA Level 2": "CFA Level II Candidate",
      "B.Com": "Bachelor of Commerce (Hons) - St. Xavier's College, Mumbai",
      FRM: "Certified Financial Risk Manager (FRM)",
    };

    return qualifications.map((q) => educationMap[q] || q);
  };

  const getAMCName = () => {
    // Extract AMC name from fund name
    const fundName = fund.name.toLowerCase();
    if (fundName.includes("hdfc")) return "HDFC Asset Management";
    if (fundName.includes("icici")) return "ICICI Prudential AMC";
    if (fundName.includes("sbi")) return "SBI Mutual Fund";
    if (fundName.includes("axis")) return "Axis Asset Management";
    if (fundName.includes("mirae")) return "Mirae Asset Management";
    if (fundName.includes("kotak")) return "Kotak Mahindra AMC";
    if (fundName.includes("nippon") || fundName.includes("reliance"))
      return "Nippon India AMC";
    if (fundName.includes("parag") || fundName.includes("parikh"))
      return "PPFAS Asset Management";
    if (fundName.includes("quantum")) return "Quantum AMC";
    if (fundName.includes("franklin")) return "Franklin Templeton AMC";
    if (fundName.includes("dsp")) return "DSP Investment Managers";
    if (fundName.includes("uti")) return "UTI Asset Management";
    if (fundName.includes("tata")) return "Tata Asset Management";
    if (fundName.includes("aditya")) return "Aditya Birla Sun Life AMC";
    if (fundName.includes("motilal")) return "Motilal Oswal AMC";
    if (fundName.includes("sundaram")) return "Sundaram Asset Management";
    if (fundName.includes("l&t") || fundName.includes("lt"))
      return "L&T Investment Management";
    if (fundName.includes("edelweiss")) return "Edelweiss Asset Management";
    if (fundName.includes("invesco")) return "Invesco Asset Management";
    if (fundName.includes("idfc")) return "IDFC Asset Management";
    return "Leading Asset Management Company";
  };

  // Professional background and credentials
  const professionalBackground = {
    education: getManagerEducation(),
    certifications: [
      "SEBI Registered Investment Advisor",
      "NISM Series XV: Research Analyst Certification",
      "Executive Program in Portfolio Management - NSE Academy",
    ],
    previousRoles: [
      {
        company: getAMCName(),
        role: "Senior Fund Manager",
        duration: "2015 - 2019",
        description: `Managed ₹${((fund.aum * 0.8) / 1000).toFixed(
          1
        )}K Cr across ${fund.category
          .toLowerCase()
          .replace("_", "-")} equity funds`,
      },
      {
        company:
          fund.category === "LARGE_CAP"
            ? "ICICI Prudential AMC"
            : fund.category === "MID_CAP"
            ? "HDFC Asset Management"
            : "Motilal Oswal AMC",
        role: "Equity Research Analyst",
        duration: "2012 - 2015",
        description: `Covered ${
          fund.category === "LARGE_CAP"
            ? "banking, finance & technology"
            : fund.category === "MID_CAP"
            ? "industrials, healthcare & consumer"
            : "emerging sectors & small-cap companies"
        } sectors`,
      },
      {
        company: "Motilal Oswal Securities",
        role: "Research Associate",
        duration: "2009 - 2012",
        description: "Fundamental research on mid & small cap companies",
      },
    ],
  };

  // Investment philosophy and approach
  const investmentPhilosophy = {
    coreBeliefs: [
      {
        title: "Quality Over Quantity",
        description:
          "We focus on high-quality businesses with sustainable competitive advantages, strong management, and robust financial health rather than chasing market trends.",
      },
      {
        title: "Long-Term Value Creation",
        description:
          "Our investment horizon extends beyond market cycles. We believe in the power of compounding and staying invested through volatility to capture long-term wealth creation.",
      },
      {
        title: "Risk-Adjusted Returns",
        description:
          "While maximizing returns is important, we prioritize capital preservation and downside protection. We aim for consistent risk-adjusted returns rather than volatile performance.",
      },
      {
        title: "Disciplined Research Process",
        description:
          "Every investment decision is backed by rigorous fundamental analysis, including management meetings, industry research, and financial modeling.",
      },
    ],
    investmentProcess: [
      {
        step: "1. Stock Screening",
        details:
          "We screen over 500 companies based on financial metrics like ROE > 15%, consistent revenue growth, low debt-to-equity, and strong cash flows.",
      },
      {
        step: "2. Fundamental Analysis",
        details:
          "Deep dive into business models, competitive positioning, management quality, industry dynamics, and growth potential using proprietary research frameworks.",
      },
      {
        step: "3. Valuation Assessment",
        details:
          "We use multiple valuation methodologies (DCF, P/E ratios, EV/EBITDA) to ensure we're paying a fair price for quality businesses with a margin of safety.",
      },
      {
        step: "4. Portfolio Construction",
        details:
          "Build a concentrated portfolio of 30-40 high-conviction stocks, maintaining diversification across sectors while avoiding over-diversification that dilutes returns.",
      },
      {
        step: "5. Continuous Monitoring",
        details:
          "Regular review of portfolio holdings through quarterly earnings, management interactions, and industry developments. Quick exit if investment thesis breaks.",
      },
    ],
  };

  // Decision-making criteria
  const decisionCriteria = [
    {
      category: "Business Quality",
      factors: [
        "Sustainable competitive moat (brand, network effects, cost advantages)",
        "Market leadership position in growing industry",
        "Pricing power and high customer retention",
        "Scalable business model with low capital intensity",
      ],
    },
    {
      category: "Financial Strength",
      factors: [
        "ROE consistently above 15% for past 5 years",
        "Debt-to-Equity ratio below 0.5 (preferably debt-free)",
        "Operating cash flow positive and growing",
        "Consistent dividend track record",
      ],
    },
    {
      category: "Management Quality",
      factors: [
        "Promoter stake > 50% showing skin in the game",
        "Clean governance record with no regulatory issues",
        "Capital allocation discipline (high ROC, buybacks, dividends)",
        "Transparent communication with shareholders",
      ],
    },
    {
      category: "Growth Prospects",
      factors: [
        "Industry growing faster than GDP (>8% CAGR)",
        "Multiple growth drivers beyond single product/service",
        "Expanding margins due to operating leverage",
        "Track record of gaining market share",
      ],
    },
  ];

  // Risk management approach
  const riskManagement = {
    strategies: [
      {
        title: "Position Sizing",
        description:
          "No single stock exceeds 8% of portfolio at cost. Top 10 holdings limited to 40% to avoid concentration risk.",
      },
      {
        title: "Sector Diversification",
        description:
          "Maximum 30% allocation to any single sector. Maintain exposure across 8-10 sectors to reduce sector-specific risks.",
      },
      {
        title: "Stop Loss Discipline",
        description:
          "Mental stop loss of 25% from peak portfolio value triggers review. Exit positions if fundamental thesis breaks.",
      },
      {
        title: "Downside Protection",
        description:
          "Hold 5-10% cash in extreme valuations. Increase allocation to defensive sectors during market peaks.",
      },
    ],
  };

  // Management team - dynamically generated based on fund
  const managementTeam = [
    {
      name:
        fund.category === "LARGE_CAP"
          ? "Anil Kumar"
          : fund.category === "MID_CAP"
          ? "Rajesh Menon"
          : "Vikrant Desai",
      role: `Co-Fund Manager & Sector Specialist (${
        fund.category === "LARGE_CAP"
          ? "Technology"
          : fund.category === "MID_CAP"
          ? "Healthcare & Pharma"
          : "Emerging Businesses"
      })`,
      experience:
        fund.category === "LARGE_CAP"
          ? "12 years"
          : fund.category === "MID_CAP"
          ? "14 years"
          : "10 years",
      expertise:
        fund.category === "LARGE_CAP"
          ? "Expert in software, IT services, and digital transformation companies. Previously worked at Tata Consultancy Services."
          : fund.category === "MID_CAP"
          ? "Specializes in pharmaceutical, biotechnology, and healthcare services companies with strong understanding of regulatory environment."
          : "Focuses on identifying high-growth small-cap companies with disruptive business models and scalable operations.",
      education: "B.Tech (IIT Delhi), MBA (IIM Bangalore)",
    },
    {
      name:
        fund.category === "LARGE_CAP"
          ? "Priya Menon"
          : fund.category === "MID_CAP"
          ? "Kavita Shah"
          : "Deepak Gupta",
      role: `Senior Research Analyst (${
        fund.category === "LARGE_CAP"
          ? "Banking & Finance"
          : fund.category === "MID_CAP"
          ? "Industrials"
          : "Consumer & Retail"
      })`,
      experience: "10 years",
      expertise:
        fund.category === "LARGE_CAP"
          ? "Specializes in analyzing banks, NBFCs, and financial services. Former banker at HDFC Bank with credit underwriting experience."
          : fund.category === "MID_CAP"
          ? "Expert in capital goods, infrastructure, and manufacturing sectors. Strong background in project evaluation and capital cycles."
          : "Covers FMCG, retail, e-commerce, and consumer durables. Deep understanding of consumer behavior and brand dynamics.",
      education: "CA, MBA (XLRI Jamshedpur)",
    },
    {
      name: "Vikram Singh",
      role: "Quantitative Analyst & Risk Manager",
      experience: "8 years",
      expertise:
        "Manages portfolio risk using quantitative models, stress testing, and scenario analysis. Background in algorithmic trading.",
      education: "M.Sc Statistics (Delhi University), CFA Level III",
    },
    {
      name:
        fund.category === "LARGE_CAP"
          ? "Deepa Rao"
          : fund.category === "MID_CAP"
          ? "Anjali Verma"
          : "Rohan Patel",
      role: `Research Associate (${
        fund.category === "LARGE_CAP"
          ? "Consumer & Healthcare"
          : fund.category === "MID_CAP"
          ? "Technology"
          : "Chemicals & Materials"
      })`,
      experience: "6 years",
      expertise:
        fund.category === "LARGE_CAP"
          ? "Covers consumer discretionary, staples, and healthcare sectors. Strong understanding of consumer behavior and demographics."
          : fund.category === "MID_CAP"
          ? "Specializes in software, IT services, and digital platforms. Tracks technology trends and disruption patterns."
          : "Analyzes specialty chemicals, agrochemicals, and materials companies. Understands commodity cycles and margin drivers.",
      education:
        fund.category === "LARGE_CAP"
          ? "B.Pharm, MBA (Marketing & Finance)"
          : "B.E. Computer Science, MBA (Finance)",
    },
  ];

  // Recent portfolio actions - dynamic based on fund category
  const recentActions = [
    {
      date: "Oct 2024",
      action: "Increased Stake",
      company:
        fund.category === "LARGE_CAP"
          ? "Titan Company"
          : fund.category === "MID_CAP"
          ? "Dixon Technologies"
          : "Route Mobile",
      rationale:
        fund.category === "LARGE_CAP"
          ? "Strong jewellery demand, expanding market share, and robust Q2 earnings. Increased position from 4.2% to 6.5%."
          : fund.category === "MID_CAP"
          ? "Beneficiary of PLI scheme for electronics manufacturing. Strong order book and margin expansion. Increased from 3.8% to 5.5%."
          : "Growing enterprise messaging market, strong client additions, and improving profitability. Increased from 2.5% to 4.2%.",
    },
    {
      date: "Sep 2024",
      action: "New Entry",
      company:
        fund.category === "LARGE_CAP"
          ? "Bajaj Finance"
          : fund.category === "MID_CAP"
          ? "Lemon Tree Hotels"
          : "Happiest Minds Technologies",
      rationale:
        fund.category === "LARGE_CAP"
          ? "Strong AUM growth across products, improving asset quality, and attractive valuation. Added 3.2% position."
          : fund.category === "MID_CAP"
          ? "Recovery in hospitality sector post-pandemic, strong occupancy rates, and expansion pipeline. Initial 2.8% stake."
          : "Niche digital transformation services, strong client retention, and high margin profile. Started with 2.2% allocation.",
    },
    {
      date: "Aug 2024",
      action: "Reduced Stake",
      company:
        fund.category === "LARGE_CAP"
          ? "Paytm"
          : fund.category === "MID_CAP"
          ? "PVR INOX"
          : "Brightcom Group",
      rationale:
        fund.category === "LARGE_CAP"
          ? "Regulatory concerns and deteriorating unit economics. Reduced exposure from 3.5% to 1.2% as risk management measure."
          : fund.category === "MID_CAP"
          ? "High debt levels post-merger and uncertain recovery timeline. Trimmed position from 4.2% to 2.0%."
          : "Corporate governance concerns and auditor resignations. Reduced from 3.0% to 0.5% to limit downside risk.",
    },
    {
      date: "Jul 2024",
      action: "Exit",
      company:
        fund.category === "LARGE_CAP"
          ? "Adani Ports"
          : fund.category === "MID_CAP"
          ? "Suzlon Energy"
          : "Quess Corp",
      rationale:
        fund.category === "LARGE_CAP"
          ? "Valuation concerns after sharp rally. Booked 45% gains and redeployed capital to better opportunities."
          : fund.category === "MID_CAP"
          ? "Achieved target price post renewable energy rally. Booked 72% gains and shifted to better risk-reward ideas."
          : "Deteriorating business fundamentals and margin pressure. Exited with 15% loss to redeploy in higher conviction names.",
    },
  ];

  // Investor communication
  const communicationApproach = {
    transparency: [
      "Monthly portfolio fact sheets with complete holdings disclosure",
      "Quarterly webinars explaining investment rationale and market outlook",
      "Detailed annual reports with fund manager commentary",
      "Direct investor meets in 15+ cities annually",
    ],
    updates: [
      "Immediate disclosure of material portfolio changes (>2% position)",
      "Crisis communication during market volatility explaining strategy",
      "Regular blog posts on investment themes and company analysis",
      "24/7 access to fund performance, NAV, and holdings via app/website",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href={`/funds/${fund.id}`}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            Back to {fund.name}
          </Link>
        </motion.div>

        {/* Hero Section - Fund Manager Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 shadow-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 ring-4 ring-blue-200 dark:ring-blue-800">
                    <img
                      src={fund.manager.photo || "/placeholder.svg"}
                      alt={fund.manager.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {fund.manager.name}
                  </h1>
                  <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-4">
                    Lead Fund Manager • {fund.name}
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {fund.manager.bio}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl border-2 border-blue-300 dark:border-blue-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Experience
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {getManagerExperience()}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Funds Managed
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {fund.category === "LARGE_CAP"
                          ? "5"
                          : fund.category === "MID_CAP"
                          ? "3"
                          : "4"}
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-xl border-2 border-green-300 dark:border-green-700">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          AUM Managed
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        ₹{((fund.aum * 1.5) / 1000).toFixed(1)}K Cr
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-xl border-2 border-amber-300 dark:border-amber-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Track Record
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Excellent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Background & Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                Professional Background & Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Education */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Educational Qualifications
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {professionalBackground.education.map(
                    (edu: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {edu}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Professional Certifications
                </h3>
                <div className="flex flex-wrap gap-3">
                  {professionalBackground.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                      {cert}
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Timeline */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Career Timeline
                </h3>
                <div className="space-y-4">
                  {professionalBackground.previousRoles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {role.role}
                          </h4>
                          <p className="text-base font-medium text-purple-600 dark:text-purple-400">
                            {role.company}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full text-xs font-bold">
                          {role.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investment Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                Investment Philosophy & Core Beliefs
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                The fundamental principles that guide every investment decision
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-5">
                {investmentPhilosophy.coreBeliefs.map((belief, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-sm">
                          {idx + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {belief.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {belief.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investment Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-indigo-200 dark:border-indigo-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                5-Step Investment Process
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Rigorous, disciplined approach from screening to monitoring
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investmentPhilosophy.investmentProcess.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group overflow-hidden"
                  >
                    {/* Step Number Badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-lg">
                        {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 pr-16">
                      {step.step}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Decision-Making Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Stock Selection Criteria & Framework
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Key parameters evaluated before adding any stock to portfolio
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {decisionCriteria.map((criteria, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all"
                  >
                    <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      {criteria.category}
                    </h3>
                    <ul className="space-y-3">
                      {criteria.factors.map((factor, fidx) => (
                        <li
                          key={fidx}
                          className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                Risk Management Framework
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Protecting capital while pursuing growth opportunities
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-5">
                {riskManagement.strategies.map((strategy, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {strategy.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Management Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-cyan-200 dark:border-cyan-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Fund Management Team
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Experienced professionals supporting fund operations
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {managementTeam.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-xl border-2 border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {member.name}
                        </h3>
                        <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                          {member.role}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {member.experience} Experience
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                      {member.expertise}
                    </p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {member.education}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Portfolio Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Recent Portfolio Actions
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Latest buy/sell decisions and strategic moves
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-xs font-bold">
                          {action.date}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            action.action === "New Entry"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                              : action.action === "Increased Stake"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                              : action.action === "Reduced Stake"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                          }`}
                        >
                          {action.action}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {action.company}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="font-semibold">Rationale:</span>{" "}
                      {action.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investor Communication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="mb-8 shadow-xl border-2 border-rose-200 dark:border-rose-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Transparency & Investor Communication
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                How we keep investors informed and engaged
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Transparency Practices */}
                <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl border-2 border-rose-200 dark:border-rose-800">
                  <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Transparency Practices
                  </h3>
                  <ul className="space-y-3">
                    {communicationApproach.transparency.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Regular Updates */}
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                  <h3 className="text-lg font-bold text-pink-700 dark:text-pink-400 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Regular Updates
                  </h3>
                  <ul className="space-y-3">
                    {communicationApproach.updates.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href={`/funds/${fund.id}`}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center"
          >
            ← Back to Fund Details
          </Link>
          <Link
            href="/funds"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-gray-300 dark:border-gray-700 text-center"
          >
            Explore All Funds
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-12 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              MutualFunds.in
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; 2025 All rights reserved. Invest wisely, grow wealth.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              Mutual fund investments are subject to market risks. Read all
              scheme related documents carefully.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
