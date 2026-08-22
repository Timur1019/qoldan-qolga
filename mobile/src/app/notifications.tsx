import { Stack, router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NotificationItem } from '@/api/notifications';
import { markAllNotificationsRead } from '@/api/notifications';
import { NotificationInboxRow } from '@/components/NotificationsInbox/NotificationInboxRow';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNotificationsInbox } from '@/hooks/useNotificationsInbox';
import { styles } from '@/styles/screens/notificationsInbox.styles';
import { colors } from '@/theme/colors';
import { openNotificationItem } from '@/utils/openNotificationTarget';

export default function NotificationsInboxScreen() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const {
    items,
    loading,
    refreshing,
    loadingMore,
    error,
    load,
    refresh,
    loadMore,
    markReadAndOpen,
  } = useNotificationsInbox();

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) return;
      void load(0);
    }, [isAuthenticated, load])
  );

  const openItem = async (item: NotificationItem) => {
    await markReadAndOpen(item);
    openNotificationItem(item);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: t('notify.inboxTitle') }} />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{t('notify.inboxLoginTitle')}</Text>
          <Text style={styles.emptyText}>{t('notify.inboxLoginText')}</Text>
          <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
            <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: t('notify.inboxTitle'),
          headerRight: () =>
            items.some((x) => !x.isRead) ? (
              <Pressable
                onPress={() => void markAllNotificationsRead().then(refresh)}
                hitSlop={8}
              >
                <Text style={styles.markAll}>{t('notify.markAllRead')}</Text>
              </Pressable>
            ) : null,
        }}
      />
      {loading && items.length === 0 ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => (
            <NotificationInboxRow
              item={item}
              isLast={index === items.length - 1}
              onPress={() => void openItem(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {error ? t('notify.inboxErrorTitle') : t('notify.inboxEmptyTitle')}
              </Text>
              <Text style={styles.emptyText}>
                {error ? t('notify.inboxErrorText') : t('notify.inboxEmptyText')}
              </Text>
              {error ? (
                <Pressable style={styles.loginBtn} onPress={refresh}>
                  <Text style={styles.loginBtnText}>{t('common.retry')}</Text>
                </Pressable>
              ) : null}
            </View>
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={styles.footerLoader} color={colors.primary} /> : null
          }
        />
      )}
    </SafeAreaView>
  );
}
