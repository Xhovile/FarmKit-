import { useEffect, useState } from 'react';
import { MarketListing, User } from '../types';
import { api } from '../lib/api';

export const useSavedListings = (user: User | null) => {
  const [items, setItems] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    const fetchSavedListings = async () => {
      try {
        const data = await api.get('/api/saved-listings');
        const listings = (data as any[]).map(item => ({
          ...item,
          id: item.listing_id, // Map listing_id to id for the UI
          savedAt: item.saved_at ? { seconds: Math.floor(new Date(item.saved_at).getTime() / 1000) } : null,
        })) as MarketListing[];

        setItems(listings);
      } catch (error) {
        console.error('Error loading saved listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedListings();
    const interval = setInterval(fetchSavedListings, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [user?.uid]);

  return { items, loading };
};
