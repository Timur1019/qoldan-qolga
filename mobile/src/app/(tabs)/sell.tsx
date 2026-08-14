import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { adsApi } from '@/api/client';
import { MyAdCard } from '@/components/MyAds/MyAdCard';
import { MyAdsActionSheet } from '@/components/MyAds/MyAdsActionSheet';
import { MyAdsEmpty } from '@/components/MyAds/MyAdsEmpty';
import { MyAdsTabs } from '@/components/MyAds/MyAdsTabs';
import { MyAdsTips } from '@/components/MyAds/MyAdsTips';
import { ProfileInfoSheet } from '@/components/Profile/ProfileInfoSheet';
import { PromoSheet } from '@/components/PromoSheet/PromoSheet';
import {
  AD_STATUS,
  countMyAdsByTab,
  filterMyAdsByTab,
  type MyAdsTabKey,
} from '@/constants/myAds';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import type { AdListItemDto, PageResponse } from '@/types/api';

import { styles } from '@/styles/screens/sell.styles';

export default function SellScreen() {
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();
  const { t } = useLanguage();
  const [ads, setAds] = useState<AdListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<MyAdsTabKey>('active');
  const [menuAd, setMenuAd] = useState<AdListItemDto | null>(null);
  const [promoAd, setPromoAd] = useState<AdListItemDto | null>(null);
  const [infoKind, setInfoKind] = useState<'sales' | 'tips' | null>(null);

  const goCreate = () => requireAuth(() => router.push('/ads/create'));
  const goEdit = (id: string) => router.push({ pathname: '/ads/create', params: { editId: id } });

  const load = useCallback(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    adsApi
      .myAds({ size: 50 })
      .then((res) => {
        const page = res as PageResponse<AdListItemDto>;
        setAds(
          Array.isArray(page?.content)
            ? page.content
            : Array.isArray(res)
              ? (res as AdListItemDto[])
              : []
        );
      })
      .catch(() => setAds([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const counts = useMemo(
    () => ({
      active: countMyAdsByTab(ads, 'active'),
      drafts: countMyAdsByTab(ads, 'drafts'),
      pending: countMyAdsByTab(ads, 'pending'),
      archive: countMyAdsByTab(ads, 'archive'),
    }),
    [ads]
  );

  const visibleAds = useMemo(() => filterMyAdsByTab(ads, tab), [ads, tab]);

  const emptyCopy =
    tab === 'archive'
      ? {
          title: t('myAds.emptyArchiveTitle'),
          text: t('myAds.emptyArchiveText'),
        }
      : tab === 'drafts'
        ? {
            title: t('myAds.emptyDraftsTitle'),
            text: t('myAds.emptyDraftsText'),
          }
        : tab === 'pending'
          ? {
              title: t('myAds.emptyPendingTitle'),
              text: t('myAds.emptyPendingText'),
            }
          : {
              title: t('myAds.emptyActiveTitle'),
              text: t('myAds.emptyActiveText'),
              actionLabel: t('profile.promoBannerCta'),
              onAction: goCreate,
            };

  const confirmArchive = (ad: AdListItemDto) => {
    Alert.alert("E'lonni yopish", "E'lon arxivga o'tkazilsinmi?", [
      { text: 'Bekor', style: 'cancel' },
      {
        text: 'Yopish',
        style: 'destructive',
        onPress: () => {
          adsApi
            .archive(ad.id)
            .then(() =>
              setAds((prev) =>
                prev.map((a) => (a.id === ad.id ? { ...a, status: AD_STATUS.ARCHIVED } : a))
              )
            )
            .catch((e) => Alert.alert('Xatolik', e instanceof Error ? e.message : 'Xatolik'));
        },
      },
    ]);
  };

  const confirmRestore = (ad: AdListItemDto) => {
    Alert.alert('Arxivdan chiqarish', "E'lon yana faol bo'lsinmi?", [
      { text: 'Bekor', style: 'cancel' },
      {
        text: 'Chiqarish',
        onPress: () => {
          adsApi
            .restore(ad.id)
            .then(() =>
              setAds((prev) =>
                prev.map((a) => (a.id === ad.id ? { ...a, status: AD_STATUS.ACTIVE } : a))
              )
            )
            .catch((e) => Alert.alert('Xatolik', e instanceof Error ? e.message : 'Xatolik'));
        },
      },
    ]);
  };

  const confirmDelete = (ad: AdListItemDto) => {
    Alert.alert("O'chirish", "E'lon butunlay o'chirilsinmi?", [
      { text: 'Bekor', style: 'cancel' },
      {
        text: "O'chirish",
        style: 'destructive',
        onPress: () => {
          adsApi
            .delete(ad.id)
            .then(() => setAds((prev) => prev.filter((a) => a.id !== ad.id)))
            .catch((e) => Alert.alert('Xatolik', e instanceof Error ? e.message : 'Xatolik'));
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.guestWrap}>
          <Text style={styles.guestTitle}>E'lonni bepul joylashtiring</Text>
          <Text style={styles.guestText}>
            Bir necha daqiqada e'lon qo'shing. Uni minglab xaridorlar ko'radi.
          </Text>
          <Pressable style={styles.primaryBtn} onPress={goCreate}>
            <Text style={styles.primaryBtnText}>E'lon qo'yish</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => requireAuth()}>
            <Text style={styles.secondaryBtnText}>Kirish</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('myAds.title')}</Text>
      </View>

      <MyAdsTips
        onSalesPress={() => setInfoKind('sales')}
        onTipsPress={() => setInfoKind('tips')}
      />
      <MyAdsTabs activeTab={tab} counts={counts} onChange={setTab} />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={visibleAds}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <MyAdsEmpty
              title={emptyCopy.title}
              text={emptyCopy.text}
              actionLabel={'actionLabel' in emptyCopy ? emptyCopy.actionLabel : undefined}
              onAction={'onAction' in emptyCopy ? emptyCopy.onAction : undefined}
            />
          }
          renderItem={({ item }) => (
            <MyAdCard
              ad={item}
              onPress={() => router.push(`/ads/${item.id}`)}
              onEdit={() => goEdit(item.id)}
              onMenu={() => setMenuAd(item)}
              onPromote={
                item.status === AD_STATUS.ACTIVE ? () => setPromoAd(item) : undefined
              }
            />
          )}
        />
      )}

      <Pressable style={styles.fab} onPress={goCreate}>
        <Text style={styles.fabText}>{t('myAds.post')}</Text>
      </Pressable>

      <MyAdsActionSheet
        visible={!!menuAd}
        ad={menuAd}
        onClose={() => setMenuAd(null)}
        onOpen={() => {
          if (!menuAd) return;
          const id = menuAd.id;
          setMenuAd(null);
          router.push(`/ads/${id}`);
        }}
        onEdit={() => {
          if (!menuAd) return;
          const id = menuAd.id;
          setMenuAd(null);
          goEdit(id);
        }}
        onPromote={() => {
          if (!menuAd) return;
          const ad = menuAd;
          setMenuAd(null);
          setPromoAd(ad);
        }}
        onArchive={() => {
          if (!menuAd) return;
          const ad = menuAd;
          setMenuAd(null);
          confirmArchive(ad);
        }}
        onRestore={() => {
          if (!menuAd) return;
          const ad = menuAd;
          setMenuAd(null);
          confirmRestore(ad);
        }}
        onDelete={() => {
          if (!menuAd) return;
          const ad = menuAd;
          setMenuAd(null);
          confirmDelete(ad);
        }}
      />

      <PromoSheet visible={!!promoAd} ad={promoAd} onClose={() => setPromoAd(null)} />

      <ProfileInfoSheet
        visible={infoKind === 'sales'}
        title="Qoldan Qolgada sotish"
        text="Xavfsiz bitim uchun chatda kelishing, shubhali to'lovlardan saqlaning va profilni to'ldiring."
        onClose={() => setInfoKind(null)}
      />
      <ProfileInfoSheet
        visible={infoKind === 'tips'}
        title="Sotuvchi uchun maslahatlar"
        text="Yaxshi rasmlar, aniq narx va to'liq tavsif — e'loningizni ko'proq odamlar ko'radi."
        onClose={() => setInfoKind(null)}
      />
    </SafeAreaView>
  );
}
