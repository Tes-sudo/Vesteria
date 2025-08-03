# BEST_PRACTICES.md - Mobile Development Excellence Guide

> **🤖 AI Assistant Note**: When asked for "docs", use Context7 MCP (`mcp__context7__get-library-docs`) to fetch the latest React Native, React Native Reusables, Convex, and NativeWind documentation for the source of truth.

## 🎯 Core Principles

1. **Component-First Architecture**: All UI components MUST be built using React Native Reusables with NativeWind
2. **Type Safety**: TypeScript strict mode with no `any` types
3. **Performance by Default**: Optimize first, not later
4. **Accessibility Always**: Every interactive element must be accessible
5. **Testing as Documentation**: Tests describe component behavior

## 🏗️ Component Development Standards

### 1. React Native Reusables Pattern

**MANDATORY**: All components must be built using React Native Reusables as the foundation.

```typescript
// ✅ CORRECT: Using RN Reusables components
import { Button, Card, Input, Label, Text } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CustomComponentProps {
  title: string;
  variant?: 'default' | 'secondary';
}

export function CustomComponent({ title, variant = 'default' }: CustomComponentProps) {
  return (
    <Card className={cn('p-4', variant === 'secondary' && 'bg-secondary')}>
      <Text className="text-lg font-semibold">{title}</Text>
      <Input placeholder="Enter text" className="mt-2" />
      <Button variant="default" className="mt-4">
        Submit
      </Button>
    </Card>
  );
}
```

```typescript
// ❌ WRONG: Direct React Native components without RN Reusables
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

// Don't do this - use RN Reusables components instead
```

### 2. Component Composition Rules

#### Use Slot Pattern for Flexibility
```typescript
import { Slot } from '@rn-primitives/slot';

interface ButtonWithIconProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export function ButtonWithIcon({ asChild, children }: ButtonWithIconProps) {
  const Component = asChild ? Slot : Button;
  return <Component>{children}</Component>;
}
```

#### Use Portal for Overlays
```typescript
import { Portal } from '@rn-primitives/portal';

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <Portal>
      <View className="absolute inset-0 bg-black/50">
        {children}
      </View>
    </Portal>
  );
}
```

### 3. NativeWind Styling Best Practices

#### Always Use Semantic Classes
```typescript
// ✅ CORRECT: Semantic color classes
<View className="bg-background border-border">
  <Text className="text-foreground">Content</Text>
  <Button className="bg-primary text-primary-foreground">
    Action
  </Button>
</View>

// ❌ WRONG: Hardcoded colors
<View className="bg-white border-gray-200">
  <Text className="text-black">Content</Text>
</View>
```

#### Platform-Specific Styling
```typescript
// ✅ CORRECT: Platform-specific classes
<View className="p-4 ios:pt-6 android:pt-4">
  <Text className="text-base ios:text-lg android:text-base">
    Platform-aware text
  </Text>
</View>
```

#### Responsive Design
```typescript
// ✅ CORRECT: Responsive classes
<View className="p-4 sm:p-6 lg:p-8">
  <Text className="text-sm sm:text-base lg:text-lg">
    Responsive text
  </Text>
</View>
```

## 🔌 Convex Integration Best Practices

### 1. Query Patterns

```typescript
// ✅ CORRECT: Typed Convex queries with error handling
import { api } from '@monorepo/convex';
import { useQuery, useMutation } from 'convex/react';

export function useUserData(userId: string) {
  const user = useQuery(
    api.users.get,
    userId ? { userId } : 'skip'
  );

  return {
    data: user,
    isLoading: user === undefined,
    error: user === null ? new Error('User not found') : null,
  };
}
```

### 2. Optimistic Updates

