import type { User, Project, Message, Memory } from './types';

// Mock data is being phased out in favor of live Firestore data.
// It is kept here for reference or fallback during development.

export const users: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: 'Ani',
    avatarUrl: 'https://picsum.photos/seed/1/100/100',
    initials: 'AN',
  },
  'ai-1': {
    id: 'ai-1',
    name: 'Ani AI',
    avatarUrl: '/logo.svg', // Will use an SVG for the AI
    initials: 'AI',
  },
};

export const projects: Project[] = [
  { id: 'proj-1', name: 'Personal Assistant' },
  { id: 'proj-2', name: 'Work Project X' },
  { id: 'proj-3', name: 'Creative Writing' },
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    author: users['ai-1'],
    content: 'Hello! I am Ani AI, your personal assistant. How can I help you today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

export const memories: Memory[] = []; // This is now fetched from Firestore
