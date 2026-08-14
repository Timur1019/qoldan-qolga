import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 88,
  },
  cardSales: {
    backgroundColor: 'rgba(4, 73, 45, 0.1)',
  },
  cardTips: {
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTips: {
    backgroundColor: colors.white,
  },
  cardText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 17,
  },
});
