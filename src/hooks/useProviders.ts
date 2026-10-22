import { useState, useEffect, useCallback } from 'react';
import type { Provider } from '../types';
import { queryCollectionDocs, getCollectionDocs } from '../services/firebase';

interface UseProvidersOptions {
  category?: string;
  city?: string;
}

export const useProviders = ({ category, city }: UseProvidersOptions = {}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: any[] = [];
      if (category) {
        data = await queryCollectionDocs('providers', 'category', '==', category);
      } else {
        data = await getCollectionDocs('providers');
      }

      if (city) {
        data = data.filter((p: any) => p.city?.toLowerCase() === city.toLowerCase());
      }

      setProviders(data as Provider[]);
    } catch (err: any) {
      console.error('Error fetching providers:', err);
      setError(err?.message || 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  }, [category, city]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return { providers, setProviders, loading, error, refetch: fetchProviders };
};
