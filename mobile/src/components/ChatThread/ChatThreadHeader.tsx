import { Text, View } from 'react-native';

import { ChatPresenceStatus } from './ChatPresenceStatus';
import { styles } from './ChatThreadHeader.styles';

interface Props {
  title: string;
  subtitle?: string;
  lastSeenAt?: string | null;
  isSystem?: boolean;
}

export function ChatThreadHeader({ title, subtitle, lastSeenAt, isSystem }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {isSystem && subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : !isSystem ? (
        <ChatPresenceStatus lastSeenAt={lastSeenAt} />
      ) : null}
    </View>
  );
}
