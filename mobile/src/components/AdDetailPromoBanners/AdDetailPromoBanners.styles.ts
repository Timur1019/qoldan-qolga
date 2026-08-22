import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  stack: {
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: '#111827',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: colors.bgSubtle,
  },
});
