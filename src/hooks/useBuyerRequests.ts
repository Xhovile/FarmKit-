import { useEffect, useState } from 'react';
import { BuyerRequest, User } from '../types';
import { api } from '../lib/api';

export const useBuyerRequests = (user: User | null) => {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const data = await api.get('/api/buyer-requests');
        const items = data as BuyerRequest[];

        items.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setRequests(items);
      } catch (error) {
        console.error('Error loading buyer requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [user?.uid]);

  return { requests, loading };
};
