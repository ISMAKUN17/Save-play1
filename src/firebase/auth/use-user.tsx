
'use client';

import {useEffect, useState} from 'react';
import {onAuthStateChanged, User, signInAnonymously} from 'firebase/auth';
import {ref, set, get, serverTimestamp, update} from 'firebase/database';

import {useAuth, useDatabase} from '../provider';

export function useUser() {
  const auth = useAuth();
  const database = useDatabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !database) return;

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // User is signed in.
        const userRef = ref(database, `users/${userAuth.uid}`);
        
        try {
          const userSnap = await get(userRef);
          
          if (!userSnap.exists()) {
            // If user profile doesn't exist, create it.
            await set(userRef, {
              uid: userAuth.uid,
              email: userAuth.email,
              displayName: userAuth.displayName || userAuth.email?.split('@')[0] || 'Anonymous Player',
              lastLogin: serverTimestamp(),
              createdAt: serverTimestamp(),
            });
          } else {
              // If user exists, update last login
              await update(userRef, {
                  lastLogin: serverTimestamp(),
              });
          }
          setUser(userAuth);
        } catch(error) {
          console.error("Error accessing user data:", error);
          setUser(null);
        }
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, database]);

  return {user, loading};
}
