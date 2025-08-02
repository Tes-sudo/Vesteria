/**
 * Migration wrapper to gradually move from React Query to Convex
 * This allows us to switch between implementations without breaking the app
 */

import { usePosts as usePostsReactQuery } from './use-posts';
import { usePosts as usePostsConvex, shouldUseConvex } from './convex-posts';

export function usePosts() {
  const USE_CONVEX = shouldUseConvex();
  
  if (USE_CONVEX) {
    return usePostsConvex();
  }
  
  // Map React Query response to match Convex format
  const reactQueryResult = usePostsReactQuery();
  return {
    data: reactQueryResult.data,
    isLoading: reactQueryResult.isLoading,
    error: reactQueryResult.error,
  };
}

// Export all other hooks with similar pattern
export { usePost, useCreatePost, useUpdatePost, useDeletePost } from './convex-posts';