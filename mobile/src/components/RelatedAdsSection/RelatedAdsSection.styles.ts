import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flexShrink: 1,
  },
  titleStandalone: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: 'rgba(4, 73, 45, 0.08)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  chevron: {
    marginLeft: 'auto',
  },
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  cardWrap: {
    width: 160,
  },
});
