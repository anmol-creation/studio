'use server';

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
} from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '@/firebase/config';

type MemoryEntry = {
  title: string;
  created: string;
  updated: string;
  content: string[];
  importance: 'Low' | 'Medium' | 'High';
  ownerApproved: boolean;
};

// Initialize Firebase app if it hasn't been already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function saveMemory(
  project: string,
  phase: number,
  level: number,
  entry: MemoryEntry
) {
  if (entry.ownerApproved !== true) {
    console.log('Memory not saved: owner approval is required.');
    return;
  }

  const collectionPath = `memory_projects/${project}/phases/${phase}/levels/${level}/entries`;
  const entriesCollection = collection(db, collectionPath);

  try {
    const docRef = await addDoc(entriesCollection, entry);
    console.log('Memory entry saved successfully with ID: ', docRef.id);
  } catch (error) {
    console.error('Error saving memory entry: ', error);
  }
}

export async function getMemory(project: string) {
  console.log('Fetching memory for:', project);
  // Placeholder implementation for fetching all entries for a project.
  // A more complex query would be needed to traverse all subcollections.
  // For now, this is a simplified example.
  try {
    const q = query(collection(db, `memory_projects/${project}/phases/1/levels/1/entries`));
    const querySnapshot = await getDocs(q);
    const memories: MemoryEntry[] = [];
    querySnapshot.forEach((doc) => {
        memories.push(doc.data() as MemoryEntry);
    });
    console.log(`Successfully fetched ${memories.length} memories.`);
    return memories;
  } catch (error) {
    console.error("Error fetching memory:", error);
    return [];
  }
}
