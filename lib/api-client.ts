const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// 🔒 Ensure no trailing /api or slash
const API_BASE_URL = RAW_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

console.log('🌐 API Base URL configured:', API_BASE_URL);

function buildSafeQueryParams(
  params?: Record<string, any>
): Record<string, string> {
  const safe: Record<string, string> = {};
  if (!params) return safe;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      safe[key] = String(value);
    }
  });

  return safe;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('🌐 API Request:', url);

    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status}: ${text}`);
    }

    return res.json();
  }

  // ---------------------------------------
  // FUND APIs
  // ---------------------------------------

  async getFunds(params?: { page?: number; limit?: number }) {
    const q = new URLSearchParams(buildSafeQueryParams(params)).toString();
    return this.request(`/api/funds${q ? `?${q}` : ''}`);
  }

  // ✅ THIS FIXES YOUR ERROR
  async getFundsMultiPage(params?: { targetCount?: number }) {
    const MAX = 100;
    const target = params?.targetCount || 500;
    const pages = Math.ceil(target / MAX);

    let allFunds: any[] = [];
    let lastPagination: any = null;

    for (let page = 1; page <= pages; page++) {
      const res: any = await this.getFunds({ page, limit: MAX });
      allFunds.push(...res.data);
      lastPagination = res.pagination;

      if (!res.pagination?.hasNext) break;
    }

    return {
      data: allFunds,
      pagination: lastPagination,
    };
  }

  async getFundById(id: string) {
    return this.request(`/api/funds/${id}`);
  }

  // ---------------------------------------
  // ANALYSIS APIs
  // ---------------------------------------

  async compareFunds(fundIds: string[]) {
    return this.request('/api/compare', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  async overlapFunds(fundIds: string[]) {
    return this.request('/api/overlap', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }
}

export const apiClient = new ApiClient();
