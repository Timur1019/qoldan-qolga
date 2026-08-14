import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

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
  sideCol: {
    flex: 1,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tile: {
    backgroundColor: colors.bgTile,
    borderRadius: radius.lg,
    padding: spacing.md,
    overflow: 'hidden',
  },
  heroTile: {
    flex: 1.35,
    justifyContent: 'space-between',
    minHeight: 132,
  },
  sideTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  smallTile: {
    flex: 1,
    minHeight: 88,
    justifyContent: 'space-between',
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    maxWidth: '88%',
  },
  tileTitleSm: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  heroIconWrap: {
    alignSelf: 'flex-end',
    opacity: 0.9,
  },
  allBtn: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
  },
  allBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.muted,
    marginBottom: spacing.sm,
  },
});
