import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/theme/colors';
import type { AdDetailDto } from '@/types/api';
import { formatDate, formatPrice } from '@/utils/formatters';
import { styles } from '@/styles/screens/adDetail.styles';

type Props = {
  ad: AdDetailDto;
  categoryLabel: string;
  regionLabel: string;
  watching: boolean;
  onToggleFavorite: () => void;
  onTogglePriceWatch: () => void;
  t: (key: string, fallback?: string) => string;
};

export function AdDetailHeader({
  ad,
  categoryLabel,
  regionLabel,
  watching,
  onToggleFavorite,
  onTogglePriceWatch,
  t,
}: Props) {
  return (
    <>
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {formatPrice(ad.price, ad.currency)}
          {ad.isNegotiable ? ' (Kelishiladi)' : ''}
        </Text>
        <Pressable onPress={onToggleFavorite} hitSlop={8}>
          <Ionicons
            name={ad.favorite ? 'heart' : 'heart-outline'}
            size={26}
            color={ad.favorite ? colors.favorite : colors.text}
          />
        </Pressable>
      </View>
      <Text style={styles.title}>{ad.title}</Text>
      <Pressable onPress={onTogglePriceWatch} hitSlop={8}>
        <Text style={styles.trackPrice}>
          {watching ? t('ads.trackPriceStop') : t('ads.trackPrice')} ›
        </Text>
      </Pressable>
      {ad.category ? (
        <Pressable onPress={() => router.push(`/categories/${ad.category}`)}>
          <Text style={styles.categoryLink}>{categoryLabel || ad.category}</Text>
        </Pressable>
      ) : null}
      <Text style={styles.meta}>
        {regionLabel || ad.region}
        {ad.district ? `, ${ad.district}` : ''}
        {ad.createdAt ? ` · ${formatDate(ad.createdAt)}` : ''} · {ad.views ?? 0} ko'rildi
      </Text>
    </>
  );
}
