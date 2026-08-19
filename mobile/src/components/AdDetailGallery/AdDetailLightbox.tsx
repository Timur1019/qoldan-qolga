import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { imageUrl } from '@/api/client';
import { colors } from '@/theme/colors';

import { styles } from './AdDetailLightbox.styles';

type Props = {
  visible: boolean;
  images: string[];
  startIndex: number;
  onClose: () => void;
};

export function AdDetailLightbox({ visible, images, startIndex, onClose }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (!visible) return;
    setIndex(startIndex);
    const x = startIndex * width;
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ x, animated: false });
    });
  }, [visible, startIndex, width]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / Math.max(width, 1));
    setIndex(Math.min(images.length - 1, Math.max(0, i)));
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Pressable
          style={[styles.close, { top: insets.top + 8 }]}
          onPress={onClose}
          hitSlop={8}
        >
          <Ionicons name="close" size={22} color={colors.white} />
        </Pressable>
        {images.length > 1 ? (
          <View style={[styles.counter, { top: insets.top + 14 }]}>
            <Text style={styles.counterText}>
              {index + 1}/{images.length}
            </Text>
          </View>
        ) : null}
        <ScrollView
          ref={listRef}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          onScrollEndDrag={onScrollEnd}
        >
          {images.map((uri, i) => (
            <Pressable key={`${uri}-${i}`} style={[styles.slide, { width, height: height - insets.top - insets.bottom }]} onPress={onClose}>
              <Image
                source={{ uri: imageUrl(uri) }}
                style={styles.image}
                contentFit="contain"
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
