import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.muted,
  },
  tabTextOn: {
    color: colors.text,
    fontWeight: '700',
  },
  underline: {
    marginTop: 6,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  underlineSpacer: {
    marginTop: 6,
    height: 2,
  },
});
