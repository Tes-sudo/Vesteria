# RULES.md - Mobile Development Bible

This document serves as the comprehensive guide for all mobile development in the Vesteria React Native application. All developers and AI assistants must follow these rules to maintain consistency and quality.

## 🎯 Core Principle

**When asked to "docs", use Context7 MCP to fetch React Native and relevant component documentation for the source of truth.**

## 📚 Tech Stack & Libraries

### Core Technologies
- **React Native**: 0.79.4
- **Expo**: ~53.0.12
- **TypeScript**: ^5.8.3
- **React**: 19.0.0

### Navigation & Routing
- **Expo Router**: ~5.1.0 (File-based routing)
- **React Native Screens**: ^4.11.1

### State Management
- **Zustand**: ^5.0.5 (Global state)
- **Convex**: ^1.11.0 (Real-time backend)
- **React Hook Form**: ^7.53.0 (Form state)
- **MMKV**: ~2.12.2 (Ultra-fast key-value storage)

### Styling & UI
- **NativeWind**: ^4.1.21 (TailwindCSS for React Native)
- **Tailwind Merge**: ^3.3.1
- **Class Variance Authority (CVA)**: ^0.7.1
- **Tailwind Variants**: ^0.2.1

### UI Components & Libraries
- **React Native Reusables**: Custom component library (Button, Card, Input, Label, Text)
- **@rn-primitives/portal**: ^1.3.0 (Portal primitive)
- **@rn-primitives/slot**: ^1.2.0 (Slot primitive)
- **@gorhom/bottom-sheet**: ^5.0.5 (Bottom sheets)
- **@shopify/flash-list**: 1.7.6 (High-performance lists)
- **React Native Gesture Handler**: ~2.24.0
- **React Native Reanimated**: ~3.17.5
- **Lucide React Native**: ^0.536.0 (Icons)
- **Expo Image**: ~2.3.0 (Optimized images)
- **React Native SVG**: ~15.11.2

### Forms & Validation
- **React Hook Form**: ^7.53.0
- **Zod**: ^3.23.8
- **@hookform/resolvers**: ^3.9.0

### Internationalization
- **i18next**: ^23.14.0
- **react-i18next**: ^15.0.1
- **Expo Localization**: ~16.1.5

### Development Tools
- **ESLint**: ^9.28.0
- **Prettier**: ^3.3.3
- **Jest**: ^29.7.0
- **Testing Library**: ^12.7.2

## 🎨 Design System

### Color Palette

#### Primary Colors
```typescript
primary: {
  100: '#E6F2FF',
  200: '#BAE0FF',
  300: '#7CC2FF',
  400: '#3BA0FF',
  500: '#0B79FF', // Main primary
  600: '#0058CC',
  700: '#003D99',
  800: '#002966',
  900: '#001A40',
}
```

#### Neutral Colors (Charcoal)
```typescript
charcoal: {
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  850: '#1F1F1F',
  900: '#171717',
  950: '#0A0A0A',
}
```

#### Semantic Colors (CSS Variables)
- Light Mode:
  - Background: `hsl(0 0% 100%)`
  - Foreground: `hsl(240 10% 3.9%)`
  - Primary: `hsl(240 5.9% 10%)`
  - Destructive: `hsl(0 84.2% 60.2%)`
  
- Dark Mode:
  - Background: `hsl(240 10% 3.9%)`
  - Foreground: `hsl(0 0% 98%)`
  - Primary: `hsl(0 0% 98%)`
  - Destructive: `hsl(0 72% 51%)`

### Typography
- **Font Family**: Inter (custom font)
- **Usage**: `font-inter` in Tailwind classes

## 📁 Project Structure

```
apps/mobile/
├── src/
│   ├── api/              # API client & React Query hooks
│   │   ├── common/       # Shared API utilities
│   │   ├── posts/        # Post-related APIs
│   │   └── types.ts      # API type definitions
│   ├── app/              # Expo Router screens
│   │   ├── (app)/        # App stack
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── settings.tsx
│   │   ├── auth/         # Auth routes
│   │   ├── feed/         # Feed routes
│   │   ├── _layout.tsx   # Root layout
│   │   ├── login.tsx
│   │   └── onboarding.tsx
│   ├── components/       # Reusable components
│   │   ├── ui/           # Core UI components
│   │   │   ├── rn-reusables/  # Base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   └── text.tsx
│   │   │   ├── colors.ts
│   │   │   ├── empty-list.tsx
│   │   │   └── focus-aware-status-bar.tsx
│   │   └── settings/     # Settings components
│   ├── lib/              # Core utilities
│   │   ├── auth/         # Authentication
│   │   ├── hooks/        # Custom hooks
│   │   ├── i18n/         # Internationalization
│   │   ├── convex.ts     # Convex client
│   │   ├── storage.tsx   # MMKV storage
│   │   └── utils.ts      # Utility functions
│   ├── translations/     # i18n JSON files
│   └── types/           # TypeScript types
├── assets/              # Static assets
│   └── fonts/          # Custom fonts
├── global.css          # Global Tailwind styles
├── tailwind.config.js  # Tailwind configuration
└── metro.config.js     # Metro bundler config
```

## 🏗️ Component Development Rules

### 1. Component Structure
- Use **functional components** with TypeScript
- Keep components **under 80 lines**
- Use **kebab-case** for file naming
- Co-locate related components in folders

### 2. Component Pattern
```typescript
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface ComponentProps extends ViewProps {
  title: string;
  variant?: 'default' | 'secondary';
}

export function ComponentName({ 
  title, 
  variant = 'default',
  className,
  ...props 
}: ComponentProps) {
  return (
    <View 
      className={cn(
        'flex-1 p-4',
        variant === 'secondary' && 'bg-secondary',
        className
      )}
      {...props}
    >
      <Text className="text-foreground">{title}</Text>
    </View>
  );
}
```

