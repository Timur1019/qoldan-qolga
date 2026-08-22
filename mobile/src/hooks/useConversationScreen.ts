import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { adsApi, chatApi } from '@/api/client';
import { isSystemConversation } from '@/constants/system';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import type { ConversationDto, MessageDto } from '@/types/api';
import { applyReadStatus, parseChatWsEvent } from '@/utils/chatWsEvent';
import {
  blockUser,
  isConversationMuted,
  toggleMuteConversation,
} from '@/utils/chatPreferences';
import { pickChatImageFromCamera, pickChatImageFromLibrary } from '@/utils/pickChatAttachment';
import { asMessageList, upsertMessage } from '@/utils/pendingChat';

export function useConversationScreen(conversationId?: string) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [conversation, setConversation] = useState<ConversationDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [muted, setMuted] = useState(false);

  const isSystemChat = isSystemConversation(conversation);

  useEffect(() => {
    if (!conversationId) return;
    void isConversationMuted(conversationId).then(setMuted);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || !isAuthenticated) {
      setLoading(false);
      setMessages([]);
      setConversation(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([chatApi.getMessages(conversationId), chatApi.getConversations()])
      .then(([list, conversations]) => {
        if (cancelled) return;
        setMessages(asMessageList<MessageDto>(list));
        const found = (Array.isArray(conversations) ? conversations : []).find(
          (c) => (c as ConversationDto).id === conversationId
        ) as ConversationDto | undefined;
        setConversation(found ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setMessages([]);
          setConversation(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    chatApi.markAsRead(conversationId).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [conversationId, isAuthenticated, user?.id]);

  const handleIncoming = useCallback(
    (raw: unknown) => {
      const event = parseChatWsEvent(raw);
      if (!event) return;
      if (event.kind === 'read') {
        if (event.readerId !== user?.id) {
          setMessages((prev) => applyReadStatus(prev, event.readAt, user?.id));
        }
        return;
      }
      const msg = event.message;
      setMessages((prev) => upsertMessage(prev, msg));
      if (msg.senderId !== user?.id && conversationId) {
        chatApi.markAsRead(conversationId).catch(() => {});
      }
    },
    [conversationId, user?.id]
  );

  const sendPayload = useCallback(
    async (payload: { text?: string; attachmentUrl?: string; messageType?: string }) => {
      if (!conversationId || sending || isSystemChat) return;
      setSending(true);
      try {
        const msg = (await chatApi.sendMessage(conversationId, payload)) as MessageDto;
        setMessages((prev) => upsertMessage(prev, msg));
      } finally {
        setSending(false);
      }
    },
    [conversationId, sending, isSystemChat]
  );

  const send = useCallback(async () => {
    const value = text.trim();
    if (!value) return;
    setText('');
    try {
      await sendPayload({ text: value });
    } catch {
      setText(value);
    }
  }, [sendPayload, text]);

  const sendAttachment = useCallback(
    async (localUri: string, messageType: 'IMAGE' | 'FILE') => {
      if (!conversationId) return;
      setUploading(true);
      try {
        const url = await adsApi.upload(localUri);
        await sendPayload({ text: '', attachmentUrl: url, messageType });
      } catch {
        Alert.alert(t('common.error', 'Xatolik'), t('chat.uploadFailed', 'Yuklab bo\'lmadi'));
      } finally {
        setUploading(false);
      }
    },
    [conversationId, sendPayload, t]
  );

  const attachFromLibrary = useCallback(async () => {
    try {
      const picked = await pickChatImageFromLibrary();
      if (picked) await sendAttachment(picked.uri, picked.messageType);
    } catch (e) {
      if (e instanceof Error && e.message === 'PERMISSION') {
        Alert.alert(t('chat.permissionTitle', 'Ruxsat'), t('chat.permissionPhotos', 'Galereyaga ruxsat bering'));
      }
    }
  }, [sendAttachment, t]);

  const attachFromCamera = useCallback(async () => {
    try {
      const picked = await pickChatImageFromCamera();
      if (picked) await sendAttachment(picked.uri, picked.messageType);
    } catch (e) {
      if (e instanceof Error && e.message === 'PERMISSION') {
        Alert.alert(t('chat.permissionTitle', 'Ruxsat'), t('chat.permissionCamera', 'Kameraga ruxsat bering'));
      }
    }
  }, [sendAttachment, t]);

  const handleMute = useCallback(async () => {
    if (!conversationId) return;
    const nowMuted = await toggleMuteConversation(conversationId);
    setMuted(nowMuted);
    setMenuVisible(false);
    Alert.alert('', nowMuted ? t('chat.muted', 'O\'chirildi') : t('chat.unmuted', 'Yoqildi'));
  }, [conversationId, t]);

  const handleBlock = useCallback(() => {
    if (!conversation?.otherPartyId) return;
    Alert.alert(t('chat.blockUser', 'Bloklash'), t('chat.confirmBlock', 'Bloklashni xohlaysizmi?'), [
      { text: t('common.cancel', 'Bekor'), style: 'cancel' },
      {
        text: t('chat.blockUser', 'Bloklash'),
        style: 'destructive',
        onPress: () => {
          void blockUser(conversation.otherPartyId).then(() => {
            setMenuVisible(false);
            router.back();
          });
        },
      },
    ]);
  }, [conversation?.otherPartyId, t]);

  const handleDelete = useCallback(() => {
    if (!conversationId) return;
    Alert.alert(t('chat.deleteChat', 'O\'chirish'), t('chat.confirmDeleteChat', 'Butun suhbatni o\'chirish?'), [
      { text: t('common.cancel', 'Bekor'), style: 'cancel' },
      {
        text: t('chat.deleteChat', 'O\'chirish'),
        style: 'destructive',
        onPress: () => {
          void chatApi.deleteConversation(conversationId).then(() => {
            setMenuVisible(false);
            router.back();
          });
        },
      },
    ]);
  }, [conversationId, t]);

  const openAd = useCallback(() => {
    if (conversation?.adId) router.push(`/ads/${conversation.adId}`);
  }, [conversation?.adId]);

  const threadTitle = isSystemChat
    ? t('chat.notifications', 'Bildirishnomalar')
    : conversation?.otherPartyName || t('chat.conversation', 'Suhbat');

  return {
    conversation,
    messages,
    loading,
    text,
    setText,
    sending,
    uploading,
    menuVisible,
    setMenuVisible,
    reportVisible,
    setReportVisible,
    muted,
    isSystemChat,
    threadTitle,
    handleIncoming,
    send,
    attachFromLibrary,
    attachFromCamera,
    handleMute,
    handleBlock,
    handleDelete,
    openAd,
  };
}
