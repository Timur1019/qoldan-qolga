import { Pressable, ScrollView, Text, View } from 'react-native';

import { MY_ADS_TABS, type MyAdsTabKey } from '@/constants/myAds';
import { useLanguage } from '@/context/LanguageContext';

import { styles } from './MyAdsTabs.styles';

interface Props {
  activeTab: MyAdsTabKey;
  counts: Record<MyAdsTabKey, number>;
  onChange: (tab: MyAdsTabKey) => void;
}

export function MyAdsTabs({ activeTab, counts, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {MY_ADS_TABS.map((tab) => {
        const on = tab.key === activeTab;
        const count = counts[tab.key] || 0;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, on && styles.tabOn]}
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.label, on && styles.labelOn]}>{t(tab.labelKey)}</Text>
            {count > 0 ? (
              <View style={[styles.badge, on && styles.badgeOn]}>
                <Text style={[styles.badgeText, on && styles.badgeTextOn]}>
                  {count > 99 ? '99+' : count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
