import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { AdDetailDto } from '@/types/api';
import { maskPhone } from '@/utils/contacts';
import { styles } from '@/styles/screens/adDetail.styles';

type Props = {
  ad: AdDetailDto;
  creatingChat: boolean;
  phoneRevealed: boolean;
  isAuthenticated: boolean;
  showTelegram: boolean;
  onOpenChat: () => void;
  onPhone: () => void;
  onTelegram: () => void;
};

export function AdDetailContacts({
  ad,
  creatingChat,
  phoneRevealed,
  isAuthenticated,
  showTelegram,
  onOpenChat,
  onPhone,
  onTelegram,
}: Props) {
  return (
    <View style={styles.contacts}>
      <Text style={styles.contactsTitle}>Aloqa usullari</Text>
      <Pressable style={[styles.contactBtn, styles.contactBtnPrimary]} onPress={onOpenChat} disabled={creatingChat}>
        <View style={[styles.contactIconWrap, styles.contactIconWrapOnPrimary]}>
          {creatingChat ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Ionicons name="chatbubble-outline" size={18} color={colors.white} />
          )}
        </View>
        <View style={styles.contactBody}>
          <Text style={[styles.contactLabel, styles.contactLabelOnPrimary]}>Chat</Text>
          <Text style={[styles.contactHint, styles.contactHintOnPrimary]}>Ilova ichida yozing</Text>
        </View>
      </Pressable>

      {!!ad.phone && (
        <Pressable style={styles.contactBtn} onPress={onPhone}>
          <View style={styles.contactIconWrap}>
            <Ionicons name="call-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.contactBody}>
            <Text style={styles.contactLabel}>Telefon qo'ng'irog'i</Text>
            <Text style={styles.contactHint}>
              {phoneRevealed && isAuthenticated ? ad.phone : maskPhone(ad.phone) || "Raqamni ko'rsatish"}
            </Text>
          </View>
        </Pressable>
      )}

      {showTelegram && (
        <Pressable style={styles.contactBtn} onPress={onTelegram}>
          <View style={styles.contactIconWrap}>
            <Ionicons name="paper-plane-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.contactBody}>
            <Text style={styles.contactLabel}>Telegram chat</Text>
            <Text style={styles.contactHint}>
              {ad.telegramUsername?.trim()
                ? `@${ad.telegramUsername.replace(/^@/, '')}`
                : 'Telegram orqali'}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
