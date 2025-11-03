'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { useDatabase } from '../provider';

// This hook listens to a list of data at a specific path
export function useList<T>(path: string | null, orderBy: string = 'date') {
  const db = useDatabase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    if (!path) {
        setData([]);
        setLoading(false);
        return;
    };

    const dataRef = query(ref(db, path), orderByChild(orderBy));

    const unsubscribe = onValue(dataRef, (snapshot) => {
        const items: T[] = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                items.push({ id: childSnapshot.key, ...childSnapshot.val() } as T);
            });
        }
        
        // If ordering by date, we want descending (most recent first)
        if (orderBy === 'date') {
          setData(items.reverse());
        } else {
          setData(items);
        }
        setLoading(false);
    }, (err) => {
        console.error(`Error fetching list at ${path}:`, err);
        setError(err);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [db, path, orderBy]);

  return { data, loading, error };
}
