import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  field: {
    flex: 1,
    backgroundColor: colors.bgMuted,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    color: colors.text,
    maxHeight: 110,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  guestWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bgSubtle,
    gap: spacing.sm,
  },
  guestText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  guestBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
