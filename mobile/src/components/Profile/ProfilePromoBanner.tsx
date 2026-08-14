import { Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

import { styles } from './ProfilePromoBanner.styles';

interface Props {
  onPress: () => void;
}

export function ProfilePromoBanner({ onPress }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.wrap}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{t('profile.promoBannerTitle')}</Text>
        <Pressable style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>{t('profile.promoBannerCta')}</Text>
        </Pressable>
      </View>
      <View style={styles.decor}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
      </View>
    </View>
  );
}
