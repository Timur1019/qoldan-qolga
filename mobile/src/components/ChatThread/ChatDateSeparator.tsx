import { Text, View } from 'react-native';

import { formatChatDateHeader } from '@/utils/chatFormat';

import { styles } from './ChatDateSeparator.styles';

interface Props {
  createdAt: string;
}

export function ChatDateSeparator({ createdAt }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <Text style={styles.label}>{formatChatDateHeader(createdAt)}</Text>
      <View style={styles.line} />
    </View>
  );
}
