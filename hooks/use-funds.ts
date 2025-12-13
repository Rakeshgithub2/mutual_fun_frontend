import { useState, useEffect } from 'react';
import { apiClient, Fund, FundDetails } from '@/lib/api-client';

export function useFunds(filters?: {
  query?: string;
  type?: string;
  category?: string;
  subCategory?: string;
  page?: number;
  limit?: number;
}) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      setLoading(true);
      setError(null);
      try {
        const BASE_URL = 'https://mutualfun-backend.vercel.app'; // no trailing /
        console.log('🔍 [useFunds] Fetching with filters:', filters);
        console.log(
          '🌐 [useFunds] API Base URL:',
          process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`
        );
        const response = await apiClient.getFunds(filters);
        console.log(
          '✅ [useFunds] Response received:',
          response.data.length,
          'funds'
        );
        setFunds(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err as Error);
        console.error('❌ [useFunds] Failed to fetch funds:', err);
        console.error('❌ [useFunds] Error details:', {
          message: (err as Error).message,
          name: (err as Error).name,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, [JSON.stringify(filters)]);

  return { funds, pagination, loading, error };
}

export function useFundDetails(fundId: string | null) {
  const [fund, setFund] = useState<FundDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fundId) {
      setFund(null);
      setLoading(false);
      return;
    }

    const fetchFund = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getFundById(fundId);
        setFund(response.data);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch fund details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFund();
  }, [fundId]);

  return { fund, loading, error };
}

export function useSuggestions(query: string, debounceMs: number = 300) {
  const [suggestions, setSuggestions] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getSuggestions(query);
        setSuggestions(response.data.suggestions);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);

  return { suggestions, loading, error };
}
