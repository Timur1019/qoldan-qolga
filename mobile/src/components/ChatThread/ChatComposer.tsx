import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { ChatQuickReplies } from './ChatQuickReplies';
import { styles } from './ChatComposer.styles';

const EMOJIS = ['😊', '👍', '🙏', '✅', '❤️', '😂', '🔥', '💯'];

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onQuickReply: (text: string) => void;
  onAttachLibrary: () => void;
  onAttachCamera: () => void;
  sending?: boolean;
  uploading?: boolean;
  onFocus?: () => void;
}

export function ChatComposer({
  value,
  onChangeText,
  onSend,
  onQuickReply,
  onAttachLibrary,
  onAttachCamera,
  sending,
  uploading,
  onFocus,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const busy = sending || uploading;
  const canSend = Boolean(value.trim()) && !busy;

  const handleVoice = () => {
    Alert.alert(t('chat.voiceMessage', 'Ovoz'), t('chat.voiceSoon', 'Tez orada'));
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <ChatQuickReplies onSelect={onQuickReply} />
      {uploading ? (
        <View style={styles.uploadRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.uploadText}>{t('chat.uploading', 'Yuklanmoqda…')}</Text>
        </View>
      ) : null}
      {emojiOpen ? (
        <View style={styles.emojiRow}>
          {EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              style={styles.emojiBtn}
              onPress={() => {
                onChangeText(`${value}${emoji}`);
                setEmojiOpen(false);
              }}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <View style={styles.row}>
        <View style={styles.tools}>
          <Pressable style={styles.toolBtn} onPress={onAttachLibrary} disabled={busy} hitSlop={4}>
            <Ionicons name="attach" size={22} color={colors.muted} />
          </Pressable>
          <Pressable style={styles.toolBtn} onPress={onAttachCamera} disabled={busy} hitSlop={4}>
            <Ionicons name="camera-outline" size={22} color={colors.muted} />
          </Pressable>
          <Pressable style={styles.toolBtn} onPress={() => setEmojiOpen((v) => !v)} disabled={busy} hitSlop={4}>
            <Ionicons name="happy-outline" size={22} color={colors.muted} />
          </Pressable>
        </View>
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder={t('chat.placeholder', 'Xabar yozing…')}
            placeholderTextColor={colors.muted}
            value={value}
            onChangeText={onChangeText}
            multiline
            onFocus={onFocus}
            editable={!busy}
          />
        </View>
        <Pressable style={styles.toolBtn} onPress={handleVoice} hitSlop={4}>
          <Ionicons name="mic-outline" size={22} color={colors.muted} />
        </Pressable>
        <Pressable
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
          onPress={onSend}
          disabled={!canSend}
          hitSlop={4}
        >
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

interface GuestProps {
  onLogin: () => void;
}

export function ChatComposerGuest({ onLogin }: GuestProps) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  return (
    <View style={[styles.guestWrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Text style={styles.guestText}>{t('chat.loginToWrite', 'Yozish uchun tizimga kiring')}</Text>
      <Pressable style={styles.guestBtn} onPress={onLogin}>
        <Text style={styles.guestBtnText}>{t('auth.login', 'Kirish')}</Text>
      </Pressable>
    </View>
  );
}
