import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { styles } from './ChatMessageStatus.styles';

interface Props {
  status?: string | null;
  mine?: boolean;
}

export function ChatMessageStatus({ status, mine }: Props) {
  if (!status || !mine) return null;
  const isRead = status === 'READ';
  const isDelivered = status === 'DELIVERED' || isRead;
  const colorStyle = isRead ? styles.read : mine ? styles.delivered : styles.deliveredTheirs;

  return (
    <View style={styles.wrap}>
      <Ionicons name="checkmark" size={12} color={colorStyle.color} />
      {isDelivered ? <Ionicons name="checkmark" size={12} color={colorStyle.color} style={styles.icon} /> : null}
    </View>
  );
}
