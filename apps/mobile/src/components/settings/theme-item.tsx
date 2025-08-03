import * as React from 'react';
import { Alert } from 'react-native';

import type { ColorSchemeType } from '@/lib';
import { translate, useSelectedTheme } from '@/lib';

import { Item } from './item';

export const ThemeItem = () => {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();

  const handlePress = React.useCallback(() => {
    // Simple alert picker for now - replace with proper modal later
    Alert.alert(
      'Select Theme',
      '',
      [
        { text: translate('settings.theme.system'), onPress: () => setSelectedTheme('system') },
        { text: translate('settings.theme.light'), onPress: () => setSelectedTheme('light') },
        { text: translate('settings.theme.dark'), onPress: () => setSelectedTheme('dark') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [setSelectedTheme]);

  const getThemeLabel = () => {
    switch (selectedTheme) {
      case 'light':
        return translate('settings.theme.light');
      case 'dark':
        return translate('settings.theme.dark');
      default:
        return translate('settings.theme.system');
    }
  };

  return (
    <Item
      text="settings.theme.title"
      value={getThemeLabel()}
      onPress={handlePress}
    />
  );
};