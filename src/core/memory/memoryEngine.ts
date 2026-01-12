'use server';

type MemoryEntry = {
  title: string;
  created: string;
  updated: string;
  content: string[];
  importance: "Low" | "Medium" | "High";
  ownerApproved: boolean;
};

export async function saveMemory(
  project: string,
  phase: number,
  level: number,
  entry: MemoryEntry
) {
  console.log("Saving memory:", { project, phase, level, entry });
}

export async function getMemory(project: string) {
  console.log("Fetching memory for:", project);
}
