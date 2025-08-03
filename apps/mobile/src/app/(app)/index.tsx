import { FlashList } from '@shopify/flash-list';
import React from 'react';

import type { Post } from '@/api';
import { usePosts } from '@/api';
import { PostCard } from '@/components/card';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function Feed() {
  const { data, isLoading, error } = usePosts();
  const renderItem = React.useCallback(
    ({ item }: { item: Post }) => <PostCard {...item} />,
    []
  );

  if (error) {
    return (
      <View>
        <Text> Error Loading data </Text>
      </View>
    );
  }
  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isLoading} />}
        estimatedItemSize={300}
      />
    </View>
  );
}
