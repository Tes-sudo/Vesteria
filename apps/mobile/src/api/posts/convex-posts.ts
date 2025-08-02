import { useQuery, useMutation } from "convex/react";
import { api } from "@monorepo/convex";
import type { Doc } from "@monorepo/convex";

export function usePosts() {
  const posts = useQuery(api.posts.list);
  
  return {
    data: posts,
    isLoading: posts === undefined,
    error: posts === null ? new Error("Failed to load posts") : null,
  };
}

export function usePost(postId: string) {
  const post = useQuery(
    api.posts.get, 
    postId ? { postId: postId as any } : "skip"
  );
  
  return {
    data: post,
    isLoading: post === undefined,
    error: post === null ? new Error("Post not found") : null,
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