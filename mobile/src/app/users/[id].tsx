import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { imageUrl, isAuthError, usersApi } from '@/api/client';
import { AdCard } from '@/components/AdCard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useFavoriteClick } from '@/hooks/useFavoriteClick';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useSellerProfile } from '@/hooks/useSellerProfile';
import { colors } from '@/theme/colors';
import { formatDate } from '@/utils/formatters';
import { isSellerStore } from '@/utils/isSellerStore';

import { styles } from '@/styles/screens/sellerProfile.styles';

const AVATAR_EMOJI: Record<string, string> = {
  star: '⭐',
  cactus: '🌵',
  donut: '🍩',
  duck: '🦆',
  cat: '🐱',
  alien: '👽',
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || '?';
}

export default function SellerProfileScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { t } = useLanguage();
  const { user } = useAuth();
  const requireAuth = useRequireAuth();
  const { profile, setProfile, ads, loading, updateFavorite } = useSellerProfile(id);
  const handleFavoriteClick = useFavoriteClick(updateFavorite);
  const [subscribing, setSubscribing] = useState(false);

  const name =
    (profile?.displayName as string) ||
    (profile?.name as string) ||
    (profile?.username as string) ||
    'Sotuvchi';
  const avatarRaw = (profile?.avatar as string) || (profile?.avatarUrl as string) || null;
  const isPhoto =
    !!avatarRaw && (avatarRaw.startsWith('/') || avatarRaw.startsWith('http'));
  const emoji = !isPhoto && avatarRaw && AVATAR_EMOJI[avatarRaw] ? AVATAR_EMOJI[avatarRaw] : null;
  const isStore = isSellerStore(profile);
  const isOwner = !!user?.id && user.id === id;
  const subscribed = Boolean(profile?.subscribed);
  const adsCount = Number(profile?.adsCount ?? ads.length);
  const subscribersCount = Number(profile?.subscribersCount ?? 0);
  const verified = Boolean(profile?.profileVerified || profile?.idVerified);
  const since = profile?.createdAt ? formatDate(String(profile.createdAt)) : '';

  const toggleSubscribe = useCallback(() => {
    if (!id || isOwner) return;
    requireAuth(() => {
      setSubscribing(true);
      usersApi
        .toggleSubscribe(id)
        .then((next) =>
          setProfile((prev) => {
            const was = Boolean(prev?.subscribed);
            const subscribed = !!next;
            const prevCount = Number(prev?.subscribersCount ?? 0);
            let subscribersCount = prevCount;
            if (!was && subscribed) subscribersCount = prevCount + 1;
            if (was && !subscribed) subscribersCount = Math.max(0, prevCount - 1);
            return { ...(prev || {}), subscribed, subscribersCount };
          })
        )
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
        })
        .finally(() => setSubscribing(false));
    });
  }, [id, isOwner, requireAuth, setProfile]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: name, headerBackTitle: t('common.back') }} />
      <FlatList
        data={ads}
        keyExtractor={(a) => a.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.avatarWrap}>
              {isPhoto ? (
                <Image source={{ uri: imageUrl(avatarRaw) }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  {emoji ? (
                    <Text style={styles.avatarEmoji}>{emoji}</Text>
                  ) : (
                    <Text style={styles.avatarInitials}>{initials(name)}</Text>
                  )}
                </View>
              )}
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{isStore ? 'Magazin' : 'Shaxsiy sotuvchi'}</Text>
            {since ? <Text style={styles.since}>Platformada: {since}</Text> : null}

            <View style={styles.stats}>
              <Text style={styles.statItem}>• {adsCount} ta e'lon</Text>
              <Text style={styles.statItem}>• {subscribersCount} ta obunachi</Text>
            </View>

            <View style={[styles.badge, verified ? styles.badgeOk : styles.badgeOff]}>
              <Text style={[styles.badgeText, verified ? styles.badgeTextOk : undefined]}>
                {verified ? 'ID tasdiqlangan' : 'ID tasdiqlanmagan'}
              </Text>
            </View>

            {!isOwner ? (
              <Pressable
                style={[styles.subscribeBtn, subscribed && styles.subscribeBtnOn]}
                onPress={toggleSubscribe}
                disabled={subscribing}
              >
                {subscribing ? (
                  <ActivityIndicator color={subscribed ? colors.primary : colors.white} />
                ) : (
                  <Text style={[styles.subscribeText, subscribed && styles.subscribeTextOn]}>
                    {subscribed ? 'Obuna' : 'Obuna bo‘lish'}
                  </Text>
                )}
              </Pressable>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <AdCard ad={item} variant="grid" onToggleFavorite={handleFavoriteClick} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>E'lonlar yo'q</Text>}
      />
    </View>
  );
}
