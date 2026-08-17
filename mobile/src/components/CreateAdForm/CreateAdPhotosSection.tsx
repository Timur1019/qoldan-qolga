import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { colors } from '@/theme/colors';
import { styles } from '@/styles/screens/createAd.styles';

type Props = {
  existingImageUrls: string[];
  localImages: string[];
  onRemoveExisting: (uri: string) => void;
  onRemoveLocal: (uri: string) => void;
  onPickImages: () => void;
  t: (key: string, fallback?: string) => string;
};

export function CreateAdPhotosSection({
  existingImageUrls,
  localImages,
  onRemoveExisting,
  onRemoveLocal,
  onPickImages,
  t,
}: Props) {
  return (
    <View>
      <Text style={styles.label}>{t('create.photos')}</Text>
      <View style={styles.photos}>
        {existingImageUrls.map((uri) => (
          <View key={uri} style={styles.photoWrap}>
            <Image source={{ uri: imageUrl(uri) }} style={styles.photo} />
            <Pressable style={styles.photoRemove} onPress={() => onRemoveExisting(uri)}>
              <Ionicons name="close" size={14} color={colors.white} />
            </Pressable>
          </View>
        ))}
        {localImages.map((uri) => (
          <View key={uri} style={styles.photoWrap}>
            <Image source={{ uri }} style={styles.photo} />
            <Pressable style={styles.photoRemove} onPress={() => onRemoveLocal(uri)}>
              <Ionicons name="close" size={14} color={colors.white} />
            </Pressable>
          </View>
        ))}
        {existingImageUrls.length + localImages.length < 6 ? (
          <Pressable style={styles.photoAdd} onPress={onPickImages}>
            <Ionicons name="camera-outline" size={22} color={colors.muted} />
            <Text style={styles.photoAddText}>{t('common.add')}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
