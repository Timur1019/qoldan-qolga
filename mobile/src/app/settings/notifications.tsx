import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  getNotificationPrefs,
  setNotificationPref,
  type NotificationPrefKey,
} from '@/notifications/notificationPrefs';
import { syncExpoPushToken } from '@/notifications/syncExpoPushToken';
import { styles } from '@/styles/screens/notifications.styles';
import { colors } from '@/theme/colors';

export default function NotificationsSettingsScreen() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [chat, setChat] = useState(true);
  const [system, setSystem] = useState(true);
  const [promo, setPromo] = useState(true);

  useEffect(() => {
    void getNotificationPrefs().then((p) => {
      setChat(p.chat);
      setSystem(p.system);
      setPromo(p.promo);
    });
  }, []);

  const onToggle = (key: NotificationPrefKey, value: boolean) => {
    if (key === 'chat') setChat(value);
    if (key === 'system') setSystem(value);
    if (key === 'promo') setPromo(value);
    void (async () => {
      await setNotificationPref(key, value);
      if (isAuthenticated) {
        await syncExpoPushToken().catch(() => {});
      }
    })();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('settings.notificationsTitle') }} />
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textCol}>
            <Text style={styles.title}>{t('settings.notifChat')}</Text>
            <Text style={styles.sub}>{t('settings.notifChatSub')}</Text>
          </View>
          <Switch
            value={chat}
            onValueChange={(v) => onToggle('chat', v)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.textCol}>
            <Text style={styles.title}>{t('settings.notifSystem')}</Text>
            <Text style={styles.sub}>{t('settings.notifSystemSub')}</Text>
          </View>
          <Switch
            value={system}
            onValueChange={(v) => onToggle('system', v)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.textCol}>
            <Text style={styles.title}>{t('settings.notifPromo')}</Text>
            <Text style={styles.sub}>{t('settings.notifPromoSub')}</Text>
          </View>
          <Switch
            value={promo}
            onValueChange={(v) => onToggle('promo', v)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
