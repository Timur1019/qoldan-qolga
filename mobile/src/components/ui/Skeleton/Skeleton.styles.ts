import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  bone: {
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
    borderRadius: 8,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '55%',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});
