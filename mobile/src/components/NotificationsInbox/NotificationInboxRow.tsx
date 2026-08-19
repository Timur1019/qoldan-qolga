import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { PushInboxItem } from '@/notifications/inboxStorage';
import { colors } from '@/theme/colors';

import { styles } from './NotificationInboxRow.styles';

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

type Props = {
  item: PushInboxItem;
  isLast?: boolean;
  onPress: () => void;
};

export function NotificationInboxRow({ item, isLast, onPress }: Props) {
  return (
    <Pressable
      style={[styles.row, !item.read && styles.unread, !isLast && styles.border]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="notifications-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || 'Qoldan Qolga'}
        </Text>
        {item.body ? (
          <Text style={styles.text} numberOfLines={3}>
            {item.body}
          </Text>
        ) : null}
        <Text style={styles.time}>{formatTime(item.receivedAt)}</Text>
      </View>
      {!item.read ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}
