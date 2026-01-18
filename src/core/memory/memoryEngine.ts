import {
  collection,
  addDoc,
  getDocs,
  query,
  Firestore,
} from 'firebase/firestore';

type MemoryEntry = {
  title: string;
  created: string;
  updated: string;
  content: string[];
  importance: 'Low' | 'Medium' | 'High';
  ownerApproved: boolean;
};

export async function saveMemory(
  db: Firestore,
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

export async function getMemory(db: Firestore, project: string) {
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
