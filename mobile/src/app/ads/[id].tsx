import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { adsApi, chatApi, imageUrl, isAuthError, referenceApi, usersApi } from '@/api/client';
import { AdLocationBlock } from '@/components/AdLocationBlock/AdLocationBlock';
import { RelatedAdsSection } from '@/components/RelatedAdsSection/RelatedAdsSection';
import { ReportSheet } from '@/components/ReportSheet/ReportSheet';
import { PriceInsight } from '@/components/PriceInsight/PriceInsight';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRegionLabel } from '@/context/RegionsContext';
import { useAdDetail } from '@/hooks/useAdDetail';
import { useFavoriteClick } from '@/hooks/useFavoriteClick';
import { usePriceWatch } from '@/hooks/usePriceWatch';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import { buildTelegramUrl, hasTelegramContact, maskPhone, telUrl } from '@/utils/contacts';
import { extractLocationFromDescription } from '@/utils/descriptionLocation';
import { setPendingChat, takePendingChat } from '@/utils/pendingChat';
import { formatDate, formatPrice } from '@/utils/formatters';
import { buildPriceInsight } from '@/utils/priceInsight';
import { resolveSellerBadge } from '@/constants/sellerTypes';
import { localizedName } from '@/utils/localizedName';
import { openExternalUrl } from '@/utils/openExternalUrl';

import { styles } from '@/styles/screens/adDetail.styles';

const { width } = Dimensions.get('window');
const FALLBACK_USD_UZS = 12800;

