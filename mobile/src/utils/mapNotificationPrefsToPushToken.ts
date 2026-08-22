import type { NotificationPreference } from '@/api/notifications';

export function mapNotificationPrefsToPushToken(prefs: NotificationPreference) {
  if (!prefs.pushEnabled) {
    return { chatEnabled: false, systemEnabled: false, promoEnabled: false };
  }
  return {
    chatEnabled: prefs.chatEnabled,
    systemEnabled:
      prefs.favoriteEnabled ||
      prefs.adEnabled ||
      prefs.profileEnabled ||
      prefs.paymentEnabled ||
      prefs.dealEnabled ||
      prefs.regionalEnabled,
    promoEnabled: prefs.promotionEnabled || prefs.marketingEnabled,
  };
}
