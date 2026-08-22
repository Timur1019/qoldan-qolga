import { Image, Linking, Pressable, View } from 'react-native';
import { useEffect, useState } from 'react';

import { imageUrl, referenceApi } from '@/api/client';

import { styles } from './AdDetailPromoBanners.styles';

type Banner = {
  id: string;
  title?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
};

export function AdDetailPromoBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    referenceApi
      .getAdSidebarBanners()
      .then((list) => {
        const items = (Array.isArray(list) ? list : [])
          .filter((b) => (b as Banner)?.imageUrl)
          .slice(0, 2) as Banner[];
        setBanners(items);
      })
      .catch(() => setBanners([]));
  }, []);

  if (!banners.length) return null;

  return (
    <View style={styles.stack} accessibilityLabel="Reklama">
      {banners.map((item) => {
        const src = imageUrl(item.imageUrl);
        const href = (item.linkUrl || '').trim();
        return (
          <Pressable
            key={item.id}
            style={styles.card}
            disabled={!href}
            onPress={() => {
              if (!href) return;
              void Linking.openURL(href.startsWith('http') ? href : `https://${href}`);
            }}
          >
            <Image source={{ uri: src }} style={styles.image} resizeMode="cover" />
          </Pressable>
        );
      })}
    </View>
  );
}
