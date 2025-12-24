// API Configuration
// Gets base URL from environment variable (without /api suffix)
// The /api prefix will be added by the client methods
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

console.log('🌐 API Base URL configured:', API_BASE_URL);

// ✅ PRODUCTION-SAFE QUERY PARAM BUILDER
// Prevents 400 validation errors by sanitizing all parameters
function buildSafeQueryParams(
  params?: Record<string, any>
): Record<string, string> {
  const safeParams: Record<string, string> = {};

  if (!params) return safeParams;

  // ✅ Safe defaults for pagination
  const MAX_LIMIT = 100; // Backend-safe maximum
  const DEFAULT_LIMIT = 50;
  const DEFAULT_PAGE = 1;

  Object.entries(params).forEach(([key, value]) => {
    // Skip undefined, null, empty strings
    if (value === undefined || value === null || value === '') {
      return;
    }

    // Sanitize specific parameters
    if (key === 'limit') {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > 0) {
        // Cap to safe maximum
        safeParams[key] = String(Math.min(numValue, MAX_LIMIT));
      } else {
        safeParams[key] = String(DEFAULT_LIMIT);
      }
    } else if (key === 'page') {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > 0) {
        safeParams[key] = String(numValue);
      } else {
        safeParams[key] = String(DEFAULT_PAGE);
      }
    } else if (typeof value === 'string' || typeof value === 'number') {
      // Only include valid string/number values
      safeParams[key] = String(value);
    }
  });

  console.log('🛡️ [SafeParams] Original:', params, '→ Safe:', safeParams);
  return safeParams;
}

// Enhanced returns interface with all periods
export interface Returns {
  oneMonth: number;
  threeMonth: number;
  sixMonth: number;
  ytd: number;
  oneYear: number;
  threeYear: number;
  fiveYear: number;
  tenYear: number;
  sinceInception?: number;
}

// Enhanced risk metrics interface
export interface RiskMetrics {
  sharpeRatio: number;
  beta: number;
  alpha: number;
  volatility: number;
  standardDeviation: number;
}

export interface Fund {
  id: string;
  fundId: string;
  name: string;
  category: string;
  subCategory?: string;
  fundType: string;
  fundHouse: string;
  currentNav: number;
  previousNav?: number;
  navDate?: string;

  // Enhanced returns with all periods from backend
  returns?: Returns;

  // Enhanced risk metrics from backend
  riskMetrics?: RiskMetrics;

  // New fields from backend
  riskLevel?: string;
  rating?: number;

  aum?: number;
  expenseRatio?: number;
  ratings?: {
    morningstar?: number;
    crisil?: number;
    valueResearch?: number;
  };
  popularity?: number;
}

export interface FundDetails extends Fund {
  launchDate?: string;
  navChange?: number;
  navChangePercent?: number;
  exitLoad?: number;
  minInvestment?: number;
  sipMinAmount?: number;
  topHoldings?: Array<{
    name: string;
    ticker?: string;
    percentage: number;
    sector: string;
    value?: number;
  }>;
  sectorAllocation?: Array<{
    sector: string;
    percentage: number;
  }>;
  fundManager?: string;
  managerDetails?: {
    id: string;
    name: string;
    experience: number;
    qualification: string;
    fundsManaged: number;
    totalAum: number;
    avgReturn: number;
    bio?: string;
  };
  tags?: string[];
  lastUpdated?: string;
}

export interface PaginatedResponse<T> {
  statusCode?: number; // ✅ Backend uses statusCode
  success?: boolean; // ✅ Optional for compatibility
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore?: boolean;
    hasNext?: boolean; // ✅ Backend uses hasNext
    hasPrev?: boolean; // ✅ Backend uses hasPrev
  };
  timestamp?: string; // ✅ Backend includes timestamp
}

export interface ApiResponse<T> {
  statusCode?: number; // ✅ Backend uses statusCode
  success?: boolean; // ✅ Optional for compatibility
  message: string;
  data: T;
  timestamp?: string; // ✅ Backend includes timestamp
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number; // ✅ NEW: timeout property

