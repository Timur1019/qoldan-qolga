import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';

import { styles } from './PromoBanners.styles';

export interface PromoBannerItem {
  id: string;
  title?: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
}

interface Props {
  banners: PromoBannerItem[];
  onPress?: (banner: PromoBannerItem) => void;
}

function PromoBannerCard({
  item,
  onPress,
}: {
  item: PromoBannerItem;
  onPress?: (banner: PromoBannerItem) => void;
}) {
  const [broken, setBroken] = useState(false);
  const uri = item.imageUrl ? imageUrl(item.imageUrl) : '';
  const showImage = Boolean(uri) && !broken;

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(item)}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}
      {showImage ? <View style={styles.shade} /> : null}
      {!!item.title && (
        <Text style={[styles.title, !showImage && styles.titleOnFallback]} numberOfLines={2}>
          {item.title}
        </Text>
      )}
    </Pressable>
  );
}

export function PromoBanners({ banners, onPress }: Props) {
  if (!banners.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {banners.map((item) => (
        <PromoBannerCard key={item.id} item={item} onPress={onPress} />
      ))}
    </ScrollView>
  );
}
