import { apiRequest } from '@/api/client';

export type NotificationItem = {
  id: string;
  type: string;
  category: string;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, string>;
  groupCount?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
};

export type NotificationPreference = {
  pushEnabled: boolean;
  chatEnabled: boolean;
  favoriteEnabled: boolean;
  adEnabled: boolean;
  promotionEnabled: boolean;
  paymentEnabled: boolean;
  profileEnabled: boolean;
  dealEnabled: boolean;
  regionalEnabled: boolean;
  marketingEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
};

export async function fetchNotifications(page = 0, size = 20) {
  return apiRequest<PageResponse<NotificationItem>>(`/notifications?page=${page}&size=${size}`);
}

export async function fetchUnreadCount() {
  const data = await apiRequest<{ count: number }>('/notifications/unread-count');
  return data.count;
}

export async function markNotificationsRead(ids: string[]) {
  await apiRequest('/notifications/read', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function markAllNotificationsRead() {
  await apiRequest('/notifications/read-all', { method: 'POST' });
}

export async function fetchNotificationPreferences() {
  return apiRequest<NotificationPreference>('/notifications/preferences');
}

export async function updateNotificationPreferences(prefs: Partial<NotificationPreference>) {
  return apiRequest<NotificationPreference>('/notifications/preferences', {
    method: 'PUT',
    body: JSON.stringify(prefs),
  });
}