```typescript
// ✅ CORRECT: Optimistic updates with Convex
export function TodoItem({ todo }: { todo: Todo }) {
  const updateTodo = useMutation(api.todos.update);
  const [optimisticCompleted, setOptimisticCompleted] = useState(todo.completed);

  const handleToggle = async () => {
    const newValue = !optimisticCompleted;
    setOptimisticCompleted(newValue);
    
    try {
      await updateTodo({ 
        id: todo._id, 
        completed: newValue 
      });
    } catch (error) {
      // Revert on error
      setOptimisticCompleted(!newValue);
      showMessage({ 
        message: 'Failed to update', 
        type: 'danger' 
      });
    }
  };

  return (
    <Checkbox
      checked={optimisticCompleted}
      onCheckedChange={handleToggle}
    />
  );
}
```

### 3. Real-time Subscriptions

```typescript
// ✅ CORRECT: Real-time data with Convex
export function ChatMessages({ roomId }: { roomId: string }) {
  // This automatically subscribes to real-time updates
  const messages = useQuery(api.messages.list, { roomId });

  return (
    <FlashList
      data={messages ?? []}
      renderItem={({ item }) => <MessageItem message={item} />}
      estimatedItemSize={80}
      inverted
    />
  );
}
```

## 📏 Linter Rules & Code Quality

### Essential ESLint Rules

```javascript
// eslint.config.mjs
{
  rules: {
    // Function complexity limits
    'max-params': ['error', 3],
    'max-lines-per-function': ['error', 70],
    'complexity': ['error', 10],
    
    // File naming
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    
    // Import organization
    'simple-import-sort/imports': 'error',
    'unused-imports/no-unused-imports': 'error',
    
    // TypeScript strictness
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    
    // React Native specific
    'react-native/no-inline-styles': 'error',
    'react-native/no-unused-styles': 'error',
    'react-native/no-raw-text': 'error',
    
    // Tailwind CSS
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-contradicting-classname': 'error',
  }
}
```

### Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## 🎨 Advanced UI Patterns

### 1. Compound Components

```typescript
// ✅ CORRECT: Compound component pattern
const FormContext = React.createContext<FormContextType | null>(null);

export function Form({ children, onSubmit }: FormProps) {
  return (
    <FormContext.Provider value={{ onSubmit }}>
      <View className="space-y-4">{children}</View>
    </FormContext.Provider>
  );
}

Form.Field = function FormField({ children, name }: FormFieldProps) {
  return (
    <View className="space-y-1">
      {children}
    </View>
  );
};

Form.Label = Label;
Form.Input = Input;
Form.Error = function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-destructive text-sm">{message}</Text>;
};

// Usage
<Form onSubmit={handleSubmit}>
  <Form.Field name="email">
    <Form.Label>Email</Form.Label>
    <Form.Input placeholder="Enter email" />
    <Form.Error message={errors.email} />
  </Form.Field>
</Form>
```

### 2. Render Props Pattern

```typescript
// ✅ CORRECT: Render props for flexible composition
interface ListContainerProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

export function ListContainer<T>({ 
  data, 
  renderItem, 
  renderEmpty 
}: ListContainerProps<T>) {
  if (data.length === 0 && renderEmpty) {
    return <>{renderEmpty()}</>;
  }

  return (
    <ScrollView>
      {data.map((item, index) => (
        <View key={index}>{renderItem(item, index)}</View>
      ))}
    </ScrollView>
  );
}
```

### 3. Higher-Order Components (HOCs)

```typescript
// ✅ CORRECT: HOC for authentication
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Redirect href="/login" />;
    }
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedScreen = withAuth(ScreenComponent);
```

## 🚀 Performance Optimization

### 1. List Optimization

```typescript
// ✅ CORRECT: Optimized list with FlashList
import { FlashList } from '@shopify/flash-list';

const ItemComponent = memo(({ item }: { item: Item }) => (
  <Card className="p-4">
    <Text>{item.title}</Text>
  </Card>
));

export function OptimizedList({ data }: { data: Item[] }) {
  const renderItem = useCallback(
    ({ item }: { item: Item }) => <ItemComponent item={item} />,
    []
  );

  const keyExtractor = useCallback((item: Item) => item.id, []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={100}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
}
```

