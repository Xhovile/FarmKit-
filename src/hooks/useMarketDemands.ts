import { useEffect, useState } from 'react';
import { MarketDemand, User } from '../types';
import { api } from '../lib/api';

export const useMarketDemands = (user: User | null) => {
  const [demands, setDemands] = useState<MarketDemand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setDemands([]);
      setLoading(false);
      return;
    }

    const fetchDemands = async () => {
      try {
        const data = await api.get('/api/market-demands');
        const items = data as MarketDemand[];

        items.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setDemands(items);
      } catch (error) {
        console.error('Error loading market demands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
    const interval = setInterval(fetchDemands, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [user?.uid]);

  return { demands, loading };
};
