import * as React from 'react';
import { Alert } from 'react-native';

import { translate, useSelectedLanguage } from '@/lib';
import type { Language } from '@/lib/i18n/resources';

import { Item } from './item';

export const LanguageItem = () => {
  const { language, setLanguage } = useSelectedLanguage();

  const handlePress = React.useCallback(() => {
    // Simple alert picker for now - replace with proper modal later
    Alert.alert(
      'Select Language',
      '',
      [
        { text: translate('settings.english'), onPress: () => setLanguage('en') },
        { text: translate('settings.arabic'), onPress: () => setLanguage('ar') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [setLanguage]);

  const selectedLanguage = language === 'en' 
    ? translate('settings.english') 
    : translate('settings.arabic');

  return (
    <Item
      text="settings.language"
      value={selectedLanguage}
      onPress={handlePress}
    />
  );
};