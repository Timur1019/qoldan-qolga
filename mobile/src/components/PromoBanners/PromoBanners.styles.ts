import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  card: {
    width: 140,
    height: 100,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
    marginRight: spacing.sm,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  imageFallback: {
    backgroundColor: colors.ctaStrip,
  },
  shade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  title: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
    zIndex: 1,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 3,
  },
  titleOnFallback: {
    textShadowRadius: 0,
  },
});
