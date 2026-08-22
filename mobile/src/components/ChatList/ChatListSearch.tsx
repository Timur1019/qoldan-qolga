import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from './ChatListSearch.styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function ChatListSearch({ value, onChangeText }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.input}
          placeholder={t('chat.searchMessages', 'Qidirish')}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  );
}
