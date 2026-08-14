import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.bgSubtle,
  },
  thumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  menuBtn: {
    padding: 2,
  },
  title: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },
  status: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  statusArchived: {
    color: colors.muted,
  },
  statusPending: {
    color: '#b45309',
  },
  notice: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#92400e',
  },
  promoBtn: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(4, 73, 45, 0.1)',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  promoBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  editBtn: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.bgMuted,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
});
