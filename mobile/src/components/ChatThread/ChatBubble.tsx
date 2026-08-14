import { Text, View } from 'react-native';

import type { MessageDto } from '@/types/api';
import { formatMessageTime } from '@/utils/chatFormat';

import { styles } from './ChatBubble.styles';

interface Props {
  message: MessageDto;
  mine: boolean;
}

export function ChatBubble({ message, mine }: Props) {
  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={mine ? styles.textMine : styles.text}>{message.text}</Text>
        <Text style={[styles.time, mine ? styles.timeMine : undefined]}>
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
