import { Stack, router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationInboxRow } from '@/components/NotificationsInbox/NotificationInboxRow';
import { useLanguage } from '@/context/LanguageContext';
import {
  loadPushInbox,
  markPushInboxRead,
  savePushInboxItem,
  type PushInboxItem,
} from '@/notifications/inboxStorage';
import { mapNotificationToInbox } from '@/notifications/mapNotificationToInbox';
import { styles } from '@/styles/screens/notificationsInbox.styles';

export default function NotificationsInboxScreen() {
  const { t } = useLanguage();
  const [items, setItems] = useState<PushInboxItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        try {
          const presented = await Notifications.getPresentedNotificationsAsync();
          for (const n of presented) {
            await savePushInboxItem(mapNotificationToInbox(n));
          }
        } catch {
          /* ignore */
        }
        setItems(await loadPushInbox());
      })();
    }, [])
  );

  const openItem = async (item: PushInboxItem) => {
    const next = await markPushInboxRead(item.id);
    setItems(next);
    if (item.conversationId) {
      router.push(`/chat/${item.conversationId}`);
      return;
    }
    if (item.adId) {
      router.push(`/ads/${item.adId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: t('notify.inboxTitle') }} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <NotificationInboxRow
            item={item}
            isLast={index === items.length - 1}
            onPress={() => void openItem(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t('notify.inboxEmptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('notify.inboxEmptyText')}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
