import type { User, Project, Message, Memory } from './types';

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
  {
    id: 'msg-2',
    author: users['user-1'],
    content: 'Hi Ani! Can you tell me a fun fact about space?',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 'msg-3',
    author: users['ai-1'],
    content: 'Of course! Did you know that a day on Venus is longer than its year? It takes Venus longer to rotate once on its axis than to complete one orbit of the Sun.',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
];

export const memories: Memory[] = [
  {
    id: 'mem-1',
    projectId: 'proj-1',
    projectName: 'Personal Assistant',
    phase: 'Discovery',
    level: 'Level 1',
    content: 'User is interested in fun facts about space.',
    isLocked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'mem-2',
    projectId: 'proj-2',
    projectName: 'Work Project X',
    phase: 'Research',
    level: 'Level 2',
    content: 'Initial research on competitor A shows a strong market presence in Europe.',
    isLocked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
    {
    id: 'mem-3',
    projectId: 'proj-3',
    projectName: 'Creative Writing',
    phase: 'Brainstorming',
    level: 'Level 1',
    content: 'Idea for a sci-fi story: a sentient planet that communicates through weather patterns.',
    isLocked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'mem-4',
    projectId: 'proj-1',
    projectName: 'Personal Assistant',
    phase: 'Learning',
    level: 'Level 3',
    content: 'User prefers concise answers.',
    isLocked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];
