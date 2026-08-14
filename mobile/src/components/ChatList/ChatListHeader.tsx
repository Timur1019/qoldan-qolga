import { Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

import { styles } from './ChatListHeader.styles';

interface Props {
  title?: string;
  subtitle?: string;
}

export function ChatListHeader({ title, subtitle }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title || t('chat.title')}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
