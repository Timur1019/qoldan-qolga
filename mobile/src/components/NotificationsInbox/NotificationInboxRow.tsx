import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { NotificationItem } from '@/api/notifications';
import { colors } from '@/theme/colors';

import { styles } from './NotificationInboxRow.styles';

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

type Props = {
  item: NotificationItem;
  isLast?: boolean;
  onPress: () => void;
};

export function NotificationInboxRow({ item, isLast, onPress }: Props) {
  const body =
    item.groupCount != null && item.groupCount > 1
      ? `${item.body} (${item.groupCount})`
      : item.body;

  return (
    <Pressable
      style={[styles.row, !item.isRead && styles.unread, !isLast && styles.border]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="notifications-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || 'Qoldan Qolga'}
        </Text>
        {body ? (
          <Text style={styles.text} numberOfLines={3}>
            {body}
          </Text>
        ) : null}
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
      {!item.isRead ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}
