import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './ProfileMenuRow.styles';

export type ProfileMenuTone = 'default' | 'accent' | 'promo';

export interface ProfileMenuItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
  tone?: ProfileMenuTone;
  onPress: () => void;
}

interface Props {
  item: ProfileMenuItem;
  isLast?: boolean;
}

export function ProfileMenuRow({ item, isLast }: Props) {
  const badge = Number(item.badge || 0);
  const tone = item.tone || 'default';
  return (
    <Pressable
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={item.onPress}
      android_ripple={{ color: 'rgba(4,73,45,0.06)' }}
    >
      <View
        style={[
          styles.iconWrap,
          tone === 'accent' && styles.iconWrapAccent,
          tone === 'promo' && styles.iconWrapPromo,
        ]}
      >
        <Ionicons
          name={item.icon}
          size={20}
          color={tone === 'default' ? colors.text : colors.primary}
        />
      </View>
      <Text style={styles.label}>{item.label}</Text>
      {badge > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={16} color={colors.muted} />
    </Pressable>
  );
}
