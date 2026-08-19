import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    marginTop: 4,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    color: colors.text,
    fontSize: 16,
    letterSpacing: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    aspectRatio: 0.85,
    maxWidth: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: {
    borderColor: colors.primary,
    backgroundColor: '#f3faf6',
  },
  digit: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  caret: {
    width: 2,
    height: 22,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
});
