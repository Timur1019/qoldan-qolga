import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: 'rgba(4, 73, 45, 0.08)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    gap: spacing.md,
    zIndex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    maxWidth: 200,
  },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  decor: {
    position: 'absolute',
    right: -10,
    top: -10,
    bottom: -10,
    width: 120,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  blobOne: {
    width: 90,
    height: 90,
    right: 10,
    top: 8,
    backgroundColor: colors.primary,
  },
  blobTwo: {
    width: 60,
    height: 60,
    right: 50,
    bottom: 6,
    backgroundColor: colors.ctaStrip,
  },
});
