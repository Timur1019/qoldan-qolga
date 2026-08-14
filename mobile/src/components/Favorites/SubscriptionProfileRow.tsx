import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { isPhotoAvatar } from '@/utils/isPhotoAvatar';
import { profileInitials } from '@/utils/profileDisplay';

import { styles } from './SubscriptionProfileRow.styles';

export type SubscriptionProfile = {
  id: string;
  displayName?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  adsCount?: number;
};

interface Props {
  profile: SubscriptionProfile;
  adsLabel: string;
  unsubscribeLabel: string;
  onOpen: () => void;
  onUnsubscribe: () => void;
}

export function SubscriptionProfileRow({
  profile,
  adsLabel,
  unsubscribeLabel,
  onOpen,
  onUnsubscribe,
}: Props) {
  const name = (profile.displayName || '').trim() || '—';
  const avatarRaw = profile.avatarUrl || profile.avatar || null;
  const uri = isPhotoAvatar(avatarRaw) && avatarRaw ? imageUrl(avatarRaw) : '';
  const adsCount = Number(profile.adsCount ?? 0);

  return (
    <View style={styles.card}>
      <Pressable style={styles.main} onPress={onOpen}>
        {uri ? (
          <Image source={{ uri }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.initials}>{profileInitials(name)}</Text>
          </View>
        )}
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.meta}>
            {adsCount} {adsLabel}
          </Text>
        </View>
      </Pressable>
      <Pressable style={styles.unsubBtn} onPress={onUnsubscribe} hitSlop={6}>
        <Text style={styles.unsubText}>{unsubscribeLabel}</Text>
      </Pressable>
    </View>
  );
}
