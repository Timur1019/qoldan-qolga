import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform, Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NotificationPreference } from '@/api/notifications';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNotificationPermission } from '@/context/NotificationPermissionContext';
import { hasOsNotificationPermission } from '@/notifications/notificationConsent';
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
} from '@/notifications/notificationPrefs';
import { syncExpoPushToken } from '@/notifications/syncExpoPushToken';
import { styles } from '@/styles/screens/notifications.styles';
import { colors } from '@/theme/colors';

type PrefKey = keyof Pick<
  NotificationPreference,
  | 'pushEnabled'
  | 'chatEnabled'
  | 'favoriteEnabled'
  | 'adEnabled'
  | 'promotionEnabled'
  | 'paymentEnabled'
  | 'profileEnabled'
>;

export default function NotificationsSettingsScreen() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { enableNotifications } = useNotificationPermission();
  const [prefs, setPrefs] = useState<NotificationPreference | null>(null);
  const [osGranted, setOsGranted] = useState(true);

  const refreshPermission = useCallback(async () => {
    setOsGranted(await hasOsNotificationPermission());
  }, []);

  useEffect(() => {
    void refreshPermission();
    if (!isAuthenticated) return;
    void loadNotificationPrefs().then(setPrefs);
  }, [isAuthenticated, refreshPermission]);

  const onToggle = (key: PrefKey, value: boolean) => {
    setPrefs((prev) => (prev ? { ...prev, [key]: value } : prev));
    void (async () => {
      const saved = await saveNotificationPrefs({ [key]: value });
      setPrefs(saved);
      if (isAuthenticated && (await hasOsNotificationPermission())) {
        await syncExpoPushToken().catch(() => {});
      }
    })();
  };

  const openSystemSettings = () => {
    if (Platform.OS === 'ios') void Linking.openURL('app-settings:');
    else void Linking.openSettings();
  };

  const rows: { key: PrefKey; title: string; sub: string }[] = [
    { key: 'pushEnabled', title: t('settings.notifPushAll'), sub: t('settings.notifPushAllSub') },
    { key: 'chatEnabled', title: t('settings.notifChat'), sub: t('settings.notifChatSub') },
    { key: 'favoriteEnabled', title: t('settings.notifFavorite'), sub: t('settings.notifFavoriteSub') },
    { key: 'adEnabled', title: t('settings.notifAds'), sub: t('settings.notifAdsSub') },
    { key: 'promotionEnabled', title: t('settings.notifPromo'), sub: t('settings.notifPromoSub') },
    { key: 'paymentEnabled', title: t('settings.notifPayment'), sub: t('settings.notifPaymentSub') },
    { key: 'profileEnabled', title: t('settings.notifProfile'), sub: t('settings.notifProfileSub') },
  ];

  const enabled = prefs?.pushEnabled !== false && osGranted;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('settings.notificationsTitle') }} />

      {!osGranted ? (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{t('notify.permissionDeniedTitle')}</Text>
          <Text style={styles.bannerText}>{t('notify.settingsHint')}</Text>
          <Pressable style={styles.bannerBtn} onPress={() => void enableNotifications().then(refreshPermission)}>
            <Text style={styles.bannerBtnText}>{t('notify.permissionAllow')}</Text>
          </Pressable>
          <Pressable style={styles.bannerLink} onPress={openSystemSettings}>
            <Text style={styles.bannerLinkText}>{t('notify.openSettings')}</Text>
          </Pressable>
        </View>
      ) : null}

      {!isAuthenticated ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{t('notify.inboxLoginText')}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        {rows.map((row, index) => (
          <View key={row.key} style={[styles.row, index === rows.length - 1 && styles.rowLast]}>
            <View style={styles.textCol}>
              <Text style={styles.title}>{row.title}</Text>
              <Text style={styles.sub}>{row.sub}</Text>
            </View>
            <Switch
              value={Boolean(prefs?.[row.key]) && (row.key === 'pushEnabled' ? osGranted : enabled)}
              onValueChange={(v) => onToggle(row.key, v)}
              disabled={!isAuthenticated || !osGranted || (row.key !== 'pushEnabled' && !enabled)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
