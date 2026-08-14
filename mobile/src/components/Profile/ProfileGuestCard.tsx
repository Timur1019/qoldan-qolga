import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from './ProfileGuestCard.styles';

interface Props {
  onLogin: () => void;
}

export function ProfileGuestCard({ onLogin }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.card}>
      <View style={styles.iconRing}>
        <Ionicons name="person-outline" size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{t('profile.guestCardTitle')}</Text>
      <Text style={styles.text}>{t('profile.guestCardText')}</Text>
      <Pressable style={styles.primaryBtn} onPress={onLogin}>
        <Text style={styles.primaryBtnText}>{t('auth.continuePhone')}</Text>
      </Pressable>
    </View>
  );
}
