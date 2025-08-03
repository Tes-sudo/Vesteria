import { useConvexAuth } from 'convex/react';
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { Pressable, Text } from '@/components/ui';
// TODO: Replace with lucide-react-native or @tabler/icons-react-native
import { useIsFirstTime } from '@/lib';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, isLoading]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📰</Text>,
          headerRight: () => <CreateNewPostLink />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color }) => <Text style={{ color }}>🎨</Text>,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable>
        <Text className="text-primary-300 px-3">Create</Text>
      </Pressable>
    </Link>
  );
};
