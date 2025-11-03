'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { useDatabase } from '../provider';

// This hook listens to a list of data at a specific path
export function useList<T>(path: string | null) {
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

    // Check if the data type is likely to have a 'date' or 'createdAt' field for sorting
    // This is a heuristic. For a more robust solution, you might pass the orderBy field as an arg.
    const dataRef = query(ref(db, path), orderByChild('date'));

    const unsubscribe = onValue(dataRef, (snapshot) => {
        const items: T[] = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                items.push({ id: childSnapshot.key, ...childSnapshot.val() } as T);
            });
        }
        
        // Firebase returns items sorted ascending by date, we want descending (most recent first)
        setData(items.reverse());
        setLoading(false);
    }, (err) => {
        console.error(`Error fetching list at ${path}:`, err);
        setError(err);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [db, path]);

  return { data, loading, error };
}
