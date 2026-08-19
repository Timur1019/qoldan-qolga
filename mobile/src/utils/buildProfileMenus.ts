import type { ProfileMenuItem } from '@/components/Profile/ProfileMenuRow';

type Translate = (key: string, fallback?: string) => string;

type Handlers = {
  t: Translate;
  favoritesCount: number;
  myAdsCount: number;
  chatUnread: number;
  notificationsUnread?: number;
  storeVerified?: boolean;
  onPrize: () => void;
  onFavorites: () => void;
  onMyAds: () => void;
  onOrders: () => void;
  onMessages: () => void;
  onNotifications: () => void;
  onBusiness: () => void;
  onIdVerify: () => void;
  onSupport: () => void;
  onFeed: () => void;
  onLanguage: () => void;
  onSettings: () => void;
};

/** Меню профиля — без useMemo/stale requireAuth. */
export function buildProfileMenus(h: Handlers): {
  prizeMenu: ProfileMenuItem[];
  activityMenu: ProfileMenuItem[];
  businessMenu: ProfileMenuItem[];
  settingsMenu: ProfileMenuItem[];
} {
  const { t } = h;
  return {
    prizeMenu: [
      {
        key: 'prize',
        label: t('profile.prize'),
        icon: 'car-sport-outline',
        tone: 'promo',
        onPress: h.onPrize,
      },
    ],
    activityMenu: [
      {
        key: 'favorites',
        label: t('profile.favorites'),
        icon: 'heart-outline',
        badge: h.favoritesCount,
        onPress: h.onFavorites,
      },
      {
        key: 'myAds',
        label: t('profile.myAds'),
        icon: 'megaphone-outline',
        badge: h.myAdsCount,
        onPress: h.onMyAds,
      },
      {
        key: 'orders',
        label: t('profile.orders'),
        icon: 'bag-handle-outline',
        onPress: h.onOrders,
      },
      {
        key: 'messages',
        label: t('profile.messages'),
        icon: 'chatbubble-ellipses-outline',
        badge: h.chatUnread,
        onPress: h.onMessages,
      },
      {
        key: 'notifications',
        label: t('profile.notifications'),
        icon: 'notifications-outline',
        badge: h.notificationsUnread,
        onPress: h.onNotifications,
      },
    ],
    businessMenu: [
      {
        key: 'business',
        label: h.storeVerified ? t('profile.businessConnected') : t('profile.business'),
        icon: 'storefront-outline',
        tone: h.storeVerified ? 'accent' : 'default',
        onPress: h.onBusiness,
      },
    ],
    settingsMenu: [
      {
        key: 'idVerify',
        label: t('profile.idVerify'),
        icon: 'person-circle-outline',
        tone: 'accent',
        onPress: h.onIdVerify,
      },
      {
        key: 'support',
        label: t('profile.support'),
        icon: 'paper-plane-outline',
        onPress: h.onSupport,
      },
      {
        key: 'feed',
        label: t('profile.feed'),
        icon: 'options-outline',
        onPress: h.onFeed,
      },
      {
        key: 'language',
        label: t('profile.language'),
        icon: 'language-outline',
        onPress: h.onLanguage,
      },
      {
        key: 'settings',
        label: t('profile.settings'),
        icon: 'settings-outline',
        onPress: h.onSettings,
      },
    ],
  };
}
