import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthRequiredSheet } from '@/components/AuthRequiredSheet/AuthRequiredSheet';
import { AuthProvider } from '@/context/AuthContext';
import { AuthRequiredProvider } from '@/context/AuthRequiredContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { RegionsProvider } from '@/context/RegionsContext';
import { usePushNotifications } from '@/notifications/usePushNotifications';
import { colors } from '@/theme/colors';

function RootNavigator() {
  const { t } = useLanguage();
  usePushNotifications();

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitleStyle: { fontWeight: '600', color: colors.text },
          headerTintColor: colors.primary,
          headerBackTitle: t('common.back'),
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: t('auth.phoneTitle'), presentation: 'modal' }} />
        <Stack.Screen name="register" options={{ title: t('auth.phoneTitle'), presentation: 'modal' }} />
        <Stack.Screen name="ads/[id]" options={{ title: '' }} />
        <Stack.Screen name="ads/create" options={{ title: t('create.title') }} />
        <Stack.Screen name="business" options={{ title: t('business.title') }} />
        <Stack.Screen name="settings/index" options={{ title: t('profile.settings') }} />
        <Stack.Screen name="settings/legal" options={{ title: t('settings.legal') }} />
        <Stack.Screen
          name="settings/notifications"
          options={{ title: t('settings.notificationsTitle') }}
        />
        <Stack.Screen name="settings/feed" options={{ headerShown: false }} />
        <Stack.Screen name="users/[id]" options={{ title: t('create.seller') }} />
        <Stack.Screen name="categories/[code]" options={{ title: '' }} />
        <Stack.Screen name="chat/[id]" options={{ title: '' }} />
        <Stack.Screen name="promo/result" options={{ title: t('ads.promoResultTitle') }} />
      </Stack>
      <AuthRequiredSheet />
    </>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthRequiredProvider>
          <RegionsProvider>
            <RootNavigator />
          </RegionsProvider>
        </AuthRequiredProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
