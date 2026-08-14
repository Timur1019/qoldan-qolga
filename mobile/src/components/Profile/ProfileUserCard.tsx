import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import { isPhotoAvatar } from '@/utils/isPhotoAvatar';
import { formatProfilePhone } from '@/utils/profileDisplay';

import { styles } from './ProfileUserCard.styles';

interface Props {
  name: string;
  phone?: string | null;
  avatar?: string | null;
  isStore?: boolean;
  photoBusy?: boolean;
  onEdit: () => void;
  onChangePhoto: () => void;
  onOpenPublic: () => void;
}

function formatDisplayName(name: string) {
  const raw = String(name || '').trim();
  if (!raw) return '';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function ProfileUserCard({
  name,
  phone,
  avatar,
  isStore,
  photoBusy,
  onEdit,
  onChangePhoto,
  onOpenPublic,
}: Props) {
  const { t } = useLanguage();
  const phoneLabel = formatProfilePhone(phone);
  const showPhoto = isPhotoAvatar(avatar);
  const uri = showPhoto && avatar ? imageUrl(avatar) : '';
  const title = formatDisplayName(name) || t('profile.userFallback');

  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        <Pressable style={styles.avatarHit} onPress={onChangePhoto} disabled={photoBusy}>
          {uri ? (
            <Image source={{ uri }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={36} color={colors.muted} />
            </View>
          )}
          <View style={styles.cameraBadge}>
            {photoBusy ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Ionicons name="camera" size={14} color={colors.white} />
            )}
          </View>
        </Pressable>

        <Pressable style={styles.nameRow} onPress={onEdit} hitSlop={8}>
          <Text style={styles.name} numberOfLines={1}>
            {title}
          </Text>
          <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
        </Pressable>

        {phoneLabel ? <Text style={styles.phone}>{phoneLabel}</Text> : null}
        {isStore ? <Text style={styles.storeBadge}>{t('profile.storeBadge')}</Text> : null}
      </View>

      <Pressable style={styles.publicLink} onPress={onOpenPublic}>
        <Text style={styles.publicLinkText}>{t('profile.seePublic')}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}
