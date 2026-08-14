import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowUnread: {
    backgroundColor: 'rgba(4, 73, 45, 0.04)',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgSubtle,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(4, 73, 45, 0.12)',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  body: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  nameUnread: {
    fontWeight: '800',
  },
  time: {
    fontSize: 12,
    color: colors.muted,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '600',
  },
  adTitle: {
    fontSize: 13,
    color: colors.muted,
  },
  preview: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 1,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 11,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
