import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './ChatEmptyState.styles';

interface Props {
  onBrowseAds?: () => void;
}

export function ChatEmptyState({ onBrowseAds }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconRing}>
        <Ionicons name="chatbubbles-outline" size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>Hali suhbatlar yo'q</Text>
      <Text style={styles.text}>
        E'lon sahifasidan sotuvchiga yozing — barcha suhbatlar shu yerda saqlanadi.
      </Text>
      {onBrowseAds ? (
        <Pressable style={styles.btn} onPress={onBrowseAds}>
          <Text style={styles.btnText}>E'lonlarni ko'rish</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
