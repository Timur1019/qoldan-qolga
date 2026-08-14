import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from './HomeCtaStrip.styles';

interface Props {
  onPress: () => void;
}

/** Компактный CTA под поиск — своя плашка, не баннер Avito. */
export function HomeCtaStrip({ onPress }: Props) {
  const { t } = useLanguage();
  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{t('home.ctaTitle')}</Text>
        <Text style={styles.sub}>{t('home.ctaSub')}</Text>
      </View>
      <View style={styles.iconBtn}>
        <Ionicons name="arrow-forward" size={18} color={colors.white} />
      </View>
    </Pressable>
  );
}
