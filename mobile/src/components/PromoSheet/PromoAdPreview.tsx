import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { colors } from '@/theme/colors';
import type { AdListItemDto } from '@/types/api';
import { formatPrice } from '@/utils/formatters';

import { styles } from './PromoAdPreview.styles';

export function PromoAdPreview({ ad }: { ad: AdListItemDto }) {
  const cover = ad.mainImageUrl || ad.imageUrls?.[0];

  return (
    <View style={styles.preview}>
      {cover ? (
        <Image source={{ uri: imageUrl(cover) }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbEmpty]}>
          <Ionicons name="image-outline" size={20} color={colors.muted} />
        </View>
      )}
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2}>
          {ad.title}
        </Text>
        <Text style={styles.price}>{formatPrice(ad.price, ad.currency)}</Text>
      </View>
    </View>
  );
}
