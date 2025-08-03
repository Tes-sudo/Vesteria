import type { Id } from '@monorepo/convex';

export type Post = {
  _id: Id<'posts'>;
  title: string;
  content: string;
  authorId: Id<'users'>;
  createdAt: number;
  updatedAt: number;
  _creationTime: number;
  author?: {
    id: Id<'users'>;
    name: string;
    email?: string;
  } | null;
  // Legacy compatibility
  id: string;
  body: string;
  userId: string;
};
