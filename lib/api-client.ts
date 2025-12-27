const RAW = process.env.NEXT_PUBLIC_API_URL!;
const API_BASE = RAW.replace(/\/api\/?$/, '').replace(/\/$/, '');

class ApiClient {
  async request(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  getFunds(page = 1, limit = 1000) {
    return this.request(`/api/funds?page=${page}&limit=${limit}`);
  }

  async getFundsMultiPage(targetCount = 4000) {
    let all: any[] = [];
    let page = 1;
    const limit = 200;

    while (all.length < targetCount) {
      const res = await this.getFunds(page, limit);
      all.push(...res.data);
      if (!res.pagination?.hasNext) break;
      page++;
    }

    return { data: all };
  }

  getFund(id: string) {
    return this.request(`/api/funds/${id}`);
  }

  getIndices() {
    return this.request('/api/indices');
  }

  compareFunds(fundIds: string[]) {
    return this.request('/api/compare', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  overlapFunds(fundIds: string[]) {
    return this.request('/api/overlap', {
      method: 'POST',
      body: JSON.stringify({ fundIds }),
    });
  }

  chat(message: string) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const api = new ApiClient();
export const apiClient = api; // Backward compatibility
