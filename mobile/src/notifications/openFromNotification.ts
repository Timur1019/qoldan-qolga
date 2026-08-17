import { router } from 'expo-router';
import type { NotificationResponse } from 'expo-notifications';

export function openFromNotification(response: NotificationResponse) {
  const data = response.notification.request.content.data as {
    type?: string;
    conversationId?: string;
    adId?: string;
  };
  if (data?.conversationId) {
    router.push(`/chat/${data.conversationId}`);
    return;
  }
  if (data?.adId) {
    router.push(`/ads/${data.adId}`);
  }
}
