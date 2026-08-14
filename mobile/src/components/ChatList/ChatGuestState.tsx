import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './ChatGuestState.styles';

interface Props {
  onLogin: () => void;
}

export function ChatGuestState({ onLogin }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconRing}>
        <Ionicons name="lock-closed-outline" size={32} color={colors.primary} />
      </View>
      <Text style={styles.title}>Xabarlar</Text>
      <Text style={styles.text}>
        Sotuvchilar bilan suhbatlaringiz shu yerda bo'ladi. Yozish uchun tizimga kiring.
      </Text>
      <Pressable style={styles.btn} onPress={onLogin}>
        <Text style={styles.btnText}>Kirish / Ro'yxatdan o'tish</Text>
      </Pressable>
    </View>
  );
}