### 3. Using UI Components
```typescript
// Always import from @/components/ui
import { Button, Card, Input, Text, View } from '@/components/ui';

// Use CVA variants for consistent styling
<Button variant="destructive" size="lg">
  Delete
</Button>
```

### 4. Styling Rules
- **Always use NativeWind/TailwindCSS** classes
- Use `cn()` utility for conditional classes
- Never use inline styles unless absolutely necessary
- Prefer semantic color variables over hardcoded colors

### 5. State Management Patterns

#### Local State
```typescript
const [count, setCount] = useState(0);
```

#### Global State (Zustand)
```typescript
import { useStore } from '@/lib/store';
const { user, setUser } = useStore();
```

#### Server State (Convex)
```typescript
import { useQuery, useMutation } from 'convex/react';
import { api } from '@monorepo/convex';

const posts = useQuery(api.posts.list);
const createPost = useMutation(api.posts.create);
```

#### Form State
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

## 🔐 Authentication Pattern

```typescript
import { useAuth } from '@/lib/auth';

export function ProtectedComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onSubmit={signIn} />;
  }
  
  return <UserContent user={user} />;
}
```

## 🌍 Internationalization

```typescript
import { useTranslation } from 'react-i18next';

export function InternationalComponent() {
  const { t } = useTranslation();
  
  return <Text>{t('welcome.message')}</Text>;
}
```

## 🧪 Testing Patterns

### Unit Tests
```typescript
import { render, screen } from '@/lib/test-utils';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
```

### Test File Naming
- Component tests: `component-name.test.tsx`
- Hook tests: `use-hook-name.test.ts`
- Utility tests: `util-name.test.ts`

## 📱 Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = {
  container: cn(
    'flex-1',
    Platform.OS === 'ios' ? 'pt-12' : 'pt-8'
  ),
};
```

## 🚀 Performance Best Practices

### 1. List Optimization
```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={100}
  keyExtractor={(item) => item.id}
/>
```

### 2. Image Optimization
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  transition={200}
  placeholder={blurhash}
/>
```

### 3. Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

const MemoizedComponent = memo(Component);
const memoizedValue = useMemo(() => computeExpensive(), [deps]);
const memoizedCallback = useCallback(() => {}, [deps]);
```

## 🔧 Environment Configuration

### Environment Variables
- Client-side: Prefix with `EXPO_PUBLIC_`
- Build-time: No prefix required
- Validation: Always validate with Zod in `env.js`

### Environment Files
- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

## 📋 Coding Standards

### Imports Order
1. React/React Native imports
2. Third-party library imports
3. Convex/Backend imports
4. Local imports (@/ aliases)
5. Type imports

### TypeScript Rules
- Always use explicit types for function parameters
- Prefer interfaces over types for object shapes
- Use strict mode
- Avoid `any` type

### Error Handling
```typescript
try {
  await riskyOperation();
  showMessage({ message: 'Success!', type: 'success' });
} catch (error) {
  console.error('Operation failed:', error);
  showMessage({ message: 'Error occurred', type: 'danger' });
}
```

## 🎯 Navigation Patterns

### File-based Routing (Expo Router)
```typescript
import { router } from 'expo-router';

// Navigate
router.push('/feed/123');
router.replace('/login');
router.back();

// With params
router.push({
  pathname: '/feed/[id]',
  params: { id: '123' },
});
```

### Protected Routes
```typescript
import { Redirect } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function ProtectedScreen() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }
  
  return <ScreenContent />;
}
```

## 📝 Documentation Requirements

### Component Documentation
```typescript
/**
 * Button component with variants and sizes
 * @param variant - Visual style variant
 * @param size - Size of the button
 * @example
 * <Button variant="destructive" size="lg">Delete</Button>
 */
```

### Function Documentation
```typescript
/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
```

## 🚨 Critical Rules

1. **NEVER** commit sensitive data or API keys
2. **ALWAYS** run `pnpm lint` and `pnpm type-check` before committing
3. **ALWAYS** test on both iOS and Android
4. **NEVER** use deprecated React Native APIs
5. **ALWAYS** handle loading and error states
6. **NEVER** ignore TypeScript errors
7. **ALWAYS** use semantic commit messages
8. **ALWAYS** update tests when changing components

## 🤖 AI Assistant Instructions

When working with Claude Code or other AI assistants:

1. **Start with**: "docs" command to fetch latest documentation via Context7 MCP
2. **Reference**: Always check this RULES.md for project standards
3. **Components**: Use existing UI components from `@/components/ui`
4. **Patterns**: Follow established patterns in the codebase
5. **Testing**: Include tests for new functionality
6. **Performance**: Consider performance implications
7. **Accessibility**: Ensure components are accessible

## 📚 Quick Reference Commands

```bash
# Development
pnpm dev                    # Start everything
pnpm ios                    # iOS simulator
pnpm android                # Android emulator

# Testing
pnpm test                   # Run tests
pnpm test:watch            # Watch mode
pnpm lint                  # Lint code
pnpm type-check           # TypeScript check

# Building
pnpm prebuild              # Generate native code
pnpm build:production:ios  # Production iOS build
pnpm build:production:android # Production Android build
```

## 🔄 Update Policy

This document is the single source of truth for mobile development. It should be updated when:
- New libraries are added
- Patterns change significantly  
- Best practices evolve
- New components are created

Last Updated: 2025-01-03