import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { styles } from '@/styles/screens/createAd.styles';

type Props = {
  visible: boolean;
  brandLabel: string;
  onOpen: () => void;
  t: (key: string, fallback?: string) => string;
};

export function CreateAdBrandSection({ visible, brandLabel, onOpen, t }: Props) {
  if (!visible) return null;
  return (
    <View>
      <Text style={styles.label}>{t('create.brand')}</Text>
      <Pressable style={styles.selectBtn} onPress={onOpen}>
        <Text style={[styles.selectText, !brandLabel && styles.selectPlaceholder]} numberOfLines={1}>
          {brandLabel || t('categories.select')}
        </Text>
      </Pressable>
    </View>
  );
}
