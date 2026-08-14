import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.bgCard,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  error: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  mockBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.bgMuted,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mockBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  primary: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondary: {
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.muted,
  },
});
