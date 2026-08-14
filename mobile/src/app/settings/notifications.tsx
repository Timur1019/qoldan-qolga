import * as SecureStore from 'expo-secure-store';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from '@/styles/screens/notifications.styles';

const KEY_IMPORTANT = 'notif_important';
const KEY_PROMO = 'notif_promo';

async function readBool(key: string, fallback = true) {
  try {
    const v = await SecureStore.getItemAsync(key);
    if (v == null) return fallback;
    return v === '1';
  } catch {
    return fallback;
  }
}

async function writeBool(key: string, value: boolean) {
  try {
    await SecureStore.setItemAsync(key, value ? '1' : '0');
  } catch {
    // ignore
  }
}

export default function NotificationsSettingsScreen() {
  const { t } = useLanguage();
  const [important, setImportant] = useState(true);
  const [promo, setPromo] = useState(true);

  useEffect(() => {
    void Promise.all([readBool(KEY_IMPORTANT), readBool(KEY_PROMO)]).then(([a, b]) => {
      setImportant(a);
      setPromo(b);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('settings.notificationsTitle') }} />
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textCol}>
            <Text style={styles.title}>{t('settings.notifImportant')}</Text>
            <Text style={styles.sub}>{t('settings.notifImportantSub')}</Text>
          </View>
          <Switch
            value={important}
            onValueChange={(v) => {
              setImportant(v);
              void writeBool(KEY_IMPORTANT, v);
            }}
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
            onValueChange={(v) => {
              setPromo(v);
              void writeBool(KEY_PROMO, v);
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
