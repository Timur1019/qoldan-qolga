import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './ChatThreadEmpty.styles';

export function ChatThreadEmpty() {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconRing}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>Suhbatni boshlang</Text>
      <Text style={styles.text}>Birinchi xabarni yozing — sotuvchi tez orada javob beradi.</Text>
    </View>
  );
}