### 2. Image Optimization

```typescript
// ✅ CORRECT: Optimized image loading
import { Image } from 'expo-image';

const blurhash = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export function OptimizedImage({ uri }: { uri: string }) {
  return (
    <Image
      source={{ uri }}
      placeholder={blurhash}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      priority="high"
      className="w-full h-48 rounded-lg"
    />
  );
}
```

### 3. Memoization Strategies

```typescript
// ✅ CORRECT: Strategic memoization
export function ExpensiveComponent({ data }: { data: ComplexData }) {
  // Memoize expensive computations
  const processedData = useMemo(() => {
    return data.items
      .filter(item => item.active)
      .sort((a, b) => b.priority - a.priority)
      .map(item => ({
        ...item,
        formatted: formatItem(item),
      }));
  }, [data.items]);

  // Memoize callbacks
  const handlePress = useCallback((id: string) => {
    router.push(`/item/${id}`);
  }, []);

  // Memoize context values
  const contextValue = useMemo(
    () => ({ processedData, handlePress }),
    [processedData, handlePress]
  );

  return (
    <DataContext.Provider value={contextValue}>
      <DataList />
    </DataContext.Provider>
  );
}
```

## 🧪 Testing Best Practices

### 1. Component Testing

```typescript
// ✅ CORRECT: Comprehensive component testing
import { render, screen, userEvent } from '@/lib/test-utils';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('handles press events', async () => {
    const handlePress = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onPress={handlePress}>Click me</Button>);
    await user.press(screen.getByText('Click me'));
    
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button.props.className).toContain('bg-destructive');
  });
});
```

### 2. Hook Testing

```typescript
// ✅ CORRECT: Hook testing with renderHook
import { renderHook, waitFor } from '@testing-library/react-native';
import { useUserData } from '@/hooks/use-user-data';

describe('useUserData', () => {
  it('fetches user data successfully', async () => {
    const { result } = renderHook(() => useUserData('user-123'));
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual({
        id: 'user-123',
        name: 'Test User',
      });
    });
  });
});
```

## 🔒 Security Best Practices

### 1. Input Validation

```typescript
// ✅ CORRECT: Always validate user input
import { z } from 'zod';

const EmailSchema = z.string().email().min(5).max(100);
const PasswordSchema = z.string().min(8).max(100)
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number');

export function LoginForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(z.object({
      email: EmailSchema,
      password: PasswordSchema,
    })),
  });

  const onSubmit = (data: LoginData) => {
    // Data is validated before reaching here
    signIn(data);
  };
}
```

### 2. Secure Storage

```typescript
// ✅ CORRECT: Use MMKV for sensitive data
import { MMKV } from 'react-native-mmkv';

const secureStorage = new MMKV({
  id: 'secure-storage',
  encryptionKey: 'your-encryption-key',
});

// Store sensitive data
secureStorage.set('user.token', token);

// Retrieve sensitive data
const token = secureStorage.getString('user.token');

// Clear on logout
secureStorage.delete('user.token');
```

## 📦 Third-Party Component Libraries

While React Native Reusables is the primary component library, these additional libraries can be used when needed:

### When to Use Additional Libraries

1. **@gorhom/bottom-sheet**: For complex bottom sheet interactions
2. **react-native-modal**: For full-screen modals with advanced animations
3. **react-native-tab-view**: For swipeable tab navigation
4. **react-native-calendar**: For date picking and calendar views
5. **react-native-chart-kit**: For data visualization

### Integration Pattern

```typescript
// ✅ CORRECT: Wrap third-party components with RN Reusables styling
import BottomSheet from '@gorhom/bottom-sheet';
import { Card, Text } from '@/components/ui';

export function CustomBottomSheet({ children }: { children: React.ReactNode }) {
  return (
    <BottomSheet snapPoints={['25%', '50%', '75%']}>
      <Card className="flex-1 p-4">
        <Text className="text-lg font-semibold mb-4">
          Sheet Title
        </Text>
        {children}
      </Card>
    </BottomSheet>
  );
}
```

