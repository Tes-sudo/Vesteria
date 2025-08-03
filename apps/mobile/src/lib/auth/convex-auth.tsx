import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@monorepo/convex';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';

export function useConvexAuth() {
  const { signIn, signOut } = useAuthActions();
  // TODO: Implement proper user query once auth.viewer is available
  const user = useQuery(api.auth.viewer) || null;

  const handleSignIn = useCallback(
    async (email: string) => {
      try {
        await signIn('resend-magic-link', { email });
        // Magic link will be sent to email
        showMessage({
          message: 'Check your email for the magic link!',
          type: 'success',
        });
        return { success: true };
      } catch (error) {
        console.error('Sign in error:', error);
        showMessage({
          message: 'Failed to send magic link',
          type: 'danger',
        });
        return { success: false, error };
      }
    },
    [signIn]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [signOut]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
    signIn: handleSignIn,
    signOut: handleSignOut,
    token: user?._id, // For compatibility during migration
  };
}

// Export for compatibility during migration
export const useAuth = useConvexAuth;

// These are for gradual migration - they'll log warnings
export const signOut = () => {
  console.warn('Direct signOut call detected. Use useAuth hook instead.');
  // We can't actually sign out from here without hooks
  router.replace('/login');
};

export const signIn = (token: any) => {
  console.warn('Direct signIn call detected. Use useAuth hook instead.');
};

export const hydrateAuth = () => {
  // Convex handles this automatically
  console.log('Convex handles auth hydration automatically');
};