export default function AdDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isAuthenticated, user } = useAuth();
  const requireAuth = useRequireAuth();
  const { language, t } = useLanguage();
  const { ad, setAd, loading, sellerAds, similar, sellerProfile, setSellerProfile } = useAdDetail(id);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
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

  const toggleFavorite = useCallback(() => {
    if (!ad) return;
    requireAuth(() => {
      adsApi
        .toggleFavorite(ad.id)
        .then((favorite) => setAd((prev) => (prev ? { ...prev, favorite: !!favorite } : prev)))
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
        });
    });
  }, [ad, requireAuth, setAd]);

  const openChat = useCallback(() => {
    if (!ad) return;
    if (!isAuthenticated) {
      void setPendingChat({ adId: ad.id });
      requireAuth();
      return;
    }
    requireAuth(() => {
      setCreatingChat(true);
      chatApi
        .getOrCreateConversation(ad.id)
        .then((conv) => {
          const c = conv as { id: string };
          router.push(`/chat/${c.id}`);
        })
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
          else Alert.alert('Xatolik', err instanceof Error ? err.message : 'Chat ochilmadi');
        })
        .finally(() => setCreatingChat(false));
    });
  }, [ad, isAuthenticated, requireAuth]);

  useEffect(() => {
    if (!isAuthenticated || !ad?.id || user?.id === ad.userId) return;
    const pending = takePendingChat();
    if (!pending?.adId) return;
    if (pending.adId !== ad.id) {
      void setPendingChat(pending);
      return;
    }
    setCreatingChat(true);
    chatApi
      .getOrCreateConversation(ad.id)
      .then(async (conv) => {
        const c = conv as { id: string };
        if (pending.text) {
          await chatApi.sendMessage(c.id, pending.text);
        }
        router.push(`/chat/${c.id}`);
      })
      .catch(() => {})
      .finally(() => setCreatingChat(false));
  }, [ad?.id, isAuthenticated, user?.id]);

  const onPhone = useCallback(() => {
    if (!ad?.phone) return;
    requireAuth(() => {
      if (phoneRevealed) {
        void openExternalUrl(telUrl(ad.phone), 'Telefon chaqiruvi mavjud emas');
      } else setPhoneRevealed(true);
    });
  }, [ad, phoneRevealed, requireAuth]);

  const onTelegram = useCallback(() => {
    if (!ad) return;
    const url = buildTelegramUrl(ad.telegramUsername, ad.phone);
    if (!url) return;
    requireAuth(() => {
      void openExternalUrl(url);
    });
  }, [ad, requireAuth]);

  const toggleSubscribe = useCallback(() => {
    if (!ad?.userId) return;
    requireAuth(() => {
      setSubscribing(true);
      usersApi
        .toggleSubscribe(ad.userId)
        .then((subscribed) => {
          setSellerProfile((prev) => ({ ...(prev || {}), subscribed: !!subscribed }));
        })
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
        })
        .finally(() => setSubscribing(false));
    });
  }, [ad?.userId, requireAuth, setSellerProfile]);

  const location = useMemo(
    () => extractLocationFromDescription(ad?.description),
    [ad?.description]
  );

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />;
  }
  if (!ad) {
    return (
      <View style={styles.center}>
        <Text>E'lon topilmadi</Text>
      </View>
    );
  }

  const images = ad.images?.length ? ad.images.map((img) => img.url).filter(Boolean) : [];
  const isOwner = user?.id === ad.userId;
  const showTelegram = hasTelegramContact(ad.telegramUsername, ad.phone);
  const sellerName =
    (sellerProfile?.displayName as string) || ad.userDisplayName || 'Sotuvchi';
  const sellerAvatarRaw =
    (sellerProfile?.avatar as string) || (sellerProfile?.avatarUrl as string) || null;
  const subscribed = Boolean(sellerProfile?.subscribed);
  const adsCount = Number(sellerProfile?.adsCount ?? 0);

  const sellerBadge = resolveSellerBadge(ad);
  const sellerTypeLabel = t(sellerBadge.labelKey);
  const priceInsight = buildPriceInsight(ad, similar, usdToUzs);

  return (
    <View style={styles.container}>
    <ScrollView style={styles.scroll} nestedScrollEnabled>
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

      {images.length > 0 ? (
        <View style={styles.galleryWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / width);
              setGalleryIndex(i);
            }}
          >
            {images.map((uri, i) => (
              <Image
                key={`${uri}-${i}`}
                source={{ uri: imageUrl(uri) }}
                style={[styles.gallery, { width, height: width }]}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          {images.length > 1 ? (
            <View style={styles.galleryCounter}>
              <Text style={styles.galleryCounterText}>
                {galleryIndex + 1}/{images.length}
              </Text>
            </View>
          ) : null}
          <PriceInsight insight={priceInsight} t={t} overlay />
        </View>
      ) : (
        <View style={[styles.gallery, styles.galleryPlaceholder, { width, height: width }]}>
          <Ionicons name="image-outline" size={48} color={colors.muted} />
          <PriceInsight insight={priceInsight} t={t} overlay />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatPrice(ad.price, ad.currency)}
            {ad.isNegotiable ? ' (Kelishiladi)' : ''}
          </Text>
          <Pressable onPress={toggleFavorite} hitSlop={8}>
            <Ionicons
              name={ad.favorite ? 'heart' : 'heart-outline'}
              size={26}
              color={ad.favorite ? colors.favorite : colors.text}
            />
          </Pressable>
        </View>
        <Text style={styles.title}>{ad.title}</Text>
        <Pressable onPress={priceWatch.toggle} hitSlop={8}>
          <Text style={styles.trackPrice}>
            {priceWatch.watching ? t('ads.trackPriceStop') : t('ads.trackPrice')} ›
          </Text>
        </Pressable>
        {ad.category ? (
          <Pressable onPress={() => router.push(`/categories/${ad.category}`)}>
            <Text style={styles.categoryLink}>{categoryLabel || ad.category}</Text>
          </Pressable>
        ) : null}
        <Text style={styles.meta}>
          {regionLabel || ad.region}
          {ad.district ? `, ${ad.district}` : ''}
          {ad.createdAt ? ` · ${formatDate(ad.createdAt)}` : ''} · {ad.views ?? 0} ko'rildi
        </Text>

        {!isOwner && (
          <View style={styles.contacts}>
            <Text style={styles.contactsTitle}>Aloqa usullari</Text>
            <Pressable style={[styles.contactBtn, styles.contactBtnPrimary]} onPress={openChat} disabled={creatingChat}>
              <View style={[styles.contactIconWrap, styles.contactIconWrapOnPrimary]}>
                {creatingChat ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Ionicons name="chatbubble-outline" size={18} color={colors.white} />
                )}
              </View>
              <View style={styles.contactBody}>
                <Text style={[styles.contactLabel, styles.contactLabelOnPrimary]}>Chat</Text>
                <Text style={[styles.contactHint, styles.contactHintOnPrimary]}>Ilova ichida yozing</Text>
              </View>
            </Pressable>

            {!!ad.phone && (
              <Pressable style={styles.contactBtn} onPress={onPhone}>
                <View style={styles.contactIconWrap}>
                  <Ionicons name="call-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.contactBody}>
                  <Text style={styles.contactLabel}>Telefon qo'ng'irog'i</Text>
                  <Text style={styles.contactHint}>
                    {phoneRevealed && isAuthenticated ? ad.phone : maskPhone(ad.phone) || "Raqamni ko'rsatish"}
                  </Text>
                </View>
              </Pressable>
            )}

            {showTelegram && (
              <Pressable style={styles.contactBtn} onPress={onTelegram}>
                <View style={styles.contactIconWrap}>
                  <Ionicons name="paper-plane-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.contactBody}>
                  <Text style={styles.contactLabel}>Telegram chat</Text>
                  <Text style={styles.contactHint}>
                    {ad.telegramUsername?.trim()
                      ? `@${ad.telegramUsername.replace(/^@/, '')}`
                      : 'Telegram orqali'}
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        )}

        <View style={styles.sellerCard}>
          <Pressable style={styles.sellerMain} onPress={() => router.push(`/users/${ad.userId}`)}>
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
              onPress={toggleSubscribe}
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

        {!isOwner ? (
          <Pressable style={styles.reportLink} onPress={() => requireAuth(() => setReportOpen(true))}>
            <Ionicons name="flag-outline" size={16} color={colors.error} />
            <Text style={styles.reportLinkText}>Shikoyat qilish</Text>
          </Pressable>
        ) : null}

        <Text style={styles.sectionTitle}>Tavsif</Text>
        <Text style={styles.description}>{location.description || ad.description}</Text>

        <AdLocationBlock
          regionLabel={regionLabel || ad.region}
          district={ad.district}
          address={location.address}
          landmark={location.landmark}
          canDeliver={ad.canDeliver}
        />
      </View>

      <RelatedAdsSection
        title="Sotuvchining e'lonlari"
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
      <View style={styles.stickyBar}>
        <Pressable style={[styles.stickyBtn, styles.stickyBtnPrimary]} onPress={openChat} disabled={creatingChat}>
          <Text style={styles.stickyBtnPrimaryText}>{creatingChat ? '...' : 'Chat'}</Text>
        </Pressable>
        {!!ad.phone && (
          <Pressable style={styles.stickyBtn} onPress={onPhone}>
            <Text style={styles.stickyBtnText}>Tel</Text>
          </Pressable>
        )}
        {showTelegram && (
          <Pressable style={styles.stickyBtn} onPress={onTelegram}>
            <Text style={styles.stickyBtnText}>Telegram</Text>
          </Pressable>
        )}
      </View>
    ) : null}
    </View>
  );
}
