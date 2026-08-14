import { router } from 'expo-router';
import { Modal, Pressable, Text, View } from 'react-native';

import { useAuthRequired } from '@/context/AuthRequiredContext';
import { useLanguage } from '@/context/LanguageContext';

import { styles } from './AuthRequiredSheet.styles';

export function AuthRequiredSheet() {
  const { visible, closeAuthRequired } = useAuthRequired();
  const { t } = useLanguage();

  const goLogin = () => {
    closeAuthRequired();
    router.push('/login');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={closeAuthRequired}>
      <Pressable style={styles.overlay} onPress={closeAuthRequired}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('auth.requiredTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.requiredText')}</Text>
          <Pressable style={styles.primaryBtn} onPress={goLogin}>
            <Text style={styles.primaryBtnText}>{t('auth.continuePhone')}</Text>
          </Pressable>
          <Pressable style={styles.dismiss} onPress={closeAuthRequired}>
            <Text style={styles.dismissText}>{t('common.cancel')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
