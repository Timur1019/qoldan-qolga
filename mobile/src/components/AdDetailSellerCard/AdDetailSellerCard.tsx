import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { imageUrl } from '@/api/client';
import { colors } from '@/theme/colors';
import { styles } from '@/styles/screens/adDetail.styles';

type Props = {
  userId: string;
  sellerName: string;
  sellerAvatarRaw: string | null;
  sellerTypeLabel: string;
  adsCount: number;
  isOwner: boolean;
  subscribed: boolean;
  subscribing: boolean;
  onToggleSubscribe: () => void;
};

export function AdDetailSellerCard({
  userId,
  sellerName,
  sellerAvatarRaw,
  sellerTypeLabel,
  adsCount,
  isOwner,
  subscribed,
  subscribing,
  onToggleSubscribe,
}: Props) {
  return (
    <View style={styles.sellerCard}>
      <Pressable style={styles.sellerMain} onPress={() => router.push(`/users/${userId}`)}>
        {sellerAvatarRaw && (sellerAvatarRaw.startsWith('/') || sellerAvatarRaw.startsWith('http')) ? (
          <Image source={{ uri: imageUrl(sellerAvatarRaw) }} style={styles.sellerAvatar} contentFit="cover" />
        ) : (
          <View style={[styles.sellerAvatar, styles.sellerAvatarPh]}>
            <Ionicons name="person" size={22} color={colors.muted} />
          </View>
        )}
        <View style={styles.sellerText}>
          <Text style={styles.sellerName}>{sellerName}</Text>
          <Text style={styles.sellerType}>
            {sellerTypeLabel}
            {adsCount > 0 ? ` · ${adsCount} ta e'lon` : ' · profilni ochish'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>
      {!isOwner ? (
        <Pressable
          style={[styles.subscribeBtn, subscribed && styles.subscribeBtnOn]}
          onPress={onToggleSubscribe}
          disabled={subscribing}
        >
          {subscribing ? (
            <ActivityIndicator size="small" color={subscribed ? colors.primary : colors.white} />
          ) : (
            <Text style={[styles.subscribeText, subscribed && styles.subscribeTextOn]}>
              {subscribed ? 'Obuna' : 'Obuna bo‘lish'}
            </Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
