import { Pressable, Text, View } from 'react-native';

import { styles } from '@/styles/screens/adDetail.styles';

type Props = {
  creatingChat: boolean;
  hasPhone: boolean;
  showTelegram: boolean;
  onOpenChat: () => void;
  onPhone: () => void;
  onTelegram: () => void;
};

export function AdDetailStickyBar({
  creatingChat,
  hasPhone,
  showTelegram,
  onOpenChat,
  onPhone,
  onTelegram,
}: Props) {
  return (
    <View style={styles.stickyBar}>
      <Pressable style={[styles.stickyBtn, styles.stickyBtnPrimary]} onPress={onOpenChat} disabled={creatingChat}>
        <Text style={styles.stickyBtnPrimaryText}>{creatingChat ? '...' : 'Chat'}</Text>
      </Pressable>
      {hasPhone ? (
        <Pressable style={styles.stickyBtn} onPress={onPhone}>
          <Text style={styles.stickyBtnText}>Tel</Text>
        </Pressable>
      ) : null}
      {showTelegram ? (
        <Pressable style={styles.stickyBtn} onPress={onTelegram}>
          <Text style={styles.stickyBtnText}>Telegram</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
