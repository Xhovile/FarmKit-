import { useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../lib/api';

interface AccountRoleStats {
  savedCount: number;
  totalDemands: number;
  openDemands: number;
  matchedDemands: number;
  closedDemands: number;
  totalListings: number;
  activeListings: number;
  soldListings: number;
  hiddenListings: number;
  lowStockListings: number;
}

const emptyStats: AccountRoleStats = {
  savedCount: 0,
  totalDemands: 0,
  openDemands: 0,
  matchedDemands: 0,
  closedDemands: 0,
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
        console.log(`[useAccountRoleStats] Fetching stats for user ${user?.uid}...`);
        const data = await api.get('/api/users/me/stats');
        console.log(`[useAccountRoleStats] Stats received:`, data);
        setStats(data as AccountRoleStats);
      } catch (error: any) {
        console.error('Error loading account stats:', error);
        if (error.message === 'Failed to fetch') {
          console.error('[useAccountRoleStats] Network error - the server might be unreachable or the request was blocked.');
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [user?.uid]);

  return stats;
};
