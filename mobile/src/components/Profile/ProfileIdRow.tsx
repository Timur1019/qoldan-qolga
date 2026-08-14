import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, Share, Text } from 'react-native';

import { colors } from '@/theme/colors';

import { styles } from './ProfileIdRow.styles';

interface Props {
  userId: string;
}

export function ProfileIdRow({ userId }: Props) {
  const onPress = async () => {
    try {
      await Share.share({ message: userId });
    } catch {
      Alert.alert('Profil ID', userId);
    }
  };

  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <Text style={styles.label}>Profil ID: {userId}</Text>
      <Ionicons name="copy-outline" size={16} color={colors.muted} />
    </Pressable>
  );
}
