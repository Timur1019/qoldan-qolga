import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Stack, router } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from '@/styles/screens/settings.styles';

const SUPPORT_URL = 'https://t.me/qoldanqolga';

type SettingsRow = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function SettingsScreen() {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const version =
    Constants.expoConfig?.version || Constants.nativeAppVersion || '1.0.0';

  const rows: SettingsRow[] = [
    {
      key: 'notifications',
      label: t('settings.notifications'),
      icon: 'notifications-outline',
      onPress: () => router.push('/settings/notifications'),
    },
    {
      key: 'feed',
      label: t('settings.feed'),
      icon: 'list-outline',
      onPress: () => router.push('/settings/feed'),
    },
    {
      key: 'legal',
      label: t('settings.legal'),
      icon: 'document-text-outline',
      onPress: () => router.push('/settings/legal'),
    },
  ];

  const onLogout = () => {
    Alert.alert(t('settings.logout'), t('settings.logoutConfirm'), [
      { text: t('myAds.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: () => {
          void logout().then(() => router.replace('/(tabs)/profile'));
        },
      },
    ]);
  };

  const onDelete = () => {
    Alert.alert(t('settings.deleteAccount'), t('settings.deleteHint'), [
      { text: t('myAds.cancel'), style: 'cancel' },
      {
        text: t('profile.support'),
        onPress: () => {
          void Linking.openURL(SUPPORT_URL).catch(() => {});
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('profile.settings') }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {rows.map((row, index) => (
            <Pressable
              key={row.key}
              style={[styles.row, index === rows.length - 1 && styles.rowLast]}
              onPress={row.onPress}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={row.icon} size={20} color={colors.text} />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.version}>
          {t('settings.version').replace('{v}', version)}
        </Text>

        <View style={styles.spacer} />

        <Pressable style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>{t('settings.deleteAccount')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
