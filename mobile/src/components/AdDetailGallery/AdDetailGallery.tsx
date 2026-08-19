import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { imageUrl } from '@/api/client';
import { AdDetailLightbox } from '@/components/AdDetailGallery/AdDetailLightbox';
import { PriceInsight } from '@/components/PriceInsight/PriceInsight';
import { colors } from '@/theme/colors';
import type { PriceInsight as PriceInsightData } from '@/utils/priceInsight';

import { styles } from '@/styles/screens/adDetail.styles';
import { styles as lightboxStyles } from './AdDetailLightbox.styles';

interface Props {
  images: string[];
  insight: PriceInsightData | null;
  t: (key: string, fallback?: string) => string;
}

export function AdDetailGallery({ images, insight, t }: Props) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  const openLightbox = (i = index) => {
    setIndex(i);
    setLightboxOpen(true);
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
          <Pressable key={`${uri}-${i}`} onPress={() => openLightbox(i)}>
            <Image
              source={{ uri: imageUrl(uri) }}
              style={[styles.gallery, { width, height: width }]}
              contentFit="cover"
            />
          </Pressable>
        ))}
      </ScrollView>
      {images.length > 1 ? (
        <View style={styles.galleryCounter} pointerEvents="none">
          <Text style={styles.galleryCounterText}>
            {index + 1}/{images.length}
          </Text>
        </View>
      ) : null}
      <Pressable style={lightboxStyles.enlargeBtn} onPress={() => openLightbox(index)}>
        <Text style={lightboxStyles.enlargeText}>{t('ads.enlarge')}</Text>
      </Pressable>
      <PriceInsight insight={insight} t={t} overlay />
      <AdDetailLightbox
        visible={lightboxOpen}
        images={images}
        startIndex={index}
        onClose={() => setLightboxOpen(false)}
      />
    </View>
  );
}
