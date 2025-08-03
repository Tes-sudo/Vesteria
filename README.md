# Vesteria - Real-time React Native + Convex Monorepo

A modern real-time monorepo that evolved from the [Obytes React Native Starter](https://github.com/obytes/react-native-template-obytes) into a Convex-powered application with instant data synchronization, magic link authentication, and end-to-end type safety.

> **🚀 From Starter Kit to Production-Ready**: This project demonstrates migrating from a traditional REST API architecture to a real-time reactive system while preserving the excellent UI/UX patterns from Obytes.

## 🎁 What's Included from Obytes Starter?

All the great features from [Obytes React Native Template](https://github.com/obytes/react-native-template-obytes) are preserved:

- **30+ Pre-built Components**: Button, Input, Card, Modal, Select, Checkbox, and more
- **Dark Mode**: Automatic theme switching with NativeWind
- **Internationalization**: Arabic/English with RTL support
- **Forms**: React Hook Form + Zod validation patterns
- **Navigation**: Expo Router with typed routes
- **Icons**: 50+ custom SVG icons
- **Animations**: Moti + Reanimated 3 setup
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Performance**: FlashList, optimized images, keyboard handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- iOS/Android development environment
- Convex account
- Resend account (for magic links)

### Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Tes-sudo/Vesteria.git
cd Vesteria
pnpm install
```

2. **Configure environment:**
   - Copy `.env.development` to `.env.local` in `apps/mobile/`
   - Update with your values if needed (Convex URL is already configured)
   - For authentication, add your Resend API key to `packages/convex/.env.local`

3. **Start development:**
```bash
# Start both Convex backend and React Native app
pnpm dev

# Or start individually
pnpm --filter @monorepo/convex dev  # Convex backend
pnpm --filter @monorepo/mobile start # React Native app
```

4. **Run on device:**
```bash
# iOS
pnpm --filter @monorepo/mobile ios

# Android
pnpm --filter @monorepo/mobile android
```

## 📁 Project Structure

```
convex-mobile-monorepo/
├── apps/
│   └── mobile/          # React Native app (Obytes template)
├── packages/
│   ├── convex/         # Convex backend
│   └── shared/         # Shared types and constants
└── scripts/            # Development scripts
```

## 🔧 Configuration

### Environment Variables

**Mobile App** (`apps/mobile/.env.development`):
- `EXPO_PUBLIC_CONVEX_URL`: Your Convex deployment URL
- `EXPO_PUBLIC_APP_SCHEME`: App scheme for deep linking

**Backend** (`packages/convex/.env.local`):
- `AUTH_RESEND_KEY`: Your Resend API key
- `SITE_URL`: Your site URL (for magic links)

## 🎯 What Makes This Special?

This project showcases how to transform a traditional React Native starter kit into a real-time application while keeping the best parts of both worlds.

### 🏗️ Architecture Evolution

**Started with Obytes Starter Kit:**
- REST API with Axios
- React Query for server state
- Mock authentication
- Zustand for all state

**Evolved to Real-time Monorepo:**
- WebSocket-based real-time sync
- Convex reactive queries
- Magic link authentication
- Convex for server state, Zustand for UI only

### 📱 Features

#### From Obytes Starter (Preserved) ✨
- 🎨 **NativeWind v4** - TailwindCSS utilities
- 🌗 **Dark mode** - System-aware theming
- 🧩 **30+ UI components** - Production-ready components
- 🌍 **i18n** - Multi-language support with RTL
- 📝 **Forms** - React Hook Form + Zod validation
- 🧪 **Testing** - Jest + React Native Testing Library
- 📱 **Expo SDK 53** - Latest features
- 🔧 **Developer tools** - ESLint, Prettier, Husky

#### New Real-time Capabilities 🚀
- ⚡ **Instant sync** - Changes appear everywhere instantly
- 🔄 **Optimistic updates** - No loading states needed
- 📡 **WebSocket transport** - Efficient real-time communication
- 🔐 **Magic links** - Passwordless authentication
- 📊 **Reactive queries** - Auto-refreshing data
- 💾 **Offline support** - Works without connection
- 🔒 **End-to-end types** - Database to UI type safety

## 🛠️ Tech Stack Comparison

### What Changed from Obytes Starter

| Feature | Obytes Starter | Current (Vesteria) |
|---------|---------------|-------------------|
| **API Layer** | Axios + React Query | Convex WebSockets |
| **State Management** | Zustand (all state) | Convex (server) + Zustand (UI) |
| **Authentication** | Mock with Zustand | Convex Auth + Magic Links |
| **Data Fetching** | REST endpoints | Reactive subscriptions |
| **Type Safety** | Frontend only | End-to-end (DB to UI) |
| **Real-time** | Not supported | Built-in everywhere |
| **Backend** | External API | Integrated Convex |
| **Monorepo** | Single package | pnpm workspaces |

### Current Stack
- **Frontend**: React Native 0.79.4 + Expo SDK 53
- **Backend**: Convex (real-time DB + serverless)
- **Styling**: NativeWind v4 (TailwindCSS)
- **State**: Convex (server) + Zustand (UI-only)
- **Auth**: Convex Auth + Resend (magic links)
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Native Testing Library
- **Tools**: TypeScript, ESLint, Prettier, Husky

## 🧪 Development

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run tests
pnpm test

# Clean all dependencies
pnpm clean

# Check Convex logs
cd packages/convex && npx convex logs
```

## 📚 Documentation

- [Full Setup Guide](./convex-react-native-monorepo-guide.md) - Detailed setup instructions
- [Migration Guide](./convex-migration-guide.md) - Migrating from REST to Convex
- [Claude Rules](./.claude/rules.md) - AI assistant guidelines
- [CLAUDE.md](./CLAUDE.md) - Project-specific AI guidance

## 🔑 Key Files

- `packages/convex/convex/` - Convex backend functions
  - `schema.ts` - Database schema
  - `auth.ts` - Authentication setup
  - `posts.ts` - Example CRUD operations
- `apps/mobile/src/`
  - `app/_layout.tsx` - App entry with providers
  - `lib/convex.ts` - Convex client setup
  - `lib/auth/convex-auth.tsx` - Auth hooks
  - `api/posts/convex-posts.ts` - Data fetching hooks

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔄 Migration Journey

### From Obytes Starter to Real-time Monorepo

This project demonstrates a complete architectural migration while preserving the excellent developer experience from the Obytes starter kit.

#### Phase 1: Initial Setup ✅
- Created pnpm workspace monorepo structure
- Added Convex backend package
- Configured shared types package
- Set up concurrent dev scripts

#### Phase 2: Data Layer Migration ✅
- Replaced Axios with Convex client
- Migrated from React Query to Convex queries
- Implemented real-time subscriptions
- Added optimistic updates

#### Phase 3: Authentication Overhaul ✅
- Removed mock auth from Zustand
- Integrated Convex Auth
- Added Resend for magic links
- Implemented deep linking

#### Phase 4: State Management ✅
- Kept Zustand for UI-only state
- Moved server state to Convex
- Removed cache management code
- Simplified data flow

### Key Files Changed

| Component | Before | After |
|-----------|--------|-------|
| **API Client** | `api/common/client.ts` (Axios) | `lib/convex.ts` (Convex) |
| **Data Hooks** | `use-posts.ts` (React Query) | `convex-posts.ts` (Convex) |
| **Auth State** | `lib/auth/index.tsx` (Zustand) | `useConvexAuth` hook |
| **Login** | Password field | Magic link only |
| **Types** | Local interfaces | Generated from schema |

### Migration Benefits Achieved

1. **Developer Experience**
   - No more cache invalidation logic
   - Automatic type generation
   - Real-time by default
   - Simpler state management

2. **User Experience**
   - Instant updates across devices
   - No loading spinners for mutations
   - Offline-first with sync
   - Passwordless authentication

3. **Code Quality**
   - 50% less boilerplate code
   - End-to-end type safety
   - Single source of truth
   - Better error handling

### Lessons Learned

- **Gradual migration works** - Keep both systems during transition
- **Preserve what works** - UI components didn't need changes
- **Focus on value** - Real-time features improve UX significantly
- **Type safety matters** - End-to-end types catch bugs early

See [convex-migration-guide.md](./convex-migration-guide.md) for detailed migration steps.

## 📄 License

This project is licensed under the MIT License.