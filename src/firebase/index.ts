import {getApp, getApps, initializeApp, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getDatabase, type Database} from 'firebase/database';

import {firebaseConfig} from './config';

let app: FirebaseApp;
let auth: Auth;
export let database: Database;

export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  database: Database;
} {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    database = getDatabase(app);
  }
  return {app, auth, database};
}

export {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useDatabase,
  useAuth,
} from './provider';

export {FirebaseClientProvider} from './client-provider';

export {useUser} from './auth/use-user';
export {useList} from './database/use-list';
export {useObject} from './database/use-object';
