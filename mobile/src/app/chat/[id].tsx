import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';

import { chatApi } from '@/api/client';
import { ChatBubble } from '@/components/ChatThread/ChatBubble';
import { ChatComposer, ChatComposerGuest } from '@/components/ChatThread/ChatComposer';
import { ChatDateSeparator } from '@/components/ChatThread/ChatDateSeparator';
import { ChatThreadEmpty } from '@/components/ChatThread/ChatThreadEmpty';
import { ChatThreadHeader } from '@/components/ChatThread/ChatThreadHeader';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useStompChat } from '@/hooks/useStompChat';
import { colors } from '@/theme/colors';
import type { MessageDto } from '@/types/api';
import { groupMessagesByDate, type ChatListItem } from '@/utils/chatFormat';
import { asMessageList, upsertMessage } from '@/utils/pendingChat';

import { styles } from '@/styles/screens/conversation.styles';

export default function ConversationScreen() {
  const params = useLocalSearchParams<{
    id: string | string[];
    title?: string | string[];
    subtitle?: string | string[];
  }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const titleParam = Array.isArray(params.title) ? params.title[0] : params.title;
  const subtitleParam = Array.isArray(params.subtitle) ? params.subtitle[0] : params.subtitle;

  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const requireAuth = useRequireAuth();
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<ChatListItem>>(null);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setLoading(false);
      setMessages([]);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    chatApi
      .getMessages(id)
      .then((list) => {
        if (!cancelled) setMessages(asMessageList<MessageDto>(list));
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    chatApi.markAsRead(id).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, user?.id]);

  const handleIncoming = useCallback(
    (raw: unknown) => {
      const msg = raw as MessageDto;
      setMessages((prev) => upsertMessage(prev, msg));
      if (msg.senderId !== user?.id) {
        chatApi.markAsRead(id).catch(() => {});
      }
    },
    [id, user?.id]
  );
  useStompChat(isAuthenticated ? id : undefined, handleIncoming);

  const items = useMemo(() => groupMessagesByDate(messages), [messages]);
  const headerTitle = titleParam || 'Suhbat';
  const headerSubtitle = subtitleParam || '';

  const send = async () => {
    if (!requireAuth()) return;
    const value = text.trim();
    if (!value || !id) return;
    setSending(true);
    setText('');
    try {
      const msg = (await chatApi.sendMessage(id, value)) as MessageDto;
      setMessages((prev) => upsertMessage(prev, msg));
    } catch {
      setText(value);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <Stack.Screen options={{ title: headerTitle, headerBackTitle: t('common.back') }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen
        options={{
          headerBackTitle: t('common.back'),
          headerTitle: () => (
            <ChatThreadHeader title={headerTitle} subtitle={headerSubtitle || undefined} />
          ),
        }}
      />

      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[styles.list, items.length === 0 && styles.listEmpty]}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={<ChatThreadEmpty />}
        renderItem={({ item }) => {
          if (item.type === 'date') {
            return <ChatDateSeparator createdAt={item.createdAt} />;
          }
          return <ChatBubble message={item.msg} mine={item.msg.senderId === user?.id} />;
        }}
      />

      {isAuthenticated ? (
        <ChatComposer
          value={text}
          onChangeText={setText}
          onSend={() => void send()}
          sending={sending}
          onFocus={() => requireAuth()}
        />
      ) : (
        <ChatComposerGuest onLogin={() => requireAuth()} />
      )}
    </KeyboardAvoidingView>
  );
}
