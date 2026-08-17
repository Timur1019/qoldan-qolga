import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AdCard } from '@/components/AdCard';
import { colors } from '@/theme/colors';
import type { AdListItemDto } from '@/types/api';

import { styles } from './RelatedAdsSection.styles';

interface Props {
  title: string;
  ads: AdListItemDto[];
  onToggleFavorite: (ad: AdListItemDto) => void;
  /** Если true — секция свёрнута, открывается по нажатию. */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function RelatedAdsSection({
  title,
  ads,
  onToggleFavorite,
  collapsible = false,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  if (!ads.length) return null;

  const showList = !collapsible || open;

  return (
    <View style={styles.wrap}>
      {collapsible ? (
        <Pressable style={styles.toggle} onPress={() => setOpen((v) => !v)}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{ads.length}</Text>
          </View>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.muted}
            style={styles.chevron}
          />
        </Pressable>
      ) : (
        <Text style={[styles.title, styles.titleStandalone]}>{title}</Text>
      )}
      {showList ? (
        <FlatList
          data={ads}
          horizontal
          nestedScrollEnabled
          directionalLockEnabled
          keyExtractor={(a) => a.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <AdCard ad={item} variant="grid" onToggleFavorite={onToggleFavorite} />
            </View>
          )}
        />
      ) : null}
    </View>
  );
}
