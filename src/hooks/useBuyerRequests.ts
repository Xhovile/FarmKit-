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
        const items = (data as any[]).map(item => ({
          ...item,
          createdAt: item.created_at ? { seconds: Math.floor(new Date(item.created_at).getTime() / 1000) } : null,
          updatedAt: item.updated_at ? { seconds: Math.floor(new Date(item.updated_at).getTime() / 1000) } : null,
        })) as BuyerRequest[];

        items.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
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
