import { Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

import { styles } from './ProfileScreenHeader.styles';

interface Props {
  title?: string;
}

export function ProfileScreenHeader({ title }: Props) {
  const { t } = useLanguage();
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title || t('profile.title')}</Text>
    </View>
  );
}