## 🎯 Architecture Decisions

### 1. Feature-First Structure
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   └── utils/
│   ├── posts/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   └── utils/
```

### 2. Barrel Exports
```typescript
// features/auth/index.ts
export * from './components';
export * from './hooks';
export * from './screens';
```

### 3. Dependency Injection
```typescript
// ✅ CORRECT: Use context for dependency injection
const ApiContext = createContext<ApiClient | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => new ApiClient(), []);
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}
```

## 📊 Monitoring & Analytics

### 1. Performance Monitoring
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Track performance
const transaction = Sentry.startTransaction({
  name: 'LoadPosts',
  op: 'navigation',
});

// ... perform operation

transaction.finish();
```

### 2. Error Boundaries
```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Card className="p-4 m-4">
      <Text className="text-destructive">Something went wrong:</Text>
      <Text className="text-sm">{error.message}</Text>
      <Button onPress={resetErrorBoundary}>Try again</Button>
    </Card>
  );
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppContent />
    </ErrorBoundary>
  );
}
```

## 🔄 State Management Decision Tree

1. **Component State**: Use `useState` for UI-only state
2. **Form State**: Use React Hook Form with Zod
3. **Server State**: Use Convex queries and mutations
4. **Global Client State**: Use Zustand with MMKV persistence
5. **Navigation State**: Use Expo Router

## 📝 Documentation Standards

### Component Documentation
```typescript
/**
 * Button component with variants and sizes
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="destructive" size="lg" onPress={handleDelete}>
 *   Delete Item
 * </Button>
 * ```
 */
export function Button({ ... }) { ... }
```

### Hook Documentation
```typescript
/**
 * Hook to manage user authentication state
 * 
 * @returns {Object} Auth state and methods
 * @returns {User | null} auth.user - Current user
 * @returns {boolean} auth.isLoading - Loading state
 * @returns {Function} auth.signIn - Sign in function
 * 
 * @example
 * ```tsx
 * const { user, signIn } = useAuth();
 * ```
 */
export function useAuth() { ... }
```

## 🚀 Deployment Checklist

- [ ] Run `pnpm lint` and fix all issues
- [ ] Run `pnpm type-check` and fix all TypeScript errors
- [ ] Run `pnpm test` and ensure all tests pass
- [ ] Check bundle size with `npx expo export`
- [ ] Test on physical devices (iOS and Android)
- [ ] Verify all environment variables are set
- [ ] Update version in package.json
- [ ] Create git tag for release
- [ ] Run EAS Build for production

## 📌 Quick Reference

### Essential Commands
```bash
# Development
pnpm dev                    # Start with Convex backend
pnpm ios                    # iOS simulator
pnpm android                # Android emulator

# Quality checks
pnpm lint                   # ESLint
pnpm type-check            # TypeScript
pnpm test                  # Jest tests
pnpm check-all             # All checks

# Building
pnpm prebuild              # Generate native code
pnpm build:production:ios  # Production iOS
pnpm build:production:android # Production Android
```

### Import Order
1. React/React Native
2. Third-party libraries
3. Convex imports
4. Local components (@/components)
5. Local utilities (@/lib)
6. Types (@/types)

### Component Checklist
- [ ] Uses React Native Reusables components
- [ ] Has TypeScript types
- [ ] Uses NativeWind classes
- [ ] Includes accessibility props
- [ ] Has unit tests
- [ ] Documented with JSDoc
- [ ] Under 70 lines
- [ ] Follows kebab-case naming

---

**Remember**: When in doubt, fetch the latest documentation using Context7 MCP for React Native, React Native Reusables, Convex, and NativeWind.

Last Updated: 2025-01-03