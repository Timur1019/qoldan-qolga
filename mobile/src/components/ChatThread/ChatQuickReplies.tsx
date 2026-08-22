import { ScrollView, Pressable, Text } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { CHAT_QUICK_REPLY_KEYS } from '@/utils/chatQuickReplies';

import { styles } from './ChatQuickReplies.styles';

interface Props {
  onSelect: (text: string) => void;
}

export function ChatQuickReplies({ onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {CHAT_QUICK_REPLY_KEYS.map((key) => (
        <Pressable key={key} style={styles.chip} onPress={() => onSelect(t(key))}>
          <Text style={styles.chipText}>{t(key)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
