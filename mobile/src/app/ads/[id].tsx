import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { referenceApi } from '@/api/client';
import { AdDetailCharacteristics } from '@/components/AdDetailCharacteristics/AdDetailCharacteristics';
import { AdDetailContacts } from '@/components/AdDetailContacts/AdDetailContacts';
import { AdDetailGallery } from '@/components/AdDetailGallery/AdDetailGallery';
import { AdDetailHeader } from '@/components/AdDetailHeader/AdDetailHeader';
import { AdDetailPromoBanners } from '@/components/AdDetailPromoBanners/AdDetailPromoBanners';
import { AdDetailSellerCard } from '@/components/AdDetailSellerCard/AdDetailSellerCard';
import { AdDetailStickyBar } from '@/components/AdDetailStickyBar/AdDetailStickyBar';
import { AdLocationBlock } from '@/components/AdLocationBlock/AdLocationBlock';
import { RelatedAdsSection } from '@/components/RelatedAdsSection/RelatedAdsSection';
import { ReportSheet } from '@/components/ReportSheet/ReportSheet';
import { resolveSellerBadge } from '@/constants/sellerTypes';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRegionLabel } from '@/context/RegionsContext';
import { useAdDetail } from '@/hooks/useAdDetail';
import { useAdDetailActions } from '@/hooks/useAdDetailActions';
import { useFavoriteClick } from '@/hooks/useFavoriteClick';
import { usePriceWatch } from '@/hooks/usePriceWatch';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import { buildAdCharacteristicRows } from '@/utils/adCharacteristicRows';
import { hasTelegramContact } from '@/utils/contacts';
import { extractLocationFromDescription } from '@/utils/descriptionLocation';
import { buildPriceInsight } from '@/utils/priceInsight';
import { localizedName } from '@/utils/localizedName';

import { styles } from '@/styles/screens/adDetail.styles';

const FALLBACK_USD_UZS = 12800;

