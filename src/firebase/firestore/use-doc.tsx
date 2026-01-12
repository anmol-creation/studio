'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference, DocumentData, FirestoreError } from 'firebase/firestore';

interface UseDocReturn<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useDoc<T extends DocumentData>(ref: DocumentReference | null): UseDocReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      setData(null);
      return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching document:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
