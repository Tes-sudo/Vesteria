# Claude Rules for Vesteria Monorepo

## Primary Directive: Use Context7 MCP for Documentation

**ALWAYS** use the Context7 MCP tool (`mcp__context7__`) when users ask about:
- Framework documentation (React Native, Convex, Expo)
- Library usage (React Query, Zustand, NativeWind)
- API references
- Best practices for any technology in the stack

### How to Use Context7

1. First, resolve the library ID:
```
mcp__context7__resolve-library-id with libraryName: "convex"
```

2. Then fetch documentation:
```
mcp__context7__get-library-docs with context7CompatibleLibraryID and topic
```

## Critical Architecture Decision: Convex is Now Integrated ✅

### IMPORTANT: Current Architecture

**Current State (CORRECT)**:
- Convex is fully integrated and operational
- ConvexProvider and ConvexAuthProvider are set up
- Real-time features are working
- TypeScript API is generated and typed

**Architecture Rules**:
- ALL server state MUST use Convex reactive queries
- DO NOT use React Query for ANY new features
- DO NOT use Axios for API calls
- Authentication MUST use Convex Auth

### For New Features
When implementing ANY feature that needs server data:
1. Create Convex functions in `packages/convex/convex/`
2. Use `useQuery` for data fetching (real-time by default)
3. Use `useMutation` for data modifications
4. Let Convex handle all caching and subscriptions

## Project-Specific Rules

### 1. Code Style
- Use functional components with TypeScript
- Keep components under 80 lines
- Use kebab-case for file names
- Import UI components from `@/components/ui`
- Use NativeWind classes for styling

### 2. State Management Hierarchy
1. **Server State**: Use Convex reactive queries (useQuery/useMutation)
2. **Global UI State**: Use Zustand (theme, modals, navigation ONLY)
3. **Form State**: Use React Hook Form with Zod
4. **Local State**: Use React useState/useReducer
5. **Auth State**: Use Convex Auth hooks (useAuth from convex-auth.tsx)

### 3. Environment Variables
- Client-side variables MUST be prefixed with `EXPO_PUBLIC_`
- Always validate with Zod in `env.js`
- Run `pnpm prebuild` after environment changes

### 4. Testing Strategy
- Write tests for utilities and complex components
- Name test files as `component-name.test.tsx`
- Use React Native Testing Library
- Mock heavy dependencies (bottom-sheet, gesture-handler)

### 5. Monorepo Commands
- Always use `pnpm` (not npm or yarn)
- Use workspace filters: `pnpm --filter @monorepo/mobile`
- Run `pnpm dev` from root for concurrent development

### 6. Convex Patterns
- Keep serverless functions small and focused
- Use proper TypeScript types from schema
- Convex queries are automatically reactive (real-time)
- Always validate inputs with Convex validators (v.string(), v.number(), etc.)
- Use `useQuery` for data fetching, `useMutation` for data changes
- Real-time updates happen automatically - no configuration needed

### 7. Mobile Development
- Test on both iOS and Android
- Use Expo development builds for native modules
- Handle deep linking for magic links
- Consider offline functionality

### 8. Git Workflow
- Use conventional commits (feat:, fix:, chore:)
- Keep commits atomic and focused
- Reference issue numbers when applicable
- Run `pnpm check-all` before committing

## Technology-Specific Guidelines

### React Native + Expo
- Use Expo SDK features when available
- Prefer Expo modules over bare React Native
- Use EAS Build for production builds
- Test on physical devices before release

### Convex
- Design for real-time first
- Use transactions for data consistency
- Implement proper error handling
- Consider rate limiting for actions

### NativeWind (TailwindCSS)
- Use utility classes from the theme
- Avoid arbitrary values when possible
- Use responsive modifiers appropriately
- Follow the color system defined in config

### Convex Reactive Queries
- Use Convex's typed API from `@monorepo/convex`
- Implement proper error boundaries
- Convex handles caching automatically
- Optimistic updates work out of the box

