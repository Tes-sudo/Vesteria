# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Architecture

This is a **pnpm workspace monorepo** with three packages:
- `@monorepo/mobile` - React Native Expo app using Obytes starter template
- `@monorepo/convex` - Convex backend with serverless functions and real-time database
- `@monorepo/shared` - Shared TypeScript types and constants

The architecture separates frontend and backend concerns while maintaining type safety through shared types. Convex provides real-time subscriptions and serverless functions without traditional backend complexity.

## Essential Commands

### Development
```bash
pnpm dev                     # Starts both Convex and mobile app concurrently
pnpm --filter @monorepo/convex dev   # Start only Convex backend
pnpm --filter @monorepo/mobile start # Start only mobile app
```

### Mobile-Specific Commands
```bash
# From apps/mobile/
pnpm ios                     # Run on iOS simulator
pnpm android                 # Run on Android emulator
pnpm prebuild                # Generate native code (required after env changes)
pnpm start:staging          # Start with staging environment
pnpm start:production       # Start with production environment
```

### Testing
```bash
pnpm test                    # Run all tests
pnpm test:watch             # Run tests in watch mode
pnpm test:ci                # Run tests with coverage
pnpm e2e-test               # Run Maestro E2E tests (mobile)
```

### Code Quality
```bash
pnpm lint                    # Run ESLint across monorepo
pnpm type-check             # TypeScript checking
pnpm check-all              # Lint + type-check + tests (mobile only)
```

### Building
```bash
# EAS builds from apps/mobile/
pnpm build:development:ios
pnpm build:staging:android
pnpm build:production:ios   # Store-ready build
```

## Key Architectural Patterns

### Environment Configuration
The project uses a sophisticated three-tier environment system with Zod validation:

1. **Environment files**: `.env.development`, `.env.staging`, `.env.production`
2. **Variable types**:
   - Client variables: Prefixed with `EXPO_PUBLIC_` (available in app code)
   - Build-time variables: Used during build process only
3. **Validation**: All environment variables are validated through `env.js` with Zod schemas

### Authentication Flow
Uses Convex Auth with Resend Magic Links:
1. User enters email in React Native app
2. Convex backend sends magic link via Resend
3. Deep link handling redirects back to app
4. Session managed by Convex

### State Management Layers
1. **Global State**: Zustand with MMKV persistence
2. **Server State**: TanStack React Query with react-query-kit
3. **Form State**: React Hook Form with Zod validation
4. **Storage**: MMKV for ultra-fast key-value storage

### Metro Configuration for Monorepo
The Metro bundler is configured to:
- Watch all workspace folders
- Resolve `@monorepo/*` packages correctly
- Use file-based caching for performance
- Work with NativeWind (TailwindCSS)

### Concurrent Development Script
`scripts/dev.js` orchestrates starting both services:
- Starts Convex first (backend needs to be ready)
- Waits 3 seconds
- Starts mobile app
- Color-codes output (cyan for Convex, magenta for mobile)

## Mobile Development Guidelines

### Component Structure
Follow the pattern in `.cursorrules`:
- Use functional components with TypeScript
- Keep components under 80 lines
- Use kebab-case file naming
- Import UI components from `@/components/ui`
- Use NativeWind (TailwindCSS) for styling

### File Organization
```
src/
├── api/         # React Query hooks and API client
├── app/         # Expo Router screens (file-based routing)
├── components/  # Reusable components
├── lib/         # Core utilities, hooks, auth, i18n
└── types/       # TypeScript type definitions
```

### Testing Approach
- Unit tests for utilities and complex components
- Use `component-name.test.tsx` naming
- Mock heavy dependencies (bottom-sheet, gesture-handler)
- E2E tests with Maestro for critical flows

## Convex Backend Specifics

### Function Organization
Convex functions are in `packages/convex/convex/`:
- `auth.ts` - Authentication configuration
- `auth.config.ts` - Auth provider settings
- `schema.ts` - Database schema
- `ResendMagicLink.ts` - Email provider configuration

### Deployment
```bash
cd packages/convex
npx convex dev     # Development with hot reload
npx convex deploy  # Production deployment
```

## Critical Configuration Files

### Mobile App
- `metro.config.js` - Monorepo module resolution
- `app.config.ts` - Expo configuration with environment variables
- `eas.json` - Build profiles for different environments
- `env.js` - Environment variable validation and typing

### Backend
- `convex/auth.config.ts` - Authentication provider configuration
- `.env.local` - Convex environment variables (AUTH_RESEND_KEY, SITE_URL)

## Non-Obvious Behaviors

1. **Environment Changes**: After modifying environment variables, run `pnpm prebuild` in the mobile app
2. **New Architecture**: The app uses React Native's New Architecture (`newArchEnabled: true`)
3. **App Icon Badging**: Non-production builds show environment and version on the app icon
4. **Deep Linking**: The app scheme must match `EXPO_PUBLIC_APP_SCHEME` for magic links
5. **Typed Routes**: Expo Router generates types - run the app once to generate route types
6. **i18n Validation**: Translation files are linted with custom ESLint rules
7. **Import Aliases**: Use `@/` for src directory imports, configured in `tsconfig.json`