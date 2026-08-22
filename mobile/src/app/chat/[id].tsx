import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ChatAdCard } from '@/components/ChatThread/ChatAdCard';
import { ChatBubble } from '@/components/ChatThread/ChatBubble';
import { ChatComposer, ChatComposerGuest } from '@/components/ChatThread/ChatComposer';
import { ChatDateSeparator } from '@/components/ChatThread/ChatDateSeparator';
import { ChatThreadEmpty } from '@/components/ChatThread/ChatThreadEmpty';
import { ChatThreadHeader } from '@/components/ChatThread/ChatThreadHeader';
import { ChatThreadMenuSheet } from '@/components/ChatThread/ChatThreadMenuSheet';
import { ReportSheet } from '@/components/ReportSheet/ReportSheet';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useConversationScreen } from '@/hooks/useConversationScreen';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useStompChat } from '@/hooks/useStompChat';
import { colors } from '@/theme/colors';
import { groupMessagesByDate, type ChatListItem } from '@/utils/chatFormat';

import { styles } from '@/styles/screens/conversation.styles';

export default function ConversationScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const requireAuth = useRequireAuth();
  const listRef = useRef<FlatList<ChatListItem>>(null);

  const chat = useConversationScreen(id);
  useStompChat(isAuthenticated ? id : undefined, chat.handleIncoming);

  const items = useMemo(() => groupMessagesByDate(chat.messages), [chat.messages]);

  const headerRight = useCallback(
    () =>
      chat.isSystemChat ? null : (
        <Pressable onPress={() => chat.setMenuVisible(true)} hitSlop={8} style={{ marginRight: 4 }}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      ),
    [chat.isSystemChat, chat.setMenuVisible]
  );

  if (chat.loading) {
    return (
      <View style={styles.loaderWrap}>
        <Stack.Screen options={{ title: chat.threadTitle, headerBackTitle: t('common.back') }} />
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
            <ChatThreadHeader
              title={chat.threadTitle}
              subtitle={chat.conversation?.adTitle || undefined}
              lastSeenAt={chat.conversation?.otherPartyLastSeenAt}
              isSystem={chat.isSystemChat}
            />
          ),
          headerRight,
        }}
      />

      {!chat.isSystemChat && chat.conversation?.adId ? (
        <ChatAdCard
          adId={chat.conversation.adId}
          title={chat.conversation.adTitle}
          image={chat.conversation.adImageUrl}
          price={chat.conversation.adPrice ?? null}
          currency={chat.conversation.adCurrency}
          region={chat.conversation.adRegion}
          onPress={chat.openAd}
        />
      ) : null}

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

      {isAuthenticated && !chat.isSystemChat ? (
        <ChatComposer
          value={chat.text}
          onChangeText={chat.setText}
          onQuickReply={chat.setText}
          onSend={() => void chat.send()}
          onAttachLibrary={() => void chat.attachFromLibrary()}
          onAttachCamera={() => void chat.attachFromCamera()}
          sending={chat.sending}
          uploading={chat.uploading}
          onFocus={() => requireAuth()}
        />
      ) : chat.isSystemChat ? null : (
        <ChatComposerGuest onLogin={() => requireAuth()} />
      )}

      <ChatThreadMenuSheet
        visible={chat.menuVisible}
        muted={chat.muted}
        onClose={() => chat.setMenuVisible(false)}
        onMute={() => void chat.handleMute()}
        onBlock={chat.handleBlock}
        onReport={() => {
          chat.setMenuVisible(false);
          chat.setReportVisible(true);
        }}
        onDelete={chat.handleDelete}
      />

      {chat.conversation?.adId ? (
        <ReportSheet
          visible={chat.reportVisible}
          adId={chat.conversation.adId}
          onClose={() => chat.setReportVisible(false)}
          onAuthRequired={() => requireAuth()}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}
