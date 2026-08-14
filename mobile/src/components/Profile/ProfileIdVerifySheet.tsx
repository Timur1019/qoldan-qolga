import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './ProfileIdVerifySheet.styles';

interface Props {
  visible: boolean;
  verified?: boolean;
  onClose: () => void;
  onStart: () => void;
}

export function ProfileIdVerifySheet({ visible, verified, onClose, onStart }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.iconRing}>
            <Ionicons name="person-circle-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>
            {verified ? 'ID tasdiqlangan' : "Tasdiqlangan foydalanuvchi bo'ling"}
          </Text>
          <Text style={styles.text}>
            {verified
              ? 'Profilingiz MyID orqali tasdiqlangan. Xaridorlar sizga ko‘proq ishonadi.'
              : "Tasdiqlangan foydalanuvchilar ko'proq ishonch uyg'otadi. Jarayon xavfsiz va bir necha daqiqa davom etadi."}
          </Text>
          {!verified ? (
            <Pressable style={styles.btn} onPress={onStart}>
              <Text style={styles.btnText}>ID tekshiruvidan o'tish</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>Yopish</Text>
            </Pressable>
          )}
          <Pressable style={styles.linkBtn} onPress={onClose}>
            <Text style={styles.linkText}>Keyinroq</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
