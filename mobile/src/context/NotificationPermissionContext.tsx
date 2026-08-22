import { Ionicons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Alert, Linking, Modal, Platform, Pressable, Text, View } from 'react-native';

import { styles } from '@/components/NotificationPermissionSheet/NotificationPermissionSheet.styles';
import { useLanguage } from '@/context/LanguageContext';
import {
  hasOsNotificationPermission,
  setConsentStatus,
  shouldShowConsentPrompt,
} from '@/notifications/notificationConsent';
import {
  requestNotificationPermission,
  syncExpoPushToken,
} from '@/notifications/syncExpoPushToken';
import { showWelcomeNotification } from '@/notifications/showWelcomeNotification';
import { colors } from '@/theme/colors';

interface NotificationPermissionContextValue {
  visible: boolean;
  openPrompt: () => void;
  closePrompt: () => void;
  promptIfNeeded: () => Promise<void>;
  enableNotifications: () => Promise<boolean>;
}

const NotificationPermissionContext = createContext<NotificationPermissionContextValue | null>(null);

export function NotificationPermissionProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  const closePrompt = useCallback(() => setVisible(false), []);
  const openPrompt = useCallback(() => setVisible(true), []);

  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await setConsentStatus('granted');
      await syncExpoPushToken().catch(() => {});
      await showWelcomeNotification(t('notify.welcomeTitle'), t('notify.welcomeBody'));
      closePrompt();
      return true;
    }
    await setConsentStatus('denied');
    Alert.alert(
      t('notify.permissionDeniedTitle'),
      t('notify.permissionDeniedBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('notify.openSettings'),
          onPress: () => {
            if (Platform.OS === 'ios') void Linking.openURL('app-settings:');
            else void Linking.openSettings();
          },
        },
      ]
    );
    return false;
  }, [closePrompt, t]);

  const promptIfNeeded = useCallback(async () => {
    if (await hasOsNotificationPermission()) {
      await syncExpoPushToken().catch(() => {});
      return;
    }
    const show = await shouldShowConsentPrompt();
    if (show) openPrompt();
  }, [openPrompt]);

  const onLater = useCallback(async () => {
    await setConsentStatus('later');
    closePrompt();
  }, [closePrompt]);

  const value = useMemo(
    () => ({ visible, openPrompt, closePrompt, promptIfNeeded, enableNotifications }),
    [visible, openPrompt, closePrompt, promptIfNeeded, enableNotifications]
  );

  return (
    <NotificationPermissionContext.Provider value={value}>
      {children}
      <Modal visible={visible} transparent animationType="slide" onRequestClose={closePrompt}>
        <Pressable style={styles.overlay} onPress={closePrompt}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <View style={styles.iconWrap}>
              <Ionicons name="notifications" size={28} color={colors.primary} />
            </View>
            <Text style={styles.title}>{t('notify.permissionTitle')}</Text>
            <Text style={styles.subtitle}>{t('notify.permissionBody')}</Text>
            <Pressable style={styles.primaryBtn} onPress={() => void enableNotifications()}>
              <Text style={styles.primaryBtnText}>{t('notify.permissionAllow')}</Text>
            </Pressable>
            <Pressable style={styles.dismiss} onPress={() => void onLater()}>
              <Text style={styles.dismissText}>{t('notify.permissionLater')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </NotificationPermissionContext.Provider>
  );
}

export function useNotificationPermission() {
  const ctx = useContext(NotificationPermissionContext);
  if (!ctx) {
    throw new Error('useNotificationPermission must be used within NotificationPermissionProvider');
  }
  return ctx;
}
