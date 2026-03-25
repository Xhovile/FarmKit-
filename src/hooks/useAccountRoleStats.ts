import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BuyerRequest, MarketListing, User } from '../types';

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

    const unsubscribers: Array<() => void> = [];

    const listingsQuery = query(
      collection(db, 'market_listings'),
      where('sellerId', '==', user.uid)
    );

    const unsubscribeListings = onSnapshot(
      listingsQuery,
      (snapshot) => {
        const listings = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as MarketListing[];

        setStats((prev) => ({
          ...prev,
          totalListings: listings.length,
          activeListings: listings.filter((item) => item.status === 'active').length,
          soldListings: listings.filter((item) => item.status === 'sold').length,
          hiddenListings: listings.filter((item) => item.status === 'hidden').length,
          lowStockListings: listings.filter((item) => item.stockStatus === 'low_stock').length,
        }));
      },
      (error) => {
        console.error('Error loading listing stats:', error);
      }
    );

    unsubscribers.push(unsubscribeListings);

    const requestsQuery = query(
      collection(db, 'buyer_requests'),
      where('buyerId', '==', user.uid)
    );

    const unsubscribeRequests = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const requests = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as BuyerRequest[];

        setStats((prev) => ({
          ...prev,
          totalRequests: requests.length,
          openRequests: requests.filter((item) => item.status === 'open').length,
          matchedRequests: requests.filter((item) => item.status === 'matched').length,
          closedRequests: requests.filter((item) => item.status === 'closed').length,
        }));
      },
      (error) => {
        console.error('Error loading buyer request stats:', error);
      }
    );

    unsubscribers.push(unsubscribeRequests);

    const savedListingsRef = collection(db, 'users', user.uid, 'saved_listings');

    const unsubscribeSaved = onSnapshot(
      savedListingsRef,
      (snapshot) => {
        setStats((prev) => ({
          ...prev,
          savedCount: snapshot.size,
        }));
      },
      (error) => {
        console.error('Error loading saved listing stats:', error);
      }
    );

    unsubscribers.push(unsubscribeSaved);

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [user?.uid]);

  return stats;
};
