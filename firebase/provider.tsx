'use client';

import {FirebaseApp} from 'firebase/app';
import {Auth} from 'firebase/auth';
import {Database} from 'firebase/database';
import React, {createContext, useContext} from 'react';

// Define the shape of the context
interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  database: Database;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

// Create a provider component
export function FirebaseProvider({
  children,
  firebaseApp,
  auth,
  database,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  database: Database;
}) {
  return (
    <FirebaseContext.Provider value={{firebaseApp, auth, database}}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to use the Firebase context
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().firebaseApp;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useDatabase() {
  return useFirebase().database;
}