## Common Patterns

### API Integration (UPDATED)
```typescript
// ❌ OLD: React Query pattern (DO NOT USE)
// const usePosts = createQuery({
//   queryKey: ['posts'],
//   fetcher: (_, { signal }) => getPosts({ signal }),
// });

// ✅ NEW: Convex pattern (USE THIS)
import { useQuery } from "convex/react";
import { api } from "@monorepo/convex";

export function usePosts() {
  return useQuery(api.posts.list);
}

// With arguments
export function usePost(postId: string) {
  return useQuery(api.posts.get, { postId });
}
```

### Component Structure
```tsx
import * as React from 'react';
import { Text, View } from '@/components/ui';

type Props = {
  title: string;
};

export function MyComponent({ title }: Props) {
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold">{title}</Text>
    </View>
  );
}
```

### Environment Usage
```typescript
import { Env } from '@env';

// Use validated environment variables
const apiUrl = Env.EXPO_PUBLIC_CONVEX_URL;
```

## Debugging Tips

1. **Metro Issues**: Clear cache with `pnpm start -c`
2. **Type Errors**: Run `pnpm type-check` from root
3. **Build Issues**: Check `eas build --list` for logs
4. **Convex Issues**: 
   - Check dashboard at https://dashboard.convex.dev
   - View function logs in real-time
   - Use `npx convex logs` for CLI access
5. **Real-time Not Working**: Verify EXPO_PUBLIC_CONVEX_URL is correct

## Performance Considerations

- Use FlashList for large lists
- Implement proper memoization
- Lazy load screens with React.lazy
- Optimize images with expo-image
- Use Hermes engine (already enabled)

## Security

- Never commit `.env` files
- Use Convex for authentication
- Validate all user inputs
- Implement proper CORS for web
- Use secure storage for sensitive data

## Convex Integration Examples

### Setting up Providers
```tsx
// app/_layout.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

const convex = new ConvexReactClient(Env.EXPO_PUBLIC_CONVEX_URL);

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider>
        {/* Other providers */}
        {children}
      </ConvexAuthProvider>
    </ConvexProvider>
  );
}
```

### Authentication Pattern
```tsx
// ❌ OLD: Zustand auth
// const { signIn, signOut, token } = useAuth();

// ✅ NEW: Convex auth
import { useAuthActions, useAuthUser } from "@convex-dev/auth/react";

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const user = useAuthUser();
  
  return {
    user,
    isAuthenticated: !!user,
    signIn: (email: string) => signIn("resend-magic-link", { email }),
    signOut
  };
}
```

### Mutation with Optimistic Updates
```tsx
import { useMutation } from "convex/react";
import { api } from "@monorepo/convex";

export function CreatePost() {
  const createPost = useMutation(api.posts.create);
  
  const handleSubmit = async (data: PostData) => {
    // Optimistic update handled by Convex
    await createPost(data);
  };
}
```

## Migration Checklist for Each Feature

- [ ] Identify all Axios/fetch calls
- [ ] Create Convex functions in `packages/convex/convex/`
- [ ] Replace React Query hooks with Convex hooks
- [ ] Update TypeScript types to use Convex schema
- [ ] Remove old API client code
- [ ] Test real-time functionality
- [ ] Update component to handle loading/error states
- [ ] Verify offline behavior

## Important Notes

### Convex Integration Status: COMPLETE ✅
- The project now uses Convex as the primary backend
- React Query code exists but should NOT be used for new features
- All new server state should use Convex functions
- Migration from React Query to Convex is ongoing for existing features

### Legacy Code
Some React Query code remains in the codebase for gradual migration:
- `src/api/` directory contains old React Query hooks
- These will be removed once all features are migrated
- DO NOT use these patterns for new features

Remember: When in doubt, check the Context7 documentation for the specific library or framework!