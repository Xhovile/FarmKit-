import { useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../lib/api';

interface AccountRoleStats {
  savedCount: number;
  totalRequests: number;
  openRequests: number;
  matchedRequests: number;
  closedRequests: number;
  totalListings: number;
  activeListings: number;
  soldListings: number;
  hiddenListings: number;
  lowStockListings: number;
}

const emptyStats: AccountRoleStats = {
  savedCount: 0,
  totalRequests: 0,
  openRequests: 0,
  matchedRequests: 0,
  closedRequests: 0,
  totalListings: 0,
  activeListings: 0,
  soldListings: 0,
  hiddenListings: 0,
  lowStockListings: 0,
};

export const useAccountRoleStats = (user: User | null) => {
  const [stats, setStats] = useState<AccountRoleStats>(emptyStats);

  useEffect(() => {
    if (!user?.uid) {
      setStats(emptyStats);
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await api.get('/api/users/me/stats');
        setStats(data as AccountRoleStats);
      } catch (error) {
        console.error('Error loading account stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [user?.uid]);

  return stats;
};
