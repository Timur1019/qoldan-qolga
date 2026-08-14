import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { imageUrl } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { useTopAdStrip } from './useTopAdStrip';
import { styles } from './TopAdStrip.styles';

export function TopAdStrip() {
  const { t } = useLanguage();
  const { banner, ready, dismiss } = useTopAdStrip();

  if (!ready || !banner) return null;

  const linkUrl = (banner.linkUrl || '').trim();
  const linkText = (banner.linkText || '').trim() || t('ads.learnMore');
  const iconSrc = banner.iconUrl ? imageUrl(banner.iconUrl) : null;

  const openLink = () => {
    if (!linkUrl) return;
    if (/^https?:\/\//i.test(linkUrl)) {
      Linking.openURL(linkUrl).catch(() => {});
      return;
    }
    if (linkUrl.includes('/ads/create') || linkUrl.includes('create')) {
      router.push('/(tabs)/sell');
      return;
    }
    if (linkUrl.startsWith('/')) {
      router.push(linkUrl as never);
    }
  };

  return (
    <View style={styles.strip} accessibilityRole="summary">
      <View style={styles.content}>
        {iconSrc ? (
          <Image source={{ uri: iconSrc }} style={styles.icon} contentFit="cover" />
        ) : (
          <View style={styles.iconFallback}>
            <Ionicons name="megaphone-outline" size={14} color="#64748b" />
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {banner.title}
        </Text>
        {linkUrl ? (
          <Pressable onPress={openLink} hitSlop={8}>
            <Text style={styles.link}>{linkText}</Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        style={styles.close}
        onPress={dismiss}
        accessibilityLabel={t('common.close')}
        hitSlop={10}
      >
        <Ionicons name="close" size={18} color="#9ca3af" />
      </Pressable>
    </View>
  );
}