  constructor(baseUrl: string = API_BASE_URL, timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout; // ✅ Default 30s timeout for large datasets
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log('🌐 API Request:', url);

    // ✅ NEW: AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal, // ✅ NEW: attach abort signal
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId); // ✅ Clear timeout on successful response

      if (!response.ok) {
        let error: any = { message: response.statusText };
        let errorText = '';

        try {
          errorText = await response.text();
          if (errorText) {
            error = JSON.parse(errorText);
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', errorText);
        }

        const errorMessage =
          error.message ||
          error.error ||
          response.statusText ||
          'Unknown error';

        // Log detailed error information
        console.error('❌ API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          endpoint: endpoint,
          errorMessage: errorMessage,
          fullError: error,
          rawResponse: errorText.substring(0, 200), // First 200 chars
        });

        // More helpful error messages
        if (response.status === 404) {
          throw new Error(
            `Not Found: The requested resource at ${endpoint} was not found. Please ensure the backend API is running at ${this.baseUrl}`
          );
        } else if (response.status === 500) {
          throw new Error(
            `Server Error: The backend encountered an error processing your request. ${errorMessage}`
          );
        } else if (response.status === 0 || response.type === 'opaque') {
          throw new Error(
            `Network Error: Cannot connect to API at ${this.baseUrl}. Please ensure the backend server is running.`
          );
        } else if (response.status === 400) {
          throw new Error(
            `Bad Request (400): ${errorMessage}. Please check the request parameters. URL: ${endpoint}`
          );
        }

        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      return await response.json();
    } catch (error) {
      // Enhanced error logging
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error(
          `Network error - Cannot reach API at: ${url}. Is the backend server running?`
        );
        throw new Error(
          `Cannot connect to backend API at ${this.baseUrl}. Please start the backend server.`
        );
      }

