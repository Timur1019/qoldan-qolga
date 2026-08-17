import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { imageUrl } from '@/api/client';
import { PriceInsight } from '@/components/PriceInsight/PriceInsight';
import { colors } from '@/theme/colors';
import type { PriceInsight as PriceInsightData } from '@/utils/priceInsight';

import { styles } from '@/styles/screens/adDetail.styles';

const { width } = Dimensions.get('window');

interface Props {
  images: string[];
  insight: PriceInsightData | null;
  t: (key: string, fallback?: string) => string;
}

/**
 * Горизонтальная галерея внутри вертикального ScrollView:
 * directionalLock + nestedScroll, чтобы вертикальный скролл страницы не ломался.
 */
export function AdDetailGallery({ images, insight, t }: Props) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <View style={[styles.gallery, styles.galleryPlaceholder, { width, height: width }]}>
        <Ionicons name="image-outline" size={48} color={colors.muted} />
        <PriceInsight insight={insight} t={t} overlay />
      </View>
    );
  }

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / Math.max(width, 1));
    setIndex(Math.min(images.length - 1, Math.max(0, i)));
  };

  return (
    <View style={styles.galleryWrap}>
      <ScrollView
        horizontal
        pagingEnabled
        bounces={false}
        nestedScrollEnabled
        directionalLockEnabled
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
      >
        {images.map((uri, i) => (
          <Image
            key={`${uri}-${i}`}
            source={{ uri: imageUrl(uri) }}
            style={[styles.gallery, { width, height: width }]}
            contentFit="cover"
          />
        ))}
      </ScrollView>
      {images.length > 1 ? (
        <View style={styles.galleryCounter}>
          <Text style={styles.galleryCounterText}>
            {index + 1}/{images.length}
          </Text>
        </View>
      ) : null}
      <PriceInsight insight={insight} t={t} overlay />
    </View>
  );
}
