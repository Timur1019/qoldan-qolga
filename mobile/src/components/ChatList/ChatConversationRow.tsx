import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { isSystemConversation } from '@/constants/system';
import { colors } from '@/theme/colors';
import type { ConversationDto } from '@/types/api';
import { formatChatListTime } from '@/utils/chatFormat';

import { styles } from './ChatConversationRow.styles';

interface Props {
  item: ConversationDto;
  onPress: () => void;
}

export function ChatConversationRow({ item, onPress }: Props) {
  const [avatarBroken, setAvatarBroken] = useState(false);
  const system = isSystemConversation(item);
  const title = system ? 'Bildirishnomalar' : item.otherPartyName || 'Suhbat';
  const subtitle = system ? 'Qoldan Qolga xabarlari' : item.adTitle || 'E\'lon bo\'yicha suhbat';
  const unread = Number(item.unreadCount || 0);
  const showPhoto = Boolean(item.otherPartyAvatar) && !system && !avatarBroken;
  const preview =
    item.messageCount > 0
      ? `${item.messageCount} ta xabar`
      : system
        ? 'Tizim bildirishnomalari'
        : 'Suhbatni boshlang';

  return (
    <Pressable
      style={[styles.row, unread > 0 && styles.rowUnread]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(4,73,45,0.08)' }}
    >
      {system ? (
        <View style={[styles.avatar, styles.systemAvatar]}>
          <Ionicons name="notifications" size={22} color={colors.primary} />
        </View>
      ) : showPhoto ? (
        <Image
          source={{ uri: imageUrl(item.otherPartyAvatar) }}
          style={styles.avatar}
          onError={() => setAvatarBroken(true)}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>{title.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={[styles.name, unread > 0 && styles.nameUnread]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.time, unread > 0 && styles.timeUnread]}>
            {formatChatListTime(item.createdAt)}
          </Text>
        </View>
        <Text style={styles.adTitle} numberOfLines={1}>
          {subtitle}
        </Text>
        <Text style={[styles.preview, unread > 0 && styles.previewUnread]} numberOfLines={1}>
          {preview}
        </Text>
      </View>

      {unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.heartIdle} />
      )}
    </Pressable>
  );
}
