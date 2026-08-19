import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { adsApi, authApi, chatApi, favoritesApi, referenceApi } from '@/api/client';
import { FeedSettingsSheet } from '@/components/FeedSettingsSheet/FeedSettingsSheet';
import { ProfileGuestCard } from '@/components/Profile/ProfileGuestCard';
import { ProfileIdRow } from '@/components/Profile/ProfileIdRow';
import { ProfileIdVerifySheet } from '@/components/Profile/ProfileIdVerifySheet';
import { ProfileInfoSheet } from '@/components/Profile/ProfileInfoSheet';
import { ProfileLanguageSheet } from '@/components/Profile/ProfileLanguageSheet';
import { ProfileMenuSection } from '@/components/Profile/ProfileMenuSection';
import { ProfilePromoBanner } from '@/components/Profile/ProfilePromoBanner';
import { ProfileScreenHeader } from '@/components/Profile/ProfileScreenHeader';
import { ProfileSettingsSheet } from '@/components/Profile/ProfileSettingsSheet';
import { ProfileUserCard } from '@/components/Profile/ProfileUserCard';
import { useAuth } from '@/context/AuthContext';
import { useAuthRequired } from '@/context/AuthRequiredContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import type { CategoryDto } from '@/types/api';
import { buildProfileMenus } from '@/utils/buildProfileMenus';
import { isPhotoAvatar } from '@/utils/isPhotoAvatar';
import { pickProfileImage } from '@/utils/pickProfileImage';
import { loadPushInbox, unreadPushCount } from '@/notifications/inboxStorage';

import { styles } from '@/styles/screens/profile.styles';

const SUPPORT_URL = 'https://t.me/qoldanqolga';
const WEB_VERIFY_HINT =
  "To'liq MyID tekshiruvi hozircha veb-versiyada ochiladi. Mobil versiya tez orada.";

type InfoKind = 'prize' | 'orders' | null;