export default function AdDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isAuthenticated, user } = useAuth();
  const requireAuth = useRequireAuth();
  const { language, t } = useLanguage();
  const { ad, setAd, loading, sellerAds, similar, sellerProfile, setSellerProfile } = useAdDetail(id);
  const [reportOpen, setReportOpen] = useState(false);
  const [usdToUzs, setUsdToUzs] = useState(FALLBACK_USD_UZS);
  const [categoryInfo, setCategoryInfo] = useState<{ nameUz?: string; nameRu?: string; code?: string } | null>(
    null
  );
  const regionLabel = useRegionLabel(ad?.region);

  const updateRelatedFavorite = useCallback(
    (adId: string, favorite: boolean) => {
      if (ad?.id === adId) setAd((prev) => (prev ? { ...prev, favorite } : prev));
    },
    [ad?.id, setAd]
  );
  const handleRelatedFavorite = useFavoriteClick(updateRelatedFavorite);
  const priceWatch = usePriceWatch(ad);

  const {
    phoneRevealed,
    creatingChat,
    subscribing,
    toggleFavorite,
    openChat,
    onPhone,
    onTelegram,
    toggleSubscribe,
  } = useAdDetailActions({
    ad,
    isAuthenticated,
    userId: user?.id,
    requireAuth,
    setAd,
    setSellerProfile,
  });

  useEffect(() => {
    referenceApi
      .getCurrencyRate()
      .then((rate) => {
        const value = Number((rate as { usdToUzs?: number })?.usdToUzs);
        if (value > 0) setUsdToUzs(value);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!ad?.category) {
      setCategoryInfo(null);
      return;
    }
    referenceApi
      .getCategory(ad.category)
      .then((c) => {
        const cat = c as { nameUz?: string; nameRu?: string; code?: string } | null;
        setCategoryInfo(cat || { code: ad.category, nameUz: ad.category, nameRu: ad.category });
      })
      .catch(() => setCategoryInfo({ code: ad.category, nameUz: ad.category, nameRu: ad.category }));
  }, [ad?.category]);

  const categoryLabel = localizedName(categoryInfo, language, ad?.category || '');
  const location = useMemo(
    () => extractLocationFromDescription(ad?.description),
    [ad?.description]
  );
  const characteristicRows = useMemo(
    () =>
      buildAdCharacteristicRows(ad, {
        language,
        categoryLabel,
        regionLabel: regionLabel || ad?.region || '',
        t,
      }),
    [ad, categoryLabel, language, regionLabel, t]
  );

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />;
  }
  if (!ad) {
    return (
      <View style={styles.center}>
        <Text>{t('ads.notFound', "E'lon topilmadi")}</Text>
      </View>
    );
  }

  const images = ad.images?.length ? ad.images.map((img) => img.url).filter(Boolean) : [];
  const isOwner = user?.id === ad.userId;
  const showTelegram = hasTelegramContact(ad.telegramUsername, ad.phone);
  const sellerName =
    (sellerProfile?.displayName as string) || ad.userDisplayName || t('ads.seller', 'Sotuvchi');
  const sellerAvatarRaw =
    (sellerProfile?.avatar as string) || (sellerProfile?.avatarUrl as string) || null;
  const subscribed = Boolean(sellerProfile?.subscribed);
  const adsCount = Number(sellerProfile?.adsCount ?? 0);
  const sellerBadge = resolveSellerBadge(ad);
  const sellerTypeLabel = t(sellerBadge.labelKey);
  const priceInsight = buildPriceInsight(ad, similar, usdToUzs);
  const address = ad.address || location.address;
  const landmark = ad.landmark || location.landmark;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Stack.Screen
          options={{
            title: '',
            headerBackTitle: t('common.back'),
            headerRight: () =>
              !isOwner ? (
                <Pressable
                  onPress={() => requireAuth(() => setReportOpen(true))}
                  hitSlop={8}
                  style={styles.headerReport}
                >
                  <Ionicons name="flag-outline" size={20} color={colors.error} />
                </Pressable>
              ) : null,
          }}
        />

        <AdDetailGallery images={images} insight={priceInsight} t={t} />

        <View style={styles.content}>
          <AdDetailHeader
            ad={ad}
            categoryLabel={categoryLabel}
            regionLabel={regionLabel || ''}
            watching={priceWatch.watching}
            onToggleFavorite={toggleFavorite}
            onTogglePriceWatch={priceWatch.toggle}
            t={t}
          />

          {!isOwner && (
            <AdDetailContacts
              ad={ad}
              creatingChat={creatingChat}
              phoneRevealed={phoneRevealed}
              isAuthenticated={isAuthenticated}
              showTelegram={showTelegram}
              onOpenChat={openChat}
              onPhone={onPhone}
              onTelegram={onTelegram}
            />
          )}

          <AdDetailSellerCard
            userId={ad.userId}
            sellerName={sellerName}
            sellerAvatarRaw={sellerAvatarRaw}
            sellerTypeLabel={sellerTypeLabel}
            adsCount={adsCount}
            isOwner={isOwner}
            subscribed={subscribed}
            subscribing={subscribing}
            onToggleSubscribe={toggleSubscribe}
          />

          {!isOwner ? (
            <Pressable style={styles.reportLink} onPress={() => requireAuth(() => setReportOpen(true))}>
              <Ionicons name="flag-outline" size={16} color={colors.error} />
              <Text style={styles.reportLinkText}>{t('ads.report', 'Shikoyat qilish')}</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('ads.description', 'Tavsif')}</Text>
          <Text style={styles.description}>{location.description || ad.description}</Text>

          <AdDetailCharacteristics
            title={t('ads.characteristics', 'Xususiyatlar')}
            rows={characteristicRows}
          />

          <AdLocationBlock
            title={t('ads.locationTitle', 'Manzil')}
            regionLabel={regionLabel || ad.region}
            district={ad.district}
            address={address}
            landmark={landmark}
            canDeliver={ad.canDeliver}
            lat={ad.locationLat}
            lng={ad.locationLng}
            deliverLabel={t('ads.possibleDelivery', 'Yetkazib berish mumkin')}
            landmarkLabel={t('edit.landmark', "Yo'nalish")}
            openMapsLabel={t('ads.openOnMap', 'Xaritada ochish')}
          />
        </View>

        <AdDetailPromoBanners />

        <RelatedAdsSection
          title={t('ads.sellerAdsTitle', "Sotuvchining e'lonlari")}
          ads={sellerAds}
          onToggleFavorite={handleRelatedFavorite}
        />
        <RelatedAdsSection
          title={t('ads.similarAds')}
          ads={similar.slice(0, 10)}
          onToggleFavorite={handleRelatedFavorite}
          collapsible
          defaultOpen={false}
        />

        <ReportSheet
          visible={reportOpen}
          adId={ad.id}
          onClose={() => setReportOpen(false)}
          onAuthRequired={() => requireAuth()}
        />
      </ScrollView>
      {!isOwner ? (
        <AdDetailStickyBar
          creatingChat={creatingChat}
          hasPhone={!!ad.phone}
          showTelegram={showTelegram}
          onOpenChat={openChat}
          onPhone={onPhone}
          onTelegram={onTelegram}
        />
      ) : null}
    </View>
  );
}
