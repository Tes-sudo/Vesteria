# Convex Migration Implementation Guide

## Overview
This guide details how to migrate from the current REST API + React Query architecture to Convex's real-time reactive architecture.

## Phase 1: Core Setup (Priority: HIGH)

### 1.1 Environment Configuration

First, update the environment files to include Convex configuration:

```bash
# apps/mobile/.env.development
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

Update `apps/mobile/src/env.js`:
```typescript
const client = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  API_URL: z.string().url(),
  EXPO_PUBLIC_CONVEX_URL: z.string().url(), // Add this
  // ... other env vars
});
```

### 1.2 Install Convex Client Dependencies

```bash
cd apps/mobile
pnpm add convex@latest @convex-dev/auth@latest
```

### 1.3 Create Convex Client Configuration

Create `apps/mobile/src/lib/convex.ts`:
```typescript
import { ConvexReactClient } from "convex/react";
import { Env } from "@env";

export const convex = new ConvexReactClient(Env.EXPO_PUBLIC_CONVEX_URL);
```

### 1.4 Update App Root Provider

Update `apps/mobile/src/app/_layout.tsx`:
```tsx
import { ConvexProvider } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convex } from "@/lib/convex";

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ConvexProvider client={convex}>
          <ConvexAuthProvider>
            <ThemeProvider value={theme}>
              {/* Remove APIProvider - no longer needed */}
              <BottomSheetModalProvider>
                {children}
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </ThemeProvider>
          </ConvexAuthProvider>
        </ConvexProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
```

## Phase 2: Convex Backend Setup

### 2.1 Update Schema with Real Tables

Update `packages/convex/convex/schema.ts`:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_creation", ["createdAt"]),
  
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),
});
```

### 2.2 Create Posts Functions

Create `packages/convex/convex/posts.ts`:
```typescript
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all posts
export const list = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    
    // Enrich with author data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          author: author ? {
            id: author._id,
            name: author.name,
            email: author.email,
          } : null,
        };
      })
    );
    
    return enrichedPosts;
  },
});

// Get single post
export const get = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const post = await ctx.db.get(postId);
    if (!post) return null;
    
    const author = await ctx.db.get(post.authorId);
    return {
      ...post,
      author: author ? {
        id: author._id,
        name: author.name,
        email: author.email,
      } : null,
    };
  },
});

// Create post
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { title, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const postId = await ctx.db.insert("posts", {
      title,
      content,
      authorId: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return postId;
  },
});

// Update post
export const update = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { postId, title, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Not authorized");
    
    await ctx.db.patch(postId, {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      updatedAt: Date.now(),
    });
  },
});

// Delete post
export const remove = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Not authorized");
    
    await ctx.db.delete(postId);
  },
});
```

### 2.3 Generate API Types

```bash
cd packages/convex
npx convex dev
```

This generates typed API in `packages/convex/convex/_generated/api.ts`.

## Phase 3: Migrate Authentication

### 3.1 Create New Auth Hook

Create `apps/mobile/src/lib/auth/convex-auth.tsx`:
```typescript
import { useAuthActions, useAuthUser } from "@convex-dev/auth/react";
import { useCallback } from "react";
import { router } from "expo-router";

export function useConvexAuth() {
  const { signIn, signOut } = useAuthActions();
  const user = useAuthUser();
  
  const handleSignIn = useCallback(async (email: string) => {
    try {
      await signIn("resend-magic-link", { email });
      // Magic link will be sent
      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error };
    }
  }, [signIn]);
  
  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace("/login");
  }, [signOut]);
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}

// Replace the Zustand exports
export const useAuth = useConvexAuth;
export const signOut = () => {
  // This will be called from outside components
  // We need to handle this differently
  console.warn("Use useAuth hook for sign out");
};
```

### 3.2 Update Login Screen

Update `apps/mobile/src/app/login.tsx` to use Convex auth:
```tsx
import { useAuth } from '@/lib/auth/convex-auth';

export default function Login() {
  const { signIn, isLoading } = useAuth();
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data: FormType) => {
    const result = await signIn(data.email);
    if (result.success) {
      showMessage({
        message: "Check your email for the magic link!",
        type: "success",
      });
    } else {
      showMessage({
        message: "Failed to send magic link",
        type: "danger",
      });
    }
  };
  
  // Rest of the component remains the same
}
```

### 3.3 Update Auth Guard

Update auth checks throughout the app to use Convex:
```tsx
// In protected routes
import { useAuth } from '@/lib/auth/convex-auth';

export default function ProtectedScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }
  
  // Protected content
}
```

## Phase 4: Migrate Features (Posts Example)

### 4.1 Create Convex Hooks

