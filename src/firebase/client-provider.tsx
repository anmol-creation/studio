'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import React, { Suspense } from 'react';
import { FirebaseProvider } from './provider';
import firebaseConfig from './config';

let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FirebaseProvider app={firebaseApp} auth={auth} db={db}>
        {children}
      </FirebaseProvider>
    </Suspense>
  );
}
