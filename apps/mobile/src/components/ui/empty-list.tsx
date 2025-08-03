import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text } from './rn-reusables';

type EmptyListProps = {
  isLoading?: boolean;
  message?: string;
};

export const EmptyList = ({ isLoading, message = 'No items found' }: EmptyListProps) => {
  return (
    <View className="flex-1 items-center justify-center p-8">
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text className="text-center text-muted-foreground">{message}</Text>
      )}
    </View>
  );
};