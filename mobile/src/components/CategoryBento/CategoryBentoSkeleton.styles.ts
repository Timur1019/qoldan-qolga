import { StyleSheet } from 'react-native';

import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  heroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 132,
  },
  heroTile: {
    flex: 1.35,
    minHeight: 132,
    borderRadius: 16,
  },
  sideCol: {
    flex: 1,
    gap: spacing.sm,
  },
  sideTile: {
    flex: 1,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smallTile: {
    flex: 1,
    minHeight: 88,
    borderRadius: 16,
  },
});
