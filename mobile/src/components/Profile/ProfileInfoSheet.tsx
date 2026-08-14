import { Modal, Pressable, Text, View } from 'react-native';

import { styles } from './ProfileInfoSheet.styles';

interface Props {
  visible: boolean;
  title: string;
  text: string;
  buttonLabel?: string;
  onClose: () => void;
  onAction?: () => void;
}

/** Простой info/coming-soon sheet для пунктов профиля. */
export function ProfileInfoSheet({
  visible,
  title,
  text,
  buttonLabel = 'Tushunarli',
  onClose,
  onAction,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
          <Pressable
            style={styles.btn}
            onPress={() => {
              onAction?.();
              onClose();
            }}
          >
            <Text style={styles.btnText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
