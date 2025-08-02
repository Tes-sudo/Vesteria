# Convex Migration - Next Steps

## What We've Accomplished

✅ **Environment Setup**
- Added EXPO_PUBLIC_CONVEX_URL to environment configuration
- Created Convex client initialization

✅ **Provider Integration**
- Added ConvexProvider and ConvexAuthProvider to app layout
- Providers are now wrapping the entire app

✅ **Backend Schema & Functions**
- Created posts and comments tables in Convex schema
- Implemented CRUD operations for posts with auth checks
- Added proper indexes for performance

✅ **Authentication Hooks**
- Created convex-auth.tsx with Convex Auth integration
- Maintains compatibility with existing auth patterns
- Ready for magic link authentication

✅ **Data Fetching Hooks**
- Created Convex versions of all post hooks
- Added migration wrapper for gradual transition
- Maintains same API surface for easy migration

## What You Need to Do Next

### 1. Initialize Convex Project (REQUIRED)

```bash
cd packages/convex
npx convex dev
```

This will:
- Create a new Convex project (or connect to existing)
- Generate the `_generated` folder with typed API
- Start the Convex dev server
- Create `.env.local` with your deployment URL

### 2. Update Environment Files

After running `convex dev`, you'll get a deployment URL. Add it to your mobile app:

```bash
# apps/mobile/.env.development
EXPO_PUBLIC_CONVEX_URL=https://your-project-name.convex.cloud
EXPO_PUBLIC_APP_SCHEME=yourappscheme
```

### 3. Configure Resend for Magic Links

In `packages/convex/.env.local`:
```
AUTH_RESEND_KEY=re_YOUR_RESEND_API_KEY
SITE_URL=http://localhost:8081
```

### 4. Update Mobile App Imports

Once the API is generated, update these files:

**apps/mobile/src/api/posts/convex-posts.ts:**
```typescript
// Remove the mock and uncomment:
import { api } from "@monorepo/convex";
```

### 5. Test the Integration

1. Start both services:
   ```bash
   pnpm dev  # From root - starts both Convex and mobile
   ```

2. Test authentication:
   - Navigate to login screen
   - Enter email
   - Check Convex dashboard for auth entries

3. Test posts functionality:
   - Create a test post via Convex dashboard
   - Check if it appears in the app

### 6. Gradual Migration Strategy

Use the migration wrapper to switch features one by one:

```typescript
// In any component using posts:
import { usePosts } from '@/api/posts/use-posts-migration';
```

Set `EXPO_PUBLIC_USE_CONVEX=true` to use Convex, or `false` to use React Query.

### 7. Complete Migration Checklist

- [ ] Run `npx convex dev` and configure project
- [ ] Update all environment files with Convex URL
- [ ] Test authentication flow with magic links
- [ ] Verify posts are loading from Convex
- [ ] Migrate remaining features (users, comments, etc.)
- [ ] Remove React Query and Axios dependencies
- [ ] Update all imports to use Convex directly
- [ ] Remove migration wrappers

## Common Issues & Solutions

### TypeScript Errors
After running `convex dev`, restart TypeScript:
- VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
- Or restart your editor

### Metro Bundler Issues
Clear cache and restart:
```bash
cd apps/mobile
pnpm start -c
```

### Authentication Not Working
1. Check Resend API key is valid
2. Verify SITE_URL matches your mobile dev server
3. Check deep linking configuration in app.json

### Real-time Updates Not Working
- Ensure you're using the correct Convex URL
- Check network connectivity
- Verify Convex dev server is running

## Benefits You'll See

1. **Real-time Updates**: Changes appear instantly across all devices
2. **No Cache Management**: Convex handles all caching automatically
3. **Type Safety**: Full end-to-end TypeScript types
4. **Optimistic Updates**: UI updates immediately, rolls back on error
5. **Offline Support**: Built-in with automatic sync

## Need Help?

1. Check the [Convex docs](https://docs.convex.dev)
2. Review `convex-migration-guide.md` for detailed patterns
3. Check Convex dashboard for function logs
4. Use React Native debugger to inspect network requests

Remember: The goal is to completely replace React Query with Convex's reactive system. Take it one feature at a time!