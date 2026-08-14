import { Linking, FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { adsApi, referenceApi } from '@/api/client';
import { AdCard } from '@/components/AdCard';
import { CategoryBento } from '@/components/CategoryBento/CategoryBento';
import { CategoryBentoSkeleton } from '@/components/CategoryBento/CategoryBentoSkeleton';
import { FeedSettingsSheet } from '@/components/FeedSettingsSheet/FeedSettingsSheet';
import { FeedTabs, type FeedTabId } from '@/components/FeedTabs/FeedTabs';
import { HomeCtaStrip } from '@/components/HomeCtaStrip/HomeCtaStrip';
import { HomeHeader } from '@/components/HomeHeader/HomeHeader';
import { PromoBanners, type PromoBannerItem } from '@/components/PromoBanners/PromoBanners';
import { TopAdStrip } from '@/components/TopAdStrip/TopAdStrip';
import { AdCardSkeletonGrid } from '@/components/ui/AdCardSkeletonGrid/AdCardSkeletonGrid';
import { useLanguage } from '@/context/LanguageContext';
import { useRegions } from '@/context/RegionsContext';
import { useFavoriteClick } from '@/hooks/useFavoriteClick';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import type { AdListItemDto, CategoryDto, PageResponse } from '@/types/api';
import { mapPromoBanner } from '@/utils/mapPromoBanner';
import { orderHomeCategories } from '@/utils/orderHomeCategories';

import { styles } from '@/styles/screens/home.styles';

const PAGE_SIZE = 20;

export default function HomeScreen() {
  const requireAuth = useRequireAuth();
  const { t } = useLanguage();
  const { getRegionLabel } = useRegions();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [banners, setBanners] = useState<PromoBannerItem[]>([]);
  const [draftQuery, setDraftQuery] = useState('');
  const [query, setQuery] = useState('');
  const [feedTab, setFeedTab] = useState<FeedTabId>('recommended');
  const [feedSettingsOpen, setFeedSettingsOpen] = useState(false);
  const [draftInterests, setDraftInterests] = useState<string[]>([]);
  const [appliedInterests, setAppliedInterests] = useState<string[]>([]);
  const [draftRegion, setDraftRegion] = useState('');
  const [appliedRegion, setAppliedRegion] = useState('');
  const [data, setData] = useState<PageResponse<AdListItemDto>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: PAGE_SIZE,
    last: true,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setCategoriesLoading(true);
    referenceApi
      .getCategoriesForHome()
      .then(async (list) => {
        if (Array.isArray(list) && list.length > 0) return list as CategoryDto[];
        const roots = await referenceApi.getCategories();
        return Array.isArray(roots) ? (roots as CategoryDto[]) : [];
      })
      .then(setCategories)
      .catch(() => {
        referenceApi
          .getCategories()
          .then((list) => setCategories(Array.isArray(list) ? (list as CategoryDto[]) : []))
          .catch(() => setCategories([]));
      })
      .finally(() => setCategoriesLoading(false));

    referenceApi
      .getHomePromoBanners()
      .then((list) => {
        if (!Array.isArray(list)) return setBanners([]);
        setBanners(list.map((b, i) => mapPromoBanner(b as Record<string, unknown>, i)));
      })
      .catch(() => setBanners([]));
  }, []);

  const loadPage = useCallback(
    (page: number, q: string, tab: FeedTabId, interests: string[], region: string) => {
      const params: Record<string, unknown> = { page, size: PAGE_SIZE };
      if (q.trim()) params.q = q.trim();
      if (tab === 'fresh') params.sort = 'createdAt,desc';
      if (interests.length === 1) params.category = interests[0];
      if (region) params.region = region;
      return adsApi.list(params) as Promise<PageResponse<AdListItemDto>>;
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    loadPage(0, query, feedTab, appliedInterests, appliedRegion)
      .then(setData)
      .catch(() => setData((prev) => ({ ...prev, content: [] })))
      .finally(() => setLoading(false));
  }, [query, feedTab, appliedInterests, appliedRegion, loadPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || data.last) return;
    setLoadingMore(true);
    loadPage(data.number + 1, query, feedTab, appliedInterests, appliedRegion)
      .then((res) => setData((prev) => ({ ...res, content: [...prev.content, ...res.content] })))
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loading, loadingMore, data.last, data.number, query, feedTab, appliedInterests, appliedRegion, loadPage]);

  const updateFavorite = useCallback((adId: string, favorite: boolean) => {
    setData((prev) => ({ ...prev, content: prev.content.map((a) => (a.id === adId ? { ...a, favorite } : a)) }));
  }, []);
  const handleFavoriteClick = useFavoriteClick(updateFavorite);

  const submitSearch = () => setQuery(draftQuery.trim());
  const bentoCategories = useMemo(() => orderHomeCategories(categories).slice(0, 7), [categories]);
  const regionLabel = appliedRegion ? getRegionLabel(appliedRegion) : t('categories.allRegions');

  const openSettings = useCallback(() => {
    setDraftInterests(appliedInterests);
    setDraftRegion(appliedRegion);
    setFeedSettingsOpen(true);
  }, [appliedInterests, appliedRegion]);

  const onPromoPress = useCallback((banner: PromoBannerItem) => {
    const link = banner.linkUrl?.trim();
    if (!link) return;
    if (link.startsWith('http')) {
      Linking.openURL(link).catch(() => {});
      return;
    }
    if (link.includes('/ads/create') || link.includes('create')) {
      router.push('/(tabs)/sell');
      return;
    }
    if (link.includes('/categories/')) {
      const code = link.split('/categories/')[1]?.split(/[?#]/)[0];
      if (code) router.push(`/categories/${code}`);
    }
  }, []);

  const header = useMemo(
    () => (
      <View>
        <TopAdStrip />
        <HomeHeader
          regionLabel={regionLabel}
          query={draftQuery}
          onQueryChange={setDraftQuery}
          onSubmit={submitSearch}
          onFilterPress={openSettings}
        />
        <HomeCtaStrip onPress={() => requireAuth(() => router.push('/ads/create'))} />
        {categoriesLoading && categories.length === 0 ? (
          <CategoryBentoSkeleton />
        ) : (
          <CategoryBento
            categories={bentoCategories}
            onPress={(c) => router.push(`/categories/${c.code}`)}
            onAllPress={openSettings}
          />
        )}
        <PromoBanners banners={banners} onPress={onPromoPress} />
        <FeedTabs active={feedTab} onChange={setFeedTab} />
      </View>
    ),
    [draftQuery, bentoCategories, banners, feedTab, onPromoPress, regionLabel, openSettings, requireAuth, categoriesLoading, categories.length]
  );

  const showInitialSkeleton = loading && data.content.length === 0;
  const showRefreshing = loading && data.content.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        key="home-ads-grid"
        data={showInitialSkeleton ? [] : data.content}
        keyExtractor={(a) => a.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {header}
            {showInitialSkeleton ? <AdCardSkeletonGrid count={6} /> : null}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <AdCard ad={item} variant="grid" onToggleFavorite={handleFavoriteClick} />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          !showInitialSkeleton ? (
            <Text style={styles.empty}>{t('home.noAds', "E'lonlar topilmadi")}</Text>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? <AdCardSkeletonGrid count={4} faded /> : null
        }
      />

      {showRefreshing ? <View style={styles.refreshVeil} pointerEvents="none" /> : null}

      <FeedSettingsSheet
        visible={feedSettingsOpen}
        onClose={() => setFeedSettingsOpen(false)}
        regionCode={draftRegion}
        categories={categories}
        selectedCodes={draftInterests}
        onChangeInterests={setDraftInterests}
        onChangeRegion={setDraftRegion}
        onSave={() => {
          setAppliedInterests(draftInterests);
          setAppliedRegion(draftRegion);
          setFeedSettingsOpen(false);
        }}
        onReset={() => {
          setDraftInterests([]);
          setAppliedInterests([]);
          setDraftRegion('');
          setAppliedRegion('');
          setFeedSettingsOpen(false);
        }}
      />
    </SafeAreaView>
  );
}
