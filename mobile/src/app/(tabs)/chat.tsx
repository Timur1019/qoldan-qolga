import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { chatApi } from '@/api/client';
import { ChatConversationRow } from '@/components/ChatList/ChatConversationRow';
import { ChatEmptyState } from '@/components/ChatList/ChatEmptyState';
import { ChatGuestState } from '@/components/ChatList/ChatGuestState';
import { ChatListHeader } from '@/components/ChatList/ChatListHeader';
import { ChatListSearch } from '@/components/ChatList/ChatListSearch';
import { isSystemConversation } from '@/constants/system';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNotificationPermission } from '@/context/NotificationPermissionContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import type { ConversationDto } from '@/types/api';
import { getBlockedUserIds } from '@/utils/chatPreferences';
import { takePendingChat } from '@/utils/pendingChat';

import { styles } from '@/styles/screens/chatList.styles';

function sortConversations(list: ConversationDto[]) {
  return [...list].sort((a, b) => {
    const aSys = isSystemConversation(a) ? 0 : 1;
    const bSys = isSystemConversation(b) ? 0 : 1;
    if (aSys !== bSys) return aSys - bSys;
    const aUnread = a.unreadCount > 0 ? 0 : 1;
    const bUnread = b.unreadCount > 0 ? 0 : 1;
    if (aUnread !== bUnread) return aUnread - bUnread;
    const aTime = new Date(a.lastMessageAt || a.createdAt).getTime();
    const bTime = new Date(b.lastMessageAt || b.createdAt).getTime();
    return bTime - aTime;
  });
}

export default function ChatListScreen() {
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();
  const { t } = useLanguage();
  const { promptIfNeeded } = useNotificationPermission();
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async (mode: 'full' | 'refresh' = 'full') => {
    if (!isAuthenticated) {
      setConversations([]);
      setLoading(false);
      return;
    }
    if (mode === 'full') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    try {
      const [list, blocked] = await Promise.all([chatApi.getConversations(), getBlockedUserIds()]);
      const rows = (Array.isArray(list) ? list : []) as ConversationDto[];
      setConversations(rows.filter((c) => !blocked.has(c.otherPartyId)));
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      void load('full');
      if (!isAuthenticated) return;
      void promptIfNeeded();
      const pending = takePendingChat();
      if (!pending?.adId) return;
      void chatApi.getOrCreateConversation(pending.adId).then(async (conv) => {
        const c = conv as { id: string };
        if (pending.text) {
          await chatApi.sendMessage(c.id, { text: pending.text });
        }
        router.push(`/chat/${c.id}`);
      });
    }, [isAuthenticated, load, promptIfNeeded])
  );

  const ordered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = sortConversations(conversations);
    if (!q) return sorted;
    return sorted.filter((c) => {
      const system = isSystemConversation(c);
      const title = system ? t('chat.notifications', 'Bildirishnomalar') : c.otherPartyName || '';
      const ad = c.adTitle || '';
      const preview = c.lastMessageText || '';
      return [title, ad, preview].some((s) => s.toLowerCase().includes(q));
    });
  }, [conversations, query, t]);

  const unreadTotal = useMemo(
    () => ordered.reduce((sum, c) => sum + (Number(c.unreadCount) || 0), 0),
    [ordered]
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ChatListHeader />
        <ChatGuestState onLogin={() => requireAuth()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ChatListHeader
        subtitle={
          unreadTotal > 0
            ? t('chat.unread').replace('{n}', String(unreadTotal))
            : ordered.length > 0
              ? t('chat.conversations').replace('{n}', String(ordered.length))
              : undefined
        }
      />
      <ChatListSearch value={query} onChangeText={setQuery} />
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={ordered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={ordered.length === 0 ? styles.emptyList : styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void load('refresh')}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <ChatConversationRow
              item={item}
              onPress={() => router.push(`/chat/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <ChatEmptyState onBrowseAds={() => router.push('/(tabs)')} />
          }
        />
      )}
    </SafeAreaView>
  );
}
