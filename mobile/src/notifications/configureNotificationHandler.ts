import * as Notifications from 'expo-notifications';

import { isConversationMuted } from '@/utils/chatPreferences';

import { getCachedNotificationPrefs } from './notificationPrefs';

const CHAT_TYPES = new Set([
  'CHAT',
  'NEW_MESSAGE',
  'MESSAGE_REPLY',
  'VOICE_MESSAGE',
  'PHOTO_MESSAGE',
  'NEW_CONVERSATION',
  'SYSTEM_MESSAGE',
]);

export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const data = notification.request.content.data as {
        type?: string;
        conversationId?: string;
        chatId?: string;
      };

      let visible = true;
      let sound = true;
      const type = data?.type ?? '';

      if (CHAT_TYPES.has(type)) {
        const prefs = getCachedNotificationPrefs();
        if (!prefs.pushEnabled || !prefs.chatEnabled) {
          visible = false;
          sound = false;
        }
        const conversationId = data?.conversationId ?? data?.chatId;
        if (conversationId && (await isConversationMuted(conversationId))) {
          visible = false;
          sound = false;
        }
      }

      return {
        shouldShowAlert: visible,
        shouldPlaySound: sound,
        shouldSetBadge: visible,
        shouldShowBanner: visible,
        shouldShowList: visible,
      };
    },
  });
}
