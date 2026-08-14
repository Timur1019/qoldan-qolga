import { Modal, Pressable, Text, View } from 'react-native';

import { AD_STATUS } from '@/constants/myAds';
import { useLanguage } from '@/context/LanguageContext';
import type { AdListItemDto } from '@/types/api';

import { styles } from './MyAdsActionSheet.styles';

interface Props {
  visible: boolean;
  ad: AdListItemDto | null;
  onClose: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onPromote?: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export function MyAdsActionSheet({
  visible,
  ad,
  onClose,
  onOpen,
  onEdit,
  onPromote,
  onArchive,
  onRestore,
  onDelete,
}: Props) {
  const { t } = useLanguage();
  if (!ad) return null;
  const archived = ad.status === AD_STATUS.ARCHIVED;
  const canPromote = ad.status === AD_STATUS.ACTIVE && !!onPromote;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title} numberOfLines={1}>
            {ad.title}
          </Text>

          <Pressable style={styles.item} onPress={onOpen}>
            <Text style={styles.itemText}>{t('myAds.open')}</Text>
          </Pressable>
          {canPromote ? (
            <Pressable style={styles.item} onPress={onPromote}>
              <Text style={[styles.itemText, styles.promo]}>{t('ads.buyAdvertising')}</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.item} onPress={onEdit}>
            <Text style={styles.itemText}>{t('myAds.edit')}</Text>
          </Pressable>
          {archived ? (
            <Pressable style={styles.item} onPress={onRestore}>
              <Text style={styles.itemText}>{t('myAds.restoreFromArchive')}</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.item} onPress={onArchive}>
              <Text style={styles.itemText}>{t('myAds.closeAd')}</Text>
            </Pressable>
          )}
          <Pressable style={styles.item} onPress={onDelete}>
            <Text style={[styles.itemText, styles.danger]}>{t('myAds.delete')}</Text>
          </Pressable>

          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>{t('myAds.cancel')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
