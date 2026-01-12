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

export type Memory = {
  id: string;
  projectId: string;
  projectName: string;
  phase: string;
  level: string;
  content: string;
  isLocked: boolean;
  createdAt: string;
};
