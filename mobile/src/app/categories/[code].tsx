import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { adsApi, referenceApi } from '@/api/client';
import { AdCard } from '@/components/AdCard';
import {
  CategoryFiltersSheet,
  EMPTY_CATEGORY_FILTERS,
  type CategoryFiltersState,
  type RegionOption,
} from '@/components/CategoryFiltersSheet/CategoryFiltersSheet';
import { AdCardSkeleton } from '@/components/ui/AdCardSkeleton/AdCardSkeleton';
import { useFavoriteClick } from '@/hooks/useFavoriteClick';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { AdListItemDto, CategoryDto, PageResponse } from '@/types/api';
import { filtersToListApiParams, isFiltersActive } from '@/utils/categoryFiltersState';
import { localizedName } from '@/utils/localizedName';

import { styles } from '@/styles/screens/category.styles';

const PAGE_SIZE = 20;

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ code: string | string[] }>();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const { language, t } = useLanguage();
  const [info, setInfo] = useState<CategoryDto | null>(null);
  const [children, setChildren] = useState<CategoryDto[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<CategoryDto[]>([]);
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [filters, setFilters] = useState<CategoryFiltersState>(EMPTY_CATEGORY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [data, setData] = useState<PageResponse<AdListItemDto> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    setFilters(EMPTY_CATEGORY_FILTERS);
    referenceApi
      .getCategory(code)
      .then((c) => setInfo((c as CategoryDto) || null))
      .catch(() => setInfo(null));
    referenceApi
      .getCategoryChildren(code)
      .then((list) => setChildren(Array.isArray(list) ? (list as CategoryDto[]) : []))
      .catch(() => setChildren([]));
    referenceApi
      .getCategoryBreadcrumb(code)
      .then((list) => setBreadcrumb(Array.isArray(list) ? (list as CategoryDto[]) : []))
      .catch(() => setBreadcrumb([]));
    referenceApi
      .getRegions()
      .then((list) => setRegions(Array.isArray(list) ? (list as RegionOption[]) : []))
      .catch(() => setRegions([]));
  }, [code]);

  const listParams = useMemo(() => {
    const params = filtersToListApiParams(code, filters);
    params.size = PAGE_SIZE;
    return params;
  }, [code, filters]);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    adsApi
      .list(listParams)
      .then((res) => setData(res as PageResponse<AdListItemDto>))
      .catch(() =>
        setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: PAGE_SIZE, last: true })
      )
      .finally(() => setLoading(false));
  }, [code, listParams]);

  const updateFavorite = useCallback((adId: string, favorite: boolean) => {
    setData((prev) =>
      prev ? { ...prev, content: prev.content.map((a) => (a.id === adId ? { ...a, favorite } : a)) } : prev
    );
  }, []);
  const handleFavoriteClick = useFavoriteClick(updateFavorite);

  const title = localizedName(info, language, code || '');
  const filtersActive = isFiltersActive(filters);

  const header = (
    <View>
      {breadcrumb.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.crumbRow}>
          {breadcrumb.map((b, i) => (
            <Pressable key={b.code} onPress={() => router.push(`/categories/${b.code}`)} style={styles.crumbItem}>
              <Text style={styles.crumbText}>{localizedName(b, language)}</Text>
              {i < breadcrumb.length - 1 ? <Text style={styles.crumbSep}> / </Text> : null}
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {children.length > 0 ? (
        <View style={styles.subChipsWrap}>
          {children.map((c) => (
            <Pressable key={c.code} style={styles.subChip} onPress={() => router.push(`/categories/${c.code}`)}>
              <Text style={styles.subChipText}>{localizedName(c, language)}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.toolbar}>
        <Text style={styles.countText}>
          {loading
            ? '...'
            : t('categories.adsCount', "{n} ta e'lon").replace(
                '{n}',
                String(data?.totalElements ?? data?.content?.length ?? 0)
              )}
        </Text>
        <Pressable style={[styles.filterBtn, filtersActive && styles.filterBtnOn]} onPress={() => setFiltersOpen(true)}>
          <Ionicons name="options-outline" size={18} color={filtersActive ? colors.white : colors.primary} />
          <Text style={[styles.filterBtnText, filtersActive && styles.filterBtnTextOn]}>
            {t('categories.filter', 'Filtr')}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const ads = data?.content ?? [];
  const showInitialSkeleton = loading && ads.length === 0;
  const showRefreshing = loading && ads.length > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />
      <FlatList
        key={`category-ads-list-${code}`}
        data={showInitialSkeleton ? [] : ads}
        keyExtractor={(a) => a.id}
        ListHeaderComponent={
          <>
            {header}
            {showInitialSkeleton
              ? Array.from({ length: 6 }, (_, i) => <AdCardSkeleton key={i} variant="list" />)
              : null}
          </>
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AdCard ad={item} variant="list" onToggleFavorite={handleFavoriteClick} />
        )}
        ListEmptyComponent={
          !showInitialSkeleton ? <Text style={styles.empty}>E'lonlar topilmadi</Text> : null
        }
      />
      {showRefreshing ? <View style={styles.refreshVeil} pointerEvents="none" /> : null}

      <CategoryFiltersSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        regions={regions}
        categoryCode={code}
        breadcrumb={breadcrumb}
        onApply={setFilters}
        onReset={() => setFilters(EMPTY_CATEGORY_FILTERS)}
      />
    </View>
  );
}
