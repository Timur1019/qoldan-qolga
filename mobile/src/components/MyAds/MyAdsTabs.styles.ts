import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabOn: {
    borderBottomColor: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  labelOn: {
    color: colors.text,
    fontWeight: '700',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOn: {
    backgroundColor: colors.text,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  badgeTextOn: {
    color: colors.white,
  },
});
