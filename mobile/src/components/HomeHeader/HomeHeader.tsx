import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from './HomeHeader.styles';

interface Props {
  regionLabel: string;
  query: string;
  onQueryChange: (q: string) => void;
  onSubmit: () => void;
  onFilterPress?: () => void;
}

export function HomeHeader({ regionLabel, query, onQueryChange, onSubmit, onFilterPress }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.wrap}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('home.searchPlaceholder').replace('{region}', regionLabel)}
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={onQueryChange}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        <Pressable style={styles.filterBtn} onPress={onFilterPress} hitSlop={8}>
          <Ionicons name="options-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