      console.error(`API request failed: ${url}`, error);
      throw error;
    } finally {
      clearTimeout(timeoutId); // ✅ NEW: always clear timeout
    }
  }

  /**
   * GET /api/funds - Search and filter funds (Production-Safe)
   */
  async getFunds(params?: {
    query?: string;
    type?: string;
    category?: string;
    subCategory?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Fund>> {
    // ✅ Use safe query param builder
    const safeParams = buildSafeQueryParams(params);
    const searchParams = new URLSearchParams(safeParams);

    const queryString = searchParams.toString();
    const endpoint = `/api/funds${queryString ? `?${queryString}` : ''}`;

    return this.request<PaginatedResponse<Fund>>(endpoint);
  }

  /**
   * GET /api/funds - Fetch multiple pages (for large datasets)
   * ✅ Production-safe: Automatically handles pagination
   */
  async getFundsMultiPage(params?: {
    query?: string;
    type?: string;
    category?: string;
    subCategory?: string;
    targetCount?: number; // How many funds to fetch
  }): Promise<PaginatedResponse<Fund>> {
    const MAX_PER_PAGE = 100;
    const targetCount = params?.targetCount || 500;
    const pagesToFetch = Math.ceil(targetCount / MAX_PER_PAGE);

    console.log(
      `📚 [MultiPage] Fetching ${pagesToFetch} pages to get ~${targetCount} funds`
    );

    let allFunds: Fund[] = [];
    let pagination: any = null;

    // Fetch up to 12 pages to get 1200 funds (1000+ equity funds after filtering)
    for (let page = 1; page <= Math.min(pagesToFetch, 12); page++) {
      try {
        const response = await this.getFunds({
          ...params,
          page,
          limit: MAX_PER_PAGE,
        });

        allFunds = [...allFunds, ...response.data];
        pagination = response.pagination;

        console.log(
          `✅ [MultiPage] Page ${page}: ${response.data.length} funds (Total: ${allFunds.length})`
        );

        // Stop if we have enough or no more pages
        if (allFunds.length >= targetCount || !response.pagination?.hasNext) {
          break;
        }
      } catch (error) {
        console.warn(`⚠️ [MultiPage] Page ${page} failed, stopping:`, error);
        break;
      }
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Multi-page fetch successful',
      data: allFunds,
      pagination: pagination || {
        total: allFunds.length,
        page: 1,
        limit: allFunds.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  /**
   * GET /api/funds/:id - Get fund details
   */
  async getFundById(fundId: string): Promise<ApiResponse<FundDetails>> {
    return this.request<ApiResponse<FundDetails>>(`/api/funds/${fundId}`);
  }

  /**
   * GET /api/funds/:id/price-history - Get historical NAV data
   */
  async getPriceHistory(
    fundId: string,
    period: '1M' | '3M' | '1Y' | '5Y' | 'ALL' = '1Y'
  ): Promise<
    ApiResponse<{
      fundId: string;
      period: string;
      startDate: string;
      endDate: string;
      dataPoints: number;
      data: Array<{
        date: string;
        nav: number;
        open?: number;
        high?: number;
        low?: number;
        close?: number;
        volume?: number;
      }>;
    }>
  > {
    return this.request(`/api/funds/${fundId}/price-history?period=${period}`);
  }

  /**
   * GET /api/suggest - Autocomplete/fuzzy search
   */
  async getSuggestions(query: string): Promise<
    ApiResponse<{
      query: string;
      count: number;
      suggestions: Fund[];
    }>
  > {
    if (!query || query.length < 2) {
      return {
        success: true,
        message: 'Query too short',
        data: { query, count: 0, suggestions: [] },
      };
    }

    return this.request(`/api/suggest?q=${encodeURIComponent(query)}`);
  }

  /**
   * POST /api/compare - Compare multiple funds
   */
  async compareFunds(fundIds: string[]): Promise<
    ApiResponse<{
      funds: FundDetails[];
      pairwiseComparisons: Array<{
        fund1: { id: string; name: string };
        fund2: { id: string; name: string };
        jaccardSimilarity: number;
        weightedOverlap: number;
        returnCorrelation: number;
        similarity: number;
      }>;
      commonHoldings: Array<{
        ticker: string;
        name: string;
        sector: string;
        heldBy: Array<{
          fundId: string;
          fundName: string;
          percentage: number;
        }>;
        avgPercentage: number;
      }>;
      sectorOverlap: Array<{
        sector: string;
        allocations: Array<{
          fundId: string;
          fundName: string;
          percentage: number;
        }>;
        avgPercentage: number;
        maxDifference: number;
      }>;
      overallMetrics: {
        avgJaccardSimilarity: number;
        avgWeightedOverlap: number;
        avgReturnCorrelation: number;
        totalCommonHoldings: number;
      };
      insights: any;
      comparedAt: string;
    }>
  > {
    return this.request('/api/compare', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  /**
   * POST /api/overlap - Calculate holdings overlap
   */
  async calculateOverlap(fundIds: string[]): Promise<
    ApiResponse<{
      funds: Array<{
        id: string;
        name: string;
        category: string;
        totalHoldings: number;
        topHoldings: Array<{
          name: string;
          ticker?: string;
          percentage: number;
          sector: string;
        }>;
      }>;
      pairwiseOverlaps: Array<{
        fund1: { id: string; name: string };
        fund2: { id: string; name: string };
        jaccardSimilarity: number;
        weightedOverlap: number;
        commonHoldingsCount: number;
        overlapPercentage: number;
      }>;
      commonHoldings: Array<{
        ticker: string;
        name: string;
        sector: string;
        heldBy: Array<{
          fundId: string;
          fundName: string;
          percentage: number;
        }>;
        avgPercentage: number;
      }>;
      uniqueHoldings: Array<{
        fundId: string;
        fundName: string;
        uniqueCount: number;
        uniquePercentage: number;
        topUniqueHoldings: Array<{
          name: string;
          ticker?: string;
          percentage: number;
          sector: string;
        }>;
      }>;
      overallMetrics: {
        totalCommonHoldings: number;
        avgJaccardSimilarity: number;
        avgWeightedOverlap: number;
        maxOverlap: number;
        minOverlap: number;
      };
      insights: any;
      analyzedAt: string;
    }>
  > {
    return this.request('/api/overlap', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