Create `apps/mobile/src/api/posts/convex-posts.ts`:
```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@monorepo/convex";

export function usePosts() {
  const posts = useQuery(api.posts.list);
  
  return {
    data: posts,
    isLoading: posts === undefined,
    error: posts === null ? new Error("Failed to load posts") : null,
  };
}

export function usePost(postId: string) {
  const post = useQuery(api.posts.get, { postId: postId as any });
  
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
```

### 4.2 Update Components

Update components to use Convex hooks:
```tsx
// Before (React Query)
import { usePosts } from '@/api/posts/use-posts';

// After (Convex)
import { usePosts } from '@/api/posts/convex-posts';

export function PostsList() {
  const { data: posts, isLoading, error } = usePosts();
  
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading posts</Text>;
  if (!posts) return <Text>No posts</Text>;
  
  return (
    <FlashList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      keyExtractor={(item) => item._id}
    />
  );
}
```

## Phase 5: Gradual Migration Strategy

### 5.1 Feature Migration Order

1. **Authentication** (Critical - blocks everything else)
2. **User Profile** (Simple, good test case)
3. **Posts/Feed** (Core feature, validates real-time)
4. **Comments** (Tests relationships)
5. **Complex Features** (As needed)

### 5.2 Parallel Operation

During migration, both systems can work side-by-side:
```tsx
// Temporary wrapper to migrate gradually
export function usePostsData() {
  const USE_CONVEX = process.env.EXPO_PUBLIC_USE_CONVEX === 'true';
  
  const convexPosts = useQuery(
    USE_CONVEX ? api.posts.list : "skip"
  );
  const reactQueryPosts = usePostsReactQuery({
    enabled: !USE_CONVEX,
  });
  
  return USE_CONVEX ? convexPosts : reactQueryPosts.data;
}
```

### 5.3 Testing Strategy

1. **Unit Tests**: Mock Convex hooks
```tsx
jest.mock("convex/react", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));
```

2. **Integration Tests**: Use Convex test environment
3. **E2E Tests**: Point to staging Convex deployment

## Phase 6: Cleanup

### 6.1 Remove Old Dependencies

Once all features are migrated:
```bash
cd apps/mobile
pnpm remove @tanstack/react-query react-query-kit axios
```

### 6.2 Remove Old Code

- Delete `src/api/common/client.tsx`
- Delete `src/api/common/api-provider.tsx`
- Delete all `use-*.ts` files using React Query
- Update `src/lib/auth/index.tsx` to remove Zustand

### 6.3 Update Types

Remove API types and use Convex generated types:
```typescript
// Before
import type { Post } from '@/api/posts/types';

// After
import type { Doc } from "@monorepo/convex/_generated/dataModel";
type Post = Doc<"posts">;
```

## Real-time Features to Highlight

### Live Updates
```tsx
// Posts automatically update when changed by any user
export function LiveFeed() {
  const posts = useQuery(api.posts.list); // Auto-refreshes!
  
  return <PostsList posts={posts} />;
}
```

### Optimistic Updates
```tsx
const createPost = useMutation(api.posts.create);

// Optimistic update happens automatically
await createPost({ title, content });
// UI updates immediately, rolls back on error
```

### Presence/Typing Indicators
```typescript
// In Convex function
export const setTyping = mutation({
  args: { isTyping: v.boolean() },
  handler: async (ctx, { isTyping }) => {
    const userId = await getAuthUserId(ctx);
    // Store typing state with TTL
  },
});
```

## Performance Benefits

1. **No More Cache Management**: Convex handles it
2. **Automatic Deduplication**: Multiple components can query same data
3. **Smart Updates**: Only affected queries re-run
4. **Offline Support**: Built-in with optimistic updates
5. **Real-time by Default**: No polling or WebSocket setup

## Common Pitfalls & Solutions

### Loading States
```tsx
// Convex returns undefined while loading
const posts = useQuery(api.posts.list);
const isLoading = posts === undefined;
const hasError = posts === null;
```

### Type Safety
```typescript
// Always use generated types
import { api } from "@monorepo/convex";
import type { Doc, Id } from "@monorepo/convex/_generated/dataModel";
```

### Error Handling
```tsx
try {
  await createPost({ title, content });
} catch (error) {
  // Convex throws on server errors
  showError(error.message);
}
```

## Success Metrics

- [ ] All API calls replaced with Convex functions
- [ ] React Query completely removed
- [ ] Real-time updates working
- [ ] Authentication fully migrated
- [ ] No performance regressions
- [ ] Type safety maintained throughout

## Next Steps

1. Start with Phase 1 (Core Setup)
2. Deploy Convex backend with test data
3. Migrate auth (most critical)
4. Pick one simple feature to validate approach
5. Gradually migrate remaining features
6. Remove old code once stable