export default function ProfileScreen() {
  const { user, loading, isAuthenticated, logout, refreshUser } = useAuth();
  const requireAuth = useRequireAuth();
  const { closeAuthRequired } = useAuthRequired();
  const { language, setLanguage, t } = useLanguage();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [idVerifyOpen, setIdVerifyOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);
  const [infoKind, setInfoKind] = useState<InfoKind>(null);

  const [myAdsCount, setMyAdsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);
  const [notificationsUnread, setNotificationsUnread] = useState(0);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [draftInterests, setDraftInterests] = useState<string[]>([]);
  const [draftRegion, setDraftRegion] = useState('');

  useEffect(() => {
    setDisplayName(typeof user?.displayName === 'string' ? user.displayName : '');
    setEmail(typeof user?.email === 'string' ? user.email : '');
  }, [user?.displayName, user?.email]);

  useEffect(() => {
    if (isAuthenticated) closeAuthRequired();
  }, [isAuthenticated, closeAuthRequired]);

  useEffect(() => {
    referenceApi
      .getCategories()
      .then((list) => setCategories(Array.isArray(list) ? (list as CategoryDto[]) : []))
      .catch(() => setCategories([]));
  }, []);

  const refreshBadges = useCallback(() => {
    void loadPushInbox()
      .then((items) => setNotificationsUnread(unreadPushCount(items)))
      .catch(() => setNotificationsUnread(0));
    if (!isAuthenticated) {
      setMyAdsCount(0);
      setFavoritesCount(0);
      setChatUnread(0);
      return;
    }
    adsApi
      .myAds({ size: 50 })
      .then((res) => {
        const page = res as { content?: unknown[]; totalElements?: number };
        if (typeof page.totalElements === 'number') setMyAdsCount(page.totalElements);
        else setMyAdsCount(Array.isArray(page?.content) ? page.content.length : 0);
      })
      .catch(() => setMyAdsCount(0));
    favoritesApi
      .list({ size: 1 })
      .then((res) => {
        const page = res as { totalElements?: number; content?: unknown[] };
        if (typeof page.totalElements === 'number') setFavoritesCount(page.totalElements);
        else setFavoritesCount(Array.isArray(page?.content) ? page.content.length : 0);
      })
      .catch(() => setFavoritesCount(0));
    chatApi
      .getConversations()
      .then((list) => {
        const arr = Array.isArray(list) ? list : [];
        setChatUnread(arr.reduce((sum: number, c: { unreadCount?: number }) => sum + (c.unreadCount || 0), 0));
      })
      .catch(() => setChatUnread(0));
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      refreshBadges();
      if (isAuthenticated) void refreshUser();
    }, [refreshBadges, isAuthenticated, refreshUser])
  );

  const idVerified = Boolean(user?.profileVerified);
  const storeVerified = Boolean(user?.storeVerified);

  const { prizeMenu, activityMenu, businessMenu, settingsMenu } = buildProfileMenus({
    t,
    favoritesCount,
    myAdsCount,
    chatUnread,
    notificationsUnread,
    storeVerified,
    onPrize: () => setInfoKind('prize'),
    onFavorites: () => requireAuth(() => router.push('/(tabs)/favorites')),
    onMyAds: () => requireAuth(() => router.push('/(tabs)/sell')),
    onOrders: () => requireAuth(() => setInfoKind('orders')),
    onMessages: () => requireAuth(() => router.push('/(tabs)/chat')),
    onNotifications: () => router.push('/notifications'),
    onBusiness: () => requireAuth(() => router.push('/business')),
    onIdVerify: () => requireAuth(() => setIdVerifyOpen(true)),
    onSupport: () => {
      Linking.openURL(SUPPORT_URL).catch(() =>
        Alert.alert(t('profile.support'), "Hozircha Telegram orqali bog'laning.")
      );
    },
    onFeed: () => setFeedOpen(true),
    onLanguage: () => setLanguageOpen(true),
    onSettings: () => requireAuth(() => router.push('/settings')),
  });

  const currentAvatar =
    (typeof user?.avatar === 'string' && user.avatar) ||
    (typeof user?.avatarUrl === 'string' && user.avatarUrl) ||
    null;
  const currentPhotos = Array.isArray(user?.avatarPhotos)
    ? (user.avatarPhotos as string[])
    : [];

  const save = async () => {
    const name = displayName.trim();
    const mail = email.trim();
    if (!mail) {
      setSavedMsg(t('profile.emailRequired'));
      return;
    }
    setSaving(true);
    setSavedMsg('');
    try {
      const avatar = isPhotoAvatar(currentAvatar) ? currentAvatar : currentAvatar || undefined;
      await authApi.updateProfile({
        displayName: name,
        email: mail,
        avatar: avatar || undefined,
        avatarPhotos: currentPhotos.filter(isPhotoAvatar),
      });
      await refreshUser();
      setSavedMsg(t('common.saved'));
    } catch {
      setSavedMsg(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const changePhoto = async () => {
    try {
      const localUri = await pickProfileImage();
      if (!localUri) return;

      const name =
        displayName.trim() ||
        (typeof user?.displayName === 'string' ? user.displayName : '') ||
        'User';
      const mail =
        email.trim() ||
        (typeof user?.email === 'string' ? user.email : '');
      if (!mail) {
        Alert.alert(t('common.error'), t('profile.emailRequired'));
        setSettingsOpen(true);
        return;
      }

      setPhotoBusy(true);
      setSavedMsg('');
      await uploadAndSaveProfilePhoto({
        displayName: name,
        email: mail,
        localUri,
        currentAvatar,
        currentPhotos,
      });
      await refreshUser();
      setSavedMsg(t('common.saved'));
    } catch (e) {
      const msg = e instanceof Error && e.message === 'PERMISSION'
        ? t('profile.photoPermission')
        : t('profile.photoError');
      Alert.alert(t('common.error'), msg);
    } finally {
      setPhotoBusy(false);
    }
  };

  const infoCopy =
    infoKind === 'prize'
      ? {
          title: t('profile.prize'),
          text: t('profile.prizeInfo'),
        }
      : infoKind === 'orders'
        ? {
            title: t('profile.orders'),
            text: t('profile.ordersInfo'),
          }
        : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const name =
    (typeof user?.displayName === 'string' && user.displayName) ||
    (typeof user?.email === 'string' ? user.email.split('@')[0] : '') ||
    t('profile.userFallback');
  const phone = typeof user?.phone === 'string' ? user.phone : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileScreenHeader />

        {isAuthenticated ? (
          <ProfileUserCard
            name={name}
            phone={phone}
            avatar={currentAvatar}
            isStore={storeVerified}
            photoBusy={photoBusy}
            onEdit={() => setSettingsOpen(true)}
            onChangePhoto={() => void changePhoto()}
            onOpenPublic={() => {
              if (user?.id) router.push(`/users/${user.id}`);
            }}
          />
        ) : (
            <ProfileGuestCard onLogin={() => router.push('/login')} />
        )}

        <ProfilePromoBanner onPress={() => requireAuth(() => router.push('/ads/create'))} />

        <ProfileMenuSection items={prizeMenu} />
        <ProfileMenuSection items={activityMenu} />
        <ProfileMenuSection items={businessMenu} />
        <ProfileMenuSection items={settingsMenu} />

        {isAuthenticated && user?.id ? <ProfileIdRow userId={String(user.id)} /> : null}
        <View style={styles.bottomSpace} />
      </ScrollView>

      <ProfileSettingsSheet
        visible={settingsOpen}
        displayName={displayName}
        email={email}
        avatar={currentAvatar}
        saving={saving}
        photoBusy={photoBusy}
        message={savedMsg}
        onClose={() => {
          setSettingsOpen(false);
          setSavedMsg('');
        }}
        onChangeName={setDisplayName}
        onChangeEmail={setEmail}
        onChangePhoto={() => void changePhoto()}
        onSave={() => void save()}
        onLogout={() => {
          setSettingsOpen(false);
          void logout();
        }}
      />

      <ProfileLanguageSheet
        visible={languageOpen}
        value={language}
        onClose={() => setLanguageOpen(false)}
        onChange={(lang) => {
          void setLanguage(lang);
        }}
      />

      <ProfileIdVerifySheet
        visible={idVerifyOpen}
        verified={idVerified}
        onClose={() => setIdVerifyOpen(false)}
        onStart={() => {
          setIdVerifyOpen(false);
          Alert.alert('ID tekshiruvi', WEB_VERIFY_HINT);
        }}
      />

      <FeedSettingsSheet
        visible={feedOpen}
        onClose={() => setFeedOpen(false)}
        regionCode={draftRegion}
        categories={categories}
        selectedCodes={draftInterests}
        onChangeInterests={setDraftInterests}
        onChangeRegion={setDraftRegion}
        onSave={() => setFeedOpen(false)}
        onReset={() => {
          setDraftInterests([]);
          setDraftRegion('');
          setFeedOpen(false);
        }}
      />

      <ProfileInfoSheet
        visible={!!infoCopy}
        title={infoCopy?.title || ''}
        text={infoCopy?.text || ''}
        onClose={() => setInfoKind(null)}
      />
    </SafeAreaView>
  );
}
