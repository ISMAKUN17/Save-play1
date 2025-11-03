'use client';

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { useDatabase } from '../provider';

// This hook listens to a single object of data at a specific path.
export function useObject<T>(path: string) {
  const db = useDatabase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const dbRef = ref(db, path);

    const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
            setData({ id: snapshot.key, ...snapshot.val() } as T);
        } else {
            setData(null);
        }
        setLoading(false);
    }, (err) => {
        console.error('Error fetching object:', err);
        setError(err);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [db, path]);

  return { data, loading, error };
}
