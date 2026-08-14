import { Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

import { styles } from './FeedTabs.styles';

export type FeedTabId = 'recommended' | 'fresh';

interface Props {
  active: FeedTabId;
  onChange: (tab: FeedTabId) => void;
}

export function FeedTabs({ active, onChange }: Props) {
  const { t } = useLanguage();
  const tabs: { id: FeedTabId; label: string }[] = [
    { id: 'recommended', label: t('home.feedRecommended') },
    { id: 'fresh', label: t('home.feedFresh') },
  ];

  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const on = tab.id === active;
        return (
          <Pressable key={tab.id} style={styles.tab} onPress={() => onChange(tab.id)} hitSlop={6}>
            <Text style={[styles.tabText, on && styles.tabTextOn]}>{tab.label}</Text>
            {on ? <View style={styles.underline} /> : <View style={styles.underlineSpacer} />}
          </Pressable>
        );
      })}
    </View>
  );
}
