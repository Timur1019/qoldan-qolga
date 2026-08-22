import { router } from 'expo-router';

import type { NotificationItem } from '@/api/notifications';

type TargetData = {
  type?: string;
  entityType?: string;
  entityId?: string;
  chatId?: string;
  conversationId?: string;
  adId?: string;
  listingId?: string;
};

const CHAT_TYPES = new Set([
  'NEW_MESSAGE',
  'MESSAGE_REPLY',
  'VOICE_MESSAGE',
  'PHOTO_MESSAGE',
  'NEW_CONVERSATION',
  'SYSTEM_MESSAGE',
  'CHAT',
  'SYSTEM',
]);

const AD_TYPES = new Set([
  'FAVORITE_ADDED',
  'FAVORITE_PRICE_CHANGED',
  'FAVORITE_EXPIRING',
  'FAVORITE_SOLD',
  'FAVORITE_REPUBLISHED',
  'AD_PUBLISHED',
  'AD_MODERATED',
  'AD_REJECTED',
  'AD_HIDDEN',
  'AD_BLOCKED',
  'AD_EXPIRING',
  'AD_EXPIRED',
  'AD_SOLD',
  'AD_HIGH_VIEWS',
  'PROMOTION_ACTIVE',
  'PROMOTION_EXPIRING',
  'PROMOTION_EXPIRED',
  'PROMOTION_VIEWS_MILESTONE',
  'PROMOTION_IN_TOP',
  'PROMOTION_PAID',
  'PROMO',
]);

function resolveChatId(data: TargetData): string | undefined {
  return data.chatId ?? data.conversationId ?? (data.entityType === 'CHAT' ? data.entityId : undefined);
}

function resolveAdId(data: TargetData): string | undefined {
  return data.adId ?? data.listingId ?? (data.entityType === 'AD' ? data.entityId : undefined);
}

export function openNotificationTarget(data: TargetData) {
  const type = data.type ?? '';
  const chatId = resolveChatId(data);
  const adId = resolveAdId(data);

  if (chatId && (CHAT_TYPES.has(type) || !!data.conversationId || !!data.chatId)) {
    router.push(`/chat/${chatId}`);
    return;
  }

  if (adId && (AD_TYPES.has(type) || !!data.adId || !!data.listingId)) {
    router.push(`/ads/${adId}`);
    return;
  }

  if (type.startsWith('PAYMENT_') || type.startsWith('SUBSCRIPTION_')) {
    router.push('/settings/notifications');
    return;
  }

  if (type === 'NEW_LOGIN' || type === 'NEW_DEVICE_LOGIN') {
    router.push('/settings');
  }
}

export function openNotificationItem(item: NotificationItem) {
  openNotificationTarget({
    type: item.type,
    entityType: item.entityType,
    entityId: item.entityId,
    ...item.payload,
  });
}
