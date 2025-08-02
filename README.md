# Vesteria - Convex + React Native Monorepo

A modern real-time monorepo combining Convex backend with React Native (Obytes starter template) featuring magic link authentication and instant data synchronization.

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

## 📱 Features

### Core Stack
- ✅ **pnpm workspaces monorepo** - Efficient dependency management
- ✅ **Convex real-time backend** - Instant data synchronization
- ✅ **React Native + Expo** - Using Obytes starter template
- ✅ **TypeScript** - End-to-end type safety
- ✅ **Magic link authentication** - Passwordless auth via Resend

### Real-time Capabilities
- 🚀 **Live data updates** - Changes sync instantly across all clients
- 🔄 **Optimistic updates** - UI updates immediately, rollback on error
- 📊 **Reactive queries** - Data automatically refreshes when changed
- 🔐 **Real-time auth state** - Login/logout syncs across devices

### Developer Experience
- 🔥 **Hot reload** - Both backend and mobile app
- 📦 **Shared types** - TypeScript types shared between packages
- 🛠️ **Metro monorepo support** - Seamless development
- 🎨 **NativeWind v4** - TailwindCSS for React Native
- 🧪 **Testing setup** - Jest + React Native Testing Library

## 🛠️ Tech Stack

- **Backend**: Convex (real-time database + serverless functions)
- **Mobile**: React Native 0.79.4 + Expo SDK 53
- **UI**: NativeWind v4 (TailwindCSS) + React Native UI components
- **State Management**: 
  - Server state: Convex reactive queries
  - Local state: Zustand (UI only)
  - Forms: React Hook Form + Zod
- **Authentication**: Convex Auth + Resend (magic links)
- **Development**: TypeScript, ESLint, Prettier, Husky

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

## 📄 License

This project is licensed under the MIT License.