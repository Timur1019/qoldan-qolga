import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';

import { styles } from './MyAdsTips.styles';

interface Props {
  onSalesPress?: () => void;
  onTipsPress?: () => void;
}

export function MyAdsTips({ onSalesPress, onTipsPress }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.row}>
      <Pressable style={[styles.card, styles.cardSales]} onPress={onSalesPress}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
        </View>
        <Text style={styles.cardText}>{t('myAds.tipSalesCard')}</Text>
      </Pressable>
      <Pressable style={[styles.card, styles.cardTips]} onPress={onTipsPress}>
        <View style={[styles.iconWrap, styles.iconTips]}>
          <Ionicons name="bulb" size={18} color="#b45309" />
        </View>
        <Text style={styles.cardText}>{t('myAds.tipSellerCard')}</Text>
      </Pressable>
    </View>
  );
}
