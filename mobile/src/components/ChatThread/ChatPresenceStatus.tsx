import { Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { formatPresence, isUserOnline } from '@/utils/chatPresence';

import { styles } from './ChatPresenceStatus.styles';

interface Props {
  lastSeenAt?: string | null;
  isTyping?: boolean;
}

export function ChatPresenceStatus({ lastSeenAt, isTyping }: Props) {
  const { t } = useLanguage();
  if (isTyping) {
    return <Text style={[styles.text, styles.typing]}>{t('chat.typing', 'Yozmoqda…')}</Text>;
  }
  if (!lastSeenAt) return null;
  return (
    <View style={styles.status}>
      {isUserOnline(lastSeenAt) ? <View style={styles.onlineDot} /> : null}
      <Text style={styles.text} numberOfLines={1}>
        {formatPresence(lastSeenAt, t)}
      </Text>
    </View>
  );
}
