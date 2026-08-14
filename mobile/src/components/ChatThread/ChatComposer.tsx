import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

import { styles } from './ChatComposer.styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  sending?: boolean;
  onFocus?: () => void;
}

export function ChatComposer({ value, onChangeText, onSend, sending, onFocus }: Props) {
  const insets = useSafeAreaInsets();
  const canSend = Boolean(value.trim()) && !sending;

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Xabar yozing..."
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          multiline
          onFocus={onFocus}
        />
      </View>
      <Pressable
        style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={!canSend}
        hitSlop={4}
      >
        <Ionicons name="send" size={18} color={colors.white} />
      </Pressable>
    </View>
  );
}

interface GuestProps {
  onLogin: () => void;
}

export function ChatComposerGuest({ onLogin }: GuestProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.guestWrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Text style={styles.guestText}>Yozish uchun tizimga kiring</Text>
      <Pressable style={styles.guestBtn} onPress={onLogin}>
        <Text style={styles.guestBtnText}>Kirish</Text>
      </Pressable>
    </View>
  );
}
