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
import { isSystemConversation } from '@/constants/system';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { colors } from '@/theme/colors';
import type { ConversationDto } from '@/types/api';

import { styles } from '@/styles/screens/chatList.styles';

function sortConversations(list: ConversationDto[]) {
  return [...list].sort((a, b) => {
    const aSys = isSystemConversation(a) ? 0 : 1;
    const bSys = isSystemConversation(b) ? 0 : 1;
    if (aSys !== bSys) return aSys - bSys;
    const aUnread = a.unreadCount > 0 ? 0 : 1;
    const bUnread = b.unreadCount > 0 ? 0 : 1;
    if (aUnread !== bUnread) return aUnread - bUnread;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export default function ChatListScreen() {
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (mode: 'full' | 'refresh' = 'full') => {
    if (!isAuthenticated) {
      setConversations([]);
      setLoading(false);
      return;
    }
    if (mode === 'full') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    try {
      const list = await chatApi.getConversations();
      setConversations(Array.isArray(list) ? (list as ConversationDto[]) : []);
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
    }, [load])
  );

  const ordered = useMemo(() => sortConversations(conversations), [conversations]);
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
          renderItem={({ item }) => {
            const system = isSystemConversation(item);
            const title = system ? 'Bildirishnomalar' : item.otherPartyName || 'Suhbat';
            return (
              <ChatConversationRow
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/chat/[id]',
                    params: {
                      id: item.id,
                      title,
                      subtitle: system ? 'Qoldan Qolga' : item.adTitle || '',
                    },
                  })
                }
              />
            );
          }}
          ListEmptyComponent={
            <ChatEmptyState onBrowseAds={() => router.push('/(tabs)')} />
          }
        />
      )}
    </SafeAreaView>
  );
}
