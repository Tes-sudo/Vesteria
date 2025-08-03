import { api } from '@monorepo/convex';
import { useMutation, useQuery } from 'convex/react';

export function usePosts() {
  const posts = useQuery(api.posts.list);

  // Map Convex data to match the Post type with legacy compatibility
  const mappedPosts = posts?.map((post) => ({
    ...post,
    id: post._id,
    body: post.content,
    userId: post.authorId,
  }));

  return {
    data: mappedPosts,
    isLoading: posts === undefined,
    error: posts === null ? new Error('Failed to load posts') : null,
  };
}

export function usePost(postId: string) {
  const post = useQuery(
    api.posts.get,
    postId ? { postId: postId as any } : 'skip'
  );

  // Map Convex data to match the Post type with legacy compatibility
  const mappedPost = post
    ? {
        ...post,
        id: post._id,
        body: post.content,
        userId: post.authorId,
      }
    : post;

  return {
    data: mappedPost,
    isLoading: post === undefined,
    error: post === null ? new Error('Post not found') : null,
  };
}

export function useCreatePost() {
  const createPost = useMutation(api.posts.create);

  return {
    mutate: createPost,
    mutateAsync: createPost,
  };
}

export function useUpdatePost() {
  const updatePost = useMutation(api.posts.update);

  return {
    mutate: updatePost,
    mutateAsync: updatePost,
  };
}

export function useDeletePost() {
  const deletePost = useMutation(api.posts.remove);

  return {
    mutate: deletePost,
    mutateAsync: deletePost,
  };
}

// Helper function to check if we should use Convex or React Query
export function shouldUseConvex() {
  // This can be controlled via env variable during migration
  return process.env.EXPO_PUBLIC_USE_CONVEX === 'true' || true; // Default to true
}
