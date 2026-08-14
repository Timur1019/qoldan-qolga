import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { AD_STATUS, statusLabelKey } from '@/constants/myAds';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import type { AdListItemDto } from '@/types/api';
import { formatPrice } from '@/utils/formatters';

import { styles } from './MyAdCard.styles';

interface Props {
  ad: AdListItemDto;
  onPress: () => void;
  onEdit: () => void;
  onMenu: () => void;
  onPromote?: () => void;
}

export function MyAdCard({ ad, onPress, onEdit, onMenu, onPromote }: Props) {
  const { t } = useLanguage();
  const cover = ad.mainImageUrl || ad.imageUrls?.[0];
  const archived = ad.status === AD_STATUS.ARCHIVED;
  const pending = ad.status === AD_STATUS.PENDING;
  const canPromote = ad.status === AD_STATUS.ACTIVE && !!onPromote;

  return (
    <View style={styles.card}>
      <Pressable style={styles.top} onPress={onPress}>
        {cover ? (
          <Image source={{ uri: imageUrl(cover) }} style={styles.thumb} contentFit="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbEmpty]}>
            <Ionicons name="image-outline" size={22} color={colors.muted} />
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.price} numberOfLines={1}>
              {formatPrice(ad.price, ad.currency)}
            </Text>
            <Pressable hitSlop={10} onPress={onMenu} style={styles.menuBtn}>
              <Ionicons name="ellipsis-vertical" size={18} color={colors.muted} />
            </Pressable>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {ad.title}
          </Text>
          <Text
            style={[
              styles.status,
              archived && styles.statusArchived,
              pending && styles.statusPending,
            ]}
          >
            {t(statusLabelKey(ad.status))}
          </Text>
        </View>
      </Pressable>

      {pending ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{t('myAds.pendingNotice')}</Text>
        </View>
      ) : null}

      {canPromote ? (
        <Pressable style={styles.promoBtn} onPress={onPromote}>
          <Text style={styles.promoBtnText}>{t('ads.buyAdvertising')}</Text>
        </Pressable>
      ) : null}

      <Pressable style={styles.editBtn} onPress={onEdit}>
        <Text style={styles.editBtnText}>{t('myAds.edit')}</Text>
      </Pressable>
    </View>
  );
}
