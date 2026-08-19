import type { Notification } from 'expo-notifications';

import type { PushInboxItem } from '@/notifications/inboxStorage';

export function mapNotificationToInbox(notification: Notification): PushInboxItem {
  const data = (notification.request.content.data || {}) as {
    conversationId?: string;
    adId?: string;
  };
  return {
    id: notification.request.identifier,
    title: notification.request.content.title || '',
    body: notification.request.content.body || '',
    receivedAt: Date.now(),
    read: false,
    conversationId: data.conversationId,
    adId: data.adId,
  };
}
