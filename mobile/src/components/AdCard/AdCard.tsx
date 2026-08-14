import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { colors } from '@/theme/colors';
import type { AdListItemDto } from '@/types/api';
import { formatPrice } from '@/utils/formatters';

import { AdCardMeta } from './AdCardMeta';
import { AdImageBadges } from './AdImageBadges';
import { styles } from './AdCard.styles';

export type AdCardVariant = 'grid' | 'list';

interface Props {
  ad: AdListItemDto;
  onToggleFavorite: (ad: AdListItemDto) => void;
  /** grid — главная; list — категории/поиск (горизонтальный ряд) */
  variant?: AdCardVariant;
}

export function AdCard({ ad, onToggleFavorite, variant = 'grid' }: Props) {
  const cover = ad.mainImageUrl || ad.imageUrls?.[0];
  const [brokenImage, setBrokenImage] = useState(false);
  const district = ad.district;

  if (variant === 'list') {
    return (
      <Pressable style={styles.listCard} onPress={() => router.push(`/ads/${ad.id}`)}>
        <View style={styles.listImageWrap}>
          {cover && !brokenImage ? (
            <Image
              source={{ uri: imageUrl(cover) }}
              style={styles.image}
              contentFit="cover"
              onError={() => setBrokenImage(true)}
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={28} color={colors.muted} />
            </View>
          )}
          <AdImageBadges ad={ad} />
        </View>

        <View style={styles.listBody}>
          <View style={styles.listTitleRow}>
            <Text style={styles.listTitle} numberOfLines={2}>
              {ad.title}
            </Text>
            <Pressable
              style={styles.listFavoriteBtn}
              hitSlop={10}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite(ad);
              }}
            >
              <Ionicons
                name={ad.favorite ? 'heart' : 'heart-outline'}
                size={22}
                color={ad.favorite ? colors.favorite : colors.heartIdle}
              />
            </Pressable>
          </View>
          <Text style={styles.listPrice} numberOfLines={1}>
            {formatPrice(ad.price, ad.currency)}
          </Text>
          <AdCardMeta
            variant="list"
            region={ad.region}
            district={district}
            createdAt={ad.createdAt}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.gridCard} onPress={() => router.push(`/ads/${ad.id}`)}>
      <View style={styles.gridImageWrap}>
        {cover && !brokenImage ? (
          <Image
            source={{ uri: imageUrl(cover) }}
            style={styles.image}
            contentFit="cover"
            onError={() => setBrokenImage(true)}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={36} color={colors.muted} />
          </View>
        )}
        <AdImageBadges ad={ad} />
        <Pressable
          style={styles.gridFavoriteBtn}
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(ad);
          }}
        >
          <Ionicons
            name={ad.favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={ad.favorite ? colors.favorite : colors.text}
          />
        </Pressable>
      </View>
      <View style={styles.gridBody}>
        <Text style={styles.gridPrice} numberOfLines={1}>
          {formatPrice(ad.price, ad.currency)}
        </Text>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {ad.title}
        </Text>
        <AdCardMeta
          variant="grid"
          region={ad.region}
          district={district}
          createdAt={ad.createdAt}
        />
      </View>
    </Pressable>
  );
}
