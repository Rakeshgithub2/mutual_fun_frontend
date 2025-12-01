const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://mutualfun-backend.vercel.app/api';

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
  returns?: {
    day?: number;
    week?: number;
    month?: number;
    threeMonth?: number;
    sixMonth?: number;
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
    sinceInception?: number;
  };
  riskMetrics?: {
    sharpeRatio?: number;
    standardDeviation?: number;
    beta?: number;
    alpha?: number;
  };
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
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log('🌐 API Request:', url);

    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: response.statusText }));

        const errorMessage = error.message || response.statusText;

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
    }
  }

  /**
   * GET /api/funds - Search and filter funds
   */
  async getFunds(params?: {
    query?: string;
    type?: string;
    category?: string;
    subCategory?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Fund>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/funds${queryString ? `?${queryString}` : ''}`;

    return this.request<PaginatedResponse<Fund>>(endpoint);
  }

  /**
   * GET /api/funds/:id - Get fund details
   */
  async getFundById(fundId: string): Promise<ApiResponse<FundDetails>> {
    return this.request<ApiResponse<FundDetails>>(`/funds/${fundId}`);
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
    return this.request(`/funds/${fundId}/price-history?period=${period}`);
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

    return this.request(`/suggest?q=${encodeURIComponent(query)}`);
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
    return this.request('/compare', {
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
    return this.request('/overlap', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
