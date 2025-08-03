# Vesteria - Real-time React Native + Convex Monorepo

A real-time mobile app built on [Obytes React Native Starter](https://github.com/obytes/react-native-template-obytes) with Convex backend, featuring instant sync, magic link auth, and end-to-end type safety.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/Tes-sudo/Vesteria.git
cd Vesteria
pnpm install

# Set up authentication
cd packages/convex
npx convex env set AUTH_RESEND_KEY your-resend-api-key

# Start development
pnpm dev  # Runs both Convex backend and React Native app
```

## 📁 Architecture

```
├── apps/mobile/          # React Native app (Obytes-based)
├── packages/convex/      # Real-time backend
└── packages/shared/      # Shared types
```

## ✨ Key Features

### From Obytes Starter
- 🎨 **NativeWind v4** - TailwindCSS for React Native
- 🌗 **Dark Mode** - System-aware theming  
- 🌍 **i18n** - Multi-language with RTL
- 📝 **Forms** - React Hook Form + Zod
- 🧩 **30+ Components** - Production-ready UI
- 🧪 **Testing** - Jest + RNTL configured

### New Additions
- ⚡ **Real-time Sync** - Instant updates everywhere
- 🔐 **Magic Links** - Passwordless authentication
- 🔄 **Optimistic Updates** - No loading states
- 📊 **Reactive Queries** - Auto-refreshing data
- 🔒 **Type Safety** - Database to UI types
- 🎯 **RN Reusables** - Modern shadcn-style components

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native 0.76.5 + Expo SDK 52 |
| **Styling** | NativeWind v4 + RN Reusables |
| **Backend** | Convex (WebSocket-based) |
| **Auth** | Convex Auth + Resend |
| **State** | Convex (server) + Zustand (UI) |
| **Types** | TypeScript with auto-generation |

## 🔄 What Changed from Obytes

- **API**: Axios/React Query → Convex real-time
- **Auth**: Mock → Magic links with Resend
- **Types**: Manual → Auto-generated from schema
- **State**: All Zustand → Split server/UI state

## 📚 Documentation

- [Migration Guide](./convex-migration-guide.md) - Detailed migration steps
- [Auth Assessment](./AUTH_ASSESSMENT.md) - Security evaluation
- [CLAUDE.md](./CLAUDE.md) - AI assistant context

## 🚧 Current Status

- ✅ Real-time posts with CRUD
- ✅ Magic link authentication
- ✅ Deep linking setup
- ⚠️ Needs Resend API key to work
- 📊 Auth security: 4/10 (see assessment)

## 📄 License

MIT