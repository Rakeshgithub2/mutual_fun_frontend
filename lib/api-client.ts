// ✅ FIXED: Proper API base URL handling
// Backend is guaranteed to be on port 3002 with 4,459 active funds
const RAW = process.env.NEXT_PUBLIC_API_URL!;
const API_BASE = RAW.replace(/\/api\/?$/, '').replace(/\/$/, '');

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
  message?: string;
}

class ApiClient {
  private logRequest(endpoint: string, options?: RequestInit) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '🚀 API Request:',
        options?.method || 'GET',
        `${API_BASE}${endpoint}`
      );
    }
  }

  private logResponse(endpoint: string, status: number, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response [${status}]:`, endpoint);
      if (data?.data && Array.isArray(data.data)) {
        console.log(
          `📊 Data count: ${data.data.length}${data.pagination ? ` (Total: ${data.pagination.total})` : ''}`
        );
      }
    }
  }

  private logError(endpoint: string, error: any) {
    console.error('❌ API Error:', endpoint, error);
  }

  async request<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    this.logRequest(endpoint, options);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options?.headers },
      });

      this.logResponse(endpoint, res.status);

      // Handle non-OK responses
      if (!res.ok) {
        const errorText = await res.text();

        if (res.status === 404) {
          throw new Error(`API endpoint not found: ${endpoint}`);
        } else if (res.status === 500) {
          throw new Error('Backend server error. Check server logs.');
        } else if (res.status === 0 || !res.status) {
          throw new Error(
            'Network error: Cannot reach backend server. Is it running on port 3002?'
          );
        }

        throw new Error(errorText || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      // Validate response structure
      if (typeof data !== 'object' || data === null) {
        throw new Error('Invalid API response: Expected object');
      }

      // Check for success flag
      if (data.success === false) {
        throw new Error(
          data.error || data.message || 'API returned success: false'
        );
      }

      return data as ApiResponse<T>;
    } catch (error) {
      this.logError(endpoint, error);

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Backend server is not running. Please start the server on port 3002.'
        );
      }

      throw error;
    }
  }

  // ✅ FIXED: Proper response handling
  async getFunds(
    page = 1,
    limit = 20,
    filters?: {
      category?: string;
      subCategory?: string;
      fundHouse?: string;
      minAum?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters?.category) {
      // ✅ Ensure lowercase for category
      params.append('category', filters.category.toLowerCase());
    }
    if (filters?.subCategory) {
      // ✅ Keep Title Case for subCategory
      params.append('subCategory', filters.subCategory);
    }
    if (filters?.fundHouse) {
      params.append('fundHouse', filters.fundHouse);
    }
    if (filters?.minAum !== undefined) {
      params.append('minAum', filters.minAum.toString());
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    return this.request(`/api/funds?${params.toString()}`);
  }

  async getFundsMultiPage(
    targetCount = 4000,
    filters?: Parameters<typeof this.getFunds>[2]
  ) {
    let all: any[] = [];
    let page = 1;
    const limit = 200;

    console.log(
      `📚 [getFundsMultiPage] Starting multi-page fetch for ${targetCount} funds`
    );
    console.log(`📚 [getFundsMultiPage] Using limit: ${limit} per page`);

    try {
      while (all.length < targetCount) {
        console.log(
          `📖 [getFundsMultiPage] Fetching page ${page} (have ${all.length} so far)...`
        );
        const res = await this.getFunds(page, limit, filters);

        if (!res.data || !Array.isArray(res.data)) {
          console.error('❌ Invalid response structure:', res);
          break;
        }

        console.log(
          `✅ [getFundsMultiPage] Page ${page} returned ${res.data.length} funds`
        );
        console.log(`📊 [getFundsMultiPage] Pagination:`, res.pagination);

        all.push(...res.data);

        // Check if there are more pages
        if (!res.pagination?.hasNext) {
          console.log(
            `✅ [getFundsMultiPage] No more pages. Fetched all ${all.length} funds`
          );
          break;
        }

        // Safety check: don't fetch more than 50 pages (10,000 funds)
        if (page >= 50) {
          console.warn(
            `⚠️ [getFundsMultiPage] Reached page limit of 50. Stopping at ${all.length} funds`
          );
          break;
        }

        page++;
      }

      console.log(`✅ [getFundsMultiPage] Total funds fetched: ${all.length}`);

      return {
        success: true,
        data: all,
        pagination: {
          page: 1,
          limit: all.length,
          total: all.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      console.error('❌ Error fetching multiple pages:', error);
      throw error;
    }
  }

  getFund(id: string) {
    return this.request(`/api/funds/${id}`);
  }

  // Market indices
  getIndices() {
    return this.request('/api/market-indices');
  }

  // Compare multiple funds
  compareFunds(fundIds: string[]) {
    return this.request('/api/comparison/funds', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  // Analyze portfolio overlap
  analyzeFundOverlap(fundIds: string[]) {
    return this.request('/api/overlap', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  // AI Chat
  chat(message: string, context?: any) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  // Calculators
  calculateSIP(params: {
    monthlyInvestment: number;
    annualReturnRate: number;
    investmentPeriod: number;
  }) {
    return this.request('/api/calculator/sip', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  calculateLumpsum(params: {
    investmentAmount: number;
    annualReturnRate: number;
    investmentPeriod: number;
  }) {
    return this.request('/api/calculator/lumpsum', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Get fund NAV history
  getFundNavs(fundId: string, from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/funds/${fundId}/navs${query}`);
  }

  // Get fund manager details
  getFundManager(fundId: string) {
    return this.request(`/api/funds/${fundId}/manager`);
  }

  // Get fund holdings
  getFundHoldings(fundId: string, limit = 15) {
    return this.request(`/api/funds/${fundId}/holdings?limit=${limit}`);
  }

  // Get fund sector allocation
  getFundSectors(fundId: string) {
    return this.request(`/api/funds/${fundId}/sectors`);
  }

  // Get complete fund details (with holdings, sectors, manager)
  getFundDetails(fundId: string) {
    return this.request(`/api/funds/${fundId}/details`);
  }

  // News
  getNews(category?: string, limit = 10) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    return this.request(`/api/news/latest?${params.toString()}`);
  }

  // ✅ NEW: Health check
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      return false;
    }
  }

  // ✅ NEW: Search/autocomplete
  async searchFunds(query: string) {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    try {
      const response = await this.request(
        `/api/search/suggest?query=${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error('❌ Search error:', error);
      return { success: false, data: [], error: 'Search failed' };
    }
  }
}

export const api = new ApiClient();
export const apiClient = api; // Backward compatibility
