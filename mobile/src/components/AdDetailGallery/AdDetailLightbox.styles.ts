import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  counter: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    zIndex: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  counterText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  enlargeBtn: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    zIndex: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  enlargeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
