import type { NotificationResponse } from 'expo-notifications';

import { openNotificationTarget } from '@/utils/openNotificationTarget';

export function openFromNotification(response: NotificationResponse) {
  const data = response.notification.request.content.data as {
    type?: string;
    entityType?: string;
    entityId?: string;
    chatId?: string;
    conversationId?: string;
    adId?: string;
    listingId?: string;
  };
  if (!data) return;
  openNotificationTarget(data);
}
