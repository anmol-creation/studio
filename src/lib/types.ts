import { DocumentData, Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  initials: string;
};

export type Project = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  author: User;
  content: string;
  timestamp: string;
};

export type Memory = DocumentData & {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  phase?: string;
  level?: string;
  content: string | string[];
  isLocked?: boolean;
  ownerApproved?: boolean;
  importance?: 'Low' | 'Medium' | 'High';
  created: string | Timestamp;
  updated: string | Timestamp;
};
