# Convex + React Native Monorepo

A modern monorepo setup combining Convex backend with React Native (Obytes starter) and magic link authentication.

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
git clone <your-repo>
cd convex-mobile-monorepo
pnpm install
```

2. **Configure Convex:**
   - Get your Convex deployment URL from the Convex dashboard
   - Update `apps/mobile/.env.development` with your `EXPO_PUBLIC_CONVEX_URL`
   - Update `packages/convex/.env.local` with your `AUTH_RESEND_KEY`

3. **Start development:**
```bash
# Start both backend and mobile app
pnpm dev

# Or start individually
pnpm --filter @monorepo/convex dev  # Convex backend
pnpm --filter @monorepo/mobile start # React Native app
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

- ✅ pnpm workspaces monorepo
- ✅ Convex real-time backend
- ✅ React Native with Obytes starter
- ✅ Magic link authentication
- ✅ Shared TypeScript types
- ✅ Hot reload development
- ✅ Metro bundler monorepo support

## 🧪 Development

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Clean all dependencies
pnpm clean
```

## 📚 Documentation

For detailed setup and configuration, see the [full guide](./convex-react-native-monorepo-guide.md).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.