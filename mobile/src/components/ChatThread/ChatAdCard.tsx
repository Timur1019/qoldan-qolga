import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import { formatPrice } from '@/utils/formatters';

import { styles } from './ChatAdCard.styles';

interface Props {
  adId?: string;
  title?: string | null;
  image?: string | null;
  price?: number | null;
  currency?: string | null;
  region?: string | null;
  onPress: () => void;
}

export function ChatAdCard({ adId, title, image, price, currency, region, onPress }: Props) {
  const { t } = useLanguage();
  if (!adId) return null;

  const src = image ? imageUrl(image) : '';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        {src ? (
          <Image source={{ uri: src }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={22} color={colors.muted} />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {title || '—'}
        </Text>
        <View style={styles.meta}>
          {price != null ? <Text style={styles.price}>{formatPrice(price, currency || 'UZS')}</Text> : null}
          {region ? (
            <Text style={styles.region} numberOfLines={1}>
              <Ionicons name="location-outline" size={11} /> {region}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.action}>{t('chat.openAd', 'Ochish')} →</Text>
    </Pressable>
  );
}
