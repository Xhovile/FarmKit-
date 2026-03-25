import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MarketListing, User } from '../types';

export const useSavedListings = (user: User | null) => {
  const [items, setItems] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, 'users', user.uid, 'saved_listings');

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MarketListing[];

        setItems(listings);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading saved listings:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { items, loading };
};
