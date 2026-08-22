import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from './ChatThreadMenuSheet.styles';

interface Props {
  visible: boolean;
  muted: boolean;
  onClose: () => void;
  onMute: () => void;
  onBlock: () => void;
  onReport: () => void;
  onDelete: () => void;
}

export function ChatThreadMenuSheet({
  visible,
  muted,
  onClose,
  onMute,
  onBlock,
  onReport,
  onDelete,
}: Props) {
  const { t } = useLanguage();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Pressable style={styles.item} onPress={onMute}>
            <Ionicons name={muted ? 'notifications' : 'notifications-off-outline'} size={22} color={colors.text} />
            <Text style={styles.itemText}>{muted ? t('chat.unmute', 'Yoqish') : t('chat.mute', 'O\'chirish')}</Text>
          </Pressable>
          <Pressable style={styles.item} onPress={onBlock}>
            <Ionicons name="ban-outline" size={22} color={colors.text} />
            <Text style={styles.itemText}>{t('chat.blockUser', 'Bloklash')}</Text>
          </Pressable>
          <Pressable style={styles.item} onPress={onReport}>
            <Ionicons name="flag-outline" size={22} color={colors.text} />
            <Text style={styles.itemText}>{t('chat.reportUser', 'Shikoyat')}</Text>
          </Pressable>
          <Pressable style={styles.item} onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
            <Text style={[styles.itemText, styles.itemDanger]}>{t('chat.deleteChat', 'O\'chirish')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
