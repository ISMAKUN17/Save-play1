'use client';
import React, {createContext, useContext, useEffect, useState} from 'react';

import {FirebaseApp} from 'firebase/app';
import {Auth} from 'firebase/auth';
import {Database} from 'firebase/database';

import {initializeFirebase} from './index';
import {FirebaseProvider} from './provider';
import { Preloader } from '@/components/preloader';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    auth: Auth;
    database: Database;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      const firebaseInstance = await initializeFirebase();
      setFirebase(firebaseInstance);
    };

    init();
  }, []);

  if (!firebase) {
    // While the firebase instance is initializing, we show the preloader in its "loading" state.
    return <Preloader loading={true} />;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebase.app}
      auth={firebase.auth}
      database={firebase.database}
    >
      {children}
    </FirebaseProvider>
  );
}
