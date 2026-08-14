import { useEffect, useRef } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

import { styles } from './Skeleton.styles';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ style }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1350,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 140],
  });

  return (
    <Animated.View style={[styles.bone, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]} />
    </Animated.View>
  );
}
