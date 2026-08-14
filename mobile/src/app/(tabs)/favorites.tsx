import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { favoritesApi } from '@/api/client';
import { AdCard } from '@/components/AdCard';
import { SubscriptionProfileRow } from '@/components/Favorites/SubscriptionProfileRow';
import { AdCardSkeletonGrid } from '@/components/ui/AdCardSkeletonGrid/AdCardSkeletonGrid';
import { ContentReveal } from '@/components/ui/ContentReveal/ContentReveal';
import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useFavoriteClick } from '@/hooks/useFavoriteClick';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useSubscriptionProfiles } from '@/hooks/useSubscriptionProfiles';
import type { AdListItemDto, PageResponse } from '@/types/api';

import { styles } from '@/styles/screens/favorites.styles';

type FavTab = 'ads' | 'profiles';

export default function FavoritesScreen() {
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<FavTab>('ads');
  const [data, setData] = useState<PageResponse<AdListItemDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    profiles,
    loading: profilesLoading,
    load: loadProfiles,
    unsubscribe,
  } = useSubscriptionProfiles(isAuthenticated && tab === 'profiles');

  const load = useCallback(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setData(null);
      return;
    }
    setLoading(true);
    favoritesApi
      .list()
      .then((res) => setData(res as PageResponse<AdListItemDto>))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      if (tab === 'ads') load();
      else loadProfiles();
    }, [tab, load, loadProfiles])
  );

  const removeFromList = useCallback((adId: string, favorite: boolean) => {
    if (favorite) return;
    setData((prev) => (prev ? { ...prev, content: prev.content.filter((a) => a.id !== adId) } : prev));
  }, []);
  const handleFavoriteClick = useFavoriteClick(removeFromList);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.tabs}>
        <Pressable style={[styles.tab, tab === 'ads' && styles.tabOn]} onPress={() => setTab('ads')}>
          <Text style={[styles.tabText, tab === 'ads' && styles.tabTextOn]}>{t('favorites.ads')}</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'profiles' && styles.tabOn]}
          onPress={() => setTab('profiles')}
        >
          <Text style={[styles.tabText, tab === 'profiles' && styles.tabTextOn]}>
            {t('favorites.profiles')}
          </Text>
        </Pressable>
      </View>

      {!isAuthenticated ? (
        <View style={styles.guestWrap}>
          <Text style={styles.guestTitle}>{t('favorites.title')}</Text>
          <Text style={styles.guestText}>{t('favorites.guest')}</Text>
          <Pressable style={styles.primaryBtn} onPress={() => requireAuth()}>
            <Text style={styles.primaryBtnText}>{t('common.login')}</Text>
          </Pressable>
        </View>
      ) : tab === 'profiles' ? (
        profilesLoading ? (
          <View style={styles.skeletonWrap}>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} style={styles.profileSkeleton} />
            ))}
          </View>
        ) : (
          <FlatList
            data={profiles}
            keyExtractor={(p) => String(p.id)}
            contentContainerStyle={styles.profilesList}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyTitle}>{t('favorites.profilesEmptyTitle')}</Text>
                <Text style={styles.emptyText}>{t('favorites.profilesEmptyText')}</Text>
              </View>
            }
            renderItem={({ item }) => (
              <SubscriptionProfileRow
                profile={item}
                adsLabel={t('favorites.sellerAds')}
                unsubscribeLabel={t('favorites.unsubscribe')}
                onOpen={() => router.push(`/users/${item.id}`)}
                onUnsubscribe={() => unsubscribe(String(item.id))}
              />
            )}
          />
        )
      ) : loading ? (
        <AdCardSkeletonGrid count={8} />
      ) : (
        <ContentReveal>
          <FlatList
          key="favorites-ads-grid"
          data={data?.content || []}
          keyExtractor={(a) => a.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>{t('favorites.empty')}</Text>}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <AdCard ad={item} variant="grid" onToggleFavorite={handleFavoriteClick} />
            </View>
          )}
        />
        </ContentReveal>
      )}
    </SafeAreaView>
  );
}
