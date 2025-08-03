import { useConvexAuth } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Text } from '@/components/ui';

export default function AuthCallback() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  useEffect(() => {
    // The magic link will handle authentication through the web browser
    // Once the user clicks the link and authenticates, they should return to the app
    // and the auth state will be updated
    
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    } else if (!isLoading && !isAuthenticated) {
      // If not authenticated after loading, redirect to login
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-muted-foreground">
        Verifying your login...
      </Text>
    </View>
  );
}
